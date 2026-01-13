# Healthcare Admin Dashboard

A production-ready B2B Healthcare Admin Dashboard built with React, TypeScript, Redux Toolkit, and Radix UI.

## 🚀 Features

- **Authentication System**: Secure login with form validation and Redux state management
- **Protected Routes**: Dashboard pages are only accessible to authenticated users
- **Dashboard Overview**: Real-time stats for patients, doctors, appointments, and clinics
- **Patient Directory**: Full-featured table with search, filter, sort, and pagination
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Collapsible Sidebar**: Space-efficient navigation with expand/collapse functionality
- **Loading States**: Skeleton loaders for better UX during data fetching

## 🛠️ Tech Stack

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Redux Toolkit** - State Management
- **React Router v6** - Routing
- **Radix UI (shadcn/ui)** - Accessible UI Components
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Vite** - Build Tool

## 📁 Project Structure

```
src/
├── app/                    # Redux store & typed hooks
│   ├── store.ts
│   └── hooks.ts
├── features/               # Redux slices
│   ├── auth/authSlice.ts
│   ├── dashboard/dashboardSlice.ts
│   ├── directory/directorySlice.ts
│   └── theme/themeSlice.ts
├── components/
│   ├── layout/             # Layout components
│   │   ├── AppShell.tsx
│   │   ├── AppSidebar.tsx
│   │   └── Header.tsx
│   └── ui/                 # UI components
│       ├── stat-card.tsx
│       ├── skeleton-loader.tsx
│       ├── theme-toggle.tsx
│       └── ... (shadcn components)
├── pages/                  # Page components
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   └── Directory.tsx
├── routes/                 # Route guards
│   └── ProtectedRoute.tsx
└── data/                   # Dummy JSON data
    ├── credentials.json
    ├── dashboard.json
    ├── patients.json
    └── doctors.json
```

## 🔐 Demo Credentials

```
Email: admin@healthcare.com
Password: admin123
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn or bun

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd healthcare-admin-dashboard
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open http://localhost:5173 in your browser

## 📦 Build for Production

```bash
npm run build
```

## 🌐 Deployment

This project is configured for easy deployment on Vercel:

1. Push your code to GitHub
2. Import the repository on Vercel
3. Deploy!

## ✨ Key Features Explained

### Authentication
- Form validation (email format, password min length 6)
- Redux Toolkit for state management
- LocalStorage persistence for session
- Protected routes redirect to login

### Dashboard
- Animated stat cards with icons
- Recent activity feed
- Progress indicators
- Responsive grid layout

### Patient Directory
- Global search (by name, ID, clinic)
- Filter by status (Active/Inactive)
- Filter by clinic
- Sort by name, age, or last visit
- Pagination with 8 items per page
- All filter/search state managed in Redux

### Theme
- Light/Dark mode toggle
- Persisted in localStorage
- Respects system preference on first visit

## 📄 License

MIT License
