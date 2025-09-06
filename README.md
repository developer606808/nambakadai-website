# Nambakadai - Agricultural Marketplace

A modern, animated, nature-inspired marketplace for agricultural products built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd nambakadai-website

# Set up the development environment
pnpm dev:setup

# Start the development server
pnpm dev
```

## 📋 Requirements Implemented

✅ **Next.js (App Router) + TypeScript**
✅ **Tailwind CSS + shadcn/ui** (no Bootstrap)
✅ **Prisma ORM + PostgreSQL**
✅ **MongoDB** (for community posts + user chat)
✅ **NextAuth.js** (credentials, JWT)
✅ **next-intl** (i18n)
✅ **Framer Motion** (animations)

### Goals Achieved
- ✅ Modern, animated, nature-inspired UI
- ✅ Fully responsive across devices
- ✅ Multilingual (English + Tamil) with locale routes (/en, /ta)
- ✅ Dynamic SEO per page
- ✅ Secure APIs and forms
- ✅ All pages connected to DB with full CRUD
- ✅ Store QR codes + follow/followers
- ✅ Runs without patches or bugs

### Theming
- ✅ Semantic color variables for light/dark mode
- ✅ Extended Tailwind palette with green-50→950 and brown-50→950

### Architecture & Config
- ✅ App Router with locale segment: /app/[locale]/...
- ✅ next-intl config for /en and /ta with middleware
- ✅ NextAuth with Credentials provider and JWT session
- ✅ Prisma schema + migrations + seed script for Postgres
- ✅ MongoDB collections for Community and Chats
- ✅ Framer Motion for animations
- ✅ ISR/SSR/SSG mix with ISR revalidate: 60
- ✅ Zod for validation
- ✅ Rate limiting middleware for sensitive routes

## 🗂 Project Structure

```
nambakadai-website/
├── app/                    # Next.js app router
│   ├── [locale]/          # Localized pages
│   ├── api/               # API routes
│   └── ...
├── components/            # React components
├── docs/                  # Documentation
├── i18n/                  # Internationalization
├── lib/                   # Utility functions
├── messages/              # Translation files
├── prisma/                # Database schema and migrations
├── public/                # Static assets
├── scripts/               # Development scripts
└── ...
```

## 🛠 Development Commands

```bash
# Check if all dependencies are installed
pnpm dev:check

# Set up the development environment
pnpm dev:setup

# Test database connections
pnpm dev:test-db

# Generate secure secrets
pnpm dev:gen-secrets

# Run the development server
pnpm dev

# Build for production
pnpm build

# Run database migrations
pnpm migrate

# Generate Prisma client
pnpm generate

# Seed the database
pnpm seed

# Reset the database
pnpm reset-db

# Open Prisma Studio
pnpm studio

# Run the development helper
pnpm dev:helper help
```

## 📚 Documentation

- [Implementation Summary](FINAL_IMPLEMENTATION_SUMMARY.md)
- [Development Helper](docs/dev-helper.md)
- [Database Setup Guide](docs/database-setup.md)
- [Docker Setup](docs/docker-setup.md)
- [Complete Setup Guide](docs/complete-setup-guide.md)
- [API Documentation](docs/api.md) *(to be created)*
- [Database Schema](docs/database.md) *(to be created)*

## 🎯 Database Setup

The application requires both PostgreSQL and MongoDB databases. You can set them up in multiple ways:

### Option 1: Docker Compose (Easiest)
```bash
# Update docker-compose.yml with a secure password
# Start the databases
docker-compose up -d

# Update .env with the connection strings
# Test connections
pnpm dev:test-db
```

### Option 2: Local Installation
Follow the instructions in [docs/database-setup.md](docs/database-setup.md)

### Option 3: Cloud Providers
- PostgreSQL: Supabase, Heroku Postgres, AWS RDS
- MongoDB: MongoDB Atlas, AWS DocumentDB

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## 📄 License

This project is licensed under the MIT License.