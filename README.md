# Fitness App Backend

A scalable backend for a fitness application, built with Node.js, Express, and Prisma ORM (MongoDB). This backend supports user management, fitness and nutrition plans, social features, e-commerce, and more.

## Features

- **User Management**: Registration, authentication, roles (USER, SELLER, ADMIN), profile, verification, and status management.
- **Fitness & Nutrition**: AI-generated fitness and nutrition plans, workout and nutrition logs, hydration tracking.
- **Social & Community**: Posts, likes, comments, followers, connections, notifications, and challenges.
- **E-commerce**: Vendors, products, orders, payments, reviews, and subscriptions.
- **Extensible Schema**: Easily add new features or models using Prisma.

## Tech Stack

- **Node.js** & **Express**: REST API server
- **Prisma ORM**: MongoDB database modeling and access
- **@prisma/client**: Type-safe database client
- **dotenv**: Environment variable management
- **CORS**: Cross-origin resource sharing

## Project Structure

```
/ (root)
├── package.json
├── package-lock.json
├── .env
├── prisma.config.ts
├── prisma/
│   └── schema.prisma
└── src/
    ├── app.ts
    ├── server.ts
    └── app/
```

## Setup & Installation

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure environment**
   - Edit `.env` for your database connection string (MongoDB by default)
4. **Prisma setup**
   - Generate Prisma client:
     ```bash
     npx prisma generate
     ```
   - (Optional) Run migrations if using relational DB
5. **Start the server**
   ```bash
   npm start
   ```

## Prisma Schema Overview

The schema defines models for users, profiles, fitness/nutrition plans, social features (posts, likes, comments, followers), e-commerce (vendors, products, orders, payments), and subscriptions. It is designed for extensibility and scalability.

## Scripts

- `npm start` — Start the server
- `npx prisma generate` — Generate Prisma client
- `npx prisma studio` — Open Prisma Studio for DB management

## License

MIT
