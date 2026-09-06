import mongoose from 'mongoose';

// Category Schema
const CategorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  icon: { type: String, required: true },
  desc: { type: String }
}, { timestamps: true });

// Service Sub-schema
const ServiceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  priceRange: { type: String, required: true },
  completionDays: { type: Number, default: 2 },
  description: { type: String }
});

// Product Sub-schema
const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 10 },
  image: { type: String },
  description: { type: String }
});

// Entrepreneur Schema
const EntrepreneurSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  categoryName: { type: String, required: true },
  badge: { type: String, default: 'Verified Artisan' },
  verified: { type: Boolean, default: true },
  rating: { type: Number, default: 4.9 },
  reviewCount: { type: Number, default: 10 },
  location: { type: String, required: true },
  phone: { type: String, required: true },
  experience: { type: String, required: true },
  bio: { type: String, required: true },
  image: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  earnings: { type: Number, default: 0 },
  completedOrders: { type: Number, default: 0 },
  services: [ServiceSchema],
  products: [ProductSchema]
}, { timestamps: true });

// Service Request Schema
const ServiceRequestSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  entrepreneurId: { type: String, required: true },
  entrepreneurName: { type: String },
  serviceTitle: { type: String, required: true },
  dateRequested: { type: String, required: true },
  preferredDate: { type: String, required: true },
  details: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  estimatedPrice: { type: String, default: 'Quote Pending' }
}, { timestamps: true });

// Order Schema
const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  items: Array,
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'Cash on Delivery' },
  status: { type: String, default: 'Confirmed' },
  datePlaced: { type: String, required: true }
}, { timestamps: true });

// Pending Approval Schema
const PendingApprovalSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  categoryName: { type: String, required: true },
  location: { type: String, required: true },
  phone: { type: String, required: true },
  skills: { type: String, required: true },
  experience: { type: String, required: true },
  appliedDate: { type: String, required: true },
  documentProof: { type: String, required: true }
}, { timestamps: true });

// Review Schema
const ReviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  entrepreneurId: { type: String, required: true },
  customerName: { type: String, required: true },
  rating: { type: Number, required: true },
  date: { type: String, required: true },
  comment: { type: String, required: true }
}, { timestamps: true });

export const Category = mongoose.model('Category', CategorySchema);
export const Entrepreneur = mongoose.model('Entrepreneur', EntrepreneurSchema);
export const ServiceRequest = mongoose.model('ServiceRequest', ServiceRequestSchema);
export const Order = mongoose.model('Order', OrderSchema);
export const PendingApproval = mongoose.model('PendingApproval', PendingApprovalSchema);
export const Review = mongoose.model('Review', ReviewSchema);
