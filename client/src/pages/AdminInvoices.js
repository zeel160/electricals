// AdminInvoices.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaPlus, FaSearch, FaEye } from 'react-icons/fa';

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => { fetchInvoices(); }, [search, status]);

  const fetchInvoices = async () => {
    setLoading(true);
    const params = { limit: 50 };
    if (search) params.search = search;
    if (status) params.status = status;
    const res = await axios.get('/api/invoices', { params }).catch(() => ({ data: { invoices: [] } }));
    setInvoices(res.data.invoices || []);
    setLoading(false);
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Invoices</h1><p>Manage all tax invoices</p></div>
        <Link to="/admin/invoices/new" className="btn btn-primary"><FaPlus /> New Invoice</Link>
      </div>
      <div className="card">
        <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
            <FaSearch className="search-icon" />
            <input className="form-control" placeholder="Search by customer..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-control" style={{ width: 160 }} value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All Status</option>
            {['Draft','Issued','Paid','Partial','Cancelled'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Invoice No.</th><th>Customer</th><th>GSTIN</th><th>Amount</th><th>Balance</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40 }}>Loading...</td></tr>
                : invoices.length === 0 ? <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No invoices yet. <Link to="/admin/invoices/new" style={{ color: 'var(--primary)' }}>Create one?</Link></td></tr>
                : invoices.map(inv => (
                  <tr key={inv._id}>
                    <td><Link to={`/admin/invoices/${inv._id}`} style={{ color: 'var(--primary)', fontWeight: 700 }}>{inv.invoiceNumber}</Link></td>
                    <td><strong>{inv.customer?.name}</strong>{inv.customer?.phone && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{inv.customer.phone}</div>}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{inv.customer?.gstin || '—'}</td>
                    <td style={{ fontWeight: 600 }}>₹{inv.finalAmount?.toLocaleString('en-IN')}</td>
                    <td style={{ fontWeight: 600, color: inv.balance > 0 ? 'var(--warning)' : 'var(--success)' }}>₹{inv.balance?.toLocaleString('en-IN')}</td>
                    <td><span className={`badge badge-${inv.status === 'Paid' ? 'success' : inv.status === 'Cancelled' ? 'danger' : inv.status === 'Partial' ? 'warning' : 'info'}`}>{inv.status}</span></td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{new Date(inv.createdAt).toLocaleDateString('en-IN')}</td>
                    <td><Link to={`/admin/invoices/${inv._id}`} className="btn btn-outline btn-sm"><FaEye /></Link></td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
