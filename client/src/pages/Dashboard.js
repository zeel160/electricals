import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaRupeeSign, FaFileInvoiceDollar, FaBoxes, FaEnvelope, FaExclamationTriangle, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/stats'),
      axios.get('/api/invoices?limit=5'),
      axios.get('/api/products/low-stock'),
    ]).then(([s, inv, ls]) => {
      setStats(s.data.stats);
      setRecentInvoices(inv.data.invoices || []);
      setLowStock(ls.data.products || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  const chartData = (stats?.monthlySales || []).map(m => ({
    month: MONTHS[m._id.month - 1],
    sales: m.total,
    invoices: m.count,
  }));

  const STAT_CARDS = [
    { label: 'Total Sales', value: `₹${(stats?.totalSales || 0).toLocaleString('en-IN')}`, icon: <FaRupeeSign />, color: '#27AE60', bg: '#d4edda' },
    { label: 'This Month', value: `₹${(stats?.monthSales || 0).toLocaleString('en-IN')}`, icon: <FaRupeeSign />, color: '#2980B9', bg: '#d1ecf1' },
    { label: 'Total Invoices', value: stats?.totalInvoices || 0, icon: <FaFileInvoiceDollar />, color: '#8E44AD', bg: '#e8daef' },
    { label: 'Products', value: stats?.totalProducts || 0, icon: <FaBoxes />, color: '#F39C12', bg: '#fff3cd' },
    { label: 'New Inquiries', value: stats?.newInquiries || 0, icon: <FaEnvelope />, color: '#C0392B', bg: '#f8d7da' },
    { label: 'Pending Balance', value: `₹${(stats?.pendingBalance || 0).toLocaleString('en-IN')}`, icon: <FaExclamationTriangle />, color: '#E67E22', bg: '#fde8d8' },
  ];

  return (
    <div>
      <div className="page-header">
        <div><h1>Dashboard</h1><p>Welcome back! Here's your business overview.</p></div>
        <Link to="/admin/invoices/new" className="btn btn-primary">+ New Invoice</Link>
      </div>

      <div className="stats-grid">
        {STAT_CARDS.map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div className="stat-info">
              <p>{s.label}</p>
              <h2>{s.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        {/* Chart */}
        <div className="card">
          <h3 style={{ marginBottom: 20, color: 'var(--secondary)' }}>Monthly Sales (Last 6 Months)</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 13 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Sales']} />
                <Bar dataKey="sales" fill="#C0392B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: 40 }}><p>No sales data yet.</p></div>
          )}
        </div>

        {/* Low Stock */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ color: 'var(--secondary)' }}>⚠️ Low Stock Alert</h3>
            <Link to="/admin/products" style={{ fontSize: 13, color: 'var(--primary)' }}>View All <FaArrowRight /></Link>
          </div>
          {lowStock.length === 0 ? (
            <div className="empty-state" style={{ padding: 30 }}><p>✅ All products are well stocked!</p></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Product</th><th>Stock</th><th>Min</th></tr></thead>
                <tbody>
                  {lowStock.slice(0, 6).map(p => (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                      <td><span className={`badge ${p.stock === 0 ? 'badge-danger' : 'badge-warning'}`}>{p.stock} {p.unit}</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{p.minStock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="card" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ color: 'var(--secondary)' }}>Recent Invoices</h3>
          <Link to="/admin/invoices" style={{ fontSize: 13, color: 'var(--primary)' }}>View All <FaArrowRight /></Link>
        </div>
        {recentInvoices.length === 0 ? (
          <div className="empty-state"><p>No invoices yet. Create your first invoice!</p></div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Invoice No.</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {recentInvoices.map(inv => (
                  <tr key={inv._id}>
                    <td><Link to={`/admin/invoices/${inv._id}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>{inv.invoiceNumber}</Link></td>
                    <td>{inv.customer?.name}</td>
                    <td style={{ fontWeight: 600 }}>₹{inv.finalAmount?.toLocaleString('en-IN')}</td>
                    <td><span className={`badge badge-${inv.status === 'Paid' ? 'success' : inv.status === 'Cancelled' ? 'danger' : 'warning'}`}>{inv.status}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{new Date(inv.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .dash-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px; }
        @media (max-width: 900px) { .dash-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
