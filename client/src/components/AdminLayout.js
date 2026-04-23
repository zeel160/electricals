import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaBolt, FaTachometerAlt, FaBoxes, FaFileInvoiceDollar,
  FaUsers, FaEnvelope, FaBars, FaTimes, FaSignOutAlt,
  FaUser, FaPlus, FaUserCog
} from 'react-icons/fa';

const MENU = [
  { path: '/admin', icon: <FaTachometerAlt />, label: 'Dashboard', exact: true },
  { path: '/admin/products', icon: <FaBoxes />, label: 'Products' },
  { path: '/admin/invoices', icon: <FaFileInvoiceDollar />, label: 'Invoices' },
  { path: '/admin/customers', icon: <FaUsers />, label: 'Customers' },
  { path: '/admin/inquiries', icon: <FaEnvelope />, label: 'Inquiries' },
  { path: '/admin/profile', icon: <FaUserCog />, label: 'Profile & Security' },
];

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const isActive = (item) => item.exact ? pathname === item.path : pathname.startsWith(item.path);

  const currentLabel = MENU.find(m => isActive(m))?.label || 'Admin';

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="nav-logo">
            <div className="logo-icon"><FaBolt /></div>
            {!collapsed && <div><span className="logo-name">ANCHAL</span><span className="logo-sub">ELECTRICALS</span></div>}
          </div>
          <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <FaBars /> : <FaTimes />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {MENU.map(item => (
            <Link key={item.path} to={item.path} className={`nav-item ${isActive(item) ? 'active' : ''}`} title={collapsed ? item.label : ''}>
              <span className="nav-icon">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          {!collapsed && (
            <Link to="/admin/invoices/new" className="btn btn-primary btn-sm new-invoice-btn">
              <FaPlus /> New Invoice
            </Link>
          )}
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <FaSignOutAlt /> {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Admin Header */}
        <header className="admin-header">
          <div className="header-left">
            <h2 className="page-title">{currentLabel}</h2>
          </div>
          <div className="header-right">
            <a href="/" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">View Website</a>
            <Link to="/admin/profile" className="user-badge" title="Profile & Security" style={{ textDecoration: 'none', cursor: 'pointer' }}>
              <div className="user-avatar"><FaUser /></div>
              <div>
                <p className="user-name">{user?.name}</p>
                <p className="user-role">{user?.role}</p>
              </div>
            </Link>
          </div>
        </header>

        <div className="admin-content">{children}</div>
      </div>

      <style>{`
        .admin-wrapper { display: flex; min-height: 100vh; }
        .sidebar { width: 260px; background: var(--secondary); display: flex; flex-direction: column; transition: width 0.3s ease; flex-shrink: 0; }
        .sidebar.collapsed { width: 70px; }
        .sidebar-header { padding: 20px 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #333; }
        .nav-logo { display: flex; align-items: center; gap: 10px; overflow: hidden; }
        .logo-icon { width: 36px; height: 36px; background: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 17px; flex-shrink: 0; }
        .logo-name { display: block; font-family: 'Poppins', sans-serif; font-size: 15px; font-weight: 800; color: white; line-height: 1; white-space: nowrap; }
        .logo-sub { display: block; font-size: 9px; font-weight: 600; color: var(--primary-light); letter-spacing: 2px; white-space: nowrap; }
        .collapse-btn { background: none; border: none; color: #aaa; cursor: pointer; font-size: 16px; }
        .sidebar-nav { flex: 1; padding: 16px 0; }
        .nav-item { display: flex; align-items: center; gap: 14px; padding: 12px 20px; color: #aaa; font-size: 14px; font-weight: 500; transition: all 0.2s; white-space: nowrap; }
        .nav-item:hover { background: rgba(255,255,255,0.08); color: white; }
        .nav-item.active { background: var(--primary); color: white; }
        .nav-icon { font-size: 17px; flex-shrink: 0; }
        .sidebar-footer { padding: 16px; border-top: 1px solid #333; display: flex; flex-direction: column; gap: 10px; }
        .new-invoice-btn { width: 100%; justify-content: center; }
        .logout-btn { display: flex; align-items: center; gap: 10px; padding: 10px 16px; background: none; border: 1px solid #444; border-radius: 8px; color: #aaa; cursor: pointer; font-size: 14px; transition: all 0.2s; width: 100%; }
        .logout-btn:hover { border-color: var(--danger); color: var(--danger); }
        .admin-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
        .admin-header { height: 70px; background: white; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 28px; box-shadow: var(--shadow-sm); }
        .page-title { font-size: 20px; color: var(--secondary); }
        .header-right { display: flex; align-items: center; gap: 16px; }
        .user-badge { display: flex; align-items: center; gap: 10px; }
        .user-badge:hover .user-avatar { background: var(--secondary); }
        .user-avatar { width: 36px; height: 36px; background: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; transition: background 0.2s; }
        .user-name { font-size: 14px; font-weight: 600; color: var(--text); }
        .user-role { font-size: 12px; color: var(--text-muted); text-transform: capitalize; }
        .admin-content { flex: 1; padding: 28px; overflow-y: auto; }
      `}</style>
    </div>
  );
}
