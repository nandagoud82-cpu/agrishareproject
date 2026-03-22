# 🌾 AgriShare — Farm Equipment Rental Platform (MySQL Edition)

A full-stack web application connecting **farmers** with **equipment owners** across India.  
Built with **React + Vite** (frontend) and **Node.js + Express + MySQL + Sequelize** (backend).

---

## 🗂 Project Structure

```
agrishare-mysql/
├── client/          # React + Vite frontend
└── server/          # Node.js + Express + MySQL backend
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- MySQL 8.0+ (local) or any MySQL-compatible host

### 1. Clone & Install

```bash
# Backend
cd agrishare-mysql/server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure Environment

**server/.env**
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=agrishare
DB_USER=root
DB_PASSWORD=your_mysql_password

JWT_SECRET=your_super_secret_key
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

**client/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Create Database & Tables

```bash
cd server
npm run migrate      # creates DB + all tables via raw SQL
```

### 4. Seed Demo Data

```bash
npm run seed         # inserts demo users, equipment, bookings
```

### 5. Start Both Servers

```bash
# Terminal 1 — Backend (port 5000)
cd server
npm run dev

# Terminal 2 — Frontend (port 3000)
cd client
npm run dev
```

Open **http://localhost:3000** in your browser.

---


