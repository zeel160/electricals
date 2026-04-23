import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaSave } from 'react-icons/fa';

const EMPTY_ITEM = { name: '', hsnCode: '', quantity: 1, unit: 'Pcs', pricePerUnit: '', gstRate: 18 };

export default function CreateInvoice() {
  const [customer, setCustomer] = useState({ name: '', address: '', gstin: '', phone: '', email: '', state: '24-Gujarat' });
  const [items, setItems] = useState([{ ...EMPTY_ITEM }]);
  const [products, setProducts] = useState([]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { axios.get('/api/products?limit=200').then(r => setProducts(r.data.products || [])).catch(() => {}); }, []);

  const cf = (k) => (e) => setCustomer(c => ({ ...c, [k]: e.target.value }));

  const setItem = (i, k, v) => setItems(items.map((it, idx) => idx === i ? { ...it, [k]: v } : it));

  const selectProduct = (i, name) => {
    const p = products.find(p => p.name === name);
    if (p) setItems(items.map((it, idx) => idx === i ? { ...it, name: p.name, hsnCode: p.hsnCode || '', pricePerUnit: p.price, unit: p.unit || 'Pcs', gstRate: p.gstRate || 18 } : it));
    else setItem(i, 'name', name);
  };

  const addItem = () => setItems([...items, { ...EMPTY_ITEM }]);
  const removeItem = (i) => items.length > 1 && setItems(items.filter((_, idx) => idx !== i));

  const calcItem = (it) => {
    const base = Number(it.quantity || 0) * Number(it.pricePerUnit || 0);
    const gst = base * (Number(it.gstRate || 18) / 100);
    return { base, gst, total: base + gst };
  };

  const subTotal = items.reduce((s, it) => s + calcItem(it).base, 0);
  const gstTotal = items.reduce((s, it) => s + calcItem(it).gst, 0);
  const total = Math.round(subTotal + gstTotal);

  const handleSave = async () => {
    if (!customer.name) return toast.error('Customer name required');
    if (items.some(it => !it.name || !it.pricePerUnit || !it.quantity)) return toast.error('Fill all item details');
    setSaving(true);
    try {
      const res = await axios.post('/api/invoices', { customer, items, notes });
      toast.success(`Invoice ${res.data.invoice.invoiceNumber} created!`);
      navigate(`/admin/invoices/${res.data.invoice._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create invoice');
    }
    setSaving(false);
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Create Invoice</h1><p>Fill customer details and add items</p></div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          <FaSave /> {saving ? 'Saving...' : 'Save Invoice'}
        </button>
      </div>

      <div className="invoice-grid">
        {/* Customer */}
        <div className="card">
          <h3 style={{ marginBottom: 20, color: 'var(--secondary)' }}>Bill To (Customer Details)</h3>
          <div className="form-group"><label>Customer Name *</label><input className="form-control" value={customer.name} onChange={cf('name')} placeholder="Company or customer name" /></div>
          <div className="form-row-2">
            <div className="form-group"><label>Phone</label><input className="form-control" value={customer.phone} onChange={cf('phone')} placeholder="+91 XXXXXXXXXX" /></div>
            <div className="form-group"><label>Email</label><input className="form-control" value={customer.email} onChange={cf('email')} placeholder="customer@email.com" /></div>
          </div>
          <div className="form-group"><label>GSTIN</label><input className="form-control" value={customer.gstin} onChange={cf('gstin')} placeholder="Customer GSTIN (optional)" /></div>
          <div className="form-group"><label>Address</label><textarea className="form-control" rows={3} value={customer.address} onChange={cf('address')} placeholder="Full billing address" /></div>
          <div className="form-group"><label>Notes</label><textarea className="form-control" rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Payment terms, special instructions..." /></div>
        </div>

        {/* Invoice Info */}
        <div className="card invoice-summary-top">
          <h3 style={{ marginBottom: 16, color: 'var(--secondary)' }}>Invoice Info</h3>
          <div className="inv-meta"><span>From</span><strong>ANCHAL ELECTRICALS</strong></div>
          <div className="inv-meta"><span>GSTIN</span><strong>24AHWPG6193R1ZA</strong></div>
          <div className="inv-meta"><span>Date</span><strong>{new Date().toLocaleDateString('en-IN')}</strong></div>
          <div className="inv-meta"><span>Place of Supply</span><strong>24-Gujarat</strong></div>
          <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid var(--border)' }} />
          <div className="inv-meta"><span>Sub Total</span><strong>₹{subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></div>
          <div className="inv-meta"><span>SGST @9%</span><strong>₹{(gstTotal / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></div>
          <div className="inv-meta"><span>CGST @9%</span><strong>₹{(gstTotal / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></div>
          <div className="inv-meta total-row"><span>TOTAL</span><strong>₹{total.toLocaleString('en-IN')}</strong></div>
        </div>
      </div>

      {/* Items */}
      <div className="card" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ color: 'var(--secondary)' }}>Invoice Items</h3>
          <button className="btn btn-outline btn-sm" onClick={addItem}><FaPlus /> Add Item</button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th><th style={{ minWidth: 200 }}>Item Name</th><th>HSN</th>
                <th style={{ minWidth: 100 }}>Qty</th><th>Unit</th>
                <th style={{ minWidth: 120 }}>Price/Unit (₹)</th><th>GST%</th>
                <th>GST Amt</th><th>Amount</th><th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => {
                const c = calcItem(it);
                return (
                  <tr key={i}>
                    <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                    <td>
                      <input className="form-control" style={{ fontSize: 13 }} list={`products-${i}`} value={it.name}
                        onChange={e => selectProduct(i, e.target.value)} placeholder="Select or type..." />
                      <datalist id={`products-${i}`}>{products.map(p => <option key={p._id} value={p.name} />)}</datalist>
                    </td>
                    <td><input className="form-control" style={{ width: 80, fontSize: 13 }} value={it.hsnCode} onChange={e => setItem(i, 'hsnCode', e.target.value)} placeholder="8536" /></td>
                    <td><input className="form-control" style={{ width: 80, fontSize: 13 }} type="number" value={it.quantity} onChange={e => setItem(i, 'quantity', e.target.value)} min={1} /></td>
                    <td>
                      <select className="form-control" style={{ width: 70, fontSize: 13 }} value={it.unit} onChange={e => setItem(i, 'unit', e.target.value)}>
                        {['Pcs','Mtr','Roll','Set','Box','Kg'].map(u => <option key={u}>{u}</option>)}
                      </select>
                    </td>
                    <td><input className="form-control" style={{ width: 110, fontSize: 13 }} type="number" value={it.pricePerUnit} onChange={e => setItem(i, 'pricePerUnit', e.target.value)} placeholder="0.00" /></td>
                    <td>
                      <select className="form-control" style={{ width: 75, fontSize: 13 }} value={it.gstRate} onChange={e => setItem(i, 'gstRate', e.target.value)}>
                        {[5,12,18,28].map(r => <option key={r} value={r}>{r}%</option>)}
                      </select>
                    </td>
                    <td style={{ fontWeight: 500 }}>₹{c.gst.toFixed(2)}</td>
                    <td style={{ fontWeight: 700 }}>₹{c.total.toFixed(2)}</td>
                    <td><button className="btn btn-danger btn-sm" onClick={() => removeItem(i)} disabled={items.length === 1}><FaTrash /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .invoice-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px; }
        .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .inv-meta { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; border-bottom: 1px solid #f5f5f5; }
        .inv-meta span { color: var(--text-muted); }
        .inv-meta strong { color: var(--secondary); }
        .total-row { margin-top: 8px; padding-top: 12px !important; border-top: 2px solid var(--border) !important; border-bottom: none !important; }
        .total-row span { font-size: 16px; font-weight: 700; color: var(--secondary); }
        .total-row strong { font-size: 20px; color: var(--primary); }
        @media (max-width: 768px) { .invoice-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
