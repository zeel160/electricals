// AdminInquiries.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => { fetch(); }, [filter]);

  const fetch = async () => {
    setLoading(true);
    const res = await axios.get('/api/inquiries', { params: { status: filter, limit: 50 } }).catch(() => ({ data: { inquiries: [] } }));
    setInquiries(res.data.inquiries || []);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    await axios.put(`/api/inquiries/${id}`, { status });
    toast.success('Status updated');
    fetch();
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Inquiries</h1><p>Customer inquiries from website</p></div>
        <select className="form-control" style={{ width: 180 }} value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Inquiries</option>
          {['New','In Progress','Resolved','Closed'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Name</th><th>Phone</th><th>Subject</th><th>Message</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40 }}>Loading...</td></tr>
                : inquiries.length === 0 ? <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No inquiries yet.</td></tr>
                : inquiries.map(inq => (
                  <tr key={inq._id}>
                    <td><strong>{inq.name}</strong></td>
                    <td><a href={`tel:${inq.phone}`} style={{ color: 'var(--primary)' }}>{inq.phone}</a></td>
                    <td>{inq.subject || '—'}</td>
                    <td style={{ maxWidth: 220, fontSize: 13, color: 'var(--text-muted)' }}>{inq.message?.substring(0, 80)}...</td>
                    <td><span className={`badge badge-${inq.status === 'Resolved' || inq.status === 'Closed' ? 'success' : inq.status === 'In Progress' ? 'warning' : 'danger'}`}>{inq.status}</span></td>
                    <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{new Date(inq.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <select className="form-control" style={{ width: 140, fontSize: 13 }} value={inq.status} onChange={e => updateStatus(inq._id, e.target.value)}>
                        {['New','In Progress','Resolved','Closed'].map(s => <option key={s}>{s}</option>)}
                      </select>
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
