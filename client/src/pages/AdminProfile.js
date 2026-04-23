import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaLock, FaUser, FaEye, FaEyeSlash, FaSave } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function AdminProfile() {
  const { user, setUser } = useAuth();

  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileLoading, setProfileLoading] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwLoading, setPwLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validateProfile = () => {
    const e = {};
    if (!profileForm.name.trim()) e.name = 'Name is required';
    setProfileErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleProfileSave = async () => {
    if (!validateProfile()) return;
    setProfileLoading(true);
    try {
      const res = await axios.put('/api/auth/profile', profileForm);
      if (res.data.success) {
        toast.success('Profile updated successfully!');
        if (setUser) setUser(res.data.user);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
    setProfileLoading(false);
  };

  const validatePassword = () => {
    const e = {};
    if (!pwForm.currentPassword) e.currentPassword = 'Current password is required';
    if (!pwForm.newPassword) e.newPassword = 'New password is required';
    else if (pwForm.newPassword.length < 6) e.newPassword = 'Password must be at least 6 characters';
    if (!pwForm.confirmPassword) e.confirmPassword = 'Please confirm your new password';
    else if (pwForm.newPassword !== pwForm.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (pwForm.currentPassword && pwForm.newPassword && pwForm.currentPassword === pwForm.newPassword) {
      e.newPassword = 'New password must be different from current password';
    }
    setPwErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePasswordChange = async () => {
    if (!validatePassword()) return;
    setPwLoading(true);
    try {
      const res = await axios.put('/api/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      if (res.data.success) {
        toast.success('Password changed successfully!');
        setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPwErrors({});
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
    setPwLoading(false);
  };

  const pf = (k) => (e) => {
    setProfileForm(p => ({ ...p, [k]: e.target.value }));
    if (profileErrors[k]) setProfileErrors(prev => ({ ...prev, [k]: '' }));
  };
  const pw = (k) => (e) => {
    setPwForm(p => ({ ...p, [k]: e.target.value }));
    if (pwErrors[k]) setPwErrors(prev => ({ ...prev, [k]: '' }));
  };

  const ErrMsg = ({ err }) => err ? <span style={{ color: '#ef4444', fontSize: 12, marginTop: 3, display: 'block' }}>{err}</span> : null;

  const PasswordInput = ({ label, field, value, onChange, show, onToggle, err }) => (
    <div className="form-group">
      <label>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          className={`form-control ${err ? 'input-error' : ''}`}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder="••••••••"
          style={{ paddingRight: 44 }}
        />
        <button type="button" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={onToggle}>
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      <ErrMsg err={err} />
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div><h1>Profile & Security</h1><p>Manage your account settings</p></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 960 }}>

        {/* Profile Info */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 20 }}>
              <FaUser />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18 }}>Profile Information</h3>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>Update your name and contact</p>
            </div>
          </div>

          <div className="form-group">
            <label>Full Name *</label>
            <input className={`form-control ${profileErrors.name ? 'input-error' : ''}`} value={profileForm.name} onChange={pf('name')} placeholder="Your full name" />
            <ErrMsg err={profileErrors.name} />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input className="form-control" value={user?.email || ''} disabled style={{ background: 'var(--bg)', color: 'var(--text-muted)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3, display: 'block' }}>Email cannot be changed</span>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input className="form-control" value={profileForm.phone} onChange={pf('phone')} placeholder="e.g. 9664624690" />
          </div>

          <div className="form-group">
            <label>Role</label>
            <input className="form-control" value={user?.role === 'admin' ? 'Administrator' : 'Staff'} disabled style={{ background: 'var(--bg)', color: 'var(--text-muted)' }} />
          </div>

          <button className="btn btn-primary" onClick={handleProfileSave} disabled={profileLoading} style={{ width: '100%' }}>
            <FaSave /> {profileLoading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>

        {/* Change Password */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 20 }}>
              <FaLock />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 18 }}>Change Password</h3>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>Keep your account secure</p>
            </div>
          </div>

          <PasswordInput label="Current Password *" value={pwForm.currentPassword} onChange={pw('currentPassword')} show={showCurrent} onToggle={() => setShowCurrent(v => !v)} err={pwErrors.currentPassword} />
          <PasswordInput label="New Password *" value={pwForm.newPassword} onChange={pw('newPassword')} show={showNew} onToggle={() => setShowNew(v => !v)} err={pwErrors.newPassword} />
          <PasswordInput label="Confirm New Password *" value={pwForm.confirmPassword} onChange={pw('confirmPassword')} show={showConfirm} onToggle={() => setShowConfirm(v => !v)} err={pwErrors.confirmPassword} />

          <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 4 }}>Password requirements:</strong>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
              <li>Minimum 6 characters</li>
              <li>Different from current password</li>
            </ul>
          </div>

          <button className="btn btn-primary" onClick={handlePasswordChange} disabled={pwLoading} style={{ width: '100%' }}>
            <FaLock /> {pwLoading ? 'Changing...' : 'Change Password'}
          </button>
        </div>

      </div>

      <style>{`
        .input-error { border-color: #ef4444 !important; }
        .input-error:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.15) !important; }
      `}</style>
    </div>
  );
}
