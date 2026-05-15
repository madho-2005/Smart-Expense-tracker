import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <>
      {/* Navbar */}
      <nav className="landing-nav glass">
        <div className="landing-nav-inner">
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '1.75rem' }}>💰</span>
            <span className="font-bold text-xl" style={{ letterSpacing: '-0.025em' }}>SmartTracker</span>
          </div>
          <div className="flex gap-4 items-center">
            <Link to="/admin-login" className="text-gray text-sm font-medium" style={{ textDecoration: 'none', transition: 'color 0.2s' }}>
              Admin Portal
            </Link>
            <Link to="/login" className="btn btn-indigo btn-sm rounded-full">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        <div className="absolute" style={{ top: '5rem', right: 0, width: '24rem', height: '24rem', background: 'rgba(99,102,241,0.2)', borderRadius: '50%', filter: 'blur(48px)', zIndex: -1, animation: 'float 6s ease-in-out infinite' }}></div>
        <div className="absolute" style={{ bottom: '5rem', left: 0, width: '18rem', height: '18rem', background: 'rgba(168,85,247,0.1)', borderRadius: '50%', filter: 'blur(48px)', zIndex: -1, animation: 'float 6s ease-in-out infinite', animationDelay: '2s' }}></div>

        <div className="max-w-7xl" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div className="space-y-8">
            <div className="animate-fade-in-up" style={{ display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.875rem', fontWeight: 500, color: '#a5b4fc' }}>
              ✨ Voted #1 Personal Finance Tool
            </div>

            <h1 className="text-5xl font-extrabold leading-tight animate-fade-in-up delay-100" style={{ lineHeight: 1.1 }}>
              Master Your Money <br />
              <span className="text-gradient">Intelligently.</span>
            </h1>

            <p className="text-xl text-gray animate-fade-in-up delay-200" style={{ maxWidth: '32rem' }}>
              Stop guessing where your money goes. Track <strong style={{ color: 'white' }}>Groceries</strong>, <strong style={{ color: 'white' }}>Bills</strong>, <strong style={{ color: 'white' }}>Dining</strong>, and more with our real-time dashboard and intuitive reporting tools.
            </p>

            <div className="flex gap-4 animate-fade-in-up delay-300" style={{ flexWrap: 'wrap' }}>
              <Link to="/login" className="btn" style={{ padding: '1rem 2rem', background: 'white', color: '#312e81', borderRadius: '1rem', fontWeight: 700, transition: 'all 0.2s', textDecoration: 'none' }}>
                Get Started Now
              </Link>
              <a href="#features" className="btn glass" style={{ padding: '1rem 2rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '1rem', textDecoration: 'none' }}>
                Learn More
              </a>
            </div>
          </div>

          {/* Dashboard Preview Card */}
          <div className="relative animate-fade-in-up delay-300" style={{ display: 'none' }} id="hero-preview">
          </div>

          <div className="animate-fade-in-up delay-300">
            <div className="glass card-3xl" style={{ transform: 'rotate(3deg)', transition: 'transform 0.5s' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-gray text-sm">Total Balance</div>
                  <div className="text-3xl font-bold">₹45,230</div>
                </div>
                <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📈</div>
              </div>
              <div className="space-y-4">
                <div style={{ height: '0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '75%', background: '#6366f1' }}></div>
                </div>
                <div className="flex justify-between text-xs text-gray">
                  <span>Monthly Budget</span>
                  <span>75% Spent</span>
                </div>
              </div>
            </div>

            <div className="glass animate-float" style={{ position: 'absolute', bottom: '-2.5rem', left: '-2.5rem', padding: '1rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)', animationDelay: '1s' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>🛒</div>
              <div>
                <div className="font-bold">-₹2,450</div>
                <div className="text-xs text-gray">Groceries</div>
              </div>
            </div>

            <div className="glass animate-float" style={{ position: 'absolute', top: '-1.25rem', right: '-1.25rem', padding: '1rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)', animationDelay: '2.5s' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'rgba(59,130,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>💡</div>
              <div>
                <div className="font-bold">-₹1,200</div>
                <div className="text-xs text-gray">Electricity Bill</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '6rem 1.5rem', position: 'relative' }}>
        <div className="max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray">Everything you need to manage your finances in one place.</p>
          </div>

          <div className="grid grid-3">
            {[
              { icon: '📊', title: 'Real-time Analytics', desc: 'Visualize your income and expenses with dynamic charts. See exactly where your money goes every month.', color: 'rgba(59,130,246,0.2)' },
              { icon: '📁', title: 'Comprehensive Categories', desc: 'Effortlessly tag expenses as Food, Groceries, Transport, Bills, Shopping, Entertainment, Health, or Education.', color: 'rgba(245,158,11,0.2)' },
              { icon: '🛡️', title: 'Secure & Private', desc: 'Your financial data is stored securely with encrypted authentication and role-based access control.', color: 'rgba(34,197,94,0.2)' },
            ].map((f, i) => (
              <div key={i} className="glass feature-card">
                <div className="feature-icon" style={{ background: f.color }}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray" style={{ lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '6rem 1.5rem', background: 'rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
            <div>
              <h2 className="text-4xl font-bold mb-6">How It Works</h2>
              <div className="space-y-8">
                {[
                  { step: '1', title: 'Create an Account', desc: 'Sign up in seconds and access your personal dashboard.' },
                  { step: '2', title: 'Add Transactions', desc: 'Quickly log income or expenses like Groceries and Bills with our easy forms.' },
                  { step: '3', title: 'View Reports', desc: 'Check your history and charts to make better financial decisions.' },
                ].map((s, i) => (
                  <div key={i} className="flex gap-4">
                    <div style={{ flexShrink: 0, width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                      {s.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                      <p className="text-gray">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass card-3xl relative">
              <div style={{ opacity: 0.8 }} className="space-y-4">
                <div style={{ height: '1rem', background: 'rgba(255,255,255,0.2)', borderRadius: '0.5rem', width: '33%' }}></div>
                <div style={{ height: '8rem', background: 'rgba(255,255,255,0.1)', borderRadius: '0.875rem' }}></div>
                <div className="grid grid-3">
                  <div style={{ height: '5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '0.875rem' }}></div>
                  <div style={{ height: '5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '0.875rem' }}></div>
                  <div style={{ height: '5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '0.875rem' }}></div>
                </div>
              </div>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Link to="/login" className="btn btn-indigo" style={{ borderRadius: '0.875rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)' }}>
                  Try Demo Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="max-w-7xl flex items-center justify-between" style={{ flexWrap: 'wrap', gap: '1.5rem' }}>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '1.5rem' }}>💰</span>
            <span className="text-lg font-bold">Smart Expense Tracker</span>
          </div>
          <div className="text-gray text-sm">
            © 2026 SmartTracker. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <Link to="/admin-login" className="admin-link">Admin</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
