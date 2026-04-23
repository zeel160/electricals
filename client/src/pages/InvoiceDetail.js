import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaPrint, FaArrowLeft } from 'react-icons/fa';

function numberToWords(n) {
  const a = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine',
    'Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const b = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  if (n === 0) return 'Zero';
  function helper(num) {
    if (num < 20) return a[num];
    if (num < 100) return b[Math.floor(num/10)] + (num%10 ? ' ' + a[num%10] : '');
    if (num < 1000) return a[Math.floor(num/100)] + ' Hundred' + (num%100 ? ' ' + helper(num%100) : '');
    if (num < 100000) return helper(Math.floor(num/1000)) + ' Thousand' + (num%1000 ? ' ' + helper(num%1000) : '');
    if (num < 10000000) return helper(Math.floor(num/100000)) + ' Lakh' + (num%100000 ? ' ' + helper(num%100000) : '');
    return helper(Math.floor(num/10000000)) + ' Crore' + (num%10000000 ? ' ' + helper(num%10000000) : '');
  }
  const rupees = Math.floor(n);
  const paise = Math.round((n - rupees) * 100);
  let result = helper(rupees) + ' Rupees';
  if (paise > 0) result += ' and ' + helper(paise) + ' Paise';
  return result + ' Only';
}

export default function InvoiceDetail() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/invoices/${id}`)
      .then(r => setInvoice(r.data.invoice))
      .catch(() => toast.error('Invoice not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrint = () => window.print();

  const updateStatus = async (status) => {
    await axios.put(`/api/invoices/${id}`, { status });
    toast.success('Status updated');
    const res = await axios.get(`/api/invoices/${id}`);
    setInvoice(res.data.invoice);
  };

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!invoice) return <div className="empty-state"><p>Invoice not found</p></div>;

  const inv = invoice;
  const amountInWords = numberToWords(inv.finalAmount || 0);

  return (
    <div>
      {/* Action bar — hidden on print */}
      <div className="no-print">
        <div className="page-header">
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin/invoices')}><FaArrowLeft /></button>
            <div><h1>{inv.invoiceNumber}</h1><p>Tax Invoice</p></div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="btn btn-outline" onClick={handlePrint}><FaPrint /> Print / Save PDF</button>
            <select className="form-control" style={{ width: 160 }} value={inv.status}
              onChange={e => updateStatus(e.target.value)}>
              {['Draft','Issued','Paid','Partial','Cancelled'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ===== PRINTABLE INVOICE ===== */}
      <div className="invoice-print">

        {/* HEADER */}
        <div className="inv-header">
          <div className="inv-logo-area">
            <div className="inv-logo-box">⚡</div>
            <div className="inv-company-info">
              <div className="inv-company-name">ANCHAL ELECTRICALS</div>
              <div className="inv-company-detail">GSTIN: 24AHWPG6193R1ZA &nbsp;|&nbsp; State: 24 - Gujarat</div>
              <div className="inv-company-detail">Shop No 14/16, Nirant Shopping Centre, Opp. Subhash Estate,</div>
              <div className="inv-company-detail">Ramol Road, C.T.M. Ahmedabad 380026</div>
              <div className="inv-company-detail">📞 9664624690 &nbsp;|&nbsp; ✉ electricalsanchal@gmail.com</div>
            </div>
          </div>
          <div className="inv-title-area">
            <div className="inv-title-text">Tax Invoice</div>
            <table className="inv-meta">
              <tbody>
                <tr><td className="meta-label">Invoice No.</td><td className="meta-val">{inv.invoiceNumber}</td></tr>
                <tr><td className="meta-label">Date</td><td className="meta-val">{new Date(inv.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'2-digit', year:'numeric' })}</td></tr>
                <tr><td className="meta-label">Place of Supply</td><td className="meta-val">{inv.placeOfSupply || '24-Gujarat'}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* BILL TO */}
        <div className="inv-bill-section">
          <div className="bill-label">Bill To</div>
          <div className="bill-name">{inv.customer?.name}</div>
          {inv.customer?.address && <div className="bill-detail">{inv.customer.address}</div>}
          {inv.customer?.phone && <div className="bill-detail">Contact: {inv.customer.phone}</div>}
          {inv.customer?.gstin && <div className="bill-detail">GSTIN: {inv.customer.gstin}</div>}
          {inv.customer?.state && <div className="bill-detail">State: {inv.customer.state}</div>}
        </div>

        {/* ITEMS TABLE */}
        <table className="inv-items">
          <thead>
            <tr>
              <th style={{ width: 32 }}>#</th>
              <th>Item Name</th>
              <th style={{ width: 70 }}>HSN/SAC</th>
              <th style={{ width: 48, textAlign:'center' }}>Qty</th>
              <th style={{ width: 44, textAlign:'center' }}>Unit</th>
              <th style={{ width: 90, textAlign:'right' }}>Price/Unit</th>
              <th style={{ width: 110, textAlign:'right' }}>GST</th>
              <th style={{ width: 100, textAlign:'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {inv.items.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td><strong>{item.name}</strong></td>
                <td>{item.hsnCode || '—'}</td>
                <td style={{ textAlign:'center' }}>{item.quantity}</td>
                <td style={{ textAlign:'center' }}>{item.unit}</td>
                <td style={{ textAlign:'right' }}>₹{Number(item.pricePerUnit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                <td style={{ textAlign:'right' }}>₹{Number(item.gstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })} ({item.gstRate}%)</td>
                <td style={{ textAlign:'right' }}>₹{Number(item.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={6}><strong>Total</strong></td>
              <td style={{ textAlign:'right' }}><strong>₹{Number(inv.totalAmount - inv.subTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
              <td style={{ textAlign:'right' }}><strong>₹{Number(inv.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></td>
            </tr>
          </tfoot>
        </table>

        {/* FOOTER: bank + totals side by side */}
        <div className="inv-footer-grid">

          {/* Left: bank + words */}
          <div className="inv-bank-col">
            <div className="bank-block">
              <div className="bank-title">Pay To:</div>
              <div className="bank-row"><strong>Bank:</strong> State Bank Of India, Express Highway Junction New</div>
              <div className="bank-row"><strong>Account No.:</strong> 36441708334</div>
              <div className="bank-row"><strong>IFSC:</strong> SBIN0016028</div>
              <div className="bank-row"><strong>Holder:</strong> ANCHAL ELECTRICALS</div>
              {inv.notes && <div className="bank-row" style={{ marginTop: 6, fontStyle:'italic' }}><strong>Note:</strong> {inv.notes}</div>}
            </div>
            <div className="words-block">
              <div className="words-label">Amount in Words:</div>
              <div className="words-text">₹{amountInWords}</div>
            </div>
          </div>

          {/* Right: totals */}
          <div className="inv-totals-col">
            <div className="totals-box">
              <div className="total-row"><span>Sub Total</span><span>₹{Number(inv.subTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
              <div className="total-row"><span>SGST @9%</span><span>₹{Number(inv.sgst).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
              <div className="total-row"><span>CGST @9%</span><span>₹{Number(inv.cgst).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
              {inv.roundOff !== 0 && <div className="total-row"><span>Round Off</span><span>₹{Number(inv.roundOff).toFixed(2)}</span></div>}
              <div className="total-row grand"><span>Total</span><span>₹{Number(inv.finalAmount).toLocaleString('en-IN')}</span></div>
              <div className="total-row"><span>Received</span><span>₹{Number(inv.received).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
              <div className="total-row balance"><span>Balance</span><span>₹{Number(inv.balance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span></div>
            </div>
          </div>
        </div>

        {/* SIGN */}
        <div className="inv-sign-row">
          <div className="terms-col">
            <div className="terms-title">Terms &amp; Conditions</div>
            <div className="terms-body">Thanks for doing business with us!</div>
          </div>
          <div className="sign-col">
            <div className="sign-for">For: ANCHAL ELECTRICALS</div>
            <div className="sign-line"></div>
            <div className="sign-label">Authorized Signatory</div>
          </div>
        </div>

      </div>
      {/* ===== END PRINTABLE INVOICE ===== */}

      <style>{`
        /* ---- Screen wrapper ---- */
        .invoice-print {
          background: white;
          border-radius: var(--radius);
          border: 1px solid var(--border);
          padding: 28px 32px;
          max-width: 860px;
          margin: 0 auto;
          font-family: 'Poppins', sans-serif;
          font-size: 13px;
          color: #1a1a2e;
        }

        /* HEADER */
        .inv-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 3px solid #e63946;
          padding-bottom: 14px;
          margin-bottom: 14px;
        }
        .inv-logo-area { display: flex; gap: 12px; align-items: flex-start; }
        .inv-logo-box {
          width: 52px; height: 52px; background: #e63946; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; color: white; flex-shrink: 0;
        }
        .inv-company-name { font-size: 17px; font-weight: 800; color: #1a1a2e; margin-bottom: 3px; letter-spacing: 0.5px; }
        .inv-company-detail { font-size: 11px; color: #555; line-height: 1.6; }
        .inv-title-area { text-align: right; }
        .inv-title-text { font-size: 22px; font-weight: 700; color: #1a1a2e; margin-bottom: 8px; }
        .inv-meta { font-size: 12px; }
        .meta-label { color: #777; padding: 2px 10px 2px 0; text-align: right; white-space: nowrap; }
        .meta-val { font-weight: 600; color: #1a1a2e; padding: 2px 0; white-space: nowrap; }

        /* BILL TO */
        .inv-bill-section {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 14px;
          border-left: 3px solid #e63946;
        }
        .bill-label { font-size: 11px; font-weight: 700; color: #e63946; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .bill-name { font-size: 15px; font-weight: 700; color: #1a1a2e; margin-bottom: 3px; }
        .bill-detail { font-size: 12px; color: #555; line-height: 1.6; }

        /* ITEMS TABLE */
        .inv-items { width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 12px; }
        .inv-items th { background: #1a1a2e; color: white; padding: 8px 10px; text-align: left; font-weight: 600; font-size: 11.5px; }
        .inv-items td { padding: 8px 10px; border-bottom: 1px solid #e9ecef; vertical-align: middle; }
        .inv-items tbody tr:nth-child(even) { background: #fafafa; }
        .inv-items tfoot td { background: #f0f0f0; font-weight: 700; border-top: 2px solid #ddd; font-size: 12.5px; }

        /* FOOTER GRID */
        .inv-footer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 14px; align-items: start; }

        /* Bank + Words */
        .bank-block { background: #f8f9fa; border-radius: 8px; padding: 12px; margin-bottom: 10px; font-size: 12px; }
        .bank-title { font-weight: 700; color: #1a1a2e; margin-bottom: 6px; }
        .bank-row { color: #555; line-height: 1.8; }
        .words-block { background: #fff8e1; border-radius: 8px; padding: 10px 12px; border: 1px solid #ffe082; font-size: 12px; }
        .words-label { font-weight: 700; color: #1a1a2e; margin-bottom: 3px; font-size: 11px; }
        .words-text { color: #333; font-style: italic; line-height: 1.5; }

        /* Totals */
        .totals-box { border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; font-size: 13px; }
        .total-row { display: flex; justify-content: space-between; padding: 7px 14px; border-bottom: 1px solid #eee; }
        .total-row:last-child { border-bottom: none; }
        .total-row.grand { background: #1a1a2e; color: white; font-weight: 700; font-size: 14px; }
        .total-row.balance { background: #fff8e1; color: #e65100; font-weight: 700; }

        /* SIGN */
        .inv-sign-row { display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #ddd; padding-top: 14px; }
        .terms-title { font-weight: 700; color: #1a1a2e; font-size: 12px; margin-bottom: 4px; }
        .terms-body { font-size: 12px; color: #777; }
        .sign-col { text-align: center; }
        .sign-for { font-size: 12px; color: #555; margin-bottom: 32px; }
        .sign-line { width: 160px; border-bottom: 1px solid #333; margin: 0 auto 6px; }
        .sign-label { font-size: 12px; font-weight: 600; color: #1a1a2e; }

        /* ---- PRINT STYLES ---- */
        @media print {
          @page {
            size: A4;
            margin: 12mm 10mm;
          }
          body * { visibility: hidden; }
          .invoice-print, .invoice-print * { visibility: visible; }
          .invoice-print {
            position: absolute; top: 0; left: 0;
            width: 100%; max-width: 100%;
            padding: 0; margin: 0;
            border: none; border-radius: 0;
            box-shadow: none;
            page-break-inside: avoid;
          }
          .no-print { display: none !important; }
          .inv-items { page-break-inside: avoid; }
          .inv-footer-grid { page-break-inside: avoid; }
          .inv-sign-row { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}
