# Docker Compose Setup

This guide will help you set up PostgreSQL and MongoDB using Docker Compose.

## Prerequisites

1. Install Docker: https://docs.docker.com/get-docker/
2. Install Docker Compose: https://docs.docker.com/compose/install/

## Setup Instructions

1. **Update the docker-compose.yml file**:
   - Change `your_password_here` to a secure password

2. **Start the databases**:
   ```bash
   docker-compose up -d
   ```

3. **Update your .env file**:
   ```env
   DATABASE_URL=postgresql://nambakadai_user:your_password_here@localhost:5432/nambakadai?schema=public
   MONGODB_URI=mongodb://localhost:27017/nambakadai
   ```

4. **Test the connections**:
   ```bash
   pnpm dev:test-db
   ```

## Docker Compose Commands

- **Start services**: `docker-compose up -d`
- **Stop services**: `docker-compose down`
- **View logs**: `docker-compose logs`
- **Restart services**: `docker-compose restart`
- **View running containers**: `docker-compose ps`

## Database Access

### PostgreSQL
- **Host**: localhost
- **Port**: 5432
- **Database**: nambakadai
- **User**: nambakadai_user
- **Password**: your_password_here

### MongoDB
- **Host**: localhost
- **Port**: 27017
- **Database**: nambakadai

## Troubleshooting

### Common Issues:

1. **Port already in use**:
   - Change the ports in docker-compose.yml
   - Or stop the existing services using those ports

2. **Permission denied**:
   - Ensure Docker is running with proper permissions
   - On Linux, you might need to run with `sudo`

3. **Container fails to start**:
   - Check the logs: `docker-compose logs`
   - Ensure the password is properly set

### Reset Data (Development Only):

To completely reset the databases:
```bash
docker-compose down -v
docker-compose up -d
```

The `-v` flag removes the volumes, which will delete all data.