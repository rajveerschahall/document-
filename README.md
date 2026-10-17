# Document Verification & Tamper Detection System (MERN)

A centralized institutional web application for digital admission document verification, applicant management, and fraud/tamper detection.

## 🚀 Key Features
- **Universal Single-Link Access (`http://localhost:5173/`)**: Automatically routes users. If unauthenticated, it presents the login gate. Upon login, it opens the respective Student or Admin dashboard on the same link.
- **Dedicated Administrative Desk**: Complete student roster, document inspection desk with rotation & zoom, REAL vs FAKE marking, fraud reasoning, and tamper audits.
- **Student Workspace**: Multi-step admission form, auto-generated Application ID (`APP-2026-XXXX`), certificate uploads (PDF/Images), status tracking, and tamper-proof digital stamps with QR codes.
- **100% Mobile Responsive**: Touch-optimized inputs, mobile drawer navigation, swipeable tables, and responsive dialogs.
- **Resilient Database Layer**: Automatic fallback to local persistent JSON store if MongoDB is offline.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, QR Code SVG
- **Backend**: Node.js, Express, JWT, Bcrypt, Multer
- **Database**: MongoDB / Resilient JSON Store

## 🏃 Quick Start

### 1. Backend Server
```bash
cd server
npm install
node server.js
```
Runs at `http://localhost:5000`

### 2. Frontend Client
```bash
cd client
npm install
npm run dev
```
Runs at `http://localhost:5173`

## 🔑 Demo Credentials
- **Admin Desk**: `admin@campusverify.edu` / `Admin@123`
- **Student Portal**: `rahul@example.com` / `Student@123`
- **Flagged Demo**: `simran@example.com` / `Student@123`
