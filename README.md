# 🛍️ Dude Men's Wears - E-Commerce Platform

A modern, full-featured e-commerce platform built with Next.js 16, designed for selling premium men's fashion and streetwear.

## ✨ Features

### Customer Features
- 🛒 Full-featured shopping cart
- 💳 Secure checkout with Razorpay integration
- 🔐 User authentication and profiles
- ❤️ Wishlist functionality
- 📦 Order tracking
- 🔍 Advanced product search and filtering
- 📱 Fully responsive mobile design
- ⚡ Lightning-fast performance

### Admin Dashboard
- 📊 Comprehensive analytics dashboard
- 📦 Product management (CRUD operations)
- 🏷️ Category and collection management
- 🎨 Banner and promotion management
- 👥 Customer management
- 💰 Order processing and fulfillment
- ⚙️ Store settings and configuration
- 📈 Sales reporting

## 🛠️ Tech Stack

- **Framework:** Next.js 16 with App Router
- **Frontend:** React 19, TypeScript 5
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui + Radix UI
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Payments:** Razorpay
- **Caching:** Upstash Redis (optional)
- **Email:** Resend (optional)
- **Deployment:** Vercel / Hostinger

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm package manager
- Supabase account
- Razorpay account

### Installation

```bash
# Clone repository
git clone https://github.com/Melvinkheturus/dudemw.git
cd dudemw

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Create Admin Account

1. Visit: http://localhost:3000/admin/setup
2. Enter your `ADMIN_SETUP_KEY`
3. Create admin account
4. Login at: http://localhost:3000/admin/login

## 📚 Documentation

- **[Quick Start Guide](./QUICKSTART.md)** - Get started in 5 minutes
- **[Deployment Guide](./DEPLOYMENT.md)** - Complete deployment instructions for Vercel & Hostinger
- **[Production Checklist](./PRODUCTION_CHECKLIST.md)** - Pre-launch checklist
- **[Project Structure](./docs/PROJECT_STRUCTURE.md)** - Detailed project architecture
- **[Admin Dashboard Guide](./docs/ADMIN_DASHBOARD.md)** - Admin panel documentation

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md#vercel-deployment) for detailed instructions.

### Deploy to Hostinger

1. Build: `npm run build`
2. Upload via SSH/SFTP
3. Configure environment variables
4. Run with PM2: `pm2 start ecosystem.config.js`

See [DEPLOYMENT.md](./DEPLOYMENT.md#hostinger-deployment) for detailed instructions.

## ⚙️ Environment Variables

Required environment variables (see `.env.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
ADMIN_SETUP_KEY=your_admin_setup_key
NEXT_PUBLIC_APP_URL=your_app_url
```

## 🧪 Testing

```bash
# Run linter
npm run lint

# Analyze bundle size
npm run analyze

# Build for production
npm run build

# Test production build
npm start
```

## 📁 Project Structure

```
dudemw/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable components
│   ├── domains/          # Domain-driven features
│   ├── lib/              # Utilities & services
│   └── types/            # TypeScript types
├── public/               # Static assets
├── docs/                 # Documentation
└── scripts/              # Deployment scripts
```

See [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md) for complete structure.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- 📖 [Documentation](./DEPLOYMENT.md)
- 🐛 [Issue Tracker](https://github.com/Melvinkheturus/dudemw/issues)
- 📧 Email: support@dudemw.com
- 💬 WhatsApp: +919876543210
- 📱 Instagram: [@dude_mensclothing](https://instagram.com/dude_mensclothing)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Vercel](https://vercel.com/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Made with ❤️ for modern e-commerce**
