import React from 'react';

export default function CartDrawer({ isOpen, onClose, cart, updateQty, onCheckout }) {
  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      <div class="cart-drawer-backdrop" onClick={onClose}></div>
      <div class="cart-drawer">
        <div class="cart-header">
          <h5 class="mb-0 fw-bold"><i class="bi bi-bag-heart-fill text-primary me-2"></i> Your Craft Cart</h5>
          <button type="button" class="btn-close" onClick={onClose}></button>
        </div>
        <div class="cart-body">
          {cart.length === 0 ? (
            <div class="text-center py-5 text-muted">
              <i class="bi bi-cart-x fs-1 mb-2 d-block"></i>
              <p>Your cart is empty.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} class="d-flex gap-3 align-items-center mb-3 pb-3 border-bottom">
                <img src={item.image} alt={item.title} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                <div class="flex-grow-1">
                  <div class="fw-bold small text-secondary">{item.title}</div>
                  <div class="text-primary fw-bold small">₹{item.price}</div>
                  <div class="d-flex align-items-center gap-2 mt-1">
                    <button class="btn btn-outline-secondary btn-sm px-2 py-0" onClick={() => updateQty(item.id, -1)}>-</button>
                    <span class="small fw-bold">{item.quantity}</span>
                    <button class="btn btn-outline-secondary btn-sm px-2 py-0" onClick={() => updateQty(item.id, 1)}>+</button>
                  </div>
                </div>
                <div class="fw-bold text-end">₹{item.price * item.quantity}</div>
              </div>
            ))
          )}
        </div>
        <div class="cart-footer">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <span class="fw-semibold text-secondary">Total Amount:</span>
            <span class="fw-bold fs-4 text-primary">₹{total}</span>
          </div>
          <button class="btn btn-hunar-primary w-100 py-3" onClick={onCheckout}>
            <i class="bi bi-credit-card-fill me-2"></i> Checkout & Place Order
          </button>
        </div>
      </div>
    </>
  );
}
