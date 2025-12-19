# Chef Academy Backend

## User Model
Implements a `User` with fields: `name`, `email`, `password`, `status`.
- Email is unique, lowercased, and validated.
- Password is hashed with bcrypt on save.
- Status is one of `active` or `inactive`.
- Includes `comparePassword(candidate)` and `findByEmail(email)` helpers.

## Quick Start (Windows PowerShell)

1. Set your MongoDB connection string:
   - Copy `.env.example` to `.env` and update `MONGODB_URI`.

2. Install dependencies:

```powershell
cd "d:\GITHUB\chef-academy-web\backend"
npm install
```

3. Run the model test script:

```powershell
cd "d:\GITHUB\chef-academy-web\backend"; npm run test:user
```

This script connects to MongoDB, inserts a sample user, fetches it by email, checks password comparison, and exits.

4. Start the API server:

```powershell
cd "d:\GITHUB\chef-academy-web\backend"; npm start
```

Endpoints:
- `GET /health` — returns `{ ok: true, dbState }`.
- `POST /users` — body `{ name, email, password, status? }`, creates a user.
- `GET /users/:id` — fetch a user by id.

## Files
- `models/User.js` — Mongoose schema and model.
- `scripts/testUserModel.js` — simple smoke test.
- `package.json` — dependencies and scripts.
- `.env.example` — environment variable example.
