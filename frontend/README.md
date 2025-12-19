# Chef Academy Frontend

Vite + React app structured as requested.

## Quick Start (Windows PowerShell)

```powershell
cd "d:\GITHUB\chef-academy-web\frontend"
npm install
cp .env.example .env  # or create .env and set VITE_API_BASE_URL
npm run dev
```

Open the printed URL (default http://localhost:5173).

## API Base URL
- Configure `VITE_API_BASE_URL` (default `http://localhost:5000`).
- Backend must enable CORS.

## Key Routes
- `/` Home
- `/recipes` Recipes list
- `/booking` Booking demo
- `/register` User registration form

## Structure
- `src/components/common` Navbar, Footer, Loader
- `src/components/recipes` RecipeCard, RecipeList
- `src/components/bookings` BookingForm
- `src/pages` Home, About, Recipes, Booking, Contact, AdminDashboard, Register
- `src/services` axios `api.js`, `authService.js`, `recipeService.js`
- `src/context` AuthContext
- `src/hooks` useAuth
- `src/routes` AppRoutes
- `src/styles` main.css
