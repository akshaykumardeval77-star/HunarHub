import React from 'react';

export default function ProfileModal({ entrepreneur, onClose, onRequestService, onAddToCart }) {
  if (!entrepreneur) return null;

  return (
    <div class="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold text-secondary">
              <i class="bi bi-patch-check-fill text-primary me-2"></i> {entrepreneur.name}
            </h5>
            <button type="button" class="btn-close" onClick={onClose}></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-4 text-center border-end">
                <img src={entrepreneur.image} alt={entrepreneur.name} class="img-fluid rounded-4 shadow-sm mb-3" style={{ maxHeight: '220px', width: '100%', objectFit: 'cover' }} />
                <h5 class="fw-bold mb-1">{entrepreneur.name}</h5>
                <div class="badge bg-warning text-dark mb-2">{entrepreneur.badge || 'Artisan'}</div>
                <div class="small text-muted mb-2"><i class="bi bi-geo-alt-fill text-danger me-1"></i> {entrepreneur.location}</div>
                <div class="small text-muted mb-3"><i class="bi bi-telephone-fill me-1"></i> {entrepreneur.phone}</div>
                <div class="p-3 bg-light rounded-3 text-start mb-3">
                  <div class="small fw-bold text-secondary mb-1">Background & Expertise</div>
                  <p class="small text-muted mb-0">{entrepreneur.bio}</p>
                </div>
              </div>
              <div class="col-md-8 ps-md-4">
                <h5 class="fw-bold text-secondary mb-3"><i class="bi bi-gear-wide-connected me-2"></i> Available Services</h5>
                <div class="list-group mb-4">
                  {entrepreneur.services?.map(s => (
                    <div key={s.id} class="list-group-item p-3 rounded-3 mb-2 border">
                      <div class="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 class="fw-bold mb-1">{s.title}</h6>
                          <p class="small text-muted mb-1">{s.description}</p>
                          <span class="badge bg-light text-dark"><i class="bi bi-clock me-1"></i> Est. {s.completionDays} days</span>
                        </div>
                        <div class="text-end ms-3">
                          <div class="fw-bold text-primary mb-2">{s.priceRange}</div>
                          <button class="btn btn-hunar-primary btn-sm" onClick={() => onRequestService(entrepreneur, s.title)}>
                            <i class="bi bi-calendar-check me-1"></i> Request
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <h5 class="fw-bold text-secondary mb-3"><i class="bi bi-box-seam me-2"></i> Craft Products</h5>
                <div class="row g-2 mb-4">
                  {entrepreneur.products?.map(p => (
                    <div key={p.id} class="col-6">
                      <div class="p-2 border rounded-3 d-flex align-items-center gap-2">
                        <img src={p.image} alt={p.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
                        <div class="overflow-hidden">
                          <div class="small fw-bold text-truncate">{p.title}</div>
                          <div class="small text-primary fw-bold">₹{p.price}</div>
                        </div>
                        <button class="btn btn-outline-primary btn-sm ms-auto" onClick={() => onAddToCart(p)}>
                          <i class="bi bi-cart-plus"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <h5 class="fw-bold text-secondary mb-2"><i class="bi bi-star-fill text-warning me-1"></i> Customer Feedback</h5>
                <div class="bg-light p-3 rounded-3" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                  {entrepreneur.reviews?.length > 0 ? (
                    entrepreneur.reviews.map(r => (
                      <div key={r.id} class="mb-2 pb-2 border-bottom">
                        <div class="d-flex justify-content-between small">
                          <strong class="text-secondary">{r.customerName}</strong>
                          <span class="text-warning fw-bold">★ {r.rating}/5</span>
                        </div>
                        <p class="small text-muted mb-0">{r.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p class="small text-muted mb-0">No reviews submitted yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
