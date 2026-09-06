/**
 * HunarHub - Application Logic & LocalStorage State Manager
 */

const STORAGE_KEY = 'hunarhub_db_v1';

// Initial state loader
function getDbState() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_HUNARHUB_DATA));
    return INITIAL_HUNARHUB_DATA;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse database state, resetting...", e);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_HUNARHUB_DATA));
    return INITIAL_HUNARHUB_DATA;
  }
}

function saveDbState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Shopping Cart State
let cart = JSON.parse(localStorage.getItem('hunarhub_cart') || '[]');

function saveCart() {
  localStorage.setItem('hunarhub_cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const countEl = document.getElementById('cart-count');
  if (countEl) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countEl.textContent = totalItems;
  }
}

// Toast Notification Helper
function showToast(message, icon = 'bi-check-circle-fill') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'hunar-toast';
  toast.innerHTML = `<i class="bi ${icon} text-warning fs-5"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// --- CUSTOMER MARKETPLACE FUNCTIONS ---
let currentCategory = 'all';

function initMarketplace() {
  updateCartBadge();
  renderCategories();
  renderEntrepreneurs();
  renderProducts();
  setupSearchAndFilters();
  setupCartEvents();
}

function renderCategories() {
  const container = document.getElementById('category-pills-container');
  if (!container) return;

  const db = getDbState();
  container.innerHTML = db.categories.map(cat => `
    <button class="cat-pill ${cat.id === currentCategory ? 'active' : ''}" onclick="filterByCategory('${cat.id}')">
      <i class="bi ${cat.icon}"></i> ${cat.name}
    </button>
  `).join('');
}

function filterByCategory(catId) {
  currentCategory = catId;
  renderCategories();
  renderEntrepreneurs();
  renderProducts();
}

function renderEntrepreneurs() {
  const container = document.getElementById('entrepreneurs-grid');
  if (!container) return;

  const db = getDbState();
  const searchInput = (document.getElementById('search-input')?.value || '').toLowerCase();
  const locationSelect = document.getElementById('location-filter')?.value || 'all';

  let filtered = db.entrepreneurs.filter(ent => {
    const matchesCat = currentCategory === 'all' || ent.category === currentCategory;
    const matchesSearch = ent.name.toLowerCase().includes(searchInput) ||
                          ent.categoryName.toLowerCase().includes(searchInput) ||
                          ent.bio.toLowerCase().includes(searchInput) ||
                          ent.location.toLowerCase().includes(searchInput);
    const matchesLoc = locationSelect === 'all' || ent.location.includes(locationSelect);
    return matchesCat && matchesSearch && matchesLoc;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-search fs-1 text-muted mb-3 d-block"></i>
        <h5>No micro-entrepreneurs found</h5>
        <p class="text-muted">Try selecting a different category or search term.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(ent => `
    <div class="col-lg-4 col-md-6 mb-4">
      <div class="entrepreneur-card">
        <div class="card-img-wrapper">
          <img src="${ent.image}" alt="${ent.name}" onerror="this.src='https://images.unsplash.com/photo-1544717305-2782549b5136?w=600'">
          ${ent.verified ? `<span class="badge-verified"><i class="bi bi-patch-check-fill"></i> ${ent.badge || 'Verified'}</span>` : ''}
        </div>
        <div class="card-body-content">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <h4 class="entrepreneur-name">${ent.name}</h4>
              <div class="entrepreneur-cat"><i class="bi bi-tools"></i> ${ent.categoryName}</div>
            </div>
            <div class="badge ${ent.isAvailable ? 'bg-success-subtle text-success border border-success-subtle' : 'bg-secondary-subtle text-secondary'} rounded-pill px-3 py-1 fw-bold">
              ${ent.isAvailable ? 'Available' : 'Busy'}
            </div>
          </div>
          <div class="rating-bar">
            <i class="bi bi-star-fill"></i>
            <span class="fw-bold">${ent.rating}</span>
            <span class="text-muted">(${ent.reviewCount} reviews) • ${ent.experience} Exp</span>
          </div>
          <div class="location-tag">
            <i class="bi bi-geo-alt-fill text-danger"></i> ${ent.location}
          </div>
          <p class="entrepreneur-bio">${ent.bio}</p>
          <div class="card-footer-actions">
            <button class="btn btn-hunar-secondary flex-grow-1" onclick="openProfileModal('${ent.id}')">
              <i class="bi bi-person-badge"></i> View Profile & Services
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  const db = getDbState();
  let allProducts = [];

  db.entrepreneurs.forEach(ent => {
    if (ent.products && ent.products.length > 0) {
      ent.products.forEach(p => {
        allProducts.push({ ...p, sellerName: ent.name, sellerId: ent.id, location: ent.location });
      });
    }
  });

  if (currentCategory !== 'all') {
    allProducts = allProducts.filter(p => {
      const ent = db.entrepreneurs.find(e => e.id === p.sellerId);
      return ent && ent.category === currentCategory;
    });
  }

  container.innerHTML = allProducts.map(p => `
    <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div class="product-card">
        <img src="${p.image}" class="product-img" alt="${p.title}" onerror="this.src='https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=500'">
        <div class="product-info">
          <h5 class="product-title">${p.title}</h5>
          <div class="product-seller">By <strong>${p.sellerName}</strong> • ${p.location}</div>
          <p class="small text-muted mb-3 flex-grow-1">${p.description}</p>
          <div class="d-flex justify-content-between align-items-center mt-auto">
            <div class="product-price">₹${p.price}</div>
            <button class="btn btn-hunar-primary btn-sm" onclick="addToCart('${p.id}', '${p.title.replace(/'/g, "\\'")}', ${p.price}, '${p.image}')">
              <i class="bi bi-bag-plus"></i> Buy Handmade
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function setupSearchAndFilters() {
  const searchInput = document.getElementById('search-input');
  const locationSelect = document.getElementById('location-filter');

  if (searchInput) searchInput.addEventListener('input', () => { renderEntrepreneurs(); });
  if (locationSelect) locationSelect.addEventListener('change', () => { renderEntrepreneurs(); });
}

// Open Entrepreneur Profile Modal
function openProfileModal(entId) {
  const db = getDbState();
  const ent = db.entrepreneurs.find(e => e.id === entId);
  if (!ent) return;

  const modalTitle = document.getElementById('profileModalLabel');
  const modalBody = document.getElementById('profileModalBody');
  if (!modalTitle || !modalBody) return;

  modalTitle.innerHTML = `<i class="bi bi-patch-check-fill text-primary"></i> ${ent.name}`;

  const entReviews = db.reviews.filter(r => r.entrepreneurId === ent.id);

  modalBody.innerHTML = `
    <div class="row">
      <div class="col-md-4 text-center border-end">
        <img src="${ent.image}" class="img-fluid rounded-4 shadow-sm mb-3" style="max-height: 220px; width: 100%; object-fit: cover;">
        <h5 class="fw-bold mb-1">${ent.name}</h5>
        <div class="badge bg-warning text-dark mb-2">${ent.badge || 'Artisan'}</div>
        <div class="small text-muted mb-2"><i class="bi bi-geo-alt-fill text-danger"></i> ${ent.location}</div>
        <div class="small text-muted mb-3"><i class="bi bi-telephone-fill"></i> ${ent.phone}</div>
        <div class="p-3 bg-light rounded-3 text-start mb-3">
          <div class="small fw-bold text-secondary mb-1">Background & Expertise</div>
          <p class="small text-muted mb-0">${ent.bio}</p>
        </div>
      </div>
      <div class="col-md-8 ps-md-4">
        <h5 class="fw-bold text-secondary mb-3"><i class="bi bi-gear-wide-connected"></i> Available Services</h5>
        <div class="list-group mb-4">
          ${ent.services.map(s => `
            <div class="list-group-item list-group-item-action p-3 rounded-3 mb-2 border">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h6 class="fw-bold mb-1">${s.title}</h6>
                  <p class="small text-muted mb-1">${s.description}</p>
                  <span class="badge bg-light text-dark"><i class="bi bi-clock"></i> Est. ${s.completionDays} days</span>
                </div>
                <div class="text-end ms-3">
                  <div class="fw-bold text-primary mb-2">${s.priceRange}</div>
                  <button class="btn btn-hunar-primary btn-sm" onclick="openServiceRequestModal('${ent.id}', '${s.title.replace(/'/g, "\\'")}')">
                    <i class="bi bi-calendar-check"></i> Request Service
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <h5 class="fw-bold text-secondary mb-3"><i class="bi bi-box-seam"></i> Craft Products</h5>
        <div class="row g-2 mb-4">
          ${ent.products.map(p => `
            <div class="col-6">
              <div class="p-2 border rounded-3 d-flex align-items-center gap-2">
                <img src="${p.image}" style="width:50px; height:50px; object-fit:cover; border-radius:6px;">
                <div class="overflow-hidden">
                  <div class="small fw-bold text-truncate">${p.title}</div>
                  <div class="small text-primary fw-bold">₹${p.price}</div>
                </div>
                <button class="btn btn-outline-primary btn-sm ms-auto" onclick="addToCart('${p.id}', '${p.title.replace(/'/g, "\\'")}', ${p.price}, '${p.image}')">
                  <i class="bi bi-cart-plus"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        <h5 class="fw-bold text-secondary mb-2"><i class="bi bi-star-fill text-warning"></i> Customer Feedback (${entReviews.length})</h5>
        <div class="bg-light p-3 rounded-3" style="max-height: 180px; overflow-y: auto;">
          ${entReviews.length > 0 ? entReviews.map(r => `
            <div class="mb-2 pb-2 border-bottom">
              <div class="d-flex justify-content-between small">
                <strong class="text-secondary">${r.customerName}</strong>
                <span class="text-warning">★ ${r.rating}/5</span>
              </div>
              <p class="small text-muted mb-0">${r.comment}</p>
            </div>
          `).join('') : '<p class="small text-muted mb-0">No reviews submitted yet.</p>'}
        </div>
      </div>
    </div>
  `;

  const bsModal = new bootstrap.Modal(document.getElementById('profileModal'));
  bsModal.show();
}

// Open Service Request Form Modal
function openServiceRequestModal(entId, serviceTitle) {
  const db = getDbState();
  const ent = db.entrepreneurs.find(e => e.id === entId);
  if (!ent) return;

  const requestModalBody = document.getElementById('serviceRequestModalBody');
  if (!requestModalBody) return;

  requestModalBody.innerHTML = `
    <form id="service-request-form" onsubmit="submitServiceRequest(event, '${ent.id}')">
      <div class="alert alert-info py-2 small">
        <i class="bi bi-info-circle-fill"></i> Requesting <strong>${serviceTitle}</strong> from <strong>${ent.name}</strong> (${ent.location})
      </div>
      <input type="hidden" id="req-service-title" value="${serviceTitle}">
      <div class="mb-3">
        <label class="form-label fw-semibold small">Your Full Name</label>
        <input type="text" class="form-control" id="req-customer-name" placeholder="e.g. Ramesh Kumar" required>
      </div>
      <div class="mb-3">
        <label class="form-label fw-semibold small">Phone Number</label>
        <input type="tel" class="form-control" id="req-customer-phone" placeholder="e.g. +91 98765 43210" required>
      </div>
      <div class="mb-3">
        <label class="form-label fw-semibold small">Service Location / Address</label>
        <input type="text" class="form-control" id="req-customer-address" placeholder="Door No, Street Name, Area" required>
      </div>
      <div class="mb-3">
        <label class="form-label fw-semibold small">Preferred Service Date</label>
        <input type="date" class="form-control" id="req-preferred-date" required>
      </div>
      <div class="mb-3">
        <label class="form-label fw-semibold small">Work Details / Custom Instructions</label>
        <textarea class="form-control" id="req-details" rows="3" placeholder="Describe your specific requirement (e.g. sizes, custom colors, repair issues)..." required></textarea>
      </div>
      <div class="text-end">
        <button type="button" class="btn btn-light me-2" data-bs-dismiss="modal">Cancel</button>
        <button type="submit" class="btn btn-hunar-primary"><i class="bi bi-send-fill"></i> Submit Request</button>
      </div>
    </form>
  `;

  // Hide profile modal if open
  const profModalEl = document.getElementById('profileModal');
  const profModal = bootstrap.Modal.getInstance(profModalEl);
  if (profModal) profModal.hide();

  const reqModal = new bootstrap.Modal(document.getElementById('serviceRequestModal'));
  reqModal.show();
}

function submitServiceRequest(e, entId) {
  e.preventDefault();
  const db = getDbState();
  const ent = db.entrepreneurs.find(e => e.id === entId);

  const newReq = {
    id: "req_" + Date.now(),
    customerName: document.getElementById('req-customer-name').value,
    customerPhone: document.getElementById('req-customer-phone').value,
    customerAddress: document.getElementById('req-customer-address').value,
    entrepreneurId: entId,
    entrepreneurName: ent ? ent.name : "Artisan",
    serviceTitle: document.getElementById('req-service-title').value,
    dateRequested: new Date().toISOString().split('T')[0],
    preferredDate: document.getElementById('req-preferred-date').value,
    details: document.getElementById('req-details').value,
    status: "Pending",
    estimatedPrice: "Quote Pending"
  };

  db.serviceRequests.unshift(newReq);
  saveDbState(db);

  const reqModalEl = document.getElementById('serviceRequestModal');
  const reqModal = bootstrap.Modal.getInstance(reqModalEl);
  if (reqModal) reqModal.hide();

  showToast(`Service request sent to ${ent.name}! They will contact you shortly.`);
}

// Shopping Cart Drawer Controls
function setupCartEvents() {
  const triggerBtn = document.getElementById('cart-trigger');
  const closeBtn = document.getElementById('cart-close');
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');

  if (triggerBtn) {
    triggerBtn.addEventListener('click', () => {
      renderCartDrawer();
      drawer.classList.add('active');
      backdrop.classList.add('active');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeCart);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeCart);
  }
}

function closeCart() {
  document.getElementById('cart-drawer')?.classList.remove('active');
  document.getElementById('cart-backdrop')?.classList.remove('active');
}

function addToCart(id, title, price, image) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id, title, price, image, quantity: 1 });
  }
  saveCart();
  showToast(`Added "${title}" to your cart!`, 'bi-bag-check-fill');
}

function updateCartQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  saveCart();
  renderCartDrawer();
}

function renderCartDrawer() {
  const container = document.getElementById('cart-items-container');
  const totalEl = document.getElementById('cart-total-price');
  if (!container || !totalEl) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5 text-muted">
        <i class="bi bi-cart-x fs-1 mb-2 d-block"></i>
        <p>Your cart is empty.</p>
      </div>
    `;
    totalEl.textContent = '₹0';
    return;
  }

  let total = 0;
  container.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    return `
      <div class="cart-item">
        <img src="${item.image}" class="cart-item-img" onerror="this.src='https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=100'">
        <div class="flex-grow-1">
          <div class="fw-bold small text-secondary">${item.title}</div>
          <div class="text-primary fw-bold small">₹${item.price}</div>
          <div class="d-flex align-items-center gap-2 mt-1">
            <button class="btn btn-outline-secondary btn-sm px-2 py-0" onclick="updateCartQty('${item.id}', -1)">-</button>
            <span class="small fw-bold">${item.quantity}</span>
            <button class="btn btn-outline-secondary btn-sm px-2 py-0" onclick="updateCartQty('${item.id}', 1)">+</button>
          </div>
        </div>
        <div class="fw-bold text-end">
          ₹${itemTotal}
        </div>
      </div>
    `;
  }).join('');

  totalEl.textContent = `₹${total}`;
}

function checkoutCart() {
  if (cart.length === 0) {
    showToast('Your cart is empty!', 'bi-exclamation-triangle-fill');
    return;
  }

  const db = getDbState();
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const newOrder = {
    id: "ord_" + Date.now(),
    customerName: "Active Customer",
    customerPhone: "+91 98765 00000",
    deliveryAddress: "Customer Address",
    items: [...cart],
    totalAmount: total,
    paymentMethod: "Cash on Delivery",
    status: "Confirmed",
    datePlaced: new Date().toISOString().split('T')[0]
  };

  db.orders.unshift(newOrder);
  saveDbState(db);

  cart = [];
  saveCart();
  closeCart();

  showToast(`Order #${newOrder.id.slice(-4)} placed successfully! Support local micro-entrepreneurs!`, 'bi-check-circle-fill');
}
