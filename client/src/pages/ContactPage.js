import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaWhatsapp, FaPaperPlane } from 'react-icons/fa';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.message.trim()) e.message = 'Message is required';
    else if (form.message.trim().length < 10) e.message = 'Message too short (min 10 chars)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) { toast.error('Please fix the errors above'); return; }
    setLoading(true);
    try {
      await axios.post('/api/inquiries', form);
      toast.success('Inquiry submitted! We will contact you shortly.');
      setForm({ name: '', phone: '', email: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to submit. Please call us directly.');
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="page-banner">
        <div className="container"><h1>Contact Us</h1><p>We're here to help. Reach out anytime!</p></div>
      </div>
      <div className="container contact-grid">
        {/* Info */}
        <div className="contact-info">
          <h2>Get In Touch</h2>
          <p>Visit our shop at CTM, or reach us via phone, WhatsApp, or email.</p>
          <div className="info-cards">
            <div className="info-card"><FaPhone /><div><strong>Phone</strong><span>9664624690</span></div></div>
            <div className="info-card"><FaWhatsapp /><div><strong>WhatsApp</strong><span>9664624690</span></div></div>
            <div className="info-card"><FaEnvelope /><div><strong>Email</strong><span>electricalsanchal@gmail.com</span></div></div>
            <div className="info-card"><FaClock /><div><strong>Hours</strong><span>Mon–Sat: 9 AM – 9 PM</span></div></div>
            <div className="info-card full"><FaMapMarkerAlt /><div><strong>Address</strong><span>Shop No 14/16, Nirant Shopping Centre, Opp. Subhash Estate, Ramol Road, C.T.M. Ahmedabad – 380026</span></div></div>
          </div>
          {/* Map */}
          <div className="map-embed">
            <iframe
              title="Anchal Electricals Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.0!2d72.6419!3d23.0038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAwJzEzLjciTiA3MsKwMzgnMzAuOCJF!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%" height="250" style={{ border: 0, borderRadius: 12 }} allowFullScreen loading="lazy"
            />
          </div>
        </div>

        {/* Form */}
        <div className="contact-form card">
          <h2>Send Inquiry</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: 14 }}>Fill the form and we'll get back to you within 1 business hour.</p>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input className={`form-control ${errors.name ? 'err-border' : ''}`} name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
              {errors.name && <span className="err-msg">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input className={`form-control ${errors.phone ? 'err-border' : ''}`} name="phone" value={form.phone} onChange={handleChange} placeholder="Mobile number" />
              {errors.phone && <span className="err-msg">{errors.phone}</span>}
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input className={`form-control ${errors.email ? 'err-border' : ''}`} name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" />
            {errors.email && <span className="err-msg">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>Subject</label>
            <input className="form-control" name="subject" value={form.subject} onChange={handleChange} placeholder="Product inquiry, quote request..." />
          </div>
          <div className="form-group">
            <label>Message *</label>
            <textarea className={`form-control ${errors.message ? 'err-border' : ''}`} name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Describe what you need..." />
            {errors.message && <span className="err-msg">{errors.message}</span>}
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSubmit} disabled={loading}>
            <FaPaperPlane /> {loading ? 'Sending...' : 'Send Inquiry'}
          </button>
        </div>
      </div>
      <style>{`
        .page-banner { background: var(--secondary); color: white; padding: 60px 0; text-align: center; }
        .page-banner h1 { font-size: 36px; margin-bottom: 8px; }
        .page-banner p { color: #aaa; }
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; padding: 60px 20px; }
        .contact-info h2, .contact-form h2 { font-size: 24px; color: var(--secondary); margin-bottom: 12px; }
        .contact-info p { color: var(--text-muted); margin-bottom: 24px; }
        .info-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
        .info-card { display: flex; align-items: flex-start; gap: 12px; background: var(--bg); border-radius: var(--radius-sm); padding: 14px; }
        .info-card.full { grid-column: 1/-1; }
        .info-card svg { color: var(--primary); font-size: 18px; flex-shrink: 0; margin-top: 2px; }
        .info-card strong { display: block; font-size: 13px; color: var(--secondary); }
        .info-card span { font-size: 13px; color: var(--text-muted); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        textarea.form-control { resize: vertical; }
        @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } .form-row { grid-template-columns: 1fr; } }
        .err-border { border-color: #ef4444 !important; }
        .err-msg { color: #ef4444; font-size: 12px; margin-top: 3px; display: block; }
      `}</style>
    </div>
  );
}
