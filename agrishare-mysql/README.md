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

## 🔐 Demo Login Credentials

| Role   | Email               | Password  |
|--------|---------------------|-----------|
| Admin  | admin@agri.com      | admin123  |
| Owner  | suresh@owner.com    | pass123   |
| Owner  | anita@owner.com     | pass123   |
| Farmer | ravi@farm.com       | pass123   |
| Farmer | meena@farm.com      | pass123   |

---

## 🗄 MySQL Schema

### `users`
| Column     | Type         | Notes                          |
|------------|--------------|--------------------------------|
| id         | INT UNSIGNED | PK, AUTO_INCREMENT             |
| name       | VARCHAR(100) | Required                       |
| email      | VARCHAR(150) | Unique, lowercase              |
| password   | VARCHAR(255) | bcrypt hashed                  |
| role       | ENUM         | farmer / owner / admin         |
| phone      | VARCHAR(15)  | Indian 10-digit                |
| location   | VARCHAR(100) | Indian state                   |
| is_active  | TINYINT(1)   | Default 1                      |
| created_at | DATETIME     |                                |
| updated_at | DATETIME     |                                |

### `equipment`
| Column       | Type          | Notes                        |
|--------------|---------------|------------------------------|
| id           | INT UNSIGNED  | PK, AUTO_INCREMENT           |
| name         | VARCHAR(150)  | Required                     |
| category     | ENUM          | 9 categories                 |
| description  | TEXT          | Required                     |
| specs        | VARCHAR(400)  | Optional                     |
| price_per_day| DECIMAL(10,2) | Required, min 1              |
| location     | VARCHAR(100)  | Required                     |
| available    | TINYINT(1)    | Default 1                    |
| owner_id     | INT UNSIGNED  | FK → users.id                |
| created_at   | DATETIME      |                              |
| updated_at   | DATETIME      |                              |

### `bookings`
| Column           | Type          | Notes                      |
|------------------|---------------|----------------------------|
| id               | INT UNSIGNED  | PK, AUTO_INCREMENT         |
| equipment_id     | INT UNSIGNED  | FK → equipment.id          |
| farmer_id        | INT UNSIGNED  | FK → users.id              |
| owner_id         | INT UNSIGNED  | FK → users.id              |
| start_date       | DATE          | Required                   |
| end_date         | DATE          | Required, >= start_date    |
| total_days       | INT UNSIGNED  | Auto-computed              |
| total_amount     | DECIMAL(12,2) | days × price_per_day       |
| status           | ENUM          | pending/approved/rejected/ |
|                  |               | completed/cancelled        |
| notes            | TEXT          | Farmer's notes             |
| owner_note       | TEXT          | Owner's response note      |
| status_updated_at| DATETIME      | When status changed        |
| created_at       | DATETIME      |                            |
| updated_at       | DATETIME      |                            |

---

## 📡 API Reference

### Auth `/api/auth`
| Method | Route             | Access  | Description          |
|--------|-------------------|---------|----------------------|
| POST   | /register         | Public  | Register new user    |
| POST   | /login            | Public  | Login                |
| GET    | /profile          | Private | Get own profile      |
| PUT    | /profile          | Private | Update profile       |
| PUT    | /change-password  | Private | Change password      |

### Equipment `/api/equipment`
| Method | Route                   | Access       | Description          |
|--------|-------------------------|--------------|----------------------|
| GET    | /                       | Public       | Browse all           |
| GET    | /:id                    | Public       | Single item          |
| GET    | /my                     | Owner        | Own listings         |
| POST   | /                       | Owner        | Create listing       |
| PUT    | /:id                    | Owner/Admin  | Update               |
| DELETE | /:id                    | Owner/Admin  | Delete               |
| PATCH  | /:id/availability       | Owner        | Toggle availability  |

### Bookings `/api/bookings`
| Method | Route             | Access       | Description           |
|--------|-------------------|--------------|-----------------------|
| POST   | /                 | Farmer       | Create request        |
| GET    | /my               | Farmer       | Own bookings          |
| GET    | /owner            | Owner        | Incoming requests     |
| GET    | /:id              | Farmer/Owner | Booking detail        |
| PATCH  | /:id/status       | Owner/Admin  | Approve / Reject      |
| PATCH  | /:id/cancel       | Farmer       | Cancel booking        |
| PATCH  | /:id/complete     | Owner/Admin  | Mark completed        |

### Admin `/api/admin`
| Method | Route                   | Access | Description           |
|--------|-------------------------|--------|-----------------------|
| GET    | /stats                  | Admin  | Platform stats        |
| GET    | /users                  | Admin  | All users             |
| GET    | /users/:id              | Admin  | User detail           |
| DELETE | /users/:id              | Admin  | Delete user           |
| PATCH  | /users/:id/toggle       | Admin  | Toggle active status  |
| GET    | /bookings               | Admin  | All bookings          |
| DELETE | /equipment/:id          | Admin  | Remove equipment      |

---

## 🛠 Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, React Router v6, Axios, Vite  |
| Backend   | Node.js, Express                        |
| Database  | MySQL 8.0                               |
| ORM       | Sequelize v6                            |
| Auth      | JWT (jsonwebtoken) + bcryptjs           |
| Security  | helmet, cors, express-rate-limit        |
| Dev       | nodemon, morgan                         |

---

## 🔧 Useful Commands

```bash
# Create DB + tables
npm run migrate

# Seed demo data
npm run seed

# Destroy all data
node seeds/seedData.js --destroy

# Start dev server
npm run dev

# Start production
npm start
```
