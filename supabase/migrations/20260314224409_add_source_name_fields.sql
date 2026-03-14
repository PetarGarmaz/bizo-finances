/*
  # Add Source Name Fields

  1. Changes to Tables
    - `expenses`
      - Add `source_name` (text) - Name of the store/vendor (e.g., Konzum, Pevex, Lidl)
    
    - `budgets`
      - Add `source_name` (text) - Source of budget (e.g., Revolut, Cash, Bank Account)

  2. Notes
    - Both fields are optional (nullable)
    - Existing `source` field in expenses will remain for tracking method (manual, qr_scan, etc.)
    - `source_name` is for user-friendly identification of where money came from/went to
*/

-- Add source_name to expenses table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'source_name'
  ) THEN
    ALTER TABLE expenses ADD COLUMN source_name text;
  END IF;
END $$;

-- Add source_name to budgets table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'budgets' AND column_name = 'source_name'
  ) THEN
    ALTER TABLE budgets ADD COLUMN source_name text;
  END IF;
END $$;