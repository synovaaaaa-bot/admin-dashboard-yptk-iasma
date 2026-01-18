# GitHub Actions Workflows

Repository ini menggunakan GitHub Actions untuk automasi quality checks, security scans, dan deployment.

## 🔄 Workflows

### 1. Quality Check & Auto Merge (`quality-check-and-merge.yml`)

**Trigger:** Pull Request ke branch `main`

**Jobs:**
- ✅ ESLint check
- ✅ TypeScript type check
- ✅ Security audit
- ✅ Build test
- ✅ Prisma validation
- 🔀 Auto-merge jika semua check passed

**Auto-merge conditions:**
- Semua quality checks passed
- PR dari branch: `fix/*` atau `feature/*`
- Akan otomatis approve dan merge dengan squash commit

### 2. Security Scan (`security-scan.yml`)

**Trigger:** 
- Push ke `main`
- Pull Request ke `main`
- Scheduled (setiap hari jam 2 pagi)

**Jobs:**
- 🔒 npm audit untuk dependency vulnerabilities
- 📊 Dependency review (untuk PR)
- 🔍 CodeQL security analysis
- ⚠️ Fail jika ada critical/high severity vulnerabilities

### 3. Code Quality Check (`code-quality.yml`)

**Trigger:**
- Push ke `main`
- Pull Request ke `main`

**Jobs:**
- 📝 ESLint validation
- 🔧 TypeScript compilation check
- 📦 Build test
- 🗄️ Prisma schema validation

## 🚀 Cara Kerja Auto-Merge

1. **Buat PR** dari branch `fix/*` atau `feature/*`
2. **GitHub Actions** akan otomatis run quality checks
3. Jika **semua checks passed** ✅:
   - PR akan otomatis di-approve
   - PR akan otomatis di-merge ke `main` (squash merge)
   - Vercel akan otomatis deploy
4. Jika **ada yang failed** ❌:
   - Auto-merge tidak akan jalan
   - Fix issues dan push lagi

## 📋 Status Badges

Tambahkan ke README.md:

```markdown
![Quality Check](https://github.com/synovaaaaa-bot/admin-dashboard-yptk-iasma/workflows/Quality%20Check%20%26%20Auto%20Merge/badge.svg)
![Security Scan](https://github.com/synovaaaaa-bot/admin-dashboard-yptk-iasma/workflows/Security%20Scan/badge.svg)
![Code Quality](https://github.com/synovaaaaa-bot/admin-dashboard-yptk-iasma/workflows/Code%20Quality%20Check/badge.svg)
```

## ⚙️ Configuration

### Environment Variables untuk CI

Workflows menggunakan dummy environment variables untuk testing:
```env
DATABASE_URL=postgresql://test:test@localhost:5432/test
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=test-secret-for-ci
```

### Permissions

Auto-merge membutuhkan permissions:
```yaml
permissions:
  contents: write
  pull-requests: write
```

## 🔧 Troubleshooting

### Auto-merge tidak jalan

**Problem:** PR tidak auto-merge meskipun checks passed

**Solutions:**
1. Pastikan branch name dimulai dengan `fix/` atau `feature/`
2. Check permissions di repository settings
3. Pastikan tidak ada merge conflicts
4. Check workflow logs untuk error messages

### Security audit gagal

**Problem:** npm audit menemukan vulnerabilities

**Solutions:**
```bash
# Fix automatically
npm audit fix

# Fix dengan breaking changes
npm audit fix --force

# Check specific package
npm audit [package-name]
```

### Build gagal di CI tapi sukses di local

**Problem:** Build pass di local tapi fail di GitHub Actions

**Solutions:**
1. Clear cache: hapus `node_modules` dan `package-lock.json`, lalu `npm install`
2. Check Node.js version (CI uses 18.x)
3. Check environment variables
4. Run `npm run build` di local dengan env variables yang sama

## 📞 Support

Jika ada masalah dengan CI/CD pipeline:
- Check workflow logs: Actions tab di GitHub
- Review failed steps
- Contact: admin@yptkiasma.org

---

**Automated with ❤️ by GitHub Actions**
