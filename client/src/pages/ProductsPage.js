import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaWhatsapp, FaFilter, FaTimes } from 'react-icons/fa';

const CATEGORIES = ['All', 'MCB & Circuit Breakers', 'Cables & Wires', 'Switches & Sockets', 'LED Lighting', 'Control Panels', 'Fans', 'Conduits & Accessories', 'Meters & Instruments', 'Other'];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const delaySearch = setTimeout(() => fetchProducts(), 400);
    return () => clearTimeout(delaySearch);
  }, [search, category, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      const res = await axios.get('/api/products', { params });
      setProducts(res.data.products);
      setTotalPages(res.data.pages);
    } catch (err) {
      // Show demo products if backend not running
      setProducts(DEMO_PRODUCTS);
    }
    setLoading(false);
  };

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
  const handleCategory = (cat) => { setCategory(cat); setPage(1); };

  return (
    <div className="products-page">
      <div className="products-hero">
        <div className="container">
          <h1>Our Products</h1>
          <p>Quality electrical products from India's leading brands</p>
        </div>
      </div>

      <div className="container">
        <div className="products-toolbar">
          <div className="search-bar" style={{ flex: 1, maxWidth: 400 }}>
            <FaSearch className="search-icon" />
            <input className="form-control" placeholder="Search products, brands..." value={search} onChange={handleSearch} />
          </div>
          <div className="results-count">{products.length} products found</div>
        </div>

        <div className="category-tabs">
          {CATEGORIES.map(cat => (
            <button key={cat} className={`cat-tab ${category === cat ? 'active' : ''}`} onClick={() => handleCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-grid">
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>No products found. Try a different search.</p>
            <a href="https://wa.me/919664624690" target="_blank" rel="noreferrer" className="btn btn-primary mt-16">
              <FaWhatsapp /> Ask on WhatsApp
            </a>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(p => (
              <div className="product-card" key={p._id || p.name}>
                <div className="product-img">
                  {p.image ? <img src={p.image} alt={p.name} /> : <div className="product-img-placeholder">⚡</div>}
                  <div className="product-category-tag">{p.category}</div>
                </div>
                <div className="product-info">
                  <div className="product-brand">{p.brand || 'Generic'}</div>
                  <h3>{p.name}</h3>
                  {p.model && <p className="product-model">Model: {p.model}</p>}
                  <div className="product-footer">
                    <div className="product-price">
                      <span className="price">₹{p.price?.toLocaleString('en-IN')}</span>
                      <span className="price-unit">/ {p.unit || 'Pcs'}</span>
                    </div>
                    <a href={`https://wa.me/919664624690?text=Hi, I want to enquire about: ${p.name}`} target="_blank" rel="noreferrer" className="btn btn-success btn-sm">
                      <FaWhatsapp /> Enquire
                    </a>
                  </div>
                  {p.stock <= p.minStock && p.stock > 0 && <div className="low-stock">⚠️ Low Stock</div>}
                  {p.stock === 0 && <div className="out-of-stock">Out of Stock</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} className={page === i + 1 ? 'active' : ''} onClick={() => setPage(i + 1)}>{i + 1}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>
          </div>
        )}
      </div>

      <style>{`
        .products-hero { background: var(--secondary); color: white; padding: 60px 0; text-align: center; }
        .products-hero h1 { font-size: 36px; margin-bottom: 10px; }
        .products-hero p { color: #aaa; font-size: 16px; }
        .products-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin: 32px 0 20px; flex-wrap: wrap; }
        .results-count { font-size: 14px; color: var(--text-muted); }
        .category-tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
        .cat-tab { padding: 7px 16px; border-radius: 30px; border: 1.5px solid var(--border); background: white; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s; }
        .cat-tab:hover { border-color: var(--primary); color: var(--primary); }
        .cat-tab.active { background: var(--primary); color: white; border-color: var(--primary); }
        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .product-card { background: white; border-radius: var(--radius); border: 1.5px solid var(--border); overflow: hidden; transition: all 0.25s; }
        .product-card:hover { box-shadow: var(--shadow-md); transform: translateY(-3px); border-color: var(--primary); }
        .product-img { height: 160px; background: var(--bg); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
        .product-img img { width: 100%; height: 100%; object-fit: cover; }
        .product-img-placeholder { font-size: 48px; opacity: 0.3; }
        .product-category-tag { position: absolute; top: 10px; left: 10px; background: rgba(26,26,46,0.85); color: white; font-size: 11px; padding: 3px 8px; border-radius: 4px; }
        .product-info { padding: 16px; }
        .product-brand { font-size: 12px; color: var(--primary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .product-info h3 { font-size: 14px; color: var(--secondary); margin-bottom: 4px; line-height: 1.4; }
        .product-model { font-size: 12px; color: var(--text-muted); margin-bottom: 12px; }
        .product-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 12px; }
        .price { font-size: 18px; font-weight: 700; color: var(--secondary); }
        .price-unit { font-size: 12px; color: var(--text-muted); }
        .low-stock { margin-top: 8px; font-size: 12px; color: var(--warning); font-weight: 500; }
        .out-of-stock { margin-top: 8px; font-size: 12px; color: var(--danger); font-weight: 500; }
        .loading-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
        .skeleton-card { height: 280px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; border-radius: var(--radius); animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}</style>
    </div>
  );
}

const DEMO_PRODUCTS = [
  { name: 'L&T MCB TPN 63A', category: 'MCB & Circuit Breakers', brand: 'L&T', price: 1650, unit: 'Pcs', stock: 10, minStock: 5 },
  { name: 'MCB TPN 40 AMP', category: 'MCB & Circuit Breakers', brand: 'Generic', price: 1450, unit: 'Pcs', stock: 8, minStock: 5 },
  { name: '4.0 SQMM 4 Core Cable', category: 'Cables & Wires', brand: 'Polycab', price: 230, unit: 'Mtr', stock: 500, minStock: 50 },
  { name: 'Legrand 16A Switch', category: 'Switches & Sockets', brand: 'Legrand', price: 145, unit: 'Pcs', stock: 30, minStock: 10 },
  { name: 'Philips LED Bulb 9W', category: 'LED Lighting', brand: 'Philips', price: 85, unit: 'Pcs', stock: 50, minStock: 15 },
  { name: 'Havells RCCB 32A', category: 'MCB & Circuit Breakers', brand: 'Havells', price: 890, unit: 'Pcs', stock: 12, minStock: 5 },
  { name: 'Finolex 2.5 SQMM Wire', category: 'Cables & Wires', brand: 'Finolex', price: 52, unit: 'Mtr', stock: 800, minStock: 100 },
  { name: 'Orient Fan 48 inch', category: 'Fans', brand: 'Orient', price: 1850, unit: 'Pcs', stock: 6, minStock: 5 },
];
