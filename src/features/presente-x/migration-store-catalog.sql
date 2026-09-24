-- Migration: enhance rewards for store catalog and cart purchases
-- Run in Supabase SQL Editor

-- Ensure the rewards table exists (safe to run multiple times)
CREATE TABLE IF NOT EXISTS presente_rewards (
  id bigint primary key generated always as identity,
  title text not null,
  description text,
  hint text,
  cost_coins int not null DEFAULT 0,
  is_surprise boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz default now()
);

-- Add reward metadata columns (if the table already existed but columns are missing)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'presente_rewards') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'presente_rewards' AND column_name = 'is_surprise'
    ) THEN
      ALTER TABLE presente_rewards ADD COLUMN is_surprise boolean DEFAULT false;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'presente_rewards' AND column_name = 'hint'
    ) THEN
      ALTER TABLE presente_rewards ADD COLUMN hint text;
    END IF;
  END IF;
END $$;

-- Add quantity to user redemptions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_name = 'presente_user_rewards'
  ) THEN
    CREATE TABLE presente_user_rewards (
      id bigint primary key generated always as identity,
      user_id bigint not null references presente_users(id) on delete cascade,
      reward_id bigint,
      reward_name text not null,
      reward_description text,
      points_cost int not null DEFAULT 0,
      coins_spent int DEFAULT 0,
      quantity int DEFAULT 1,
      is_redeemed boolean default false,
      redeemed_at timestamptz default now()
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'presente_user_rewards' AND column_name = 'coins_spent'
  ) THEN
    ALTER TABLE presente_user_rewards ADD COLUMN coins_spent int DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'presente_user_rewards' AND column_name = 'points_cost'
  ) THEN
    ALTER TABLE presente_user_rewards ADD COLUMN points_cost int DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'presente_user_rewards' AND column_name = 'quantity'
  ) THEN
    ALTER TABLE presente_user_rewards ADD COLUMN quantity int DEFAULT 1;
  END IF;
END $$;

-- Add available quantity to rewards (default 1)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'presente_rewards' AND column_name = 'available_quantity'
  ) THEN
    ALTER TABLE presente_rewards ADD COLUMN available_quantity int DEFAULT 1;
  END IF;
END $$;

-- Create helper function to decrement available_quantity atomically
CREATE OR REPLACE FUNCTION decrement_reward_quantity(rid bigint, q int)
RETURNS boolean LANGUAGE plpgsql AS $$
DECLARE
  updated_count int;
BEGIN
  UPDATE presente_rewards
  SET available_quantity = available_quantity - q
  WHERE id = rid AND (available_quantity IS NULL OR available_quantity >= q);
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  IF updated_count > 0 THEN
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END; $$;

CREATE OR REPLACE FUNCTION increment_reward_quantity(rid bigint, q int)
RETURNS boolean LANGUAGE plpgsql AS $$
DECLARE
  updated_count int;
BEGIN
  UPDATE presente_rewards
  SET available_quantity = available_quantity + q
  WHERE id = rid;
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  IF updated_count > 0 THEN
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END; $$;

-- Seed catalog (insert if missing by title)
INSERT INTO presente_rewards (title, description, hint, cost_coins, is_surprise, is_active, available_quantity)
SELECT 'Açaí', 'Um açaí bem gostoso para recarregar as energias.', NULL, 100, false, true, 2
WHERE NOT EXISTS (SELECT 1 FROM presente_rewards WHERE title = 'Açaí');

INSERT INTO presente_rewards (title, description, hint, cost_coins, is_surprise, is_active, available_quantity)
SELECT 'Flores', NULL, 'Algo delicado para alegrar o dia.', 300, true, true, 1
WHERE NOT EXISTS (SELECT 1 FROM presente_rewards WHERE title = 'Flores');

INSERT INTO presente_rewards (title, description, hint, cost_coins, is_surprise, is_active, available_quantity)
SELECT 'Carta', 'Uma carta especial com palavras do coração.', NULL, 200, false, true, 1
WHERE NOT EXISTS (SELECT 1 FROM presente_rewards WHERE title = 'Carta');

INSERT INTO presente_rewards (title, description, hint, cost_coins, is_surprise, is_active, available_quantity)
SELECT 'Poema', 'Um poema feito sob medida.', NULL, 100, false, true, 1
WHERE NOT EXISTS (SELECT 1 FROM presente_rewards WHERE title = 'Poema');

INSERT INTO presente_rewards (title, description, hint, cost_coins, is_surprise, is_active, available_quantity)
SELECT 'Vale cinema', 'Uma ida ao cinema para um momento especial.', NULL, 400, false, true, 1
WHERE NOT EXISTS (SELECT 1 FROM presente_rewards WHERE title = 'Vale cinema');

INSERT INTO presente_rewards (title, description, hint, cost_coins, is_surprise, is_active, available_quantity)
SELECT 'Video especial IA', NULL, 'Um conteúdo surpreendente feito com IA.', 800, true, true, 1
WHERE NOT EXISTS (SELECT 1 FROM presente_rewards WHERE title = 'Video especial IA');

INSERT INTO presente_rewards (title, description, hint, cost_coins, is_surprise, is_active, available_quantity)
SELECT 'Livro personalizado', NULL, 'Algo único feito só para você.', 600, true, true, 1
WHERE NOT EXISTS (SELECT 1 FROM presente_rewards WHERE title = 'Livro personalizado');

INSERT INTO presente_rewards (title, description, hint, cost_coins, is_surprise, is_active, available_quantity)
SELECT 'Gift Card para roupa', 'Um gift card para escolher algo especial.', NULL, 1000, false, true, 1
WHERE NOT EXISTS (SELECT 1 FROM presente_rewards WHERE title = 'Gift Card para roupa');

INSERT INTO presente_rewards (title, description, hint, cost_coins, is_surprise, is_active, available_quantity)
SELECT 'Passeio com almoço', NULL, 'Um passeio gostoso com uma refeição especial.', 1000, true, true, 1
WHERE NOT EXISTS (SELECT 1 FROM presente_rewards WHERE title = 'Passeio com almoço');

INSERT INTO presente_rewards (title, description, hint, cost_coins, is_surprise, is_active, available_quantity)
SELECT 'Presente Master', 'O grande prêmio de toda a jornada.', NULL, 2000, false, true, 1
WHERE NOT EXISTS (SELECT 1 FROM presente_rewards WHERE title = 'Presente Master');

INSERT INTO presente_rewards (title, description, hint, cost_coins, is_surprise, is_active, available_quantity)
SELECT 'Lego', 'Um Lego especial para construir memórias.', NULL, 10000, false, true, 1
WHERE NOT EXISTS (SELECT 1 FROM presente_rewards WHERE title = 'Lego');

INSERT INTO presente_rewards (title, description, hint, cost_coins, is_surprise, is_active, available_quantity)
SELECT 'Passagem para Irlanda', 'Uma aventura especial do outro lado do oceano.', NULL, 999999, false, true, 1
WHERE NOT EXISTS (SELECT 1 FROM presente_rewards WHERE title = 'Passagem para Irlanda');

INSERT INTO presente_rewards (title, description, hint, cost_coins, is_surprise, is_active, available_quantity)
SELECT 'Passagem para o Brasil', 'Um reencontro muito esperado.', NULL, 100000, false, true, 1
WHERE NOT EXISTS (SELECT 1 FROM presente_rewards WHERE title = 'Passagem para o Brasil');

-- Verify seed
SELECT title, cost_coins, is_surprise, hint FROM presente_rewards ORDER BY cost_coins ASC;