import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);
ChartJS.defaults.color = '#94a3b8';
ChartJS.defaults.font.family = 'Inter';

export default function Reports() {
  const [data, setData] = useState({ transactions: [], income: 0, expense: 0, savings: 0, rate: 0 });
  const [catData, setCatData] = useState({ labels: [], values: [] });
  const [monthlyData, setMonthlyData] = useState({ labels: [], income: [], expense: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await API.get('/transactions');
        const transactions = res.data;
        
        let totalInc = 0;
        let totalExp = 0;
        const categoryMap = {};
        const monthMap = {};
        
        transactions.forEach(t => {
          const amt = t.amount;
          const d = new Date(t.date);
          const monthKey = d.toLocaleString('default', { month: 'short', year: 'numeric' });
          
          if (!monthMap[monthKey]) monthMap[monthKey] = { income: 0, expense: 0 };
          
          if (t.type === 'income') {
            totalInc += amt;
            monthMap[monthKey].income += amt;
          } else {
            totalExp += amt;
            monthMap[monthKey].expense += amt;
            const cat = t.category || 'Other';
            categoryMap[cat] = (categoryMap[cat] || 0) + amt;
          }
        });
        
        const savings = totalInc - totalExp;
        const rate = totalInc > 0 ? ((savings / totalInc) * 100).toFixed(1) : '0.0';
        
        setData({ transactions, income: totalInc, expense: totalExp, savings, rate });
        setCatData({ labels: Object.keys(categoryMap), values: Object.values(categoryMap) });
        
        const months = Object.keys(monthMap).reverse(); // Oldest to newest
        setMonthlyData({
          labels: months,
          income: months.map(m => monthMap[m].income),
          expense: months.map(m => monthMap[m].expense)
        });
      } catch (err) {
        console.error('Failed to fetch reports data', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReports();
  }, []);

  const formatMoney = (amount) => `₹${amount.toLocaleString('en-IN')}`;

  const doughnutConfig = {
    labels: catData.labels.length ? catData.labels : ['No Data'],
    datasets: [{
      data: catData.values.length ? catData.values : [1],
      backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'],
      borderColor: 'transparent',
      hoverOffset: 10
    }]
  };

  const barConfig = {
    labels: monthlyData.labels.length ? monthlyData.labels : ['No Data'],
    datasets: [
      { label: 'Income', data: monthlyData.labels.length ? monthlyData.income : [0], backgroundColor: '#10b981', borderRadius: 4 },
      { label: 'Expense', data: monthlyData.labels.length ? monthlyData.expense : [0], backgroundColor: '#ef4444', borderRadius: 4 }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="main-content flex-1">
        <header className="page-header animate-fade-in-up">
          <h1>Financial Reports</h1>
          <p>Visualize your income and spending</p>
        </header>

        {loading ? (
          <div className="text-gray animate-pulse">Generating reports...</div>
        ) : (
          <>
            <div className="grid grid-4 mb-8 animate-fade-in-up">
              <div className="card glass">
                <div className="stat-label">Total Income</div>
                <div className="text-2xl font-bold green">{formatMoney(data.income)}</div>
              </div>
              <div className="card glass">
                <div className="stat-label">Total Expenses</div>
                <div className="text-2xl font-bold red">{formatMoney(data.expense)}</div>
              </div>
              <div className="card glass">
                <div className="stat-label">Net Savings</div>
                <div className="text-2xl font-bold blue">{formatMoney(data.savings)}</div>
              </div>
              <div className="card glass">
                <div className="stat-label">Savings Rate</div>
                <div className="text-2xl font-bold amber">{data.rate}%</div>
              </div>
            </div>

            <div className="grid grid-2 animate-fade-in-up delay-100">
              <div className="card-3xl glass">
                <h3 className="text-xl font-bold mb-6">Expense Breakdown By Category</h3>
                <div style={{ height: '300px' }}>
                  <Doughnut data={doughnutConfig} options={{ ...chartOptions, cutout: '70%' }} />
                </div>
              </div>

              <div className="card-3xl glass">
                <h3 className="text-xl font-bold mb-6">Monthly Trend</h3>
                <div style={{ height: '300px' }}>
                  <Bar data={barConfig} options={{
                    ...chartOptions,
                    scales: {
                      y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, border: { display: false } },
                      x: { grid: { display: false }, border: { display: false } }
                    }
                  }} />
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
