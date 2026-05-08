const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vihztuzsejufyucbroih.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpaHp0dXpzZWp1Znl1Y2Jyb2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5Njg0NzQsImV4cCI6MjA5MjU0NDQ3NH0.xc1_PsNdz9Fxq0uMwaoF_mvJKM2-nhkDV7wV1wxFv34';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
  const tables = ['users', 'attendance', 'time_entries', 'tasks', 'departments', 'designations'];
  console.log('--- Database Table Counts ---');
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      if (error) {
        console.error(`Error counting ${table}:`, error.message);
      } else {
        console.log(`${table}: ${count} rows`);
      }
    } catch (e) {
      console.error(`Exception counting ${table}:`, e.message);
    }
  }
}

checkDatabase();
