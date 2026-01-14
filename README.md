# Waruiru Farm Platform

A modern, full-stack agricultural management platform built with Next.js 14. This application serves as both a public storefront for Waruiru Farm and a powerful internal management dashboard.

## 🚀 Key Features

### 🌍 Public Portal
- **Landing Page**: Showcase of farm services and products.
- **About & Contact**: Company information and inquiry forms.
- **Quote System**: Interactive cart for requesting product quotes.
- **Blog**: Educational content and farm updates with rich text editing.

### 🤖 AI Powered Tools
- **Farm Doctor**: An intelligent diagnostic tool for identifying crop diseases.
- **AI Chat Assistant**: Conversational interface for general farming advice (powered by Gemini integration).
- **Crop Analysis**: Image-based diagnosis for plants (upload and analyze).

### 📊 Management Dashboard
- **Analytics**: Real-time overview of revenue, orders, and customer growth.
- **Inventory Management**: Track stock levels, add/edit products, and get low-stock alerts.
- **Financial Tracking**: visualizations of revenue trends and transaction history.
- **Reports**: Generate and download CSV reports for inventory and financials.
- **Notifications**: System alerts for orders and inventory updates.

### 🔐 Authentication & Security
- Secure user authentication using **NextAuth.js**.
- Role-based access control (Admin vs. User).
- Protected API routes and dashboard pages.

### 💳 Payments
- **M-Pesa Integration**: STK Push and callback handling for mobile money payments.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## 📂 Project Structure

```
src/
├── app/                  # App Router pages and API routes
│   ├── api/              # Backend API endpoints
│   ├── auth/             # Authentication pages
│   ├── blog/             # Blog pages
│   ├── bot/              # Farm Doctor bot pages
│   ├── chat/             # AI Chat pages
│   ├── dashboard/        # Admin dashboard
│   └── ...               # Public pages (about, contact, quote)
├── components/           # Reusable UI components
│   ├── bot/              # Bot-specific components
│   ├── chat/             # Chat-specific components
│   ├── dashboard/        # Dashboard widgets
│   ├── forms/            # Form components
│   └── ui/               # Base UI elements (buttons, inputs, etc.)
├── lib/                  # Utility functions and configurations
│   ├── prisma.ts         # Database client
│   ├── auth.ts           # Auth configuration
│   └── ...
└── types/                # TypeScript interfaces and types
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/waruiru-farm.git
   cd waruiru-farm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory based on `.env.example`:
   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   GEMINI_API_KEY="your-gemini-key"
   MPESA_CONSUMER_KEY="..."
   MPESA_CONSUMER_SECRET="..."
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📚 Documentation
The codebase is fully documented with JSDoc. You can explore the `src/app/api` directory to understand the available API endpoints for:
- Authentication (`/api/auth`)
- Dashboard Stats (`/api/dashboard`)
- Products & Inventory (`/api/products`, `/api/inventory`)
- Chat & AI (`/api/chat`, `/api/gemini-analysis`)

## 📄 License
This project is licensed under the MIT License.
