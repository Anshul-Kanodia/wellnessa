# 🗄️ Wellnessa Database Setup Guide

## 📋 Overview

This guide will help you set up PostgreSQL database with Prisma ORM for your Wellnessa healthcare platform, both locally and in production.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Navigate to your project
cd "c:\Users\kanod\CascadeProjects\figma-replica"

# Install database dependencies
npm install prisma @prisma/client pg
npm install -D @types/pg

# Generate Prisma client
npx prisma generate
```

### 2. Environment Setup

Copy `.env.example` to `.env` and update with your database credentials:

```bash
# Copy the example file
copy .env.example .env
```

Update your `.env` file:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/wellnessa_db"
JWT_SECRET=wellnessa_jwt_secret_key_2024_secure_development
NODE_ENV=development
PORT=5001
FRONTEND_URL=http://localhost:3000
BCRYPT_ROUNDS=12
```

## 🐘 PostgreSQL Installation

### Option 1: Local PostgreSQL (Recommended for Development)

#### Windows:
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer and follow the setup wizard
3. Remember your postgres user password
4. Create a database:
   ```sql
   CREATE DATABASE wellnessa_db;
   CREATE USER wellnessa_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE wellnessa_db TO wellnessa_user;
   ```

#### Using Docker (Alternative):
```bash
# Run PostgreSQL in Docker
docker run --name wellnessa-postgres \
  -e POSTGRES_DB=wellnessa_db \
  -e POSTGRES_USER=wellnessa_user \
  -e POSTGRES_PASSWORD=your_password \
  -p 5432:5432 \
  -d postgres:15
```

### Option 2: Cloud Database (Production)

#### Render PostgreSQL (Free):
1. Go to https://render.com
2. Create a new PostgreSQL database
3. Copy the connection string
4. Update your `.env` file

#### Supabase (Alternative):
1. Go to https://supabase.com
2. Create a new project
3. Get the database URL from Settings > Database
4. Update your `.env` file

## 🔧 Database Setup Commands

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# OR create and run migrations (for production)
npm run db:migrate

# Seed the database with initial data
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio

# Reset database (WARNING: Deletes all data)
npm run db:reset
```

## 🏃‍♂️ Running the Application

### Development Mode:
```bash
# Run with database
npm run server:db

# OR run both frontend and backend
npm run dev
```

### Production Mode:
```bash
# Build and start
npm run build
npm start
```

## 📊 Database Schema

The database includes these main tables:

- **users** - User accounts with access levels
- **assessments** - Health assessment templates
- **assessment_groups** - Assessment categories
- **assessment_subgroups** - Assessment subcategories
- **questions** - Individual questions
- **question_options** - Multiple choice options
- **assessment_results** - Completed assessment results
- **question_responses** - Individual question responses
- **home_page_content** - CMS content
- **system_settings** - Application settings

## 🚀 Deployment Guide

### Step 1: Prepare for Deployment

1. **Update Environment Variables**:
   ```bash
   # Production .env
   NODE_ENV=production
   DATABASE_URL="your_production_database_url"
   JWT_SECRET="your_secure_jwt_secret"
   FRONTEND_URL="https://your-domain.com"
   ```

2. **Test Locally**:
   ```bash
   npm run build
   npm start
   ```

### Step 2: Deploy to Render

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add database integration"
   git push origin main
   ```

2. **Deploy on Render**:
   - The `render.yaml` file is already configured
   - Render will automatically create a PostgreSQL database
   - The app will run database migrations on deployment

### Step 3: Deploy Frontend to Vercel

Your frontend deployment remains the same. The API calls will automatically route to your Render backend.

## 🔍 Troubleshooting

### Common Issues:

1. **Connection Error**:
   ```
   Error: P1001: Can't reach database server
   ```
   - Check if PostgreSQL is running
   - Verify DATABASE_URL is correct
   - Check firewall settings

2. **Migration Error**:
   ```
   Error: P3009: migrate found failed migration
   ```
   - Run: `npm run db:reset` (WARNING: Deletes data)
   - Or manually fix the migration

3. **Prisma Client Error**:
   ```
   Error: @prisma/client did not initialize yet
   ```
   - Run: `npm run db:generate`

### Database Commands:

```bash
# Check database connection
npx prisma db pull

# View database in browser
npm run db:studio

# Generate new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations in production
npx prisma migrate deploy
```

## 📈 Performance Tips

1. **Database Indexing**: Key fields are already indexed in the schema
2. **Connection Pooling**: Prisma handles this automatically
3. **Query Optimization**: Use Prisma's `select` and `include` wisely
4. **Caching**: Consider Redis for session management in production

## 🔐 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Database Access**: Use least-privilege principle
3. **Connection Security**: Always use SSL in production
4. **Backup Strategy**: Set up automated backups
5. **Monitoring**: Monitor database performance and errors

## 📚 Useful Commands

```bash
# Database Management
npm run db:studio          # Open database GUI
npm run db:seed           # Populate with sample data
npm run db:reset          # Reset database (DEV ONLY)

# Development
npm run server:db         # Run server with database
npm run dev              # Run full stack development

# Production
npm run build            # Build frontend
npm start               # Start production server
```

## 🆘 Support

If you encounter issues:

1. Check the logs: `npm run server:db`
2. Verify environment variables
3. Test database connection: `npx prisma db pull`
4. Check Prisma documentation: https://www.prisma.io/docs

## 🎉 Success!

Once everything is set up, you should see:

```
✅ Database connected successfully
🚀 Server running on port 5001
🌍 Environment: development

📋 Demo Credentials:
👤 User (Level 1): username: user1, password: password123
👨‍💼 Admin (Level 2): username: admin1, password: admin123
👨‍💻 Super Admin (Level 3): username: superadmin, password: super123

🔗 API Health Check: http://localhost:5001/api/health
```

Your Wellnessa platform is now running with a full PostgreSQL database! 🎊
