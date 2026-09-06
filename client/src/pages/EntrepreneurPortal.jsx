import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function EntrepreneurPortal({ showToast }) {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [activeArtisanId, setActiveArtisanId] = useState('ent_101');
  const [artisan, setArtisan] = useState(null);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('requests');

  // Modals state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);

  const [newProd, setNewProd] = useState({ title: '', price: '', stock: '10', image: '/assets/product_pottery.jpg', description: '' });
  const [newSrv, setNewSrv] = useState({ title: '', priceRange: '₹300 - ₹800', completionDays: 2, description: '' });

  useEffect(() => {
    loadEntrepreneurs();
    loadRequests();
  }, [activeArtisanId]);

  const loadEntrepreneurs = async () => {
    try {
      const list = await api.getEntrepreneurs();
      setEntrepreneurs(list);
      const current = list.find(e => e.id === activeArtisanId) || list[0];
      setArtisan(current);
    } catch (e) {
      console.error(e);
    }
  };

  const loadRequests = async () => {
    try {
      const data = await api.getServiceRequests();
      setServiceRequests(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleAvailability = async (checked) => {
    if (!artisan) return;
    try {
      await api.updateAvailability(artisan.id, checked);
      setArtisan({ ...artisan, isAvailable: checked });
      showToast(checked ? 'You are now ACCEPTING new service requests!' : 'Availability set to BUSY.');
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStatus = async (reqId, status) => {
    try {
      await api.updateRequestStatus(reqId, status);
      loadRequests();
      showToast(`Service request marked as ${status}!`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.addProduct(artisan.id, { ...newProd, price: parseFloat(newProd.price), stock: parseInt(newProd.stock) });
      setShowAddProductModal(false);
      setNewProd({ title: '', price: '', stock: '10', image: '/assets/product_pottery.jpg', description: '' });
      loadEntrepreneurs();
      showToast(`Product "${newProd.title}" published!`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.addService(artisan.id, { ...newSrv, completionDays: parseInt(newSrv.completionDays) });
      setShowAddServiceModal(false);
      setNewSrv({ title: '', priceRange: '₹300 - ₹800', completionDays: 2, description: '' });
      loadEntrepreneurs();
      showToast(`Service "${newSrv.title}" published!`);
    } catch (err) {
      console.error(err);
    }
  };

  if (!artisan) return <div class="container py-5 text-center">Loading artisan portal...</div>;

  const artisanRequests = serviceRequests.filter(r => r.entrepreneurId === artisan.id);
  const pendingCount = artisanRequests.filter(r => r.status === 'Pending').length;

  return (
    <div>
      {/* Header */}
      <header class="bg-white border-bottom py-4 mb-4">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-auto">
              <img src={artisan.image} class="rounded-circle shadow" style={{ width: '85px', height: '85px', objectFit: 'cover', border: '3px solid var(--primary)' }} onError={(e) => e.target.src = '/assets/artisan_potter.jpg'} />
            </div>
            <div class="col">
              <div class="d-flex align-items-center gap-2">
                <h3 class="fw-bold text-secondary mb-0">{artisan.name}</h3>
                <span class="badge bg-success-subtle text-success border rounded-pill px-3 py-1 fw-bold">
                  <i class="bi bi-patch-check-fill me-1"></i> {artisan.badge || 'Verified Artisan'}
                </span>
              </div>
              <div class="text-muted small">{artisan.categoryName} • {artisan.location} • Phone: {artisan.phone}</div>
            </div>
            <div class="col-auto mt-3 mt-md-0">
              <div class="d-flex align-items-center gap-3">
                <select class="form-select form-select-sm fw-bold border-primary text-secondary" value={activeArtisanId} onChange={(e) => setActiveArtisanId(e.target.value)}>
                  {entrepreneurs.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.categoryName})</option>
                  ))}
                </select>
                <div class="form-check form-switch">
                  <input class="form-check-input fs-5" type="checkbox" id="availSwitch" checked={artisan.isAvailable} onChange={(e) => handleToggleAvailability(e.target.checked)} />
                  <label class="form-check-label fw-bold ms-1" htmlFor="availSwitch">
                    {artisan.isAvailable ? '🟢 Accepting Work' : '🔴 Busy'}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main class="container mb-5">
        {/* Stats Row */}
        <div class="row g-3 mb-4">
          <div class="col-md-3 col-6">
            <div class="stat-card">
              <div class="stat-icon terracotta"><i class="bi bi-wallet2"></i></div>
              <div>
                <div class="stat-number">₹{artisan.earnings?.toLocaleString()}</div>
                <div class="stat-label">Total Earnings</div>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-6">
            <div class="stat-card">
              <div class="stat-icon indigo"><i class="bi bi-inbox-fill"></i></div>
              <div>
                <div class="stat-number">{artisanRequests.length}</div>
                <div class="stat-label">Service Requests</div>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-6">
            <div class="stat-card">
              <div class="stat-icon emerald"><i class="bi bi-box-seam-fill"></i></div>
              <div>
                <div class="stat-number">{artisan.products ? artisan.products.length : 0}</div>
                <div class="stat-label">Active Crafts</div>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-6">
            <div class="stat-card">
              <div class="stat-icon gold"><i class="bi bi-star-fill"></i></div>
              <div>
                <div class="stat-number">{artisan.rating} ★</div>
                <div class="stat-label">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Pills */}
        <ul class="nav nav-pills mb-4 bg-white p-2 rounded-4 shadow-sm border">
          <li class="nav-item me-1">
            <button class={`nav-link fw-bold ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>
              <i class="bi bi-inbox-fill me-1"></i> Service Requests <span class="badge bg-danger rounded-circle ms-1">{pendingCount}</span>
            </button>
          </li>
          <li class="nav-item me-1">
            <button class={`nav-link fw-bold ${activeTab === 'catalog' ? 'active' : ''}`} onClick={() => setActiveTab('catalog')}>
              <i class="bi bi-box-seam-fill me-1"></i> Products Catalog
            </button>
          </li>
          <li class="nav-item me-1">
            <button class={`nav-link fw-bold ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>
              <i class="bi bi-tools me-1"></i> Offered Services
            </button>
          </li>
        </ul>

        {/* Tab Panes */}
        {activeTab === 'requests' && (
          <div class="bg-white rounded-4 p-4 shadow-sm border">
            <h4 class="fw-bold text-secondary mb-3"><i class="bi bi-card-checklist text-primary me-2"></i> Incoming Service Requests</h4>
            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="table-light">
                  <tr>
                    <th>Req ID</th>
                    <th>Customer Details</th>
                    <th>Service Requested</th>
                    <th>Preferred Date</th>
                    <th>Work Details</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {artisanRequests.length === 0 ? (
                    <tr><td colSpan="7" class="text-center py-4 text-muted">No service requests yet.</td></tr>
                  ) : (
                    artisanRequests.map(r => (
                      <tr key={r.id}>
                        <td class="fw-bold text-secondary">#{r.id.slice(-4)}</td>
                        <td>
                          <div class="fw-bold">{r.customerName}</div>
                          <div class="small text-muted">{r.customerPhone}</div>
                        </td>
                        <td class="fw-semibold text-primary">{r.serviceTitle}</td>
                        <td class="small fw-bold">{r.preferredDate}</td>
                        <td class="small text-muted" style={{ maxWidth: '200px' }}>{r.details}</td>
                        <td>
                          <span class={`badge ${r.status === 'Accepted' ? 'bg-success' : r.status === 'Completed' ? 'bg-primary' : r.status === 'Rejected' ? 'bg-danger' : 'bg-warning text-dark'} px-3 py-2`}>
                            {r.status}
                          </span>
                        </td>
                        <td>
                          {r.status === 'Pending' ? (
                            <>
                              <button class="btn btn-success btn-sm me-1" onClick={() => handleUpdateStatus(r.id, 'Accepted')}>Accept</button>
                              <button class="btn btn-outline-danger btn-sm" onClick={() => handleUpdateStatus(r.id, 'Rejected')}>Reject</button>
                            </>
                          ) : r.status === 'Accepted' ? (
                            <button class="btn btn-primary btn-sm" onClick={() => handleUpdateStatus(r.id, 'Completed')}>Complete</button>
                          ) : (
                            <span class="small text-muted">Finished</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'catalog' && (
          <div class="bg-white rounded-4 p-4 shadow-sm border">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h4 class="fw-bold text-secondary mb-0"><i class="bi bi-bag-fill text-primary me-2"></i> Handcrafted Products</h4>
              <button class="btn btn-hunar-primary" onClick={() => setShowAddProductModal(true)}>
                <i class="bi bi-plus-lg me-1"></i> Add Product
              </button>
            </div>
            <div class="row g-4">
              {artisan.products?.map(p => (
                <div key={p.id} class="col-md-4 col-sm-6">
                  <div class="card h-100 border shadow-sm">
                    <img src={p.image} class="card-img-top" style={{ height: '160px', objectFit: 'cover' }} onError={(e) => e.target.src = '/assets/product_pottery.jpg'} />
                    <div class="card-body p-3">
                      <h6 class="card-title fw-bold mb-1">{p.title}</h6>
                      <p class="small text-muted mb-2">{p.description}</p>
                      <div class="d-flex justify-content-between align-items-center">
                        <span class="fw-bold text-primary fs-5">₹{p.price}</span>
                        <span class="badge bg-light text-dark">Stock: {p.stock}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div class="bg-white rounded-4 p-4 shadow-sm border">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h4 class="fw-bold text-secondary mb-0"><i class="bi bi-tools text-primary me-2"></i> Service Offerings</h4>
              <button class="btn btn-hunar-secondary" onClick={() => setShowAddServiceModal(true)}>
                <i class="bi bi-plus-lg me-1"></i> Add Service
              </button>
            </div>
            <div class="list-group">
              {artisan.services?.map(s => (
                <div key={s.id} class="list-group-item p-3 mb-2 rounded-3 border">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 class="fw-bold mb-1">{s.title}</h6>
                      <p class="small text-muted mb-0">{s.description}</p>
                    </div>
                    <div class="text-end">
                      <div class="fw-bold text-primary">{s.priceRange}</div>
                      <div class="small text-muted"><i class="bi bi-clock me-1"></i> {s.completionDays} Days turnaround</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div class="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title fw-bold text-secondary">Add Handcrafted Product</h5>
                <button type="button" class="btn-close" onClick={() => setShowAddProductModal(false)}></button>
              </div>
              <div class="modal-body">
                <form onSubmit={handleAddProductSubmit}>
                  <div class="mb-3">
                    <label class="form-label small fw-semibold">Product Title</label>
                    <input type="text" class="form-control" value={newProd.title} onChange={e => setNewProd({ ...newProd, title: e.target.value })} required />
                  </div>
                  <div class="row g-2 mb-3">
                    <div class="col-6">
                      <label class="form-label small fw-semibold">Price (₹)</label>
                      <input type="number" class="form-control" value={newProd.price} onChange={e => setNewProd({ ...newProd, price: e.target.value })} required />
                    </div>
                    <div class="col-6">
                      <label class="form-label small fw-semibold">Stock</label>
                      <input type="number" class="form-control" value={newProd.stock} onChange={e => setNewProd({ ...newProd, stock: e.target.value })} required />
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label small fw-semibold">Description</label>
                    <textarea class="form-control" rows="3" value={newProd.description} onChange={e => setNewProd({ ...newProd, description: e.target.value })} required></textarea>
                  </div>
                  <div class="text-end">
                    <button type="button" class="btn btn-light me-2" onClick={() => setShowAddProductModal(false)}>Cancel</button>
                    <button type="submit" class="btn btn-hunar-primary">Save Product</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      {showAddServiceModal && (
        <div class="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title fw-bold text-secondary">Add Service Listing</h5>
                <button type="button" class="btn-close" onClick={() => setShowAddServiceModal(false)}></button>
              </div>
              <div class="modal-body">
                <form onSubmit={handleAddServiceSubmit}>
                  <div class="mb-3">
                    <label class="form-label small fw-semibold">Service Title</label>
                    <input type="text" class="form-control" value={newSrv.title} onChange={e => setNewSrv({ ...newSrv, title: e.target.value })} required />
                  </div>
                  <div class="row g-2 mb-3">
                    <div class="col-6">
                      <label class="form-label small fw-semibold">Price Range</label>
                      <input type="text" class="form-control" value={newSrv.priceRange} onChange={e => setNewSrv({ ...newSrv, priceRange: e.target.value })} required />
                    </div>
                    <div class="col-6">
                      <label class="form-label small fw-semibold">Days</label>
                      <input type="number" class="form-control" value={newSrv.completionDays} onChange={e => setNewSrv({ ...newSrv, completionDays: e.target.value })} required />
                    </div>
                  </div>
                  <div class="mb-3">
                    <label class="form-label small fw-semibold">Description</label>
                    <textarea class="form-control" rows="3" value={newSrv.description} onChange={e => setNewSrv({ ...newSrv, description: e.target.value })} required></textarea>
                  </div>
                  <div class="text-end">
                    <button type="button" class="btn btn-light me-2" onClick={() => setShowAddServiceModal(false)}>Cancel</button>
                    <button type="submit" class="btn btn-hunar-secondary">Save Service</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
