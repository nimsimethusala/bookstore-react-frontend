# 📚 Bookstore Frontend

React frontend for the Bookstore Cloud microservice project — ITS 2130 Enterprise Cloud Architecture, IJSE.

## Tech Stack
- React 19 + Vite 8
- Axios

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:5173

## API Gateway URL

Edit `src/api.js` or set the env variable:

```bash
# .env.local
VITE_API_BASE_URL=http://<YOUR-GCP-GATEWAY-IP>:8080
```

Default is `http://localhost:8080`.

## Features

| Tab | Features |
|---|---|
| 📖 Books | Create, list, search, edit, update stock, delete |
| 🛒 Orders | Place order (multi-item), list, filter by email/status, update status, cancel, delete |
| 📁 Files | Upload to GCS, list, filter by category/reference, image preview, delete |
