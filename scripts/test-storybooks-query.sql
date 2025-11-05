-- Test query to check if is_admin = 1 records exist and can be queried
-- Run this in Supabase SQL Editor

-- 1. Check if is_admin column exists
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'storybooks' AND column_name = 'is_admin';

-- 2. Check all records and their is_admin values
SELECT id, title, is_admin, user_id, guest_token
FROM public.storybooks
ORDER BY created_at DESC
LIMIT 10;

-- 3. Test query for is_admin = 1
SELECT id, title, description, icon, featured
FROM public.storybooks
WHERE is_admin = 1
ORDER BY created_at DESC;

-- 4. Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'storybooks';

