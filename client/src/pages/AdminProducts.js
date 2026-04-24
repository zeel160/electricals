import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaImage, FaUpload } from 'react-icons/fa';

const CATS = ['MCB & Circuit Breakers','Cables & Wires','Switches & Sockets','LED Lighting','Control Panels','Fans','Conduits & Accessories','Meters & Instruments','Other'];
const UNITS = ['Pcs', 'Mtr', 'Roll', 'Set', 'Box', 'Kg'];
const EMPTY = { name:'', category:'MCB & Circuit Breakers', brand:'', model:'', description:'', hsnCode:'', price:'', gstRate:18, unit:'Pcs', stock:'', minStock:5, isActive:true, image:'' };

const CLOUDINARY_CLOUD_NAME = 'dkkdicq6f';
const CLOUDINARY_UPLOAD_PRESET = 'q5qjebu6';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [imageUploading, setImageUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  useEffect(() => { fetchProducts(); }, [search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (search) params.search = search;
      const res = await axios.get('/api/products', { params });
      setProducts(res.data.products || []);
    } catch { toast.error('Failed to load products'); }
    setLoading(false);
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    );
    const data = await res.json();
    if (!data.secure_url) throw new Error('Upload failed');
    return data.secure_url;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }

    setImageUploading(true);
    const toastId = toast.loading('Uploading image...');
    try {
      const url = await uploadImage(file);
      setForm(prev => ({ ...prev, image: url }));
      toast.dismiss(toastId);
      toast.success('Image uploaded!');
    } catch {
      toast.dismiss(toastId);
      toast.error('Image upload failed');
    }
    setImageUploading(false);
    // reset file input so same file can be re-selected if needed
    e.target.value = '';
  };

  const openAdd = () => {
    setForm(EMPTY); setEditing(null); setErrors({});
    setShowModal(true);
  };

  const openEdit = (p) => {
    setForm({ ...p, price: p.price || '', stock: p.stock ?? '', image: p.image || '' });
    setEditing(p._id); setErrors({});
    setShowModal(true);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.price || isNaN(Number(form.price))) e.price = 'Valid price is required';
    if (Number(form.price) < 0) e.price = 'Price cannot be negative';
    if (form.stock !== '' && isNaN(Number(form.stock))) e.stock = 'Stock must be a number';
    if (!form.category) e.category = 'Category is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      // Send as JSON since the image is now a Cloudinary URL (no file upload needed)
      const payload = { ...form };

      if (editing) {
        await axios.put(`/api/products/${editing}`, payload);
        toast.success('Product updated successfully!');
      } else {
        await axios.post('/api/products', payload);
        toast.success('Product added successfully!');
      }
      setShowModal(false); fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this product from catalogue?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
      toast.success('Product removed');
      fetchProducts();
    } catch { toast.error('Failed to remove product'); }
  };

  const f = (k) => (e) => {
    setForm(p => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: '' }));
  };

  const ErrMsg = ({ field }) => errors[field] ? <span style={{ color:'#ef4444', fontSize:12, marginTop:3, display:'block' }}>{errors[field]}</span> : null;

  return (
    <div>
      <div className="page-header">
        <div><h1>Products</h1><p>Manage your product catalogue</p></div>
        <button className="btn btn-primary" onClick={openAdd}><FaPlus /> Add Product</button>
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="search-bar" style={{ flex: 1, maxWidth: 360 }}>
            <FaSearch className="search-icon" />
            <input className="form-control" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{products.length} products</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>#</th><th>Photo</th><th>Name</th><th>Category</th><th>Brand</th><th>Price</th><th>GST</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={10} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No products found. Add your first product!</td></tr>
              ) : products.map((p, i) => (
                <tr key={p._id}>
                  <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                  <td>
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} onError={e => { e.target.style.display='none'; }} />
                    ) : (
                      <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 18 }}>
                        <FaImage />
                      </div>
                    )}
                  </td>
                  <td><strong>{p.name}</strong>{p.model && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.model}</div>}</td>
                  <td><span className="badge badge-info">{p.category}</span></td>
                  <td>{p.brand || '—'}</td>
                  <td style={{ fontWeight: 600 }}>₹{Number(p.price).toLocaleString('en-IN')} <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>/{p.unit}</span></td>
                  <td>{p.gstRate}%</td>
                  <td>
                    <span className={`badge ${p.stock === 0 ? 'badge-danger' : p.stock <= p.minStock ? 'badge-warning' : 'badge-success'}`}>
                      {p.stock} {p.unit}
                    </span>
                  </td>
                  <td><span className={`badge ${p.isActive ? 'badge-success' : 'badge-secondary'}`}>{p.isActive ? 'Active' : 'Hidden'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)} title="Edit"><FaEdit /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)} title="Delete"><FaTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal" style={{ maxWidth: 720 }}>
            <div className="modal-header">
              <h3>{editing ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="btn btn-sm" onClick={() => setShowModal(false)}><FaTimes /></button>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

              {/* Image Upload — Cloudinary */}
              <div className="form-group">
                <label>Product Image</label>
                <div
                  onClick={() => !imageUploading && fileRef.current.click()}
                  style={{
                    width: '100%', borderRadius: 10, border: '2px dashed var(--border)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    cursor: imageUploading ? 'not-allowed' : 'pointer', background: 'var(--bg)',
                    overflow: 'hidden', transition: 'border-color 0.2s', minHeight: 160, position: 'relative'
                  }}
                  onMouseEnter={e => { if (!imageUploading) e.currentTarget.style.borderColor = 'var(--primary)'; }}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  {imageUploading ? (
                    <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                      <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
                      <span style={{ fontSize: 13 }}>Uploading to Cloudinary...</span>
                    </div>
                  ) : form.image ? (
                    <img
                      src={form.image}
                      alt="preview"
                      style={{ width: '100%', height: 150, objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>
                      <FaUpload style={{ fontSize: 28, marginBottom: 8 }} />
                      <div style={{ fontSize: 13 }}>Click to upload image</div>
                      <div style={{ fontSize: 11, marginTop: 4 }}>JPG, PNG, WebP · Max 5MB</div>
                    </div>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => fileRef.current.click()}
                    disabled={imageUploading}
                  >
                    <FaUpload /> {form.image ? 'Change Image' : 'Upload Image'}
                  </button>
                  {form.image && !imageUploading && (
                    <button
                      type="button"
                      className="btn btn-sm"
                      style={{ color: '#ef4444' }}
                      onClick={() => setForm(p => ({ ...p, image: '' }))}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input className={`form-control ${errors.name ? 'input-error' : ''}`} value={form.name} onChange={f('name')} placeholder="e.g. L&T MCB TPN 63A" />
                  <ErrMsg field="name" />
                </div>
                <div className="form-group">
                  <label>Brand</label>
                  <input className="form-control" value={form.brand} onChange={f('brand')} placeholder="e.g. L&T, Havells" />
                </div>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Category *</label>
                  <select className={`form-control ${errors.category ? 'input-error' : ''}`} value={form.category} onChange={f('category')}>
                    {CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <ErrMsg field="category" />
                </div>
                <div className="form-group">
                  <label>Model</label>
                  <input className="form-control" value={form.model} onChange={f('model')} placeholder="Model number" />
                </div>
              </div>
              <div className="form-row-3">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input className={`form-control ${errors.price ? 'input-error' : ''}`} type="number" value={form.price} onChange={f('price')} placeholder="0.00" min="0" />
                  <ErrMsg field="price" />
                </div>
                <div className="form-group">
                  <label>GST Rate (%)</label>
                  <select className="form-control" value={form.gstRate} onChange={f('gstRate')}>
                    {[0, 5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <select className="form-control" value={form.unit} onChange={f('unit')}>{UNITS.map(u => <option key={u}>{u}</option>)}</select>
                </div>
              </div>
              <div className="form-row-3">
                <div className="form-group">
                  <label>HSN Code</label>
                  <input className="form-control" value={form.hsnCode} onChange={f('hsnCode')} placeholder="e.g. 8536" />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input className={`form-control ${errors.stock ? 'input-error' : ''}`} type="number" value={form.stock} onChange={f('stock')} placeholder="0" min="0" />
                  <ErrMsg field="stock" />
                </div>
                <div className="form-group">
                  <label>Min Stock Alert</label>
                  <input className="form-control" type="number" value={form.minStock} onChange={f('minStock')} min="0" />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" rows={3} value={form.description} onChange={f('description')} placeholder="Optional product description" />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select className="form-control" value={form.isActive ? 'true' : 'false'} onChange={e => setForm(p => ({ ...p, isActive: e.target.value === 'true' }))}>
                  <option value="true">Active (visible to customers)</option>
                  <option value="false">Hidden</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving || imageUploading}>
                {saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .toolbar { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
        .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
        .input-error { border-color: #ef4444 !important; }
        .input-error:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.15) !important; }
      `}</style>
    </div>
  );
}