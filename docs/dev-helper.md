# Development Helper

This project includes a development helper script to make common development tasks easier.

## Usage

```bash
# Run the development server
pnpm dev:helper dev

# Build the project
pnpm dev:helper build

# Run database migrations
pnpm dev:helper migrate

# Generate Prisma client
pnpm dev:helper generate

# Seed the database
pnpm dev:helper seed

# Reset the database
pnpm dev:helper reset-db

# Open Prisma Studio
pnpm dev:helper studio

# Show all available commands
pnpm dev:helper help
```

## Available Commands

- `dev` - Start the development server
- `build` - Build the project for production
- `start` - Start the production server
- `migrate` - Run Prisma migrations
- `generate` - Generate Prisma client
- `seed` - Seed the database with initial data
- `test` - Run tests
- `lint` - Run the linter
- `clean` - Clean build cache
- `reset-db` - Reset the database
- `studio` - Open Prisma Studio

## Adding New Commands

To add new commands, edit the `scripts/dev-helper.js` file and add new entries to the `commands` object.