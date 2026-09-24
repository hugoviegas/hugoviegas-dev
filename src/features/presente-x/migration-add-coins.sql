-- Migration: Add coins_balance column if it doesn't exist
-- Run this in your Supabase SQL Editor

-- Check if column exists and add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'presente_users' 
        AND column_name = 'coins_balance'
    ) THEN
        ALTER TABLE presente_users ADD COLUMN coins_balance int DEFAULT 0;
        
        -- Update existing users to have 0 coins
        UPDATE presente_users SET coins_balance = 0 WHERE coins_balance IS NULL;
        
        RAISE NOTICE 'Column coins_balance added successfully';
    ELSE
        RAISE NOTICE 'Column coins_balance already exists';
    END IF;
END $$;

-- Ensure the user for Sthefany exists with correct name
INSERT INTO presente_users (full_name, name_normalized, total_points, coins_balance, current_streak, longest_streak, last_visit_date)
VALUES ('Sthefany Nayure Campos Vieira', 'sthefany nayure campos vieira', 0, 0, 0, 0, CURRENT_DATE)
ON CONFLICT (name_normalized) DO NOTHING;

-- Verify the column exists
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns
WHERE table_name = 'presente_users'
AND column_name = 'coins_balance';

-- Check current user data
SELECT id, full_name, coins_balance, total_points, current_streak 
FROM presente_users 
WHERE name_normalized = 'sthefany nayure campos vieira';
