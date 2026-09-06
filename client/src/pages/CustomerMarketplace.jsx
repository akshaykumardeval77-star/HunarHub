import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function CustomerMarketplace({ onOpenProfile, onAddToCart }) {
  const [categories, setCategories] = useState([]);
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('all');

  useEffect(() => {
    loadCategories();
    loadEntrepreneurs();
  }, [selectedCategory, location]);

  const loadCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadEntrepreneurs = async () => {
    try {
      const data = await api.getEntrepreneurs({ category: selectedCategory, search, location });
      setEntrepreneurs(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadEntrepreneurs();
  };

  // Extract products
  const allProducts = [];
  entrepreneurs.forEach(ent => {
    if (ent.products) {
      ent.products.forEach(p => {
        allProducts.push({ ...p, sellerName: ent.name, sellerId: ent.id, location: ent.location });
      });
    }
  });

  return (
    <div>
      {/* Hero Banner */}
      <header class="hero-section">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-8">
              <span class="badge bg-warning text-dark mb-3 px-3 py-2 rounded-pill fw-bold">
                <i class="bi bi-award-fill me-1"></i> Vocal for Local • MERN Stack Platform
              </span>
              <h1 class="hero-title">Empowering Local Micro-Entrepreneurs & Traditional Crafts</h1>
              <p class="hero-subtitle">
                Connect directly with verified potters, cobblers, tailors, weavers, and local artisans. Book service requests or buy authentic handmade products without middlemen.
              </p>

              {/* Search Bar */}
              <form class="hero-search-box" onSubmit={handleSearchSubmit}>
                <i class="bi bi-search text-muted fs-5 ms-3"></i>
                <input
                  type="text"
                  class="hero-search-input"
                  placeholder="Search by skill, product (e.g. Clay Matka, Kolhapuri, Stitching)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select
                  class="hero-search-select"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="all">📍 All Locations</option>
                  <option value="Varanasi">Varanasi, UP</option>
                  <option value="Jaipur">Jaipur, RJ</option>
                  <option value="Kolhapur">Kolhapur, MH</option>
                  <option value="Saharanpur">Saharanpur, UP</option>
                </select>
                <button type="submit" class="btn btn-hunar-primary">
                  Discover Talent
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main class="container my-5">
        
        {/* Category Pills Scroll */}
        <div class="category-filter-wrapper">
          <div class="category-filter-scroll">
            {categories.map(cat => (
              <button
                key={cat.id}
                class={`cat-pill ${cat.id === selectedCategory ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <i class={`bi ${cat.icon}`}></i> {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Section 1: Entrepreneurs Directory */}
        <section class="mb-5">
          <div class="d-flex justify-content-between align-items-end mb-4">
            <div>
              <h2 class="section-title">Verified Micro-Entrepreneurs</h2>
              <p class="section-subtitle mb-0">Book custom service requests or view skilled profiles near you</p>
            </div>
          </div>

          <div class="row">
            {entrepreneurs.length === 0 ? (
              <div class="col-12 text-center py-5">
                <i class="bi bi-search fs-1 text-muted mb-3 d-block"></i>
                <h5>No micro-entrepreneurs found</h5>
                <p class="text-muted">Try selecting a different category or location filter.</p>
              </div>
            ) : (
              entrepreneurs.map(ent => (
                <div key={ent.id} class="col-lg-4 col-md-6 mb-4">
                  <div class="entrepreneur-card">
                    <div class="card-img-wrapper">
                      <img src={ent.image} alt={ent.name} onError={(e) => e.target.src = '/assets/artisan_potter.jpg'} />
                      {ent.verified && (
                        <span class="badge-verified"><i class="bi bi-patch-check-fill me-1"></i> Verified</span>
                      )}
                    </div>
                    <div class="card-body-content">
                      <div class="d-flex justify-content-between align-items-start">
                        <div>
                          <h4 class="entrepreneur-name">{ent.name}</h4>
                          <div class="entrepreneur-cat"><i class="bi bi-tools me-1"></i> {ent.categoryName}</div>
                        </div>
                        <span class={`badge ${ent.isAvailable ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'} rounded-pill px-3 py-1 fw-bold`}>
                          {ent.isAvailable ? 'Available' : 'Busy'}
                        </span>
                      </div>
                      <div class="rating-bar">
                        <i class="bi bi-star-fill"></i>
                        <span class="fw-bold">{ent.rating}</span>
                        <span class="text-muted">({ent.reviewCount} reviews) • {ent.experience} Exp</span>
                      </div>
                      <div class="location-tag">
                        <i class="bi bi-geo-alt-fill text-danger me-1"></i> {ent.location}
                      </div>
                      <p class="entrepreneur-bio">{ent.bio}</p>
                      <div class="card-footer-actions">
                        <button class="btn btn-hunar-secondary flex-grow-1" onClick={() => onOpenProfile(ent.id)}>
                          <i class="bi bi-person-badge me-1"></i> View Profile & Services
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Section 2: Craft Products Grid */}
        <section class="mb-5 py-4 px-4 bg-white rounded-4 shadow-sm border">
          <div class="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span class="badge bg-danger-subtle text-danger px-3 py-1 rounded-pill fw-bold mb-2">100% Authentic Handcrafts</span>
              <h2 class="section-title">Direct-from-Artisan Crafts Marketplace</h2>
              <p class="section-subtitle mb-0">Buy genuine terracotta pottery, leather footwear, Chikankari kurtis, and woodcarvings</p>
            </div>
          </div>

          <div class="row">
            {allProducts.map(p => (
              <div key={p.id} class="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div class="product-card">
                  <img src={p.image} class="product-img" alt={p.title} onError={(e) => e.target.src = '/assets/product_pottery.jpg'} />
                  <div class="product-info">
                    <h5 class="product-title">{p.title}</h5>
                    <div class="product-seller small text-muted mb-2">By <strong>{p.sellerName}</strong> • {p.location}</div>
                    <p class="small text-muted mb-3 flex-grow-1">{p.description}</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                      <div class="product-price">₹{p.price}</div>
                      <button class="btn btn-hunar-primary btn-sm" onClick={() => onAddToCart(p)}>
                        <i class="bi bi-bag-plus me-1"></i> Buy Craft
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
