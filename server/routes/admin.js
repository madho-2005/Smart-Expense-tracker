const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get admin dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTransactions = await Transaction.countDocuments();

    const volumeResult = await Transaction.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalVolume = volumeResult[0]?.total || 0;

    // Get user-wise activity
    const userActivity = await Transaction.aggregate([
      { $sort: { date: -1 } },
      {
        $group: {
          _id: '$userId',
          transactions: { $push: '$$ROOT' },
          latestDate: { $max: '$date' }
        }
      },
      { $sort: { latestDate: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      }
    ]);

    const userGroups = userActivity.map(group => {
      const user = group.userInfo[0] || {};
      const incomeTx = group.transactions.filter(t => t.type === 'income');
      const expenseTx = group.transactions.filter(t => t.type === 'expense');
      const totalInc = incomeTx.reduce((s, t) => s + (t.amount || 0), 0);
      const totalExp = expenseTx.reduce((s, t) => s + (t.amount || 0), 0);

      return {
        userId: group._id,
        name: user.name || 'Unknown',
        email: user.email || '',
        incomeTx: incomeTx.slice(0, 3),
        expenseTx: expenseTx.slice(0, 3),
        totalInc,
        totalExp,
        net: totalInc - totalExp
      };
    });

    res.json({ totalUsers, totalTransactions, totalVolume, userGroups });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    // Compute balance for each user
    const usersWithBalance = await Promise.all(
      users.map(async (user) => {
        const result = await Transaction.aggregate([
          { $match: { userId: user._id } },
          {
            $group: {
              _id: '$type',
              total: { $sum: '$amount' }
            }
          }
        ]);

        let income = 0, expense = 0;
        result.forEach(r => {
          if (r._id === 'income') income = r.total;
          else expense = r.total;
        });

        return {
          ...user.toJSON(),
          balance: income - expense
        };
      })
    );

    res.json(usersWithBalance);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Toggle ban/unban user
router.patch('/users/:id/toggle-ban', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = user.status === 'active' ? 'banned' : 'active';
    await user.save();

    res.json({ message: `User ${user.status === 'active' ? 'unbanned' : 'banned'} successfully`, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get category stats
router.get('/categories', adminAuth, async (req, res) => {
  try {
    const incomeCats = ['Salary', 'Freelance', 'Investment'];
    const expenseCats = ['Food', 'Transport', 'Shopping', 'Bills'];

    const transactions = await Transaction.find();

    const computeStats = (type, categoryName) => {
      const filtered = transactions.filter(
        t => t.type === type && t.category === categoryName
      );
      return {
        count: filtered.length,
        sum: filtered.reduce((s, t) => s + (t.amount || 0), 0)
      };
    };

    const incomeStats = incomeCats.map(name => ({
      name,
      ...computeStats('income', name)
    }));

    const expenseStats = expenseCats.map(name => ({
      name,
      ...computeStats('expense', name)
    }));

    res.json({ incomeStats, expenseStats });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Purge invalid transactions
router.delete('/purge-invalid', adminAuth, async (req, res) => {
  try {
    const result = await Transaction.deleteMany({
      $or: [
        { amount: { $lt: 1 } },
        { amount: { $gt: 10000000 } },
        { amount: null }
      ]
    });
    res.json({ message: `Removed ${result.deletedCount} invalid records` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
