# Vitto — Loan Application Portal

A full-stack loan application portal. Borrowers submit loan applications in their preferred language; agents review and update statuses from a live dashboard.

### 🌐 Live Application
[https://vitto-loan-portal-jad6.vercel.app/](https://vitto-loan-portal-jad6.vercel.app/)

### ⚙️ Backend API
[https://vitto-loan-portal-1nfm.onrender.com](https://vitto-loan-portal-1nfm.onrender.com)

### 🎥 Video Walkthrough
[https://drive.google.com/file/d/1q_i1-wzQgim3fWx5j2dMhzlghR-MKjjz/view?usp=sharing](https://drive.google.com/file/d/1q_i1-wzQgim3fWx5j2dMhzlghR-MKjjz/view?usp=sharing)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 (Vite) + Tailwind CSS |
| Backend | Node.js + Express |
| Database | PostgreSQL (Neon) |
| Hosting | Vercel (frontend) · Render (backend) |

---

## Run Locally 

**You need:** Node.js v18+ and a PostgreSQL database ([Neon](https://neon.tech) )

### Step 1 — Clone

```bash
git clone https://github.com/vai-sys/vitto-Loan-Portal.git
cd vitto-Loan-Portal
```

### Step 2 — Database

```bash
psql connection_string -f backend/migrations/001_init.sql
```

### Step 3 — Backend

```bash
cd backend
npm install
node app.js
```

```env
# backend/.env
DATABASE_URL=neon_db_string
PORT=5000
```

✅ Check it's running: `curl http://localhost:5000/` → `{"message":"API Running","dbTime":"current_timestamp"}`

### Step 4 — Frontend

```bash
cd ../vitto-frontend
npm install
npm run dev
```

```env
# vitto-frontend/.env
VITE_API_URL=http://localhost:5000/api
```

 Open `http://localhost:5173` — you're good to go.

---


---

## Database Schema

```sql
-- migrations/001_init.sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    purpose TEXT NOT NULL,
    language VARCHAR(50) NOT NULL,

    status VARCHAR(20)
    CHECK (status IN ('pending','approved','rejected'))
    DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/applications` | Submit a new application |
| `GET` | `/api/applications` | List all (supports `?status=pending\|approved\|rejected`) |
| `PATCH` | `/api/applications/:id/status` | Update to `approved` or `rejected` |
| `GET` | `/api/summary` | Stats: total apps, total amount, per-status counts |

All errors return `{ success: false, message: "..." }` with the appropriate HTTP status code.

---



## Known Issues

- The free backend spins down after ~15 min of inactivity. First request may take 20–30 seconds; everything after is fast.
- Search functionality is client-side and intended for small datasets.

---

## What I'd Improve with More Time

- JWT auth so only authorised agents can change statuses
- Pagination on the dashboard for large datasets
- SMS/email notification when a borrower's status changes
- Export reports to CSV/PDF
- Audit log table tracking who changed which application and when
