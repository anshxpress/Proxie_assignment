# Supabase Database Setup - Tasks Table

## Step 1: Create Tasks Table

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `task-management-app`
3. Navigate to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the following SQL:

```sql
-- Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  priority VARCHAR(10) NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
  due_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
```

6. Click **Run** (or press Ctrl+Enter)
7. You should see "Success. No rows returned"

## Step 2: Enable Row Level Security (RLS)

1. In the same SQL Editor, create a new query
2. Copy and paste the following SQL:

```sql
-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only their own tasks
CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own tasks
CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own tasks
CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own tasks
CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);
```

3. Click **Run**
4. You should see "Success. No rows returned"

## Step 3: Verify Setup

### Check Table
1. Navigate to **Table Editor** (left sidebar)
2. You should see `tasks` table listed
3. Click on it to view the schema

### Check RLS Policies
1. Navigate to **Authentication** → **Policies** (left sidebar)
2. Select `tasks` table
3. You should see 4 policies:
   - Users can view own tasks
   - Users can insert own tasks
   - Users can update own tasks
   - Users can delete own tasks

## What This Does

### Table Schema
- **id**: Unique identifier for each task (auto-generated)
- **user_id**: Links task to the user who created it
- **title**: Task title (max 100 characters, required)
- **description**: Task description (optional, unlimited text)
- **priority**: Low, Medium, or High (required)
- **due_date**: When the task is due (required)
- **status**: Pending, In Progress, or Completed (default: Pending)
- **created_at**: When the task was created (auto-generated)
- **updated_at**: When the task was last updated (auto-generated)

### Row Level Security (RLS)
- **Security**: Users can ONLY see, create, update, and delete their own tasks
- **Privacy**: User A cannot see User B's tasks
- **Automatic**: Supabase automatically filters queries based on the logged-in user

## Troubleshooting

### Error: "relation 'tasks' already exists"
- The table already exists. You can either:
  - Drop it: `DROP TABLE tasks CASCADE;` then recreate
  - Or skip table creation and just run RLS policies

### Error: "policy already exists"
- The policies already exist. You can either:
  - Drop them: `DROP POLICY "policy_name" ON tasks;` then recreate
  - Or skip policy creation

### Verify RLS is Working
1. Create a task while logged in as User A
2. Log out and log in as User B
3. User B should NOT see User A's task
4. Each user sees only their own tasks

---

**Status**: Ready for Day 4 implementation ✅  
**Next**: Build the task creation form in the app
