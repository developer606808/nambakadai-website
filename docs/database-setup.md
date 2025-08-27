# Database Configuration Guide

This guide will help you set up both PostgreSQL and MongoDB databases for the Nambakadai application.

## PostgreSQL Setup

### Option 1: Local Installation

1. **Install PostgreSQL**:
   - Windows: Download from https://www.postgresql.org/download/windows/
   - macOS: `brew install postgresql`
   - Ubuntu: `sudo apt install postgresql postgresql-contrib`

2. **Start PostgreSQL service**:
   - Windows: Start the PostgreSQL service from Services
   - macOS: `brew services start postgresql`
   - Ubuntu: `sudo systemctl start postgresql`

3. **Create database and user**:
   ```bash
   # Connect to PostgreSQL
   psql postgres
   
   # Create database
   CREATE DATABASE nambakadai;
   
   # Create user
   CREATE USER nambakadai_user WITH ENCRYPTED PASSWORD 'your_password_here';
   
   # Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE nambakadai TO nambakadai_user;
   
   # Exit
   \q
   ```

### Option 2: Using Docker

1. **Install Docker** (if not already installed)

2. **Run PostgreSQL container**:
   ```bash
   docker run --name nambakadai-postgres \
     -e POSTGRES_DB=nambakadai \
     -e POSTGRES_USER=nambakadai_user \
     -e POSTGRES_PASSWORD=your_password_here \
     -p 5432:5432 \
     -d postgres:13
   ```

### Option 3: Cloud Provider (Recommended for Production)

- **Supabase**: https://supabase.com/
- **Heroku Postgres**: https://www.heroku.com/postgres
- **AWS RDS**: https://aws.amazon.com/rds/postgresql/
- **Google Cloud SQL**: https://cloud.google.com/sql/docs/postgres

## MongoDB Setup

### Option 1: Local Installation

1. **Install MongoDB**:
   - Windows: Download from https://www.mongodb.com/try/download/community
   - macOS: `brew tap mongodb/brew && brew install mongodb-community`
   - Ubuntu: Follow instructions at https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

2. **Start MongoDB service**:
   - Windows: Start the MongoDB service from Services
   - macOS: `brew services start mongodb/brew/mongodb-community`
   - Ubuntu: `sudo systemctl start mongod`

### Option 2: Using Docker

1. **Run MongoDB container**:
   ```bash
   docker run --name nambakadai-mongo \
     -p 27017:27017 \
     -d mongo:latest
   ```

### Option 3: Cloud Provider (Recommended for Production)

- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **AWS DocumentDB**: https://aws.amazon.com/documentdb/
- **Google Cloud Firestore**: https://cloud.google.com/firestore

## Environment Configuration

Update your `.env` file with the correct database URLs:

```env
# PostgreSQL - Replace with your actual credentials
DATABASE_URL=postgresql://nambakadai_user:your_password_here@localhost:5432/nambakadai?schema=public

# MongoDB - Replace with your actual credentials
MONGODB_URI=mongodb://localhost:27017/nambakadai

# NextAuth - Generate a secure secret
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Email (for password reset, verification, etc.)
EMAIL_SERVER=smtp://username:password@smtp.example.com:587
EMAIL_FROM=no-reply@nambakadai.com

# Cloud Storage (for images)
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

# API Keys
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

To generate a secure NEXTAUTH_SECRET, run:
```bash
openssl rand -base64 32
```

## Database Initialization

After configuring your databases, run these commands:

1. **Generate Prisma client**:
   ```bash
   pnpm generate
   ```

2. **Run database migrations**:
   ```bash
   pnpm migrate
   ```

3. **Seed the database**:
   ```bash
   pnpm seed
   ```

## Testing Database Connections

You can test your database connections with these commands:

1. **Test PostgreSQL**:
   ```bash
   pnpm dev:helper studio
   ```

2. **Test MongoDB**:
   ```bash
   # If you have MongoDB shell installed
   mongosh mongodb://localhost:27017/nambakadai
   ```

## Troubleshooting

### Common Issues:

1. **Connection refused**:
   - Ensure database services are running
   - Check if the port is correct (5432 for PostgreSQL, 27017 for MongoDB)
   - Verify firewall settings

2. **Authentication failed**:
   - Double-check username and password
   - Ensure the user has proper privileges

3. **Database does not exist**:
   - Create the database using the commands above
   - Ensure the database name matches in your connection string

### Reset Database (Development Only):

If you need to reset your database during development:
```bash
pnpm reset-db
pnpm migrate
pnpm seed
```

## Production Deployment

For production deployment, make sure to:

1. Use secure, strong passwords
2. Use SSL connections (append `?ssl=true` to connection strings)
3. Use environment variables for sensitive data
4. Set up proper backups
5. Monitor database performance