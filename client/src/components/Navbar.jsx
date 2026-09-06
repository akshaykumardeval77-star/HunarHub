import React from 'react';

export default function Navbar({ activeRole, setActiveRole, cartCount, toggleCart }) {
  return (
    <nav class="navbar navbar-hunar navbar-expand-lg">
      <div class="container">
        <a class="brand-logo" href="#" onClick={(e) => { e.preventDefault(); setActiveRole('customer'); }}>
          <div class="logo-icon"><i class="bi bi-shop-window"></i></div>
          <div>Hunar<span class="highlight">Hub</span></div>
        </a>

        {/* Role Switcher Pills */}
        <div class="role-switcher-badge ms-lg-4 me-auto my-2 my-lg-0">
          <button 
            class={`role-btn ${activeRole === 'customer' ? 'active' : ''}`}
            onClick={() => setActiveRole('customer')}
          >
            <i class="bi bi-person-heart me-1"></i> Customer Marketplace
          </button>
          <button 
            class={`role-btn ${activeRole === 'entrepreneur' ? 'active' : ''}`}
            onClick={() => setActiveRole('entrepreneur')}
          >
            <i class="bi bi-briefcase-fill me-1"></i> Entrepreneur Portal
          </button>
          <button 
            class={`role-btn ${activeRole === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveRole('admin')}
          >
            <i class="bi bi-shield-lock-fill me-1"></i> Admin Governance
          </button>
        </div>

        <div class="d-flex align-items-center gap-3">
          <button class="cart-trigger-btn" onClick={toggleCart}>
            <i class="bi bi-bag-fill fs-5"></i>
            <span>Cart</span>
            <span class="cart-badge">{cartCount}</span>
          </button>

          <span class="badge bg-success-subtle text-success border px-3 py-2 rounded-pill fw-bold">
            <i class="bi bi-patch-check-fill me-1"></i> MERN Connected
          </span>
        </div>
      </div>
    </nav>
  );
}
