/*
  # Create Expenses and Budget Tables

  1. New Tables
    - `budgets`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (uuid) - User identifier for future auth integration
      - `amount` (numeric) - Budget amount
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `expenses`
      - `id` (uuid, primary key) - Unique identifier
      - `user_id` (uuid) - User identifier for future auth integration
      - `amount` (numeric) - Expense amount
      - `description` (text) - Optional expense description
      - `source` (text) - Source of expense (manual, qr_scan, etc.)
      - `receipt_url` (text) - Optional receipt URL from QR scan
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on both tables
    - For now, allow all operations (will be restricted when auth is added)
    - Tables are ready for future user-based access control
*/

-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  amount numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  amount numeric NOT NULL,
  description text DEFAULT '',
  source text DEFAULT 'manual',
  receipt_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create policies (open for now, will restrict when auth is added)
CREATE POLICY "Allow all operations on budgets"
  ON budgets
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on expenses"
  ON expenses
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_budgets_updated_at ON budgets(updated_at DESC);