/*
  # Enable Realtime Replication

  1. Changes
    - Enable realtime replication for `expenses` table
    - Enable realtime replication for `budgets` table

  2. Notes
    - This allows real-time subscriptions to work properly
    - Dashboard will update automatically when data changes
*/

-- Enable realtime for expenses table
ALTER PUBLICATION supabase_realtime ADD TABLE expenses;

-- Enable realtime for budgets table
ALTER PUBLICATION supabase_realtime ADD TABLE budgets;