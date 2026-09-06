import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import ProfileModal from './components/ProfileModal';
import ServiceRequestModal from './components/ServiceRequestModal';
import CustomerMarketplace from './pages/CustomerMarketplace';
import EntrepreneurPortal from './pages/EntrepreneurPortal';
import AdminDashboard from './pages/AdminDashboard';
import { api } from './services/api';

export default function App() {
  const [activeRole, setActiveRole] = useState('customer');
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem('hunarhub_mern_cart') || '[]');
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const [selectedEntrepreneur, setSelectedEntrepreneur] = useState(null);
  const [serviceRequestTarget, setServiceRequestTarget] = useState(null);

  useEffect(() => {
    localStorage.setItem('hunarhub_mern_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (message, icon = 'bi-check-circle-fill') => {
    setToast({ message, icon });
    setTimeout(() => setToast(null), 3500);
  };

  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(i => i.id === product.id);
      if (existing) {
        return prevCart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    showToast(`Added "${product.title}" to cart!`, 'bi-bag-check-fill');
  };

  const handleUpdateCartQty = (id, delta) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const order = await api.createOrder({
        customerName: "Active Customer",
        customerPhone: "+91 98765 00000",
        deliveryAddress: "Customer Location",
        items: cart,
        totalAmount: total
      });

      setCart([]);
      setIsCartOpen(false);
      showToast(`Order #${order.order.id.slice(-4)} placed successfully via MERN Backend!`, 'bi-check-circle-fill');
    } catch (e) {
      console.error(e);
      showToast('Checkout failed, check server logs.', 'bi-exclamation-triangle-fill');
    }
  };

  const handleOpenProfile = async (id) => {
    try {
      const data = await api.getEntrepreneurById(id);
      setSelectedEntrepreneur(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenServiceRequest = (entrepreneur, serviceTitle) => {
    setSelectedEntrepreneur(null);
    setServiceRequestTarget({ entrepreneur, serviceTitle });
  };

  const handleSubmitServiceRequest = async (formData) => {
    try {
      await api.createServiceRequest(formData);
      setServiceRequestTarget(null);
      showToast(`Request sent to ${formData.entrepreneurName}! They will contact you shortly.`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div class="d-flex flex-column min-vh-100">
      <Navbar
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        toggleCart={() => setIsCartOpen(!isCartOpen)}
      />

      <div class="flex-grow-1">
        {activeRole === 'customer' && (
          <CustomerMarketplace
            onOpenProfile={handleOpenProfile}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeRole === 'entrepreneur' && (
          <EntrepreneurPortal showToast={showToast} />
        )}

        {activeRole === 'admin' && (
          <AdminDashboard showToast={showToast} />
        )}
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQty={handleUpdateCartQty}
        onCheckout={handleCheckout}
      />

      {/* Profile Modal */}
      <ProfileModal
        entrepreneur={selectedEntrepreneur}
        onClose={() => setSelectedEntrepreneur(null)}
        onRequestService={handleOpenServiceRequest}
        onAddToCart={handleAddToCart}
      />

      {/* Service Request Modal */}
      <ServiceRequestModal
        requestData={serviceRequestTarget}
        onClose={() => setServiceRequestTarget(null)}
        onSubmit={handleSubmitServiceRequest}
      />

      {/* Toast Notifications */}
      {toast && (
        <div class="toast-container-custom">
          <div class="hunar-toast">
            <i class={`bi ${toast.icon} text-warning fs-5`}></i>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer class="mt-auto">
        <div class="container text-center">
          <div class="brand-logo justify-content-center mb-2 text-white">
            <div class="logo-icon"><i class="bi bi-shop-window"></i></div>
            <div class="text-white">Hunar<span class="highlight">Hub</span></div>
          </div>
          <p class="small text-white-50 mb-0">HunarHub MERN Application • MongoDB, Express.js, React.js, Node.js Architecture</p>
        </div>
      </footer>
    </div>
  );
}
