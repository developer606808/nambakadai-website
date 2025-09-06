# Complete Database Setup Guide

This guide will walk you through setting up both PostgreSQL and MongoDB databases for the Nambakadai application.

## Step 1: Choose Your Setup Method

You have three options for setting up the databases:

1. **Docker Compose** (Recommended for development)
2. **Local Installation** (For development)
3. **Cloud Providers** (Recommended for production)

## Step 2: Docker Compose Setup (Easiest)

If you have Docker installed, this is the easiest way to get started:

1. **Update the docker-compose.yml file**:
   ```yaml
   # Change this line in docker-compose.yml
   POSTGRES_PASSWORD: your_secure_password_here
   ```

2. **Start the databases**:
   ```bash
   docker-compose up -d
   ```

3. **Update your .env file**:
   ```env
   DATABASE_URL=postgresql://nambakadai_user:your_secure_password_here@localhost:5432/nambakadai?schema=public
   MONGODB_URI=mongodb://localhost:27017/nambakadai
   NEXTAUTH_SECRET=b01b28cc785a6ee1e96c34f7ab195f3e0744469a3c78f2b02a36bc4b6aeca4cf
   ```

4. **Test the connections**:
   ```bash
   pnpm dev:test-db
   ```

## Step 3: Local Installation

### PostgreSQL Setup

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
   CREATE USER nambakadai_user WITH ENCRYPTED PASSWORD 'your_secure_password_here';
   
   # Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE nambakadai TO nambakadai_user;
   
   # Exit
   \q
   ```

### MongoDB Setup

1. **Install MongoDB**:
   - Windows: Download from https://www.mongodb.com/try/download/community
   - macOS: `brew tap mongodb/brew && brew install mongodb-community`
   - Ubuntu: Follow instructions at https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

2. **Start MongoDB service**:
   - Windows: Start the MongoDB service from Services
   - macOS: `brew services start mongodb/brew/mongodb-community`
   - Ubuntu: `sudo systemctl start mongod`

## Step 4: Update Environment Variables

Update your `.env` file with the correct database URLs:

```env
# Database URLs
DATABASE_URL=postgresql://nambakadai_user:your_secure_password_here@localhost:5432/nambakadai?schema=public
MONGODB_URI=mongodb://localhost:27017/nambakadai

# NextAuth - Use the generated secret
NEXTAUTH_SECRET=b01b28cc785a6ee1e96c34f7ab195f3e0744469a3c78f2b02a36bc4b6aeca4cf
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

## Step 5: Test Database Connections

Run the database test script:
```bash
pnpm dev:test-db
```

## Step 6: Initialize the Database

If the database connections are successful, run these commands:

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

## Step 7: Start Development

Start the development server:
```bash
pnpm dev
```

Visit http://localhost:3000 to see your application running!

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
6. Consider using cloud providers like:
   - PostgreSQL: Supabase, Heroku Postgres, AWS RDS
   - MongoDB: MongoDB Atlas, AWS DocumentDB

## Next Steps

Once your databases are configured and the application is running:

1. Create your first admin user
2. Add categories and units
3. Test all functionality
4. Customize the UI/UX
5. Add more features as needed

Your Nambakadai marketplace is now ready to help farmers and agricultural businesses connect and thrive!