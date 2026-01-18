# Setup Guide - YPT Kiasma Admin Dashboard

## Quick Start Guide

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

Anda memerlukan PostgreSQL database. Pilih salah satu:

#### Option A: Local PostgreSQL
Install PostgreSQL di komputer Anda, kemudian buat database:
```sql
CREATE DATABASE ypt_kiasma_admin;
```

#### Option B: Cloud Database (Recommended untuk production)
Daftar di salah satu provider gratis:
- **Supabase** (https://supabase.com) - Recommended
- **Neon** (https://neon.tech)
- **Railway** (https://railway.app)

### 3. Configure Environment Variables

Buat file `.env` di root folder:

```env
# Database Connection
DATABASE_URL="postgresql://username:password@host:5432/database_name"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-random-secret-key-here"
```

**Cara generate NEXTAUTH_SECRET:**
```bash
# Linux/Mac
openssl rand -base64 32

# Windows (PowerShell)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Initialize Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# Seed database dengan data awal (user admin, sample data)
npm run db:seed
```

### 5. Run Development Server

```bash
npm run dev
```

Buka http://localhost:3000

### 6. Login

Default credentials:
- **Email**: `admin@yptkiasma.org`
- **Password**: `admin123`

⚠️ **PENTING**: Ganti password setelah login pertama!

---

## Troubleshooting

### Error: "Can't reach database server"

**Solusi:**
- Pastikan PostgreSQL running
- Cek DATABASE_URL di `.env` sudah benar
- Test koneksi database

### Error: "NextAuth configuration error"

**Solusi:**
- Pastikan NEXTAUTH_SECRET sudah di-set di `.env`
- Pastikan NEXTAUTH_URL sesuai dengan URL aplikasi

### Error: Prisma Client not generated

**Solusi:**
```bash
npm run prisma:generate
```

### Database migration failed

**Solusi:**
```bash
# Reset database (⚠️ akan hapus semua data!)
npx prisma migrate reset

# Atau buat migration baru
npx prisma migrate dev --name init
```

---

## Development Tips

### Prisma Studio
Buka GUI untuk manage database:
```bash
npm run prisma:studio
```

### Create new migration
Setelah ubah `schema.prisma`:
```bash
npx prisma migrate dev --name your_migration_name
```

### Reset database
```bash
npx prisma migrate reset
```

### View logs
```bash
npm run dev
# Logs akan muncul di terminal
```

---

## Production Deployment

### Deploy ke Vercel

1. **Push ke GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

2. **Import di Vercel**
- Buka https://vercel.com
- Import repository
- Set environment variables:
  - `DATABASE_URL`
  - `NEXTAUTH_URL` (URL production Anda)
  - `NEXTAUTH_SECRET`

3. **Deploy!**

### Setup Production Database

**Recommended: Supabase**

1. Daftar di https://supabase.com
2. Create new project
3. Copy connection string:
   - Go to Settings > Database
   - Copy "Connection string" (Transaction mode)
4. Paste ke `DATABASE_URL` di Vercel

**Run migrations di production:**
```bash
# Set DATABASE_URL to production
export DATABASE_URL="your-production-url"

# Run migrations
npx prisma migrate deploy

# Seed if needed
npm run db:seed
```

---

## File Structure Explained

```
admyysn/
├── app/
│   ├── api/              # Backend API routes
│   ├── dashboard/        # Admin pages (protected)
│   ├── login/            # Login page
│   └── globals.css       # Global styles
│
├── components/           # Reusable React components
│   ├── Sidebar.tsx
│   └── DashboardLayout.tsx
│
├── lib/                  # Utilities
│   ├── prisma.ts         # Database client
│   └── auth.ts           # Auth config
│
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data
│
├── .env                  # Environment variables (create this!)
├── package.json          # Dependencies
└── README.md             # Documentation
```

---

## Common Commands

```bash
# Development
npm run dev                # Start dev server
npm run build              # Build for production
npm start                  # Start production server

# Database
npm run prisma:studio      # Open Prisma Studio
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Run migrations
npm run db:seed            # Seed database

# Code Quality
npm run lint               # Run ESLint
```

---

## Next Steps

1. ✅ Login dengan admin account
2. ✅ Ganti password default
3. ✅ Tambah berita pertama
4. ✅ Tambah program
5. ✅ Tambah donatur dan donasi
6. ✅ Explore dashboard dan semua fitur

---

## Need Help?

- 📖 Read full [README.md](./README.md)
- 💬 Contact: admin@yptkiasma.org
- 🌐 Website: https://yptkiasma.vercel.app

---

**Selamat menggunakan YPT Kiasma Admin Dashboard! 🎉**
