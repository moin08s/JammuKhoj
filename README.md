# JammuKhoj (जम्मू खोज) 🏔️🛕

> **Explore Jammu. Travel with confidence.**
>
> An Apple-inspired, offline-first smart tourism and pilgrim safety companion for Jammu Division, including visitors traveling to and from the Vaishno Devi pilgrimage.

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![PWA](https://img.shields.io/badge/PWA-Ready-green.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![License](https://img.shields.io/badge/License-MIT-orange.svg)](LICENSE)

---

## 🌟 Highlights & Key Features

### ⏱️ Time-Based Circuit Planner
- **4-Hour City Layover Circuit:** Tailored for transit passengers waiting at Jammu Tawi Railway Station or Jammu Airport.
- **8-Hour Regional Heritage Circuit:** Balanced itineraries covering historic Dogra forts, royal museums, and riverside shrines.
- **24-Hour Alpine & Pilgrimage Circuit:** Extended circuits exploring Patnitop, Bhaderwah valley, and Katra.
- **Strict Return Safety Buffer:** Automatically reserves 45-min rail buffer or 150-min flight buffer to ensure travelers never miss departures.

### 🗺️ Interactive Maps & 100% Offline Resilience
- **Vector MapLibre Engine:** Fast, interactive map preview and full-screen GIS navigation.
- **Client-Side Storage:** Built with **Dexie (IndexedDB)** and service-worker precaching. All 36+ attractions, emergency contacts, nodes, and transport fares work without active internet.

### 🏷️ Certified Regional GI-Tagged Items Hub
- Dedicated showcase of authentic Geographical Indications (GI) of the Jammu region:
  - **Basohli Paintings** *(Kathua, GI Application No. 732)*
  - **Basohli Pashmina** *(Kathua, GI Application No. 733)*
  - **Bhaderwah Rajmash** *(Doda/Bhaderwah, GI Application No. 734)*
  - **Ramban Sulai Honey** *(Ramban, GI Application No. 735)*
  - **Ramban Anardana** *(Ramban, GI Application No. 736)*
  - **Rajouri Chikri Woodcraft** *(Rajouri, GI Application No. 737)*
  - **Kishtwar Saffron** *(Kishtwar, GI Application No. 738)*
  - **Udhampur Kalari (Dogra Cheese)**
- Includes price benchmarks, scientific authenticity tests (water release, burn tests), and verified purchasing locations (Poshish J&K Handloom, Raghunath Bazaar, Katra Shrine Board).

### 🗣️ Trilingual Parity
- Full localization in **English**, **Hindi (हिन्दी)**, and native **Dogri (डोगरी)**.

### 🛡️ Pilgrim Safety & Fair-Fare Protection
- Direct 1-tap integration with National ERSS **112**.
- Government-referenced auto, taxi, and e-rickshaw fare benchmarks to protect travelers from touts and overcharging.
- Audio guide chronicles for Dogra heritage sites.

### ♿ Accessibility & Apple-Inspired Design
- Apple Human Interface Guidelines aesthetic: fluid cards, responsive press physics, restrained translucency.
- Senior Pilgrim mode with enlarged buttons (≥50px touch targets).
- WCAG 2.1 AA High-Contrast Mode and dynamic font scaling.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **State Management:** Zustand with custom rehydration & session gating
- **Offline Storage:** Dexie.js (IndexedDB wrapper)
- **Map Provider:** MapLibre GL
- **Routing:** React Router v6
- **Icons:** Lucide React & custom transit SVG icons
- **Build Tool:** Vite with `vite-plugin-pwa`

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/moin08s/JammuKhoj.git

# 2. Enter directory
cd JammuKhoj

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
```

Visit `http://localhost:5173/` in your browser.

---

## 🧪 Testing & Verification

Run the comprehensive 27-point automated verification suite:

```bash
# Execute dataset, planner, i18n, security, and design-token test suite
npx tsx scripts/high_level_test.ts

# Production build check
npm run build
```

---

## 📄 License

This project is licensed under the MIT License.
