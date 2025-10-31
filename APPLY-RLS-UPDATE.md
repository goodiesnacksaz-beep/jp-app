# Apply RLS Update for Anonymous Access

## Issue
Non-authenticated users cannot see the anime list on the dashboard because the Row Level Security (RLS) policies restrict access to authenticated users only.

## Solution
Update the RLS policies to allow both anonymous and authenticated users to read public content (animes, seasons, episodes, vocabulary lists, and vocabulary words).

## Steps to Apply

### 1. Open Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project

### 2. Open SQL Editor
1. Click on "SQL Editor" in the left sidebar
2. Click "New query"

### 3. Execute the Migration
1. Open the file `supabase-rls-update.sql` in this directory
2. Copy all the SQL code
3. Paste it into the SQL Editor
4. Click "Run" to execute

### 4. Verify the Changes
After running the migration, you can verify the policies were updated by running this query:

```sql
SELECT schemaname, tablename, policyname, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;
```

You should see that policies like "Anyone can view animes" no longer have `{authenticated}` in the roles column, indicating they now allow anonymous access.

### 5. Test the Application
1. Open your app in an incognito/private browser window (to ensure you're not logged in)
2. Navigate to `/dashboard`
3. You should now see the anime list and be able to start quizzes without logging in

## What Changed
- **Animes**: Now readable by everyone (anonymous + authenticated)
- **Seasons**: Now readable by everyone (anonymous + authenticated)
- **Episodes**: Now readable by everyone (anonymous + authenticated)
- **Vocabulary Lists**: Published lists are now readable by everyone (anonymous + authenticated)
- **Vocabulary Words**: Words from published lists are now readable by everyone (anonymous + authenticated)

All admin write operations remain restricted to authenticated admin users only.

