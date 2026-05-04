const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY);

async function fixAttendanceTable() {
  console.log('Adding missing columns to attendance table...');
  
  const queries = [
    'ALTER TABLE attendance ADD COLUMN IF NOT EXISTS break_time TEXT DEFAULT \'00h 00m\';',
    'ALTER TABLE attendance ADD COLUMN IF NOT EXISTS shift_start TEXT DEFAULT \'09:00 AM\';',
    'ALTER TABLE attendance ADD COLUMN IF NOT EXISTS shift_end TEXT DEFAULT \'06:00 PM\';',
    'ALTER TABLE attendance ADD COLUMN IF NOT EXISTS min_hours TEXT DEFAULT \'08h 00m\';',
    'ALTER TABLE attendance ADD COLUMN IF NOT EXISTS is_late BOOLEAN DEFAULT false;'
  ];

  for (const query of queries) {
    const { error } = await supabase.rpc('exec_sql', { sql_query: query });
    if (error) {
      // Fallback if exec_sql doesn't exist
      console.log(`Failed to run query via RPC: ${query}. Error: ${error.message}`);
      console.log('Please run this SQL in Supabase Dashboard SQL Editor:');
      console.log(query);
    } else {
      console.log(`Successfully ran: ${query}`);
    }
  }
}

fixAttendanceTable();
