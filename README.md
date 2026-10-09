# The Gharelu Hub 🍽️✨

> *Experience the Food. Discover the Story.*

A modern, cinematic web application for **The Gharelu Hub** — crafted for an immersive dining, online ordering, and table reservation experience across Bengaluru and beyond.

---

## 🌟 Overview

**The Gharelu Hub** blends culinary craftsmanship with a luxury digital experience. Built as a high-performance, mobile-first web app, it delivers seamless navigation, rich food storytelling, intelligent search, personalized ordering, and real-time order tracking.

---

## ✨ Features

- **🎬 Cinematic Experience**: Immersive dark luxury aesthetic with bespoke typography, smooth transitions, and tactile animations.
- **📖 Curated Menu & Craving Rails**: Browse handcrafted dishes categorized by cuisines, dietary preferences (Vegetarian / Non-Vegetarian), spice tolerance, and cravings (Comfort Food, Grilled, Spicy, Chef's Specials).
- **🛒 Dynamic Ordering & Cart Drawer**: Seamlessly customize items, select preparation preferences, and manage cart with instant price recalculations.
- **💳 Multi-step Checkout Flow**: Address management, delivery instructions, payment method selection, and coupon application.
- **📍 Real-time Order Tracking**: Visual step-by-step progress tracker for active orders from preparation to doorstep delivery.
- **🍷 Table Reservations**: Reserve dining tables with date/time pickers, guest counters, special requests, and venue selection.
- **🎁 Loyalty & Exclusive Offers**: Member tiers, rewards points system, and coupon redemption.
- **🔍 Intent-based Smart Search**: Fast search with keyword matching, filter pills, and quick suggestions.
- **🌐 Offline Awareness**: Automatic detection and notifications for network connectivity status.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 7](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + PostCSS + Custom Typography
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 📁 Project Structure

```text
The Gharelu Hub/
├── public/                 # Static assets, fonts, icons, and dish imagery
├── src/
│   ├── assets/             # Images and local media
│   ├── data/               # Menu datasets, content definitions, locations
│   ├── lib/                # Utility helpers
│   ├── screens/            # Application views
│   │   ├── CartSheet.tsx   # Slide-out interactive cart drawer
│   │   ├── Checkout.tsx    # Checkout and payment flow
│   │   ├── DishDetail.tsx  # Detailed dish presentation & customization
│   │   ├── Home.tsx        # Hero spotlight, rails, and quick actions
│   │   ├── LocationPick.tsx# Outlet and venue selection
│   │   ├── Loyalty.tsx     # Rewards and points program
│   │   ├── MenuScreen.tsx  # Full categorized food menu
│   │   ├── Offers.tsx      # Active promotions and deals
│   │   ├── Orders.tsx      # Order history & previous bills
│   │   ├── Profile.tsx     # User profile and preferences
│   │   ├── Reservations.tsx# Active bookings & table management
│   │   ├── ReserveFlow.tsx # Table reservation flow
│   │   ├── Search.tsx      # Smart search and filtering
│   │   ├── Splash.tsx      # Initial brand experience
│   │   └── TrackOrder.tsx  # Live order tracking screen
│   ├── styles/             # Global CSS and custom font styles
│   ├── App.tsx             # App shell and view controller
│   ├── BottomNav.tsx       # Persistent navigation bar
│   ├── store.ts            # Zustand global state store
│   └── main.tsx            # Application entrypoint
├── tools/                  # Asset management and smoke testing scripts
├── tailwind.config.js      # Custom theme colors and layout extensions
├── vite.config.ts          # Vite build configuration
└── package.json            # Project dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pawankumar-hue/Gharelu-App.git
   cd Gharelu-App
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

## 📦 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server |
| `npm run build` | Runs TypeScript checks and creates production build in `dist/` |
| `npm run preview` | Previews the production build locally |
| `npm run typecheck` | Type-checks code using the TypeScript compiler (`tsc`) |
| `npm run smoke` | Runs smoke tests on client endpoints |

---

## 📄 License

Private repository. All rights reserved by **The Gharelu Hub**.
