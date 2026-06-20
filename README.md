# BlogOverflow — AI-Powered Full-Stack Blogging Platform

> A modern, full-stack blogging platform combining AI-driven content creation, secure authentication, and subscription-based monetization — built for creators and managed through dedicated user and admin dashboards.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=flat&logo=fastify&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat&logo=postgresql&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=flat&logo=openai&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=flat&logo=stripe&logoColor=white)

---

## Overview

BlogOverflow is a production-grade blogging platform that blends traditional content publishing with AI-assisted writing. Users can generate blog posts automatically or from custom prompts, manage subscriptions for premium features, and engage with content through comments — all secured behind OTP-based authentication and role-based access control.

The platform ships with two purpose-built dashboards: a **User Dashboard** for personal content and subscription management, and an **Admin Dashboard** for platform-wide oversight — covering posts, tags, engagement metrics, and top-performing content.

---

## ✨ Key Features

### 🔐 Authentication & Access Control
- OTP-based email verification for secure account creation
- Role-based access control (User / Admin) with protected routes
- JWT-secured API endpoints

### 🤖 AI-Powered Content Generation
- Auto-generate full blog posts using the OpenAI API
- Custom prompt-based generation for tailored content
- Seamless editor integration for AI-assisted writing

### 💳 Monetization
- Stripe-powered subscription plans for premium features
- Plan-gated access to AI generation tools
- Payment success/failure handling with dashboard sync

### 💬 Engagement
- Threaded commenting system on blog posts
- Likes and view tracking per article
- Tag-based content categorization

### 📊 Dashboards
**User Dashboard**
- Personal post management (create, edit, delete)
- Subscription and billing overview
- Performance stats: total posts, published count, views, likes

**Admin Dashboard**
- Platform-wide statistics: total posts, published posts, total views, total likes
- Tag insights across all users' posts (visualized with a donut chart)
- Top-performing posts ranked by views
- Centralized article and comment moderation

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js (App Router), React, Tailwind CSS |
| **Backend** | Fastify (Node.js) |
| **Database** | PostgreSQL with Sequelize ORM |
| **AI Integration** | OpenAI API |
| **Payments** | Stripe |
| **Media Storage** | Cloudinary |
| **Auth** | JWT + OTP email verification |

---

## 🏗️ Architecture

The backend follows a **layered architecture** for clean separation of concerns:

```
Routes → Controllers → Services → Repositories → Models
```

- **Routes** — define API endpoints and attach middleware
- **Controllers** — handle request/response cycles
- **Services** — house business logic
- **Repositories** — handle direct database queries via Sequelize
- **Models** — define data schema and associations

This structure keeps the codebase modular, testable, and easy to extend as new features are added.

---

## 📁 Project Structure

```
backend/
├── config/              # DB, Cloudinary, email, environment config
├── src/
│   ├── controllers/      # Request handlers
│   ├── middlewares/      # Auth & upload middleware
│   ├── models/           # Sequelize models & associations
│   ├── repositories/     # Database query layer
│   ├── routes/           # API route definitions
│   ├── schemas/          # Validation schemas
│   ├── services/         # Business logic
│   └── utils/            # Helper functions
└── migrations/ seeders/  # DB versioning & seed data

frontend/
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── (auth)/         # Login, register, OTP verification
│   │   ├── admin/          # Admin dashboard
│   │   ├── dashboard/      # User dashboard
│   │   └── blog/           # Public blog pages
│   ├── components/        # Reusable UI components
│   └── hooks/              # Custom React hooks
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- Cloudinary account
- OpenAI API key
- Stripe account

### Backend Setup
```bash
cd backend
npm install
# configure your .env file (see .env.example)
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
# configure your .env.local file
npm run dev
```

---

## 🔑 Environment Variables

**Backend (`.env`)**
```
DATABASE_URL=
JWT_SECRET=
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
```

**Frontend (`.env.local`)**
```
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

---

## 🗺️ Roadmap

- [ ] Real-time notifications for comments and likes
- [ ] Advanced analytics for content performance
- [ ] Multi-language content support
- [ ] Team/collaborative blogging workspaces

---

## 👤 Author

**Daniyal**
Full-Stack Developer

---

## 📄 License

This project is proprietary and intended for personal/portfolio use.
