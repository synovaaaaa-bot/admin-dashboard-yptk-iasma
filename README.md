# YPT Kiasma Admin Dashboard

Admin dashboard untuk mengelola konten website YPT Kiasma (https://yptkiasma.vercel.app/)

## Fitur

✅ **Dashboard Overview** - Statistik dan ringkasan data
✅ **Manajemen Berita** - CRUD berita dan artikel dengan WYSIWYG editor
✅ **Manajemen Program** - Kelola program dan kegiatan
✅ **Manajemen Donatur** - Database donatur lengkap
✅ **Manajemen Donasi** - Tracking dan verifikasi donasi
✅ **Authentication** - Login dengan role-based access
✅ **Responsive Design** - Mobile-friendly interface

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL dengan Prisma ORM
- **Authentication**: NextAuth.js
- **Rich Text Editor**: React Quill
- **Icons**: React Icons
- **HTTP Client**: Axios

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm atau yarn

## Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd admyysn
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**

Buat file `.env` di root folder dengan isi:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ypt_kiasma_admin?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
```

4. **Setup database**
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed database dengan user admin
npx prisma db seed
```

5. **Run development server**
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Database Setup

### Create User Admin

Untuk membuat user admin pertama kali, jalankan script berikut di Prisma Studio atau PostgreSQL:

```bash
npx prisma studio
```

Atau buat user secara manual dengan password hash:

```sql
INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt")
VALUES (
  'admin-001',
  'Admin',
  'admin@yptkiasma.org',
  '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', -- password: admin123
  'SUPER_ADMIN',
  NOW(),
  NOW()
);
```

Default login:
- Email: `admin@yptkiasma.org`
- Password: `admin123`

**⚠️ PENTING: Ganti password setelah login pertama kali!**

## Project Structure

```
admyysn/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # Authentication
│   │   ├── news/         # News endpoints
│   │   ├── programs/     # Programs endpoints
│   │   ├── donors/       # Donors endpoints
│   │   ├── donations/    # Donations endpoints
│   │   └── stats/        # Statistics endpoint
│   ├── dashboard/        # Dashboard pages
│   │   ├── news/         # News management
│   │   ├── programs/     # Programs management
│   │   ├── donors/       # Donors management
│   │   └── donations/    # Donations management
│   ├── login/            # Login page
│   ├── globals.css       # Global styles
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── Sidebar.tsx       # Navigation sidebar
│   └── DashboardLayout.tsx
├── lib/                  # Utility libraries
│   ├── prisma.ts         # Prisma client
│   └── auth.ts           # Auth configuration
├── prisma/
│   └── schema.prisma     # Database schema
├── public/               # Static files
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Database Schema

### User
- ID, name, email, password, role
- Roles: SUPER_ADMIN, EDITOR, FINANCE, VIEWER

### News
- Title, slug, content, excerpt, featured image
- Category, tags, status (DRAFT/PUBLISHED/ARCHIVED)
- Author relation

### Program
- Title, description, featured image
- Start/end date, location, max participants
- Status (UPCOMING/RUNNING/COMPLETED)

### Donor
- Name, email, phone, address
- Donation history

### Donation
- Amount, payment method, status
- Donor relation, notes
- Status (PENDING/VERIFIED/REJECTED)

## Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Prisma commands
npx prisma studio          # Open Prisma Studio
npx prisma migrate dev     # Create and apply migration
npx prisma generate        # Generate Prisma Client
```

## Deployment

### Deploy ke Vercel

1. Push code ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy!

### Database Production

Gunakan salah satu provider PostgreSQL:
- [Supabase](https://supabase.com) (Recommended, free tier)
- [Neon](https://neon.tech)
- [Railway](https://railway.app)
- [Heroku Postgres](https://www.heroku.com/postgres)

## Security Notes

- ✅ Password di-hash dengan bcrypt
- ✅ Protected routes dengan middleware
- ✅ JWT session-based authentication
- ✅ Role-based access control ready
- ⚠️ Ganti `NEXTAUTH_SECRET` di production
- ⚠️ Gunakan HTTPS di production
- ⚠️ Setup CORS jika needed

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout

### News
- `GET /api/news` - Get all news (paginated)
- `POST /api/news` - Create news
- `GET /api/news/[id]` - Get single news
- `PUT /api/news/[id]` - Update news
- `DELETE /api/news/[id]` - Delete news

### Programs
- `GET /api/programs` - Get all programs
- `POST /api/programs` - Create program
- `GET /api/programs/[id]` - Get single program
- `PUT /api/programs/[id]` - Update program
- `DELETE /api/programs/[id]` - Delete program

### Donors
- `GET /api/donors` - Get all donors
- `POST /api/donors` - Create donor
- `GET /api/donors/[id]` - Get single donor
- `PUT /api/donors/[id]` - Update donor
- `DELETE /api/donors/[id]` - Delete donor

### Donations
- `GET /api/donations` - Get all donations
- `POST /api/donations` - Create donation
- `GET /api/donations/[id]` - Get single donation
- `PUT /api/donations/[id]` - Update donation
- `DELETE /api/donations/[id]` - Delete donation

### Statistics
- `GET /api/stats` - Get dashboard statistics

## Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

Private - YPT Kiasma

## Support

Untuk bantuan atau pertanyaan, hubungi:
- Email: admin@yptkiasma.org
- Website: https://yptkiasma.vercel.app

---

Made with ❤️ for YPT Kiasma
