# Database Seeding

This directory contains the Prisma database schema and seed file for the Nambakadai application.

## Files

- `schema.prisma` - Database schema definition
- `seed.ts` - Database seeding script
- `README.md` - This documentation

## Database Schema

The schema includes the following main entities:

### Core Entities
- **User** - Application users (BUYER, SELLER, ADMIN roles)
- **Store** - Seller stores
- **Product** - Agricultural products for sale
- **Category** - Product categories
- **State/City** - Location data

### Community Features
- **Community** - User communities
- **CommunityPost** - Posts within communities
- **CommunityComment** - Comments on posts
- **CommunityMember** - Community membership

### Rental Features
- **Vehicle** - Agricultural equipment for rent
- **VehicleBooking** - Vehicle rental bookings

### Additional Features
- **DemandPost** - User demands for products
- **Offer** - Special offers and discounts
- **Banner** - Homepage banners
- **Notification** - User notifications

## Running the Seed

To populate your database with sample data, run:

```bash
npm run seed
```

This will create:
- 5 sample users (Admin, Sellers, Buyers)
- 3 states and 4 cities
- 4 measurement units
- 5 product categories
- 2 stores with products
- 2 communities with posts
- 2 rental vehicles
- 2 homepage banners
- 2 demand posts
- 2 special offers
- Sample wishlist and followers

## Sample Data Overview

### Users Created
- **Admin**: admin@nambakadai.com / password123
- **Seller 1**: rajesh.farmer@nambakadai.com / password123
- **Buyer 1**: priya.buyer@nambakadai.com / password123
- **Seller 2**: amit.farmer@nambakadai.com / password123
- **Buyer 2**: sunita.buyer@nambakadai.com / password123

### Sample Products
- Premium Basmati Rice (₹120/kg)
- Fresh Tomatoes (₹40/kg)
- Organic Turmeric Powder (₹85/kg)
- Fresh Mangoes (₹180/kg)

### Sample Communities
- "Organic Farmers Tamil Nadu"
- "Rice Cultivation Experts"

### Sample Vehicles
- Mahindra 575 DI Tractor (₹500/hour)
- Tata Ace Mini Truck (₹300/hour)

## Database Commands

```bash
# Generate Prisma client
npm run generate

# Run migrations
npm run migrate

# Reset database and run migrations
npm run reset-db

# Open Prisma Studio
npm run studio

# Seed database
npm run seed
```

## Environment Setup

Make sure your `.env` file contains the correct `DATABASE_URL`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/nambakadai"
```

## Data Relationships

The seed file creates realistic relationships between entities:
- Users own stores
- Stores contain products
- Products belong to categories and locations
- Users join communities
- Communities have posts and members
- Products can have offers
- Users can follow stores and add products to wishlist

## Customization

To modify the seed data:
1. Edit `prisma/seed.ts`
2. Update the sample data as needed
3. Run `npm run seed` to apply changes

## Security Note

The seed file creates users with a default password (`password123`). In production, ensure users change their passwords after initial setup.