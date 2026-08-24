-- Migration: add answers column to presente_user_progress
-- Run in Supabase SQL Editor

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'presente_user_progress'
    AND column_name = 'answers'
  ) THEN
    ALTER TABLE presente_user_progress ADD COLUMN answers jsonb;
    RAISE NOTICE 'Column answers added to presente_user_progress';
  ELSE
    RAISE NOTICE 'Column answers already exists';
  END IF;
END $$;

-- Check sample rows
SELECT id, user_id, day_number, points_earned, answers
FROM presente_user_progress
LIMIT 10;