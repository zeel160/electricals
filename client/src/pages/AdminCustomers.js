import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaWhatsapp } from 'react-icons/fa';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/customers').then(r => setCustomers(r.data.customers || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div><h1>Customers</h1><p>All customers derived from invoices</p></div>
        <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{customers.length} customers</span>
      </div>
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead><tr><th>#</th><th>Customer Name</th><th>Phone</th><th>GSTIN</th><th>Invoices</th><th>Total Spent</th><th>Last Order</th><th></th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40 }}>Loading...</td></tr>
                : customers.length === 0 ? <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No customers yet.</td></tr>
                : customers.map((c, i) => (
                  <tr key={c._id}>
                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td><strong>{c._id}</strong></td>
                    <td>{c.phone || '—'}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.gstin || '—'}</td>
                    <td><span className="badge badge-info">{c.totalInvoices}</span></td>
                    <td style={{ fontWeight: 700, color: 'var(--success)' }}>₹{c.totalAmount?.toLocaleString('en-IN')}</td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{new Date(c.lastOrder).toLocaleDateString('en-IN')}</td>
                    <td>
                      {c.phone && (
                        <a href={`https://wa.me/91${c.phone}`} target="_blank" rel="noreferrer" className="btn btn-success btn-sm">
                          <FaWhatsapp />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
