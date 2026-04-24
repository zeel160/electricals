// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaImage, FaUpload } from 'react-icons/fa';

// const CATS = ['MCB & Circuit Breakers','Cables & Wires','Switches & Sockets','LED Lighting','Control Panels','Fans','Conduits & Accessories','Meters & Instruments','Other'];
// const UNITS = ['Pcs', 'Mtr', 'Roll', 'Set', 'Box', 'Kg'];
// const EMPTY = { name:'', category:'MCB & Circuit Breakers', brand:'', model:'', description:'', hsnCode:'', price:'', gstRate:18, unit:'Pcs', stock:'', minStock:5, isActive:true };

// const API_BASE = process.env.REACT_APP_API_URL || '';

// function getImageUrl(img) {
//   if (!img) return null;
//   if (img.startsWith('http')) return img;
//   return `${API_BASE}${img}`;
// }

// export default function AdminProducts() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [form, setForm] = useState(EMPTY);
//   const [errors, setErrors] = useState({});
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const fileRef = useRef();

//   useEffect(() => { fetchProducts(); }, [search]);

  
//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const params = { limit: 100 };
//       if (search) params.search = search;
//       const res = await axios.get('/api/products', { params });
//       setProducts(res.data.products || []);
//     } catch { toast.error('Failed to load products'); }
//     setLoading(false);
//   };

//   const openAdd = () => {
//     setForm(EMPTY); setEditing(null); setErrors({});
//     setImageFile(null); setImagePreview(null);
//     setShowModal(true);
//   };

//   const openEdit = (p) => {
//     setForm({ ...p, price: p.price || '', stock: p.stock ?? '' });
//     setEditing(p._id); setErrors({});
//     setImageFile(null);
//     setImagePreview(p.image ? getImageUrl(p.image) : null);
//     setShowModal(true);
//   };

//   const validate = () => {
//     const e = {};
//     if (!form.name.trim()) e.name = 'Product name is required';
//     if (!form.price || isNaN(Number(form.price))) e.price = 'Valid price is required';
//     if (Number(form.price) < 0) e.price = 'Price cannot be negative';
//     if (form.stock !== '' && isNaN(Number(form.stock))) e.stock = 'Stock must be a number';
//     if (!form.category) e.category = 'Category is required';
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSave = async () => {
//     if (!validate()) return;
//     setSaving(true);
//     try {
//       const fd = new FormData();
//       Object.entries(form).forEach(([k, v]) => {
//         if (v !== undefined && v !== null) fd.append(k, v);
//       });
//       if (imageFile) fd.append('image', imageFile);

//       const config = { headers: { 'Content-Type': 'multipart/form-data' } };
//       if (editing) {
//         await axios.put(`/api/products/${editing}`, fd, config);
//         toast.success('Product updated successfully!');
//       } else {
//         await axios.post('/api/products', fd, config);
//         toast.success('Product added successfully!');
//       }
//       setShowModal(false); fetchProducts();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Save failed');
//     }
//     setSaving(false);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Remove this product from catalogue?')) return;
//     try {
//       await axios.delete(`/api/products/${id}`);
//       toast.success('Product removed');
//       fetchProducts();
//     } catch { toast.error('Failed to remove product'); }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
//     setImageFile(file);
//     setImagePreview(URL.createObjectURL(file));
//   };

//   const f = (k) => (e) => {
//     setForm(p => ({ ...p, [k]: e.target.value }));
//     if (errors[k]) setErrors(prev => ({ ...prev, [k]: '' }));
//   };

//   const ErrMsg = ({ field }) => errors[field] ? <span style={{ color:'#ef4444', fontSize:12, marginTop:3, display:'block' }}>{errors[field]}</span> : null;

//   return (
//     <div>
//       <div className="page-header">
//         <div><h1>Products</h1><p>Manage your product catalogue</p></div>
//         <button className="btn btn-primary" onClick={openAdd}><FaPlus /> Add Product</button>
//       </div>

//       <div className="card">
//         <div className="toolbar">
//           <div className="search-bar" style={{ flex: 1, maxWidth: 360 }}>
//             <FaSearch className="search-icon" />
//             <input className="form-control" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
//           </div>
//           <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{products.length} products</span>
//         </div>
//         <div className="table-wrapper">
//           <table>
//             <thead><tr><th>#</th><th>Photo</th><th>Name</th><th>Category</th><th>Brand</th><th>Price</th><th>GST</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
//             <tbody>
//               {loading ? (
//                 <tr><td colSpan={10} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Loading...</td></tr>
//               ) : products.length === 0 ? (
//                 <tr><td colSpan={10} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No products found. Add your first product!</td></tr>
//               ) : products.map((p, i) => (
//                 <tr key={p._id}>
//                   <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
//                   <td>
//                     {p.image ? (
//                       <img src={getImageUrl(p.image)} alt={p.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }} onError={e => { e.target.style.display='none'; }} />
//                     ) : (
//                       <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 18 }}>
//                         <FaImage />
//                       </div>
//                     )}
//                   </td>
//                   <td><strong>{p.name}</strong>{p.model && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.model}</div>}</td>
//                   <td><span className="badge badge-info">{p.category}</span></td>
//                   <td>{p.brand || '—'}</td>
//                   <td style={{ fontWeight: 600 }}>₹{Number(p.price).toLocaleString('en-IN')} <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>/{p.unit}</span></td>
//                   <td>{p.gstRate}%</td>
//                   <td>
//                     <span className={`badge ${p.stock === 0 ? 'badge-danger' : p.stock <= p.minStock ? 'badge-warning' : 'badge-success'}`}>
//                       {p.stock} {p.unit}
//                     </span>
//                   </td>
//                   <td><span className={`badge ${p.isActive ? 'badge-success' : 'badge-secondary'}`}>{p.isActive ? 'Active' : 'Hidden'}</span></td>
//                   <td>
//                     <div style={{ display: 'flex', gap: 8 }}>
//                       <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)} title="Edit"><FaEdit /></button>
//                       <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)} title="Delete"><FaTrash /></button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {showModal && (
//         <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
//           <div className="modal" style={{ maxWidth: 720 }}>
//             <div className="modal-header">
//               <h3>{editing ? 'Edit Product' : 'Add New Product'}</h3>
//               <button className="btn btn-sm" onClick={() => setShowModal(false)}><FaTimes /></button>
//             </div>
//             <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

//               {/* Image Upload */}
//               <div className="form-group">
//                 <label>Product Photo</label>
//                 <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
//                   <div
//                     onClick={() => fileRef.current.click()}
//                     style={{
//                       width: 120, height: 120, borderRadius: 10, border: '2px dashed var(--border)',
//                       display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
//                       cursor: 'pointer', background: 'var(--bg)', flexShrink: 0, overflow: 'hidden',
//                       transition: 'border-color 0.2s'
//                     }}
//                     onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
//                     onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
//                   >
//                     {imagePreview ? (
//                       <img src={imagePreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//                     ) : (
//                       <>
//                         <FaUpload style={{ fontSize: 24, color: 'var(--text-muted)', marginBottom: 8 }} />
//                         <span style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>Click to upload</span>
//                       </>
//                     )}
//                   </div>
//                   <div style={{ flex: 1 }}>
//                     <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" style={{ display: 'none' }} onChange={handleImageChange} />
//                     <button type="button" className="btn btn-outline btn-sm" onClick={() => fileRef.current.click()} style={{ marginBottom: 8 }}>
//                       <FaUpload /> {imagePreview ? 'Change Photo' : 'Upload Photo'}
//                     </button>
//                     {imagePreview && (
//                       <button type="button" className="btn btn-sm" style={{ marginLeft: 8, color: '#ef4444' }}
//                         onClick={() => { setImageFile(null); setImagePreview(null); }}>
//                         Remove
//                       </button>
//                     )}
//                     <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>JPG, PNG, WebP · Max 5MB</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="form-row-2">
//                 <div className="form-group">
//                   <label>Product Name *</label>
//                   <input className={`form-control ${errors.name ? 'input-error' : ''}`} value={form.name} onChange={f('name')} placeholder="e.g. L&T MCB TPN 63A" />
//                   <ErrMsg field="name" />
//                 </div>
//                 <div className="form-group">
//                   <label>Brand</label>
//                   <input className="form-control" value={form.brand} onChange={f('brand')} placeholder="e.g. L&T, Havells" />
//                 </div>
//               </div>
//               <div className="form-row-2">
//                 <div className="form-group">
//                   <label>Category *</label>
//                   <select className={`form-control ${errors.category ? 'input-error' : ''}`} value={form.category} onChange={f('category')}>
//                     {CATS.map(c => <option key={c}>{c}</option>)}
//                   </select>
//                   <ErrMsg field="category" />
//                 </div>
//                 <div className="form-group">
//                   <label>Model</label>
//                   <input className="form-control" value={form.model} onChange={f('model')} placeholder="Model number" />
//                 </div>
//               </div>
//               <div className="form-row-3">
//                 <div className="form-group">
//                   <label>Price (₹) *</label>
//                   <input className={`form-control ${errors.price ? 'input-error' : ''}`} type="number" value={form.price} onChange={f('price')} placeholder="0.00" min="0" />
//                   <ErrMsg field="price" />
//                 </div>
//                 <div className="form-group">
//                   <label>GST Rate (%)</label>
//                   <select className="form-control" value={form.gstRate} onChange={f('gstRate')}>
//                     {[0, 5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
//                   </select>
//                 </div>
//                 <div className="form-group">
//                   <label>Unit</label>
//                   <select className="form-control" value={form.unit} onChange={f('unit')}>{UNITS.map(u => <option key={u}>{u}</option>)}</select>
//                 </div>
//               </div>
//               <div className="form-row-3">
//                 <div className="form-group">
//                   <label>HSN Code</label>
//                   <input className="form-control" value={form.hsnCode} onChange={f('hsnCode')} placeholder="e.g. 8536" />
//                 </div>
//                 <div className="form-group">
//                   <label>Stock</label>
//                   <input className={`form-control ${errors.stock ? 'input-error' : ''}`} type="number" value={form.stock} onChange={f('stock')} placeholder="0" min="0" />
//                   <ErrMsg field="stock" />
//                 </div>
//                 <div className="form-group">
//                   <label>Min Stock Alert</label>
//                   <input className="form-control" type="number" value={form.minStock} onChange={f('minStock')} min="0" />
//                 </div>
//               </div>
//               <div className="form-group">
//                 <label>Description</label>
//                 <textarea className="form-control" rows={3} value={form.description} onChange={f('description')} placeholder="Optional product description" />
//               </div>
//               <div className="form-group">
//                 <label>Status</label>
//                 <select className="form-control" value={form.isActive ? 'true' : 'false'} onChange={e => setForm(p => ({ ...p, isActive: e.target.value === 'true' }))}>
//                   <option value="true">Active (visible to customers)</option>
//                   <option value="false">Hidden</option>
//                 </select>
//               </div>
//             </div>
//             <div className="modal-footer">
//               <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
//               <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
//                 {saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <style>{`
//         .toolbar { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
//         .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
//         .form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
//         .input-error { border-color: #ef4444 !important; }
//         .input-error:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.15) !important; }
//       `}</style>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaImage } from 'react-icons/fa';

const CATS = ['MCB & Circuit Breakers','Cables & Wires','Switches & Sockets','LED Lighting','Control Panels','Fans','Conduits & Accessories','Meters & Instruments','Other'];
const UNITS = ['Pcs', 'Mtr', 'Roll', 'Set', 'Box', 'Kg'];
const EMPTY = { name:'', category:'MCB & Circuit Breakers', brand:'', model:'', description:'', hsnCode:'', price:'', gstRate:18, unit:'Pcs', stock:'', minStock:5, isActive:true, image:'' };

const API_BASE = process.env.REACT_APP_API_URL || '';

function getImageUrl(img) {
  if (!img) return null;
  if (img.startsWith('http')) return img;
  return `${API_BASE}${img}`;
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchProducts(); }, [search]);

  // ✅ Cloudinary Upload Function
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'q5qjebu6');
    formData.append('cloud_name', 'dkkdicq6f');

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/dkkdicq6f/image/upload',
      { method: 'POST', body: formData }
    );

    const data = await res.json();
    return data.secure_url;
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (search) params.search = search;
      const res = await axios.get('/api/products', { params });
      setProducts(res.data.products || []);
    } catch {
      toast.error('Failed to load products');
    }
    setLoading(false);
  };

  const openAdd = () => {
    setForm(EMPTY);
    setEditing(null);
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (p) => {
    setForm({ ...p, price: p.price || '', stock: p.stock ?? '', image: p.image || '' });
    setEditing(p._id);
    setErrors({});
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
      const fd = new FormData();

      Object.entries(form).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          fd.append(k, v);
        }
      });

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      if (editing) {
        await axios.put(`/api/products/${editing}`, fd, config);
        toast.success('Product updated successfully!');
      } else {
        await axios.post('/api/products', fd, config);
        toast.success('Product added successfully!');
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    }

    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this product?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
      toast.success('Product removed');
      fetchProducts();
    } catch {
      toast.error('Failed to remove product');
    }
  };

  const f = (k) => (e) => {
    setForm(p => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: '' }));
  };

  const ErrMsg = ({ field }) =>
    errors[field] ? <span style={{ color:'#ef4444', fontSize:12 }}>{errors[field]}</span> : null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>Manage your product catalogue</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <FaPlus /> Add Product
        </button>
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="search-bar">
            <FaSearch />
            <input
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  {p.image ? (
                    <img src={getImageUrl(p.image)} width="50" />
                  ) : <FaImage />}
                </td>
                <td>{p.name}</td>
                <td>
                  <button onClick={() => openEdit(p)}><FaEdit /></button>
                  <button onClick={() => handleDelete(p._id)}><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal">
          <h3>{editing ? 'Edit' : 'Add'} Product</h3>

          {/* ✅ CLOUDINARY IMAGE UPLOAD */}
          <div className="form-group">
            <label>Product Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  toast.loading('Uploading...');
                  const url = await uploadImage(file);
                  setForm(f => ({ ...f, image: url }));
                  toast.dismiss();
                  toast.success('Uploaded!');
                }
              }}
            />

            {form.image && (
              <img src={form.image} style={{ width: '100%', marginTop: 10 }} />
            )}
          </div>

          <input placeholder="Name" value={form.name} onChange={f('name')} />
          <input placeholder="Price" value={form.price} onChange={f('price')} />

          <button onClick={handleSave}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}
    </div>
  );
}