import express from 'express';
import { Category, Entrepreneur, ServiceRequest, Order, PendingApproval, Review } from '../models/Schemas.js';
import { getFallbackStatus } from '../config/db.js';
import { memDB } from '../seed.js';

const router = express.Router();

// GET /api/categories
router.get('/categories', async (req, res) => {
  try {
    if (getFallbackStatus()) return res.json(memDB.categories);
    const categories = await Category.find({});
    res.json(categories.length > 0 ? categories : memDB.categories);
  } catch (e) {
    res.json(memDB.categories);
  }
});

// GET /api/entrepreneurs
router.get('/entrepreneurs', async (req, res) => {
  try {
    const { category, search, location } = req.query;
    let list = getFallbackStatus() ? memDB.entrepreneurs : await Entrepreneur.find({});
    if (!list || list.length === 0) list = memDB.entrepreneurs;

    if (category && category !== 'all') {
      list = list.filter(e => e.category === category);
    }
    if (location && location !== 'all') {
      list = list.filter(e => e.location.includes(location));
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.categoryName.toLowerCase().includes(q) ||
        e.bio.toLowerCase().includes(q)
      );
    }

    res.json(list);
  } catch (e) {
    res.json(memDB.entrepreneurs);
  }
});

// GET /api/entrepreneurs/:id
router.get('/entrepreneurs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let ent = getFallbackStatus() ? memDB.entrepreneurs.find(e => e.id === id) : await Entrepreneur.findOne({ id });
    if (!ent) ent = memDB.entrepreneurs.find(e => e.id === id);
    if (!ent) return res.status(404).json({ error: "Entrepreneur not found" });

    let reviews = getFallbackStatus() ? memDB.reviews.filter(r => r.entrepreneurId === id) : await Review.find({ entrepreneurId: id });
    if (!reviews) reviews = memDB.reviews.filter(r => r.entrepreneurId === id);

    res.json({ ...ent.toObject ? ent.toObject() : ent, reviews });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/entrepreneurs/:id/availability
router.put('/entrepreneurs/:id/availability', async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    const memEnt = memDB.entrepreneurs.find(e => e.id === id);
    if (memEnt) memEnt.isAvailable = isAvailable;

    if (!getFallbackStatus()) {
      await Entrepreneur.updateOne({ id }, { $set: { isAvailable } });
    }

    res.json({ success: true, isAvailable });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/entrepreneurs/:id/products
router.post('/entrepreneurs/:id/products', async (req, res) => {
  try {
    const { id } = req.params;
    const newProd = { id: "prd_" + Date.now(), ...req.body };

    const memEnt = memDB.entrepreneurs.find(e => e.id === id);
    if (memEnt) {
      if (!memEnt.products) memEnt.products = [];
      memEnt.products.unshift(newProd);
    }

    if (!getFallbackStatus()) {
      await Entrepreneur.updateOne({ id }, { $push: { products: { $each: [newProd], $position: 0 } } });
    }

    res.json({ success: true, product: newProd });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/entrepreneurs/:id/services
router.post('/entrepreneurs/:id/services', async (req, res) => {
  try {
    const { id } = req.params;
    const newSrv = { id: "srv_" + Date.now(), ...req.body };

    const memEnt = memDB.entrepreneurs.find(e => e.id === id);
    if (memEnt) {
      if (!memEnt.services) memEnt.services = [];
      memEnt.services.unshift(newSrv);
    }

    if (!getFallbackStatus()) {
      await Entrepreneur.updateOne({ id }, { $push: { services: { $each: [newSrv], $position: 0 } } });
    }

    res.json({ success: true, service: newSrv });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/service-requests
router.get('/service-requests', async (req, res) => {
  try {
    const list = getFallbackStatus() ? memDB.serviceRequests : await ServiceRequest.find({});
    res.json(list || memDB.serviceRequests);
  } catch (e) {
    res.json(memDB.serviceRequests);
  }
});

// POST /api/service-requests
router.post('/service-requests', async (req, res) => {
  try {
    const newReq = {
      id: "req_" + Date.now(),
      dateRequested: new Date().toISOString().split('T')[0],
      status: "Pending",
      estimatedPrice: "Quote Pending",
      ...req.body
    };

    memDB.serviceRequests.unshift(newReq);

    if (!getFallbackStatus()) {
      await ServiceRequest.create(newReq);
    }

    res.json({ success: true, request: newReq });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/service-requests/:id/status
router.put('/service-requests/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const reqItem = memDB.serviceRequests.find(r => r.id === id);
    if (reqItem) {
      reqItem.status = status;
      if (status === 'Completed') {
        const ent = memDB.entrepreneurs.find(e => e.id === reqItem.entrepreneurId);
        if (ent) ent.earnings += 850;
      }
    }

    if (!getFallbackStatus()) {
      await ServiceRequest.updateOne({ id }, { $set: { status } });
    }

    res.json({ success: true, status });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/orders
router.post('/orders', async (req, res) => {
  try {
    const newOrder = {
      id: "ord_" + Date.now(),
      datePlaced: new Date().toISOString().split('T')[0],
      status: "Confirmed",
      paymentMethod: "Cash on Delivery",
      ...req.body
    };

    memDB.orders.unshift(newOrder);

    if (!getFallbackStatus()) {
      await Order.create(newOrder);
    }

    res.json({ success: true, order: newOrder });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/admin/stats
router.get('/admin/stats', async (req, res) => {
  try {
    const ents = getFallbackStatus() ? memDB.entrepreneurs : await Entrepreneur.find({});
    const reqs = getFallbackStatus() ? memDB.serviceRequests : await ServiceRequest.find({});
    const totalEnts = ents.length;
    const verifiedEnts = ents.filter(e => e.verified).length;
    const totalReqs = reqs.length;
    const gmv = ents.reduce((sum, e) => sum + (e.earnings || 0), 0);

    res.json({ totalEnts, verifiedEnts, totalReqs, gmv });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/admin/approvals
router.get('/admin/approvals', async (req, res) => {
  try {
    const list = getFallbackStatus() ? memDB.pendingApprovals : await PendingApproval.find({});
    res.json(list || memDB.pendingApprovals);
  } catch (e) {
    res.json(memDB.pendingApprovals);
  }
});

// POST /api/admin/approvals/:id/approve
router.post('/admin/approvals/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const appIndex = memDB.pendingApprovals.findIndex(a => a.id === id);
    if (appIndex !== -1) {
      const app = memDB.pendingApprovals[appIndex];
      const newEnt = {
        id: "ent_" + Date.now(),
        name: app.name,
        category: app.category,
        categoryName: app.categoryName,
        badge: "Verified Artisan",
        verified: true,
        rating: 5.0,
        reviewCount: 1,
        location: app.location,
        phone: app.phone,
        experience: app.experience,
        bio: `${app.skills}. Recently verified micro-entrepreneur on HunarHub.`,
        image: "/assets/artisan_potter.jpg",
        isAvailable: true,
        earnings: 0,
        completedOrders: 0,
        services: [{ id: "srv_new_1", title: "General Custom Service Request", priceRange: "₹200 - ₹1,000", completionDays: 2, description: "Direct service customized per request." }],
        products: []
      };

      memDB.entrepreneurs.push(newEnt);
      memDB.pendingApprovals.splice(appIndex, 1);

      if (!getFallbackStatus()) {
        await Entrepreneur.create(newEnt);
        await PendingApproval.deleteOne({ id });
      }

      return res.json({ success: true, entrepreneur: newEnt });
    }
    res.status(404).json({ error: "Application not found" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/admin/approvals/:id
router.delete('/admin/approvals/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const appIndex = memDB.pendingApprovals.findIndex(a => a.id === id);
    if (appIndex !== -1) {
      memDB.pendingApprovals.splice(appIndex, 1);
    }
    if (!getFallbackStatus()) {
      await PendingApproval.deleteOne({ id });
    }
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/admin/categories
router.post('/admin/categories', async (req, res) => {
  try {
    const newCat = req.body;
    memDB.categories.push(newCat);
    if (!getFallbackStatus()) {
      await Category.create(newCat);
    }
    res.json({ success: true, category: newCat });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
