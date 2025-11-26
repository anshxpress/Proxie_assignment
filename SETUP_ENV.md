# Environment Setup Instructions

## Your Supabase Credentials

Copy the content below and create a `.env.local` file in the project root:

```env
PUBLIC_SUPABASE_URL=https://ybtnarsivbapfuqaxdso.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlidG5hcnNpdmJhcGZ1cWF4ZHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NjgxMDEsImV4cCI6MjA3OTI0NDEwMX0.r8xlfAizi7yIpcQqjioTRrlqqtrOA25qTQ0Ro0j--AM
```

## How to Create the File

### Option 1: Using VS Code
1. Right-click in the project root folder
2. Select "New File"
3. Name it `.env.local`
4. Paste the content above

### Option 2: Using Command Line
Run this command in your project directory:

**PowerShell:**
```powershell
@"
PUBLIC_SUPABASE_URL=https://ybtnarsivbapfuqaxdso.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlidG5hcnNpdmJhcGZ1cWF4ZHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NjgxMDEsImV4cCI6MjA3OTI0NDEwMX0.r8xlfAizi7yIpcQqjioTRrlqqtrOA25qTQ0Ro0j--AM
"@ | Out-File -FilePath .env.local -Encoding utf8
```

## Verify Setup

After creating the file, test your setup:

```bash
npm run dev
```

Then visit:
- http://localhost:5173/signup
- http://localhost:5173/login

The pages should load without errors!
