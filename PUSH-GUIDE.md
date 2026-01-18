# 🚀 Panduan Push ke GitHub

## Quick Start (Automatic)

### Option 1: Menggunakan PowerShell Script

```powershell
# Jalankan di PowerShell
cd G:\outproj\admyysn
.\push-to-github.ps1
```

Jika ada error "script execution disabled":
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\push-to-github.ps1
```

---

## Manual Steps

### Option 2: Step-by-Step Manual

Buka PowerShell/Terminal di folder `G:\outproj\admyysn`, kemudian jalankan:

#### 1. Initialize Git Repository
```bash
git init
```

#### 2. Add All Files
```bash
git add .
```

#### 3. Create First Commit
```bash
git commit -m "Initial commit: YPT Kiasma Admin Dashboard"
```

#### 4. Set Branch to Main
```bash
git branch -M main
```

#### 5. Add Remote Repository
```bash
git remote add origin https://github.com/synovaaaaa-bot/admin-dashboard-yptk-iasma.git
```

#### 6. Push to GitHub
```bash
git push -u origin main
```

---

## Troubleshooting

### Error: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/synovaaaaa-bot/admin-dashboard-yptk-iasma.git
git push -u origin main
```

### Error: "failed to push some refs"
```bash
git pull origin main --rebase
git push -u origin main
```

### Error: Authentication Failed
Anda perlu setup GitHub credentials:

**Option A: Personal Access Token**
1. Buka GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Copy token
4. Saat diminta password, paste token tersebut

**Option B: GitHub CLI**
```bash
# Install GitHub CLI dulu
winget install GitHub.cli

# Login
gh auth login
```

---

## What Will Be Pushed?

✅ **Included in Repository:**
- Source code (app, components, lib, prisma)
- Configuration files (package.json, tsconfig.json, etc.)
- Documentation (README.md, SETUP.md, INTEGRATION.md)
- Prisma schema
- .gitignore

❌ **Excluded (via .gitignore):**
- node_modules/
- .env (environment variables)
- .next/ (build files)
- Database migrations (except .gitkeep)
- IDE settings

---

## After Pushing

### 1. Verify on GitHub
Buka: https://github.com/synovaaaaa-bot/admin-dashboard-yptk-iasma

### 2. Deploy to Vercel
```bash
# Install Vercel CLI (jika belum)
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Atau via Web:**
1. Login ke https://vercel.com
2. Click "New Project"
3. Import from GitHub
4. Select `admin-dashboard-yptk-iasma`
5. Configure environment variables
6. Deploy!

### 3. Setup Environment Variables di Vercel

Add these to Vercel project settings:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
NEXTAUTH_URL=https://your-deployment-url.vercel.app
NEXTAUTH_SECRET=generate-random-secret-key
```

### 4. Setup Database

**Recommended: Supabase (Free)**
1. Sign up at https://supabase.com
2. Create new project
3. Get connection string from Settings → Database
4. Add to Vercel environment variables
5. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

---

## Updating Code Later

Setelah ada perubahan:

```bash
# Add changes
git add .

# Commit with message
git commit -m "Update: description of changes"

# Push to GitHub
git push
```

Vercel akan otomatis re-deploy setiap kali ada push ke main branch!

---

## Branch Strategy (Optional)

Untuk development yang lebih terstruktur:

```bash
# Create development branch
git checkout -b development

# Make changes...
git add .
git commit -m "Add new feature"
git push origin development

# Merge to main when ready
git checkout main
git merge development
git push origin main
```

---

## Collaborators

Jika ada tim yang ingin berkontribusi:

1. Di GitHub repository → Settings → Collaborators
2. Add collaborators by username/email
3. Mereka bisa:
   ```bash
   git clone https://github.com/synovaaaaa-bot/admin-dashboard-yptk-iasma.git
   cd admin-dashboard-yptk-iasma
   npm install
   # ... setup .env
   npm run dev
   ```

---

## Protect Main Branch (Recommended)

Di GitHub repository settings:
1. Branches → Add branch protection rule
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging

---

## Important Files to Keep Secret

**NEVER commit these files:**
- ❌ `.env` - Contains database credentials
- ❌ `.env.local` - Local environment variables
- ❌ `node_modules/` - Dependencies (huge)
- ❌ Private keys or certificates

These are already in `.gitignore`!

---

## Need Help?

- 📧 Contact: admin@yptkiasma.org
- 📖 Documentation: README.md
- 🔗 Repository: https://github.com/synovaaaaa-bot/admin-dashboard-yptk-iasma

---

**Good luck! 🎉**
