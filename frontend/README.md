## Frontend (React + Vite + Tailwind)

This is the frontend for the AI Travel Companion project. It connects to the backend APIs exposed by your Node.js + Express server.

### Features

- Responsive UI with TailwindCSS
- Navigation for Restaurants, Hotels, Transport, Itineraries
- List and Card components for items
- Read/Write (CRUD) using the backend:
  - Restaurants: `/api/restaurants`
  - Hotels: `/api/hotels`
  - Transport: `/api/transport`
  - Itineraries: `/api/itinerary`
- Loading and error states

### Setup

1. Create a `.env` file in this folder and set the backend URL:

```
VITE_API_BASE=http://localhost:3000
```

2. Install dependencies:

```
npm install
```

3. Run the dev server:

```
npm run dev
```

Open the app at the printed URL (usually `http://localhost:5173`). Requests to `/api/*` are proxied to `VITE_API_BASE` during development.

### Build

```
npm run build
npm run preview
```

### Deploy

- Vercel or Netlify: Set an environment variable `VITE_API_BASE` to your deployed backend URL. Build command: `npm run build`. Publish directory: `dist`.


