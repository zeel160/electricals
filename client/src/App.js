import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';

// Admin Pages
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AdminProducts from './pages/AdminProducts';
import AdminInvoices from './pages/AdminInvoices';
import CreateInvoice from './pages/CreateInvoice';
import InvoiceDetail from './pages/InvoiceDetail';
import AdminInquiries from './pages/AdminInquiries';
import AdminCustomers from './pages/AdminCustomers';
import AdminProfile from './pages/AdminProfile';

import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  return user ? children : <Navigate to="/admin/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          <Route path="/contact" element={<Layout><ContactPage /></Layout>} />

          {/* Admin */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<PrivateRoute><AdminLayout><Dashboard /></AdminLayout></PrivateRoute>} />
          <Route path="/admin/products" element={<PrivateRoute><AdminLayout><AdminProducts /></AdminLayout></PrivateRoute>} />
          <Route path="/admin/invoices" element={<PrivateRoute><AdminLayout><AdminInvoices /></AdminLayout></PrivateRoute>} />
          <Route path="/admin/invoices/new" element={<PrivateRoute><AdminLayout><CreateInvoice /></AdminLayout></PrivateRoute>} />
          <Route path="/admin/invoices/:id" element={<PrivateRoute><AdminLayout><InvoiceDetail /></AdminLayout></PrivateRoute>} />
          <Route path="/admin/inquiries" element={<PrivateRoute><AdminLayout><AdminInquiries /></AdminLayout></PrivateRoute>} />
          <Route path="/admin/customers" element={<PrivateRoute><AdminLayout><AdminCustomers /></AdminLayout></PrivateRoute>} />
          <Route path="/admin/profile" element={<PrivateRoute><AdminLayout><AdminProfile /></AdminLayout></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
