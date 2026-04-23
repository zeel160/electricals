import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaBolt, FaShieldAlt, FaTruck, FaStar, FaWhatsapp, FaArrowRight,
  FaCheckCircle, FaTools, FaIndustry, FaHome, FaBuilding
} from 'react-icons/fa';

const CATEGORIES = [
  { icon: '⚡', name: 'MCB & Circuit Breakers', desc: 'L&T, Legrand, Havells' },
  { icon: '🔌', name: 'Cables & Wires', desc: 'Finolex, Polycab, RR Kabel' },
  { icon: '💡', name: 'LED Lighting', desc: 'Philips, Syska, Orient' },
  { icon: '🔧', name: 'Switches & Sockets', desc: 'Anchor, Legrand, GM' },
  { icon: '⚙️', name: 'Control Panels', desc: 'Industrial & Commercial' },
  { icon: '🌀', name: 'Fans', desc: 'Crompton, Orient, Havells' },
];

const FEATURES = [
  { icon: <FaShieldAlt />, title: 'Genuine Products', desc: 'Only ISI-marked, authentic electrical items from top Indian and international brands.' },
  { icon: <FaTruck />, title: 'Quick Delivery', desc: 'Same-day delivery within Ahmedabad on orders placed before 2 PM.' },
  { icon: <FaTools />, title: 'Expert Guidance', desc: '8+ years of expertise to help you choose the right product for your needs.' },
  { icon: <FaStar />, title: 'Best Prices', desc: 'Competitive prices with GST invoices for businesses and contractors.' },
];

const TESTIMONIALS = [
  { name: 'Rajesh Patel', company: 'Patel Constructions', text: 'Best electrical shop in CTM area. Always have stock of L&T MCBs and competitive pricing.', stars: 5 },
  { name: 'Suresh Shah', company: 'Shah Enterprises', text: 'Quick delivery and genuine products. Have been their customer for 3 years now.', stars: 5 },
  { name: 'Visor Refractory', company: 'Vatva GIDC', text: 'Reliable supplier for our industrial needs. Proper GST invoices always.', stars: 4 },
];

export default function HomePage() {
  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <div className="hero-badge"><FaBolt /> Ahmedabad's Trusted Electrical Store</div>
          <h1 className="hero-title">
            Power Your World with <span>Quality Electricals</span>
          </h1>
          <p className="hero-subtitle">
            MCBs, Cables, Panels, Lights & more — all genuine brands, GST billing, fast delivery across Ahmedabad.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary btn-lg"><FaBolt /> Browse Products</Link>
            <a href="https://wa.me/919664624690" target="_blank" rel="noreferrer" className="btn btn-outline-white btn-lg">
              <FaWhatsapp /> Get Quote
            </a>
          </div>
          <div className="hero-stats">
            <div><strong>8+</strong><span>Years in Business</span></div>
            <div><strong>500+</strong><span>Products</span></div>
            <div><strong>1000+</strong><span>Happy Customers</span></div>
            <div><strong>GST</strong><span>Registered</span></div>
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Our Product Categories</h2>
            <p>Everything you need for residential, commercial & industrial electrical work</p>
          </div>
          <div className="cat-grid">
            {CATEGORIES.map(cat => (
              <Link to="/products" className="cat-card" key={cat.name}>
                <div className="cat-icon">{cat.icon}</div>
                <h3>{cat.name}</h3>
                <p>{cat.desc}</p>
                <span className="cat-link">Explore <FaArrowRight /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose Anchal Electricals?</h2>
            <p>Serving Ahmedabad's electrical needs with trust and quality since 2017</p>
          </div>
          <div className="features-grid">
            {FEATURES.map(f => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="section">
        <div className="container serve-section">
          <div className="serve-text">
            <h2>Serving All Your Electrical Needs</h2>
            <p>From homeowners to large industrial clients, we provide the right products at the right price.</p>
            <div className="serve-list">
              {['Residential Buildings', 'Commercial Establishments', 'Industrial Units (GIDC)', 'Electrical Contractors', 'Government Projects', 'Solar & Renewable Energy'].map(s => (
                <div key={s} className="serve-item"><FaCheckCircle /> {s}</div>
              ))}
            </div>
            <Link to="/contact" className="btn btn-primary">Get in Touch <FaArrowRight /></Link>
          </div>
          <div className="serve-icons">
            <div className="serve-icon-card"><FaHome /><span>Residential</span></div>
            <div className="serve-icon-card"><FaBuilding /><span>Commercial</span></div>
            <div className="serve-icon-card"><FaIndustry /><span>Industrial</span></div>
            <div className="serve-icon-card"><FaTools /><span>Contractors</span></div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2>What Our Customers Say</h2>
            <p>Real reviews from real customers in Ahmedabad</p>
          </div>
          <div className="testimonial-grid">
            {TESTIMONIALS.map(t => (
              <div className="testimonial-card" key={t.name}>
                <div className="stars">{'⭐'.repeat(t.stars)}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.name[0]}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.company}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container cta-inner">
          <div>
            <h2>Ready to Order? Let's Talk!</h2>
            <p>Call us, WhatsApp us, or visit the shop at CTM, Ahmedabad</p>
          </div>
          <div className="cta-actions">
            <a href="tel:9664624690" className="btn btn-primary btn-lg">📞 Call Now</a>
            <a href="https://wa.me/919664624690" target="_blank" rel="noreferrer" className="btn btn-success btn-lg">
              <FaWhatsapp /> WhatsApp
            </a>
          </div>
        </div>
      </section>

      <style>{`
        .hero { position: relative; background: var(--secondary); color: white; padding: 100px 0 80px; overflow: hidden; }
        .hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at top right, rgba(192,57,43,0.3) 0%, transparent 60%); }
        .hero-content { position: relative; max-width: 760px; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(192,57,43,0.2); border: 1px solid rgba(192,57,43,0.4); color: #ff8a80; padding: 6px 16px; border-radius: 30px; font-size: 13px; margin-bottom: 24px; }
        .hero-title { font-size: clamp(32px, 5vw, 52px); font-weight: 800; line-height: 1.15; margin-bottom: 20px; }
        .hero-title span { color: var(--primary-light); }
        .hero-subtitle { font-size: 18px; color: #bbb; margin-bottom: 36px; max-width: 580px; line-height: 1.7; }
        .hero-actions { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 48px; }
        .btn-outline-white { background: transparent; color: white; border: 2px solid rgba(255,255,255,0.4); font-weight: 600; padding: 14px 28px; border-radius: 8px; display: inline-flex; align-items: center; gap: 8px; font-size: 16px; transition: all 0.2s; }
        .btn-outline-white:hover { background: rgba(255,255,255,0.1); border-color: white; }
        .hero-stats { display: flex; gap: 40px; flex-wrap: wrap; }
        .hero-stats div { display: flex; flex-direction: column; }
        .hero-stats strong { font-size: 26px; font-weight: 700; color: white; }
        .hero-stats span { font-size: 13px; color: #888; }
        .section { padding: 80px 0; }
        .section-alt { background: white; }
        .section-header { text-align: center; margin-bottom: 48px; }
        .section-header h2 { font-size: 32px; color: var(--secondary); margin-bottom: 10px; }
        .section-header p { color: var(--text-muted); font-size: 16px; }
        .cat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; }
        .cat-card { background: white; border: 1.5px solid var(--border); border-radius: var(--radius); padding: 28px 20px; text-align: center; transition: all 0.25s; }
        .cat-card:hover { border-color: var(--primary); transform: translateY(-4px); box-shadow: var(--shadow-md); }
        .cat-icon { font-size: 40px; margin-bottom: 14px; }
        .cat-card h3 { font-size: 14px; color: var(--secondary); margin-bottom: 6px; }
        .cat-card p { font-size: 12px; color: var(--text-muted); margin-bottom: 12px; }
        .cat-link { font-size: 13px; color: var(--primary); font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; }
        .feature-card { background: var(--bg); border-radius: var(--radius); padding: 28px; border: 1px solid var(--border); }
        .feature-icon { width: 52px; height: 52px; background: rgba(192,57,43,0.1); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; color: var(--primary); font-size: 22px; margin-bottom: 16px; }
        .feature-card h3 { font-size: 16px; margin-bottom: 8px; color: var(--secondary); }
        .feature-card p { font-size: 14px; color: var(--text-muted); line-height: 1.7; }
        .serve-section { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .serve-text h2 { font-size: 30px; margin-bottom: 12px; color: var(--secondary); }
        .serve-text p { color: var(--text-muted); margin-bottom: 24px; }
        .serve-list { margin-bottom: 28px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .serve-item { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--text); }
        .serve-item svg { color: var(--success); }
        .serve-icons { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .serve-icon-card { background: white; border: 1.5px solid var(--border); border-radius: var(--radius); padding: 30px 20px; text-align: center; }
        .serve-icon-card svg { font-size: 36px; color: var(--primary); display: block; margin: 0 auto 12px; }
        .serve-icon-card span { font-size: 14px; font-weight: 600; color: var(--secondary); }
        .testimonial-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
        .testimonial-card { background: var(--bg); border-radius: var(--radius); padding: 28px; border: 1px solid var(--border); }
        .stars { font-size: 16px; margin-bottom: 12px; }
        .testimonial-text { font-size: 14px; color: var(--text); line-height: 1.7; margin-bottom: 20px; font-style: italic; }
        .testimonial-author { display: flex; align-items: center; gap: 12px; }
        .author-avatar { width: 40px; height: 40px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 16px; }
        .testimonial-author strong { display: block; font-size: 14px; color: var(--secondary); }
        .testimonial-author span { font-size: 12px; color: var(--text-muted); }
        .cta-section { background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); padding: 60px 0; }
        .cta-inner { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px; }
        .cta-section h2 { color: white; font-size: 28px; margin-bottom: 8px; }
        .cta-section p { color: rgba(255,255,255,0.8); font-size: 15px; }
        .cta-actions { display: flex; gap: 16px; flex-wrap: wrap; }
        @media (max-width: 768px) {
          .serve-section { grid-template-columns: 1fr; }
          .serve-icons { display: grid; grid-template-columns: 1fr 1fr; }
          .cta-inner { flex-direction: column; text-align: center; }
        }
      `}</style>
    </div>
  );
}
