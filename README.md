# 🏥 Healthcare Admin Dashboard

A production-ready **B2B Healthcare Admin Dashboard** built with React, TypeScript, Redux Toolkit, and Radix UI. This project demonstrates enterprise-level architecture with modern UI/UX patterns.

![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Redux](https://img.shields.io/badge/Redux_Toolkit-2.0-purple) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.4-teal)

---

## 🔐 Demo Credentials

```
Email: admin@healthcare.com
Password: admin123
```

---

## ✨ Features

### 🔒 Authentication System
- Email & password login with **client-side validation**
- Email format validation with regex
- Password minimum length (6 characters)
- Error messages for invalid credentials
- **Redux state management** for auth
- **LocalStorage persistence** for session
- Automatic redirect to dashboard on successful login

### 🛡️ Protected Routes
- Unauthenticated users redirected to `/login`
- Loading spinner while checking auth state
- Secure route wrapping with `ProtectedRoute` component

### 📊 Dashboard
- **4 Stat Cards** - Patients, Doctors, Appointments, Clinics
- Animated counters with **Framer Motion**
- **Recent Activity Feed** with icons per activity type
- Weekly progress bars with animated fill
- **Skeleton loaders** during data fetch
- Responsive grid layout

### 📁 Patient Directory
- **Full data table** with patient information
- **Global Search** - Filter by name, ID, or clinic
- **Status Filter** - All / Active / Inactive
- **Clinic Filter** - Filter by specific clinic
- **Sortable Columns** - Click header to sort (asc/desc)
  - Sort by Name
  - Sort by Age
  - Sort by Last Visit
- **Pagination** - 8 items per page with page navigation
- Empty state handling for no results
- Staggered row animations on load

### 📅 Appointments Management
- **Daily View** - List of appointments for selected date
- **Weekly View** - Calendar grid view for the week
- **Date Navigation** - Previous/Next buttons + Today
- **Calendar Popup** - Date picker for quick navigation
- **Stats Cards** - Today's Total, Confirmed, Pending
- **Book Appointment** - Dialog form to create new appointments
- **Appointment Details** - Click to view full details
- **Cancel Appointment** - Update appointment status

### 🤖 AI Chat Assistant
- **Floating chat widget** (bottom-right corner)
- Powered by **Google Gemini AI** (gemini-1.5-flash)
- Healthcare-focused system prompt
- **Conversation history** maintained for context
- Typing indicator with "Thinking..." animation
- Clear chat functionality
- Error handling with fallback messages

### 🎨 Theme System (Dark Mode)
- **Light / Dark / System** theme options
- Powered by **next-themes** library
- Uses **Radix UI DropdownMenu** for theme picker
- Persisted in localStorage
- **Respects system preference** on first visit
- No flash of unstyled content (FOUC)
- CSS variables for seamless theme transitions

### 📱 Responsive Design
- Mobile-first approach with Tailwind breakpoints
- **Collapsible sidebar** on desktop
- **Sheet-based sidebar** on mobile
- Touch-friendly interactions
- Optimized for desktop, tablet, and mobile

### ⚡ Loading States & UX
- **Skeleton loaders** for all data sections
  - StatCardSkeleton
  - TableRowSkeleton
  - ActivitySkeleton
- Smooth page transitions with Framer Motion
- Loading spinner on login button
- Disabled states during async operations

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 18 |
| **Language** | TypeScript 5 |
| **State Management** | Redux Toolkit |
| **Routing** | React Router v6 |
| **UI Components** | Radix UI (shadcn/ui) |
| **Styling** | Tailwind CSS 3.4 |
| **Animations** | Framer Motion |
| **Theme** | next-themes |
| **AI Integration** | Google Generative AI (Gemini) |
| **Build Tool** | Vite |
| **Data** | Mock JSON files |

---

## 📁 Project Structure

```
src/
├── app/                      # Redux store & typed hooks
│   ├── store.ts             # Redux store configuration
│   └── hooks.ts             # Typed useSelector & useDispatch
├── features/                 # Redux slices (feature-based)
│   ├── auth/authSlice.ts    # Authentication state
│   ├── dashboard/           # Dashboard stats & activity
│   ├── directory/           # Patient list, filters, sort, pagination
│   ├── appointments/        # Appointment CRUD & views
│   ├── theme/               # Theme state (legacy)
│   └── chat/                # AI chat messages & state
├── components/
│   ├── layout/              # App shell, sidebar, header
│   │   ├── AppShell.tsx
│   │   ├── AppSidebar.tsx
│   │   └── Header.tsx
│   ├── ui/                  # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── stat-card.tsx
│   │   ├── skeleton-loader.tsx
│   │   ├── theme-toggle.tsx
│   │   └── ... (50+ shadcn components)
│   ├── chat/                # AI chat widget
│   │   ├── ChatWidget.tsx
│   │   └── ChatMessage.tsx
│   └── appointments/        # Appointment views & dialogs
│       ├── DailyView.tsx
│       ├── WeeklyView.tsx
│       ├── BookingDialog.tsx
│       └── AppointmentDetails.tsx
├── pages/                    # Route-level components
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── Directory.tsx
│   ├── Appointments.tsx
│   └── NotFound.tsx
├── routes/                   # Route guards
│   └── ProtectedRoute.tsx
├── lib/                      # Utilities
│   ├── utils.ts             # cn() helper for classnames
│   └── aiChatService.ts     # Gemini AI integration
├── hooks/                    # Custom hooks
│   └── use-mobile.tsx       # Mobile detection hook
└── data/                     # Mock JSON data
    ├── credentials.json     # Demo login credentials
    ├── dashboard.json       # Stats & activity data
    ├── patients.json        # Patient records (50+)
    └── appointments.json    # Appointment records
```

---

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn or bun

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd healthcare-admin-dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables** (for AI Chat)
```bash
# Create .env file
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Start the development server**
```bash
npm run dev
```

5. Open http://localhost:8080 in your browser

---

## 📦 Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

---

## 🌐 Deployment

This project is configured for easy deployment on:

### Vercel (Recommended)
1. Push your code to GitHub
2. Import repository on Vercel
3. Add environment variables
4. Deploy!

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`

---

## 🔑 Key Architecture Decisions

### State Management
- **Redux Toolkit** for global state (auth, dashboard, directory, appointments, chat)
- Feature-based slice organization
- Async actions with thunks (API calls simulated with setTimeout)
- Typed hooks for type-safe access

### Component Architecture
- **Container/Presentational pattern**
  - `pages/` = Container components (Redux-connected)
  - `components/ui/` = Presentational components (pure)
- **Composition over inheritance**
- **Radix primitives** for accessibility

### Styling Strategy
- **Tailwind CSS** utility classes
- **CSS Variables** for theming
- **cn() utility** for conditional classes
- **CVA** (Class Variance Authority) for component variants

---

## 🧪 Future Improvements

- [ ] Unit tests with Jest + React Testing Library
- [ ] E2E tests with Cypress/Playwright
- [ ] Real API integration (REST/GraphQL)
- [ ] RTK Query for data fetching
- [ ] Role-based access control (Admin/Doctor/Staff)
- [ ] Export to CSV/PDF functionality
- [ ] Notification system
- [ ] Appointment reminders

---

## 📄 License

MIT License

---

## 👨‍💻 Author

Built with ❤️ for Healthcare Admin Management
