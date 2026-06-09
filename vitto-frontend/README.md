# Vitto – Loan Portal Frontend

React + Tailwind CSS frontend for the Vitto Loan Application Portal.

## Stack
- **React 18** (Vite)
- **Tailwind CSS v3**
- **Space Grotesk** display font + **Inter** body font

## Setup

```bash
npm install
cp .env.example .env.local     # then set VITE_API_URL to your backend
npm run dev
```

The dev server proxies `/api` to `http://localhost:5000` by default (configurable in `vite.config.js`).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Full URL to your backend API (e.g. `https://your-app.onrender.com/api`) |

## Deployment (Vercel / Netlify)

1. Set `VITE_API_URL` in environment variables on the platform.
2. Build command: `npm run build`
3. Output directory: `dist`

## Structure

```
src/
├── api.js              # All fetch calls to the backend
├── utils.js            # Formatting helpers + style maps
├── App.jsx             # Shell: header, nav, page router, toast
├── index.css           # Tailwind directives + Google Fonts import
├── main.jsx            # React entry point
├── components/
│   ├── StatCard.jsx    # Single stat tile
│   ├── StatusModal.jsx # Modal to approve/reject an application
│   └── Toast.jsx       # Bottom-right notification
└── pages/
    ├── ApplyPage.jsx   # Borrower application form
    └── DashboardPage.jsx # Agent dashboard with table + filters
```

## Pages

- **Apply** — Submit a new loan application. Client-side validation before calling the API. Shows a reference ID on success.
- **Dashboard** — View all applications with status filter + name/mobile search. Stats bar at the top. Agents can approve/reject pending applications inline (no full reload).
