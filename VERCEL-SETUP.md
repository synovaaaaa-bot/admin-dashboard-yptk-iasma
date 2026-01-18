# 🚀 Panduan Deploy ke Vercel

## ⚠️ Penting: Environment Variables

Sebelum deploy, pastikan Anda sudah setup environment variables di Vercel!

### Required Environment Variables

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-random-secret-key-here"
```

---

## 🎯 Cara Setup Database untuk Production

### Option 1: Supabase (Recommended - Free Tier Available)

1. **Buat Account di Supabase**
   - Kunjungi: https://supabase.com
   - Sign up dengan GitHub

2. **Buat Project Baru**
   - Click "New Project"
   - Nama: `ypt-kiasma-admin`
   - Database Password: (simpan baik-baik)
   - Region: pilih terdekat (Southeast Asia)

3. **Get Connection String**
   - Go to Settings → Database
   - Find "Connection string" section
   - Select "Transaction" mode
   - Copy connection string:
   ```
   postgresql://postgres.xxxxx:password@aws-0-region.pooler.supabase.com:6543/postgres
   ```

4. **Replace di Connection String**
   ```
   postgresql://postgres.[REFERENCE-ID]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   ```

### Option 2: Neon (Alternative)

1. Sign up di https://neon.tech
2. Create project
3. Copy connection string dari dashboard
4. Format: `postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb`

### Option 3: Railway (Alternative)

1. Sign up di https://railway.app
2. New Project → Provision PostgreSQL
3. Copy DATABASE_URL dari Variables tab

---

## 🔐 Setup Environment Variables di Vercel

### Via Web Dashboard

1. **Login ke Vercel**
   - Buka: https://vercel.com/dashboard
   - Login dengan GitHub

2. **Pilih Project**
   - Click project `admin-dashboard-yptk-iasma`
   - Go to Settings → Environment Variables

3. **Add Variables**
   
   **DATABASE_URL**
   ```
   postgresql://postgres.xxxxx:password@aws-0-region.pooler.supabase.com:6543/postgres
   ```
   - Environment: Production, Preview, Development

   **NEXTAUTH_URL**
   ```
   https://your-app-name.vercel.app
   ```
   - Environment: Production
   
   For Preview & Development, use:
   ```
   https://VERCEL_URL
   ```

   **NEXTAUTH_SECRET**
   ```
   generate-random-32-character-secret-key-here
   ```
   
   Generate dengan command:
   ```bash
   # Linux/Mac
   openssl rand -base64 32
   
   # Windows (PowerShell)
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```
   - Environment: Production, Preview, Development

4. **Save Changes**

### Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Add environment variables
vercel env add DATABASE_URL
# Paste your database URL

vercel env add NEXTAUTH_URL
# Paste your app URL

vercel env add NEXTAUTH_SECRET
# Paste your secret key
```

---

## 🗄️ Setup Database Schema

Setelah environment variables di-set:

### Option 1: Via Vercel CLI

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database with initial data
npx prisma db seed
```

### Option 2: Via Supabase SQL Editor

1. Buka Supabase Dashboard → SQL Editor
2. Jalankan script ini untuk create admin user:

```sql
-- Create User table
CREATE TABLE "User" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'EDITOR',
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Insert admin user (password: admin123)
INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt")
VALUES (
  'admin-001',
  'Admin YPT Kiasma',
  'admin@yptkiasma.org',
  '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW',
  'SUPER_ADMIN',
  NOW(),
  NOW()
);
```

**Note:** Password hash di atas adalah untuk password `admin123`

---

## 🚀 Deploy/Redeploy

### Automatic Deployment

Vercel akan otomatis deploy setiap kali ada push ke GitHub branch `main`.

```bash
# Commit dan push changes
git add .
git commit -m "Update configuration"
git push origin main

# Vercel akan otomatis detect dan deploy
```

### Manual Deployment via CLI

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

### Check Deployment Status

1. Buka Vercel Dashboard: https://vercel.com/dashboard
2. Click project name
3. Lihat deployment status (Building/Ready/Error)
4. Klik deployment untuk melihat logs

---

## 🐛 Troubleshooting

### Error: "prisma client is not generated"

**Solution:**
1. Go to Vercel project → Settings → General
2. Find "Build & Development Settings"
3. Build Command: `npx prisma generate && next build`
4. Redeploy

### Error: "Can't reach database server"

**Solution:**
1. Vercel Dashboard → Settings → Environment Variables
2. Verify DATABASE_URL is correct
3. Test connection dari local:
   ```bash
   npx prisma db pull
   ```

### Error: "NextAuth configuration error"

**Solution:**
1. Verify NEXTAUTH_SECRET is set
2. Verify NEXTAUTH_URL matches your deployment URL
3. For preview deployments, use `https://VERCEL_URL`

### Build Warnings about Next.js version

**Solution:**
Sudah diperbaiki! Next.js diupdate ke versi 14.2.18 (security patch)

---

## ✅ Checklist Deployment

- [ ] Database created (Supabase/Neon/Railway)
- [ ] CONNECTION_STRING copied
- [ ] Environment variables added to Vercel:
  - [ ] DATABASE_URL
  - [ ] NEXTAUTH_URL
  - [ ] NEXTAUTH_SECRET
- [ ] Code pushed to GitHub
- [ ] Vercel deployment started
- [ ] Check deployment logs (no errors)
- [ ] Run migrations: `npx prisma db push`
- [ ] Seed database: `npx prisma db seed`
- [ ] Test login: `admin@yptkiasma.org` / `admin123`
- [ ] Change default password
- [ ] Add real data (berita, program, donatur)
- [ ] Test public API endpoints
- [ ] Share URL dengan team

---

## 🎯 Default Login Credentials

Setelah seed database:

```
Email: admin@yptkiasma.org
Password: admin123
```

⚠️ **PENTING: Ganti password setelah login pertama kali!**

---

## 📊 Monitor Deployment

### Vercel Analytics (Optional)

1. Vercel Dashboard → Analytics
2. Enable Web Analytics
3. View traffic, performance, dan errors

### Logs

```bash
# View production logs
vercel logs --prod

# View specific deployment logs
vercel logs [deployment-url]
```

---

## 🔗 Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Supabase Dashboard:** https://app.supabase.com
- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs

---

## 📞 Need Help?

Jika masih ada masalah:

1. Check deployment logs di Vercel
2. Verify environment variables
3. Test database connection
4. Check prisma schema

Contact: admin@yptkiasma.org

---

**Good luck with deployment! 🎉**
