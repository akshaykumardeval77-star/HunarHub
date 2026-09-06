import React, { useState } from 'react';

export default function ServiceRequestModal({ requestData, onClose, onSubmit }) {
  if (!requestData) return null;

  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    preferredDate: '',
    details: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      entrepreneurId: requestData.entrepreneur.id,
      entrepreneurName: requestData.entrepreneur.name,
      serviceTitle: requestData.serviceTitle
    });
  };

  return (
    <div class="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title fw-bold text-secondary">
              <i class="bi bi-calendar-plus text-primary me-2"></i> Place Service Request
            </h5>
            <button type="button" class="btn-close" onClick={onClose}></button>
          </div>
          <div class="modal-body">
            <form onSubmit={handleSubmit}>
              <div class="alert alert-info py-2 small">
                Requesting <strong>{requestData.serviceTitle}</strong> from <strong>{requestData.entrepreneur.name}</strong>
              </div>
              <div class="mb-3">
                <label class="form-label small fw-semibold">Your Full Name</label>
                <input type="text" class="form-control" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} placeholder="e.g. Ramesh Kumar" required />
              </div>
              <div class="mb-3">
                <label class="form-label small fw-semibold">Phone Number</label>
                <input type="tel" class="form-control" value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })} placeholder="+91 98765 43210" required />
              </div>
              <div class="mb-3">
                <label class="form-label small fw-semibold">Service Location / Address</label>
                <input type="text" class="form-control" value={form.customerAddress} onChange={e => setForm({ ...form, customerAddress: e.target.value })} placeholder="Door No, Street Name, Area" required />
              </div>
              <div class="mb-3">
                <label class="form-label small fw-semibold">Preferred Service Date</label>
                <input type="date" class="form-control" value={form.preferredDate} onChange={e => setForm({ ...form, preferredDate: e.target.value })} required />
              </div>
              <div class="mb-3">
                <label class="form-label small fw-semibold">Work Details / Instructions</label>
                <textarea class="form-control" rows="3" value={form.details} onChange={e => setForm({ ...form, details: e.target.value })} placeholder="Describe specific sizes, materials or repair requirements..." required></textarea>
              </div>
              <div class="text-end">
                <button type="button" class="btn btn-light me-2" onClick={onClose}>Cancel</button>
                <button type="submit" class="btn btn-hunar-primary"><i class="bi bi-send-fill me-1"></i> Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
