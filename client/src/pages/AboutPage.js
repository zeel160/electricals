// AboutPage.js
import React from 'react';
import { FaCheckCircle, FaBolt } from 'react-icons/fa';

export function AboutPage() {
  return (
    <div>
      <div className="page-banner">
        <div className="container"><h1>About Us</h1><p>8+ years powering Ahmedabad with quality electricals</p></div>
      </div>
      <div className="container about-content">
        <div className="about-grid">
          <div>
            <h2>Who We Are</h2>
            <p>Anchal Electricals is a trusted electrical goods dealer based in CTM, Ahmedabad, established in 2017. We serve residential, commercial, and industrial clients across Ahmedabad with genuine, ISI-marked products from India's top brands.</p>
            <p>Located at Nirant Shopping Centre on Ramol Road, we stock a wide range of MCBs, cables, switches, LED lights, fans, control panels, and more — all available with proper GST invoicing.</p>
            <div className="about-highlights">
              {['GSTIN: 24AHWPG6193R1ZA', 'State: 24-Gujarat', 'Est. 2017 | 8+ Years', 'Rating: 4.2/5 on JustDial'].map(h => (
                <div key={h} className="highlight-item"><FaCheckCircle /> {h}</div>
              ))}
            </div>
          </div>
          <div className="about-card">
            <div className="about-logo"><FaBolt /><span>AE</span></div>
            <h3>Anchal Electricals</h3>
            <p>Shop No 14/16, Nirant Shopping Centre<br />Ramol Road, CTM, Ahmedabad 380026</p>
            <p>📞 9664624690</p>
            <p>✉️ electricalsanchal@gmail.com</p>
          </div>
        </div>
      </div>
      <style>{`
        .page-banner { background: var(--secondary); color: white; padding: 60px 0; text-align: center; }
        .page-banner h1 { font-size: 36px; margin-bottom: 8px; }
        .page-banner p { color: #aaa; }
        .about-content { padding: 60px 20px; }
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
        .about-grid h2 { font-size: 28px; color: var(--secondary); margin-bottom: 16px; }
        .about-grid p { color: var(--text-muted); line-height: 1.8; margin-bottom: 16px; }
        .about-highlights { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 24px; }
        .highlight-item { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 500; }
        .highlight-item svg { color: var(--success); }
        .about-card { background: var(--secondary); color: white; border-radius: var(--radius); padding: 36px; text-align: center; }
        .about-logo { width: 80px; height: 80px; background: var(--primary); border-radius: 16px; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-size: 32px; color: white; }
        .about-card h3 { font-size: 20px; margin-bottom: 12px; }
        .about-card p { color: #bbb; font-size: 14px; line-height: 1.8; margin-bottom: 8px; }
        @media (max-width: 768px) { .about-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

export default AboutPage;
