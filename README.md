# HunarHub – Digital Marketplace for Local Micro-Entrepreneurs

> **Empowering local micro-entrepreneurs (potters, cobblers, tailors, weavers, artisans, small vendors) with direct digital discovery, service booking, and zero-commission handmade craft selling.**

---

## 🌟 Overview & Problem Statement

Millions of local micro-entrepreneurs possess valuable skills (such as clay pottery, handmade leatherwork, traditional stitching, loom weaving, wood carving) but lack digital visibility and access to customers beyond immediate foot traffic. 

**HunarHub** bridges this digital divide by providing a responsive, mobile-first marketplace platform where:
- **Customers** can easily discover local talent by skill, category, or location, book custom service requests, buy handmade craft items directly, and leave ratings/feedback.
- **Micro-Entrepreneurs** have a simple, intuitive dashboard to manage work availability, process service requests, list handcrafted products/services, and track earnings without middlemen commission.
- **Platform Admins** can verify artisan identity credentials, manage skill taxonomies, audit orders/requests, and monitor economic impact.

---

## 🚀 Key Features

### 🛍️ 1. Customer Marketplace (`index.html`)
- **Category & Location Search**: Search by skill type, city (Varanasi, Jaipur, Kolhapur, Saharanpur), or product keywords.
- **Category Navigation**: Filter by *Potter (Kumhar)*, *Cobbler (Mochi)*, *Tailor (Darzi)*, *Artisan (Shilpkar)*, *Weaver (Bunkar)*, and *Small Vendor*.
- **Artisan Profile & Services Modal**: View bio, experience, location, verified badges, available services, and customer reviews.
- **Custom Service Requests**: Book service requests with preferred date, location, and detailed work instructions.
- **Handcrafted Product Marketplace**: Slide-out shopping cart drawer with live quantity adjustments, subtotal calculation, and instant checkout.

### 💼 2. Micro-Entrepreneur Portal (`entrepreneur.html`)
- **Multi-Artisan Identity Switcher**: Seamlessly switch between onboarded artisans (e.g. Ramcharan Kumhar, Meena Devi, Ramesh Cobbler) to test individual dashboards.
- **Work Availability Toggle**: Instantly switch between `🟢 Accepting Requests` and `🔴 Currently Unavailable`.
- **Service Request Management**: Accept, reject, or mark custom customer requests as **Completed** (updating earnings automatically).
- **Product & Service Catalog Manager**: Add new handcrafted products or service offerings with real-time `localStorage` persistence.
- **Income Summary**: Track total earnings, completed jobs, saved commission, and customer reviews.

### 🛡️ 3. Admin Governance Dashboard (`admin.html`)
- **Platform Analytics**: Total registered artisans, verified master artisans count, service requests booked, and total platform GMV.
- **Verification Queue**: Review identity proof documents and approve/reject newly applied micro-entrepreneurs.
- **Taxonomy & Category Manager**: Add new skill categories and update platform descriptions.
- **Orders Supervision**: Audit platform-wide service requests and purchase orders.
- **Database Reset Action**: One-click button to reset local state back to initial seed data for testing.

---

## 🛠️ Technology Stack & Architecture

- **Frontend**: Pure HTML5, Modern CSS3 (CSS Variables, Flexbox/Grid, Glassmorphic overlays), Vanilla JavaScript (ES6+).
- **Styling & UI**: Bootstrap 5.3 + Bootstrap Icons + Custom HunarHub CSS Design System.
- **State Management**: Zero-dependency browser `localStorage` engine pre-seeded with realistic data (`js/data.js` & `js/app.js`).
- **Dependencies**: None! Runs natively in any web browser without Node.js build steps or npm installations.

---

## 📦 How to Deploy (Netlify, Vercel, GitHub Pages)

Because HunarHub is built using standard deployable static files (`.html`, `.css`, `.js`, `assets/`), you can deploy it in 1 minute to any static hosting service for free!

### Option A: Deploy to Netlify
1. Drag and drop the project folder directly into [Netlify Drop](https://app.netlify.com/drop).
2. Netlify will instantly publish your site and give you a live shareable URL!

### Option B: Deploy to Vercel
1. Install Vercel CLI or link your GitHub repository to [Vercel](https://vercel.com).
2. Run `vercel` in the project root folder.
3. Select default settings (Static Site). Your app will be live immediately!

### Option C: Deploy to GitHub Pages
1. Push this workspace folder to a GitHub repository.
2. Go to **Settings** > **Pages** in your repository.
3. Select `main` branch and `/ (root)` folder, then click **Save**.
4. Your site will be published at `https://yourusername.github.io/repository-name`.

---

## 📁 File Structure

```
HunarHub/
├── index.html          # Customer Marketplace & Discovery Hub
├── entrepreneur.html   # Micro-Entrepreneur Dashboard & Catalog Manager
├── admin.html          # Admin Verification & Platform Analytics
├── css/
│   └── styles.css      # Unified design system & responsive layout styles
├── js/
│   ├── data.js         # Pre-seeded mock database (Artisans, Products, Services)
│   └── app.js          # LocalStorage state engine, Cart, Modals & Toast notifications
├── assets/             # High quality photography for artisans, products, hero banner
│   ├── hero_banner.jpg
│   ├── artisan_potter.jpg
│   ├── artisan_tailor.jpg
│   ├── product_pottery.jpg
│   └── product_leather.jpg
└── README.md           # Project documentation & deployment guide
```

---

## 🎨 Design System Palette

- **Terracotta**: `#C85A32` (Primary Brand Warm Accent)
- **Indigo**: `#1A2B4C` (Secondary Dark Elegance)
- **Gold / Ochre**: `#D97706` (Rating & Star Highlight)
- **Emerald**: `#059669` (Verified Badges & Earnings)
- **Sand**: `#FAF7F2` (Clean Background)

---

## 👥 Credits & Impact

HunarHub was created to digitally empower local artisans, promote sustainable craft heritage, and foster community economic growth.
