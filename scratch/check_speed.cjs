const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://vihztuzsejufyucbroih.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpaHp0dXpzZWp1Znl1Y2Jyb2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5Njg0NzQsImV4cCI6MjA5MjU0NDQ3NH0.xc1_PsNdz9Fxq0uMwaoF_mvJKM2-nhkDV7wV1wxFv34';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabaseSpeed() {
  const queries = [
    { name: 'Users (all)', run: () => supabase.from('users').select('*') },
    { name: 'Attendance (today)', run: () => supabase.from('attendance').select('*').eq('date', new Date().toISOString().split('T')[0]) },
    { name: 'Time Entries (active)', run: () => supabase.from('time_entries').select('*, projects(name), tasks(name)').is('end_time', null) },
    { name: 'Tasks (all)', run: () => supabase.from('tasks').select('assignee_id, projects(name), name') }
  ];

  console.log('--- Database Query Performance ---');
  for (const q of queries) {
    const start = Date.now();
    try {
      const { data, error } = await q.run();
      const end = Date.now();
      if (error) {
        console.error(`${q.name}: FAILED in ${end - start}ms - ${error.message}`);
      } else {
        console.log(`${q.name}: SUCCESS in ${end - start}ms (${data.length} rows)`);
      }
    } catch (e) {
      const end = Date.now();
      console.error(`${q.name}: EXCEPTION in ${end - start}ms - ${e.message}`);
    }
  }
}

checkDatabaseSpeed();
