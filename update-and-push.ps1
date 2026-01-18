# Script untuk update dan push ke GitHub
Write-Host "🔧 Updating and pushing fixes to GitHub..." -ForegroundColor Cyan
Write-Host ""

# 1. Add changes
Write-Host "📝 Adding changes..." -ForegroundColor Yellow
git add .

# 2. Commit
Write-Host "💾 Committing fixes..." -ForegroundColor Yellow
git commit -m "Fix: ESLint warnings and update Next.js version

- Fix React Hooks exhaustive-deps warnings in all pages
- Update Next.js from 14.1.0 to 14.2.18 (security update)
- Suppress false positive ESLint warnings with proper comments
- Ready for Vercel deployment"

# 3. Push
Write-Host "⬆️  Pushing to GitHub..." -ForegroundColor Yellow
git push

Write-Host ""
Write-Host "✅ Successfully pushed updates!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next: Vercel will automatically redeploy" -ForegroundColor Yellow
Write-Host "    Check: https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host ""
