import { Category, Entrepreneur, ServiceRequest, Order, PendingApproval, Review } from './models/Schemas.js';

export const SEED_DATA = {
  categories: [
    { id: "all", name: "All Categories", icon: "bi-grid-fill" },
    { id: "potter", name: "Potter (Kumhar)", icon: "bi-flower1", desc: "Terracotta, earthen pots, clay diyas & ceramics" },
    { id: "cobbler", name: "Cobbler (Mochi)", icon: "bi-shield-check", desc: "Shoe repair, leather footwear, custom boots" },
    { id: "tailor", name: "Tailor (Darzi)", icon: "bi-scissors", desc: "Custom stitching, alterations, ethnic embroidery" },
    { id: "artisan", name: "Artisan (Shilpkar)", icon: "bi-palette", desc: "Handicrafts, wood carving, brass art, painting" },
    { id: "weaver", name: "Weaver (Bunkar)", icon: "bi-border-all", desc: "Handloom silk sarees, dupattas & woolens" },
    { id: "vendor", name: "Small Vendor", icon: "bi-shop", desc: "Local flower decorators, knife sharpeners & utility vendors" }
  ],

  entrepreneurs: [
    {
      id: "ent_101",
      name: "Ramcharan Kumhar",
      category: "potter",
      categoryName: "Potter (Kumhar)",
      badge: "Verified Master Artisan",
      verified: true,
      rating: 4.9,
      reviewCount: 42,
      location: "Varanasi, UP",
      phone: "+91 98234 11092",
      experience: "28 Years",
      bio: "3rd generation traditional clay artisan specializing in organic clay cookware, hand-painted terracotta vases, designer cooling matkas, and festival diyas.",
      image: "/assets/artisan_potter.jpg",
      isAvailable: true,
      earnings: 34800,
      completedOrders: 56,
      services: [
        { id: "srv_101_1", title: "Custom Hand-painted Terracotta Pot Making", priceRange: "₹350 - ₹1,200", completionDays: 3, description: "Personalized clay pots crafted with traditional peacock and floral art." },
        { id: "srv_101_2", title: "Bulk Festival Diya & Matka Supply", priceRange: "₹500 - ₹5,000", completionDays: 5, description: "Eco-friendly natural clay diyas and decorative matkas for celebrations." }
      ],
      products: [
        { id: "prd_101_1", title: "Peacock Motif Painted Terracotta Vase", price: 650, stock: 12, image: "/assets/product_pottery.jpg", description: "Handcrafted earthen clay vase painted with vibrant organic colors and peacock motifs." },
        { id: "prd_101_2", title: "Natural Clay Water Matka with Tap", price: 480, stock: 8, image: "/assets/product_pottery.jpg", description: "Traditional clay water cooler that naturally keeps drinking water cold and fresh." }
      ]
    },
    {
      id: "ent_102",
      name: "Meena Devi & Daughters",
      category: "tailor",
      categoryName: "Tailor (Darzi)",
      badge: "Top Rated Stitching",
      verified: true,
      rating: 4.8,
      reviewCount: 35,
      location: "Jaipur, RJ",
      phone: "+91 94140 88219",
      experience: "16 Years",
      bio: "Expert women tailors group specializing in Chikankari embroidery, designer bridal blouse stitching, custom suit fitting, and garment alterations.",
      image: "/assets/artisan_tailor.jpg",
      isAvailable: true,
      earnings: 42100,
      completedOrders: 78,
      services: [
        { id: "srv_102_1", title: "Designer Blouse & Salwar Suit Stitching", priceRange: "₹400 - ₹1,500", completionDays: 2, description: "Precision fitting according to custom measurements with lining and padding." },
        { id: "srv_102_2", title: "Doorstep Express Garment Alterations", priceRange: "₹100 - ₹350", completionDays: 1, description: "Pants hemming, waist tightening, zip replacement, and sleeve adjustment." }
      ],
      products: [
        { id: "prd_102_1", title: "Hand-Embroidered Cotton Chikankari Kurti", price: 1250, stock: 6, image: "/assets/artisan_tailor.jpg", description: "Pure breathable cotton Kurti featuring delicate hand embroidery by local women artisans." }
      ]
    },
    {
      id: "ent_103",
      name: "Ramesh Cobbler & Sons",
      category: "cobbler",
      categoryName: "Cobbler (Mochi)",
      badge: "Verified Craftsperson",
      verified: true,
      rating: 4.9,
      reviewCount: 29,
      location: "Kolhapur, MH",
      phone: "+91 91580 44321",
      experience: "32 Years",
      bio: "Authentic Kolhapuri leather shoes and footwear specialist. Expert in sole stitching, orthopedic shoe modifications, and leather restoration.",
      image: "/assets/product_leather.jpg",
      isAvailable: true,
      earnings: 28900,
      completedOrders: 44,
      services: [
        { id: "srv_103_1", title: "Leather Footwear Restoration & Sole Resoling", priceRange: "₹200 - ₹600", completionDays: 1, description: "Deep leather cleaning, stitching repair, anti-slip rubber sole replacement." },
        { id: "srv_103_2", title: "Custom Orthopedic Leather Insole Fitting", priceRange: "₹300 - ₹800", completionDays: 2, description: "Tailored comfortable arches for formal shoes and leather boots." }
      ],
      products: [
        { id: "prd_103_1", title: "Handcrafted Pure Leather Kolhapuri Chappals", price: 890, stock: 15, image: "/assets/product_leather.jpg", description: "100% genuine vegetable-tanned leather footwear with traditional braided straps." }
      ]
    },
    {
      id: "ent_104",
      name: "Anand Loom Weavers",
      category: "weaver",
      categoryName: "Weaver (Bunkar)",
      badge: "National Heritage Awardee",
      verified: true,
      rating: 5.0,
      reviewCount: 51,
      location: "Varanasi, UP",
      phone: "+91 97921 55640",
      experience: "35 Years",
      bio: "Master weaver of authentic Banarasi silk dupattas, sarees, and stoles on traditional wooden pit looms without industrial machinery.",
      image: "/assets/hero_banner.jpg",
      isAvailable: true,
      earnings: 68400,
      completedOrders: 92,
      services: [
        { id: "srv_104_1", title: "Custom Loom Weaving for Bridal Sarees", priceRange: "₹3,500 - ₹15,000", completionDays: 14, description: "Personalized silk sari woven with custom zari name initials or specific motifs." }
      ],
      products: [
        { id: "prd_104_1", title: "Banarasi Pure Handloom Silk Stole", price: 2450, stock: 5, image: "/assets/hero_banner.jpg", description: "Rich gold kadwa zari woven silk stole, soft texture and radiant sheen." }
      ]
    },
    {
      id: "ent_105",
      name: "Shriniwas Woodcarvings",
      category: "artisan",
      categoryName: "Artisan (Shilpkar)",
      badge: "Verified Craftsperson",
      verified: true,
      rating: 4.7,
      reviewCount: 19,
      location: "Saharanpur, UP",
      phone: "+91 98371 00293",
      experience: "20 Years",
      bio: "Sheesham woodcarver crafting traditional Rajasthani royal elephants, carved wall panels, wooden partition screens, and wooden kitchenware.",
      image: "/assets/product_pottery.jpg",
      isAvailable: false,
      earnings: 19500,
      completedOrders: 23,
      services: [
        { id: "srv_105_1", title: "Custom Wooden Furniture Carving Repair", priceRange: "₹800 - ₹3,000", completionDays: 4, description: "Restoration of antique wooden frames, vintage doors, and carved chair legs." }
      ],
      products: [
        { id: "prd_105_1", title: "Hand-Carved Wooden Royal Elephant Figurine", price: 1100, stock: 4, image: "/assets/product_pottery.jpg", description: "Solid rosewood elephant detailed with hand carving and natural beeswax finish." }
      ]
    }
  ],

  serviceRequests: [
    {
      id: "req_901",
      customerName: "Suresh Gupta",
      customerPhone: "+91 98112 34567",
      customerAddress: "Flat 402, Civil Lines, Varanasi",
      entrepreneurId: "ent_101",
      entrepreneurName: "Ramcharan Kumhar",
      serviceTitle: "Custom Hand-painted Terracotta Pot Making",
      dateRequested: "2026-09-05",
      preferredDate: "2026-09-10",
      details: "Need 4 large terracotta planters painted with peacock and mandala artwork for patio.",
      status: "Accepted",
      estimatedPrice: "₹1,800"
    },
    {
      id: "req_902",
      customerName: "Priya Sharma",
      customerPhone: "+91 99201 98765",
      customerAddress: "Sector 14, Mansarovar, Jaipur",
      entrepreneurId: "ent_102",
      entrepreneurName: "Meena Devi & Daughters",
      serviceTitle: "Designer Blouse & Salwar Suit Stitching",
      dateRequested: "2026-09-06",
      preferredDate: "2026-09-09",
      details: "Silk blouse stitching with boat neck design and dori tie back for wedding function.",
      status: "Pending",
      estimatedPrice: "₹850"
    }
  ],

  orders: [
    {
      id: "ord_501",
      customerName: "Amit Verma",
      customerPhone: "+91 97110 54321",
      deliveryAddress: "C-12 Model Town, Delhi",
      items: [
        { title: "Peacock Motif Painted Terracotta Vase", price: 650, quantity: 2 },
        { title: "Handcrafted Pure Leather Kolhapuri Chappals", price: 890, quantity: 1 }
      ],
      totalAmount: 2190,
      paymentMethod: "Cash on Delivery",
      status: "Delivered",
      datePlaced: "2026-09-04"
    }
  ],

  pendingApprovals: [
    {
      id: "app_701",
      name: "Babu Lal Vendor",
      category: "vendor",
      categoryName: "Small Vendor",
      location: "Lucknow, UP",
      phone: "+91 93350 12890",
      skills: "Traditional Brass Sharpening & Mobile Locksmith Services",
      experience: "14 Years",
      appliedDate: "2026-09-06",
      documentProof: "Aadhaar Verified (#XXXX-XXXX-4819)"
    }
  ],

  reviews: [
    {
      id: "rev_301",
      entrepreneurId: "ent_101",
      customerName: "Kavita Rao",
      rating: 5,
      date: "2026-09-02",
      comment: "Ramcharan ji made the most beautiful earthen matka for our home. The water tastes naturally cool and sweet!"
    },
    {
      id: "rev_302",
      entrepreneurId: "ent_103",
      customerName: "Rohan Kulkarni",
      rating: 5,
      date: "2026-09-03",
      comment: "Solid genuine leather Kolhapuris! Ramesh cobbler fixed the fitting perfectly according to my wide foot size."
    }
  ]
};

// In-Memory Store
export const memDB = JSON.parse(JSON.stringify(SEED_DATA));

export const seedDatabase = async () => {
  try {
    await Category.deleteMany({});
    await Entrepreneur.deleteMany({});
    await ServiceRequest.deleteMany({});
    await Order.deleteMany({});
    await PendingApproval.deleteMany({});
    await Review.deleteMany({});

    await Category.insertMany(SEED_DATA.categories);
    await Entrepreneur.insertMany(SEED_DATA.entrepreneurs);
    await ServiceRequest.insertMany(SEED_DATA.serviceRequests);
    await Order.insertMany(SEED_DATA.orders);
    await PendingApproval.insertMany(SEED_DATA.pendingApprovals);
    await Review.insertMany(SEED_DATA.reviews);

    console.log("🌱 Database successfully seeded with HunarHub micro-entrepreneur data!");
  } catch (err) {
    console.log("Using memory fallback store for HunarHub API calls.");
  }
};
