import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBolt, FaBars, FaTimes, FaPhone, FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/products', label: 'Products' },
  { path: '/about', label: 'About Us' },
  { path: '/contact', label: 'Contact' },
];

export default function Layout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="site-wrapper">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <span><FaPhone /> 9664624690</span>
          <span><FaEnvelope /> electricalsanchal@gmail.com</span>
          <span className="hide-mobile"><FaMapMarkerAlt /> Shop No 14/16, Nirant Shopping Centre, CTM, Ahmedabad 380026</span>
        </div>
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="container nav-inner">
          <Link to="/" className="nav-logo">
            <div className="logo-icon"><FaBolt /></div>
            <div>
              <span className="logo-name">ANCHAL</span>
              <span className="logo-sub">ELECTRICALS</span>
            </div>
          </Link>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {NAV_LINKS.map(l => (
              <li key={l.path}>
                <Link to={l.path} className={pathname === l.path ? 'active' : ''} onClick={() => setMenuOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a href="https://wa.me/919664624690" target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
                <FaWhatsapp /> WhatsApp Us
              </a>
            </li>
          </ul>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* Page Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <div className="footer-logo">
              <div className="logo-icon small"><FaBolt /></div>
              <div>
                <span className="logo-name">ANCHAL</span>
                <span className="logo-sub">ELECTRICALS</span>
              </div>
            </div>
            <p className="footer-about">Your trusted electrical partner in Ahmedabad since 2017. Quality products, reliable service.</p>
            <p className="footer-gstin">GSTIN: 24AHWPG6193R1ZA</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul className="footer-links">
              {NAV_LINKS.map(l => <li key={l.path}><Link to={l.path}>{l.label}</Link></li>)}
            </ul>
          </div>
          <div>
            <h4>Contact Us</h4>
            <div className="footer-contact">
              <p><FaPhone /> 9664624690</p>
              <p><FaEnvelope /> electricalsanchal@gmail.com</p>
              <p><FaMapMarkerAlt /> Shop No 14/16, Nirant Shopping Centre, Opp. Subhash Estate, Ramol Road, C.T.M. Ahmedabad 380026</p>
            </div>
          </div>
          <div>
            <h4>Business Hours</h4>
            <div className="footer-hours">
              <p>Monday – Saturday</p>
              <p className="hours-time">9:00 AM – 9:00 PM</p>
              <p className="closed">Sunday: Closed</p>
            </div>
            <a href="https://wa.me/919664624690" target="_blank" rel="noreferrer" className="btn btn-primary mt-16">
              <FaWhatsapp /> Chat on WhatsApp
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Anchal Electricals. All rights reserved. | Designed with ❤️ in Ahmedabad</p>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a href="https://wa.me/919664624690" className="whatsapp-float" target="_blank" rel="noreferrer" title="Chat on WhatsApp">
        <FaWhatsapp />
      </a>

      <style>{`
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .top-bar { background: var(--secondary); color: #aaa; font-size: 13px; padding: 8px 0; }
        .top-bar-inner { display: flex; gap: 24px; align-items: center; flex-wrap: wrap; }
        .top-bar-inner span { display: flex; align-items: center; gap: 6px; }
        .navbar { background: white; box-shadow: var(--shadow-sm); position: sticky; top: 0; z-index: 100; }
        .nav-inner { display: flex; align-items: center; justify-content: space-between; height: 70px; }
        .nav-logo { display: flex; align-items: center; gap: 12px; }
        .logo-icon { width: 42px; height: 42px; background: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; }
        .logo-icon.small { width: 34px; height: 34px; font-size: 16px; }
        .logo-name { display: block; font-family: 'Poppins', sans-serif; font-size: 18px; font-weight: 800; color: var(--secondary); line-height: 1; }
        .logo-sub { display: block; font-size: 10px; font-weight: 600; color: var(--primary); letter-spacing: 2px; }
        .nav-links { display: flex; align-items: center; gap: 6px; list-style: none; }
        .nav-links a { padding: 8px 14px; border-radius: 8px; font-size: 14px; font-weight: 500; color: var(--text); transition: all 0.2s; }
        .nav-links a:hover, .nav-links a.active { color: var(--primary); background: rgba(192,57,43,0.08); }
        .hamburger { display: none; background: none; border: none; font-size: 22px; cursor: pointer; color: var(--text); }
        .footer { background: var(--secondary); color: #ccc; padding: 60px 0 0; margin-top: 60px; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1.5fr 1.5fr; gap: 40px; padding-bottom: 40px; }
        .footer-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
        .footer-logo .logo-name, .footer-logo .logo-sub { color: white; }
        .footer-about { font-size: 14px; line-height: 1.8; color: #aaa; }
        .footer-gstin { font-size: 12px; color: #888; margin-top: 8px; }
        .footer h4 { color: white; margin-bottom: 16px; font-size: 15px; }
        .footer-links { list-style: none; }
        .footer-links li { margin-bottom: 8px; }
        .footer-links a { color: #aaa; font-size: 14px; transition: color 0.2s; }
        .footer-links a:hover { color: var(--primary); }
        .footer-contact p { display: flex; align-items: flex-start; gap: 8px; font-size: 14px; color: #aaa; margin-bottom: 8px; line-height: 1.5; }
        .footer-hours p { font-size: 14px; color: #aaa; }
        .hours-time { color: var(--accent) !important; font-weight: 600; font-size: 16px !important; }
        .closed { color: #e74c3c !important; }
        .footer-bottom { border-top: 1px solid #333; text-align: center; padding: 20px; font-size: 13px; color: #888; }
        .mt-16 { margin-top: 16px; }
        .whatsapp-float { position: fixed; bottom: 28px; right: 28px; background: #25D366; color: white; width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; box-shadow: 0 4px 20px rgba(37,211,102,0.5); z-index: 999; transition: transform 0.2s; }
        .whatsapp-float:hover { transform: scale(1.1); }
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr; }
          .hamburger { display: block; }
          .nav-links { display: none; position: fixed; top: 70px; left: 0; right: 0; background: white; flex-direction: column; padding: 20px; box-shadow: var(--shadow-md); gap: 4px; }
          .nav-links.open { display: flex; }
          .nav-links a { padding: 12px 16px; }
          .hide-mobile { display: none; }
        }
        @media (max-width: 600px) { .footer-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
