# Codebase Overview 🗺️

This document provides a high-level map of the **Task Management App** codebase to help you navigate and understand the project structure.

---

## 📂 Project Structure

### Root Directory
- **`src/`**: The heart of the application code.
- **`static/`**: Public assets (images, favicon).
- **`package.json`**: Dependencies and scripts (`dev`, `build`, `check`).
- **`svelte.config.js` / `vite.config.ts`**: Configuration for SvelteKit and Vite.
- **`tailwind.config.js`**: Tailwind CSS configuration.
- **`DATABASE_SETUP.md`**: SQL commands for setting up Supabase.

### `src/` Directory
This is where all the logic lives.

#### 1. **Routes (`src/routes/`)**
SvelteKit uses file-based routing. Each directory represents a URL path.

- **`+layout.svelte`**: The root layout wrapping every page. Handles global state like the Supabase auth listener.
- **`+layout.server.ts`**: Server-side logic for the root layout (passes session data to the client).
- **`+page.svelte`**: The Home page (`/`).
- **`hooks.server.ts`**: **CRITICAL**. Server-side middleware that runs on every request. It validates the Supabase session and protects routes.

**Feature Routes:**
- **`login/`**: Login page (`+page.svelte`, `+page.server.ts`).
- **`signup/`**: Sign-up page.
- **`tasks/`**: The main Task Management dashboard.
  - **`+page.svelte`**: The UI (Task list, Create form, Edit dialogs).
  - **`+page.server.ts`**: Server actions (`create`, `update`, `delete`, `toggleStatus`) and data loading.

#### 2. **Library (`src/lib/`)**
Shared code and components accessible via the `$lib` alias.

- **`supabaseClient.ts`**: Initializes the Supabase client.
- **`validation.ts`**: Zod schemas for form validation (Login, Signup, Task forms).
- **`utils.ts`**: Helper functions (date formatting, badge colors).
- **`components/ui/`**: Reusable UI components from `shadcn-svelte` (Button, Input, Card, Dialog, etc.).

---

## 🔑 Key Concepts

### Authentication Flow
1.  **Middleware (`hooks.server.ts`)**: Checks for `sb-access-token` cookie.
2.  **Layout (`+layout.svelte`)**: Listens for auth state changes (login/logout) and invalidates data.
3.  **Protection**: Routes check `locals.session` in their `load` functions to redirect unauthenticated users.

### Data Flow (SvelteKit)
1.  **Load**: `+page.server.ts` fetches data (e.g., tasks) from Supabase.
2.  **Render**: `+page.svelte` receives data via `data` prop and renders the UI.
3.  **Action**: User submits a form (e.g., "Create Task").
4.  **Server**: `+page.server.ts` handles the `action` (POST request), updates Supabase, and returns a result.
5.  **Update**: The page automatically reloads with fresh data.

### Styling
- **Tailwind CSS**: Utility-first styling (e.g., `class="p-4 bg-white"`).
- **Shadcn Svelte**: Pre-built, accessible components styled with Tailwind.

---

## 🛠️ Development Tips

- **Add New Page**: Create a folder in `routes/` (e.g., `routes/profile/`) and add `+page.svelte`.
- **Add New Component**: Run `npx shadcn-svelte@latest add [component-name]`.
- **Database Changes**: Update Supabase, then reflect changes in `DATABASE_SETUP.md`.

---

Happy Coding! 🚀
