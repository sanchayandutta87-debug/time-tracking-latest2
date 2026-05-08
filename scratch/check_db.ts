import { supabase } from './src/utils/supabase';

async function checkDatabase() {
  const tables = ['users', 'attendance', 'time_entries', 'tasks', 'departments', 'designations'];
  console.log('--- Database Table Counts ---');
  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    if (error) {
      console.error(`Error counting ${table}:`, error.message);
    } else {
      console.log(`${table}: ${count} rows`);
    }
  }
}

checkDatabase();
