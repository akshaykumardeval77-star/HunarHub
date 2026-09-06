import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function AdminDashboard({ showToast }) {
  const [stats, setStats] = useState({ totalEnts: 0, verifiedEnts: 0, totalReqs: 0, gmv: 0 });
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [activeTab, setActiveTab] = useState('approvals');

  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [newCat, setNewCat] = useState({ id: '', name: '', icon: 'bi-tools', desc: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sData, aData, cData, rData, eData] = await Promise.all([
        api.getAdminStats(),
        api.getPendingApprovals(),
        api.getCategories(),
        api.getServiceRequests(),
        api.getEntrepreneurs()
      ]);
      setStats(sData);
      setPendingApprovals(aData);
      setCategories(cData);
      setServiceRequests(rData);
      setEntrepreneurs(eData);
    } catch (e) {
      console.error(e);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.approveEntrepreneur(id);
      loadData();
      showToast('Applicant approved! Added to active marketplace.', 'bi-patch-check-fill');
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.rejectEntrepreneur(id);
      loadData();
      showToast('Application rejected.');
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      await api.addCategory(newCat);
      setShowAddCatModal(false);
      setNewCat({ id: '', name: '', icon: 'bi-tools', desc: '' });
      loadData();
      showToast(`Category "${newCat.name}" added to platform!`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="bg-secondary text-white py-4 mb-4">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold mb-1"><i className="bi bi-shield-check text-warning me-2"></i> Platform Governance & Admin Oversight</h2>
              <p className="small text-white-50 mb-0">Verify micro-entrepreneurs, manage skill categories, and audit orders.</p>
            </div>
            <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fw-bold">
              Super Admin Mode
            </span>
          </div>
        </div>
      </header>

      <main className="container mb-5">
        {/* Stats Grid */}
        <div className="row g-3 mb-4">
          <div className="col-md-3 col-6">
            <div className="stat-card">
              <div className="stat-icon terracotta"><i className="bi bi-people-fill"></i></div>
              <div>
                <div className="stat-number">{stats.totalEnts}</div>
                <div className="stat-label">Total Registered Artisans</div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="stat-card">
              <div className="stat-icon emerald"><i className="bi bi-patch-check-fill"></i></div>
              <div>
                <div className="stat-number">{stats.verifiedEnts}</div>
                <div className="stat-label">Verified Master Artisans</div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="stat-card">
              <div className="stat-icon indigo"><i className="bi bi-card-checklist"></i></div>
              <div>
                <div className="stat-number">{stats.totalReqs}</div>
                <div className="stat-label">Service Requests</div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="stat-card">
              <div className="stat-icon gold"><i className="bi bi-cash-stack"></i></div>
              <div>
                <div className="stat-number">₹{stats.gmv?.toLocaleString()}</div>
                <div className="stat-label">Total Platform GMV</div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Tabs */}
        <ul className="nav nav-pills mb-4 bg-white p-2 rounded-4 shadow-sm border">
          <li className="nav-item me-1">
            <button className={`nav-link fw-bold ${activeTab === 'approvals' ? 'active' : ''}`} onClick={() => setActiveTab('approvals')}>
              <i className="bi bi-person-check-fill me-1"></i> Verification Queue <span className="badge bg-danger rounded-circle ms-1">{pendingApprovals.length}</span>
            </button>
          </li>
          <li className="nav-item me-1">
            <button className={`nav-link fw-bold ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
              <i className="bi bi-diagram-3-fill me-1"></i> Skill Taxonomy
            </button>
          </li>
          <li className="nav-item me-1">
            <button className={`nav-link fw-bold ${activeTab === 'supervision' ? 'active' : ''}`} onClick={() => setActiveTab('supervision')}>
              <i className="bi bi-eye-fill me-1"></i> Requests Supervision
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link fw-bold ${activeTab === 'artisans' ? 'active' : ''}`} onClick={() => setActiveTab('artisans')}>
              <i className="bi bi-people-fill me-1"></i> All Artisans
            </button>
          </li>
        </ul>

        {/* Tab Content */}
        {activeTab === 'approvals' && (
          <div className="bg-white rounded-4 p-4 shadow-sm border">
            <h4 className="fw-bold text-secondary mb-3"><i className="bi bi-patch-check-fill text-primary me-2"></i> Pending Artisan Verification Queue</h4>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Applicant Name</th>
                    <th>Skill Category</th>
                    <th>Location</th>
                    <th>Experience</th>
                    <th>ID Proof</th>
                    <th>Applied Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingApprovals.length === 0 ? (
                    <tr><td colSpan="7" className="text-center py-4 text-muted">No pending verification applications.</td></tr>
                  ) : (
                    pendingApprovals.map(app => (
                      <tr key={app.id}>
                        <td>
                          <div className="fw-bold text-secondary">{app.name}</div>
                          <div className="small text-muted">{app.phone}</div>
                        </td>
                        <td><span className="badge bg-primary-subtle text-primary border px-2 py-1">{app.categoryName}</span></td>
                        <td className="small fw-semibold">{app.location}</td>
                        <td className="small">{app.experience}</td>
                        <td><span className="badge bg-success-subtle text-success border border-success"><i className="bi bi-shield-check me-1"></i> {app.documentProof}</span></td>
                        <td className="small text-muted">{app.appliedDate}</td>
                        <td>
                          <button className="btn btn-success btn-sm me-1" onClick={() => handleApprove(app.id)}><i className="bi bi-check-circle-fill me-1"></i> Approve</button>
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleReject(app.id)}><i className="bi bi-x-circle me-1"></i> Reject</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="bg-white rounded-4 p-4 shadow-sm border">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold text-secondary mb-0"><i className="bi bi-tags-fill text-primary me-2"></i> Categories Taxonomy</h4>
              <button className="btn btn-hunar-primary" onClick={() => setShowAddCatModal(true)}>
                <i className="bi bi-plus-lg me-1"></i> Add Category
              </button>
            </div>
            <div className="row g-3">
              {categories.map(c => (
                <div key={c.id} className="col-md-4">
                  <div className="p-3 border rounded-3 bg-light d-flex align-items-center gap-3">
                    <div className="fs-2 text-primary"><i className={`bi ${c.icon}`}></i></div>
                    <div>
                      <h6 className="fw-bold mb-0">{c.name}</h6>
                      <div className="small text-muted">{c.desc || 'Skill category'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'supervision' && (
          <div className="bg-white rounded-4 p-4 shadow-sm border">
            <h4 className="fw-bold text-secondary mb-3"><i className="bi bi-receipt-cutoff text-primary me-2"></i> Orders & Requests Audit</h4>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Req ID</th>
                    <th>Customer</th>
                    <th>Artisan</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceRequests.map(r => (
                    <tr key={r.id}>
                      <td className="fw-bold text-secondary">#{r.id.slice(-4)}</td>
                      <td>
                        <div className="fw-bold">{r.customerName}</div>
                        <div className="small text-muted">{r.customerPhone}</div>
                      </td>
                      <td className="fw-semibold text-primary">{r.entrepreneurName}</td>
                      <td className="small">{r.serviceTitle}</td>
                      <td className="small text-muted">{r.dateRequested}</td>
                      <td>
                        <span className={`badge ${r.status === 'Accepted' ? 'bg-success' : r.status === 'Completed' ? 'bg-primary' : 'bg-warning text-dark'} px-2 py-1`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'artisans' && (
          <div className="bg-white rounded-4 p-4 shadow-sm border">
            <h4 className="fw-bold text-secondary mb-3"><i className="bi bi-person-lines-fill text-primary me-2"></i> Directory of Active Artisans</h4>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Artisan</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Completed Jobs</th>
                    <th>Total Earnings</th>
                    <th>Badge</th>
                  </tr>
                </thead>
                <tbody>
                  {entrepreneurs.map(e => (
                    <tr key={e.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img src={e.image} style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '50%' }} onError={(err) => err.target.src = '/assets/artisan_potter.jpg'} />
                          <div className="fw-bold text-secondary">{e.name}</div>
                        </div>
                      </td>
                      <td><span className="badge bg-light text-dark border">{e.categoryName}</span></td>
                      <td className="small">{e.location}</td>
                      <td className="small fw-bold text-center">{e.completedOrders || 0}</td>
                      <td className="fw-bold text-success">₹{e.earnings?.toLocaleString()}</td>
                      <td><span className="badge bg-success-subtle text-success border border-success"><i className="bi bi-patch-check-fill me-1"></i> {e.badge}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Add Category Modal */}
      {showAddCatModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold text-secondary">Add Skill Category</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddCatModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddCategorySubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Category ID</label>
                    <input type="text" className="form-control" value={newCat.id} onChange={e => setNewCat({ ...newCat, id: e.target.value })} placeholder="e.g. woodcraft" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Display Title</label>
                    <input type="text" className="form-control" value={newCat.name} onChange={e => setNewCat({ ...newCat, name: e.target.value })} placeholder="e.g. Woodcraft Artisan" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Icon Class</label>
                    <input type="text" className="form-control" value={newCat.icon} onChange={e => setNewCat({ ...newCat, icon: e.target.value })} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Description</label>
                    <textarea className="form-control" rows="2" value={newCat.desc} onChange={e => setNewCat({ ...newCat, desc: e.target.value })} required></textarea>
                  </div>
                  <div className="text-end">
                    <button type="button" className="btn btn-light me-2" onClick={() => setShowAddCatModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-hunar-primary">Create Category</button>
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
