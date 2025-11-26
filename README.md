# Task Management App - Proxie Assignment

A modern, full-stack task management application built with SvelteKit, Supabase, and TypeScript. This project demonstrates professional authentication flows, form validation, and clean UI design.

## 🚀 Live Demo

[Coming Soon - Deploy to Vercel/Netlify]

## ✨ Features Implemented (Days 1-2)

### Authentication System
- ✅ **Sign Up**: Email/password registration with validation
- ✅ **Login**: Secure authentication with "Remember me" option
- ✅ **Form Validation**: Real-time validation with Zod
- ✅ **Error Handling**: User-friendly error messages
- ✅ **Session Management**: Persistent sessions with Supabase
- ✅ **Protected Routes**: Authentication checks on protected pages

### User Experience
- ✅ Real-time field validation (validates on blur)
- ✅ Field-specific error messages
- ✅ Loading states to prevent double submission
- ✅ Success notifications before redirects
- ✅ Password strength hints
- ✅ Responsive design with Tailwind CSS
- ✅ Beautiful UI with shadcn-svelte components

## 🛠️ Tech Stack

### Frontend
- **SvelteKit** - Full-stack framework with SSR
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn-svelte** - Beautiful, accessible UI components

### Backend & Services
- **Supabase** - Authentication and database
- **Zod** - Schema validation

### Development Tools
- **Vite** - Fast build tool
- **PostCSS** - CSS processing
- **ESLint** - Code linting

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/anshxpress/Proxie_assignment.git
cd Proxie_assignment
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy your Project URL and anon/public key

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
PUBLIC_SUPABASE_URL=your-supabase-url-here
PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

> **Note**: See `.env.example` for reference

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
task-management-app/
├── src/
│   ├── lib/
│   │   ├── components/ui/      # shadcn-svelte components
│   │   ├── supabaseClient.ts   # Supabase configuration
│   │   ├── validation.ts       # Zod validation schemas
│   │   └── auth-errors.ts      # Error handling utility
│   ├── routes/
│   │   ├── +page.svelte        # Home page (protected)
│   │   ├── login/              # Login page
│   │   ├── signup/             # Sign up page
│   │   └── reset-password/     # Password reset (placeholder)
│   └── app.css                 # Global styles
├── .env.example                # Environment variables template
├── tailwind.config.js          # Tailwind configuration
└── package.json                # Dependencies
```

## 🔐 Authentication Flow

### Sign Up
1. User enters email, password, and password confirmation
2. Client-side validation with Zod
3. Real-time field validation on blur
4. Supabase creates new user account
5. Success message displayed
6. Redirect to login page

### Login
1. User enters credentials
2. Client-side validation
3. Supabase authenticates user
4. Remember me preference stored (optional)
5. Success message displayed
6. Redirect to home page

### Protected Routes
- Home page checks authentication on mount
- Unauthenticated users redirected to login
- Session persists across page refreshes

## 🎨 UI Components

Built with shadcn-svelte for a consistent, accessible design:
- **Button** - Primary actions
- **Input** - Form fields
- **Label** - Field labels
- **Card** - Content containers
- **Checkbox** - Remember me option

## 📝 Validation Rules

### Sign Up
- **Email**: Required, valid email format
- **Password**: Minimum 6 characters, maximum 100 characters
- **Confirm Password**: Must match password

### Login
- **Email**: Required, valid email format
- **Password**: Required

## 🐛 Error Handling

User-friendly error messages for common scenarios:
- "An account with this email already exists"
- "Invalid email or password"
- "Password must be at least 6 characters"
- "Passwords do not match"
- "Network error. Please check your connection"

## 🚧 Roadmap (Days 3-7)

### Day 3 - Protected Routes & Logout
- [ ] Authentication middleware
- [ ] Session persistence across refresh
- [ ] Proper logout with session clearing
- [ ] Route guards

### Day 4 - Task Management Form
- [ ] Create tasks table in Supabase
- [ ] Row Level Security (RLS) policies
- [ ] Add task form with validation
- [ ] Task CRUD operations

### Day 5 - Task List Display
- [ ] Display user tasks
- [ ] Sorting (due date, priority, created date)
- [ ] Filtering (status, priority)
- [ ] Search functionality
- [ ] Empty state

### Day 6 - Task Actions
- [ ] Edit task functionality
- [ ] Delete task with confirmation
- [ ] Mark complete/incomplete
- [ ] Task status updates

### Day 7 - Polish & Deployment
- [ ] Responsive design refinement
- [ ] Loading states
- [ ] Deploy to Vercel/Netlify
- [ ] Documentation
- [ ] Screenshots

## 🧪 Testing

Currently implemented manual testing for:
- Sign up validation (empty fields, invalid email, weak password, password mismatch)
- Login validation and authentication
- Remember me functionality
- Home page authentication check
- Logout functionality

## 📦 Build for Production

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## 🤝 Contributing

This is an assignment project, but suggestions are welcome!

## 📄 License

MIT License - feel free to use this code for learning purposes.

## 👨‍💻 Author

**Ansh Kumar**
- GitHub: [@anshxpress](https://github.com/anshxpress)

## 🙏 Acknowledgments

- [SvelteKit](https://kit.svelte.dev/) - Amazing framework
- [Supabase](https://supabase.com/) - Backend as a service
- [shadcn-svelte](https://www.shadcn-svelte.com/) - Beautiful components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

---

**Status**: Days 1-2 Complete ✅  
**Next**: Day 3 - Protected Routes & Session Management
