# Cake Away - Full Stack Bakery Application

A modern, full-stack e-commerce bakery application built with Next.js (frontend) and a **secure, persistent native Node.js HTTP server** (backend).

## 🚀 Recent Enhancements

- **🔒 Advanced Security**: Implemented password hashing (SHA-512) and custom JWT-like token authentication.
- **💾 Persistent Data**: All users, cakes, and orders are stored in `db.json`, ensuring data survives server restarts.
- **🔍 Smart Search**: Real-time search functionality from the homepage and catalog.
- **📊 Admin Dashboard**: Dynamic business metrics (Revenue, Orders, Stats) with order status management.
- **📦 Order Tracking**: Customers can track their orders in real-time using their Order ID.
- **✅ Functional Checkout**: Complete end-to-end order placement flow.

## Project Structure

```
cake-away/
├── frontend/          # Next.js React application
│   ├── app/          # Next.js app router
│   ├── components/   # React components (SearchBar, OrderTracker, etc.)
│   └── lib/          # Utilities and dynamic data fetchers
├── backend/          # Native Node.js HTTP API server
│   ├── .env          # Environment configuration
│   ├── db.json       # Persistent JSON database
│   └── server.js     # Main server file (zero dependencies!)
└── README.md
```

## Quick Start

### 1. Backend Setup
```bash
cd backend
# Recommended (Node 20.6+)
node --env-file=.env server.js
# Manual
node server.js
```
The API will be available at `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The App will be available at `http://localhost:3000`.

## API Endpoints

### 🍰 Cakes & Categories
- `GET /api/cakes` - Fetch all cakes
- `GET /api/cakes/search?q=...` - Search cakes
- `GET /api/categories` - Fetch categories

### 📦 Orders & Tracking
- `POST /api/orders` - Place a new order
- `GET /api/orders/:id` - Track order by ID
- `PUT /api/orders/:id` - Update status (Admin)

### 📊 Admin
- `GET /api/admin/stats` - Fetch business metrics

---

## 🛠️ Technology Stack
- **Frontend**: Next.js 14, Tailwind CSS, TypeScript
- **Backend**: Native Node.js (v20+ supported for `.env`)
- **Database**: JSON File Persistence (`fs` module)

Enjoy your freshly baked happiness! 🎂