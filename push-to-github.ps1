# Script untuk push project ke GitHub
# Admin Dashboard YPT Kiasma

Write-Host "🚀 Pushing Admin Dashboard to GitHub..." -ForegroundColor Cyan
Write-Host ""

# 1. Initialize git repository (jika belum)
Write-Host "📁 Initializing Git repository..." -ForegroundColor Yellow
git init

# 2. Add all files
Write-Host "📝 Adding all files..." -ForegroundColor Yellow
git add .

# 3. Commit
Write-Host "💾 Creating first commit..." -ForegroundColor Yellow
git commit -m "Initial commit: YPT Kiasma Admin Dashboard

- Setup Next.js 14 with TypeScript
- Implement authentication with NextAuth
- Create admin dashboard with statistics
- Add news/berita management (CRUD)
- Add program management (CRUD)
- Add donor management (CRUD)
- Add donation management with verification
- Create public API endpoints for frontend integration
- Add export & API integration page
- Setup Prisma with PostgreSQL
- Implement responsive design with Tailwind CSS
- Add rich text editor (React Quill)
- Complete documentation (README, SETUP, INTEGRATION)"

# 4. Rename branch to main (jika masih master)
Write-Host "🌿 Setting branch to main..." -ForegroundColor Yellow
git branch -M main

# 5. Add remote repository
Write-Host "🔗 Adding remote repository..." -ForegroundColor Yellow
git remote add origin https://github.com/synovaaaaa-bot/admin-dashboard-yptk-iasma.git

# 6. Push to GitHub
Write-Host "⬆️  Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

Write-Host ""
Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
Write-Host "🌐 Repository: https://github.com/synovaaaaa-bot/admin-dashboard-yptk-iasma" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Visit your repository on GitHub"
Write-Host "2. Deploy to Vercel (vercel.com)"
Write-Host "3. Setup environment variables"
Write-Host "4. Configure database"
Write-Host ""
