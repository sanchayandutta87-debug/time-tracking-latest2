
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY);

async function createDummyRequests() {
  const { data: users } = await supabase.from('users').select('id').limit(2);
  if (!users || users.length === 0) {
    console.log('No users found to assign requests to.');
    return;
  }

  // 1. Ensure projects exist and create time entries
  const projectNames = ['test', 'Codex WEBSITE'];
  for (const name of projectNames) {
    let { data: p } = await supabase.from('projects').select('id').eq('name', name).maybeSingle();
    if (!p) {
      const { data: newP } = await supabase.from('projects').insert([{ name, status: 'active' }]).select().single();
      p = newP;
    }
    
    if (p) {
      await supabase.from('time_entries').insert([
        {
          user_id: users[0].id,
          project_id: p.id,
          start_time: new Date(Date.now() - 3600000 * 24).toISOString(), // Yesterday
          duration_seconds: 14400, // 4 hours
          description: `Supporting ${name}`
        },
        {
          user_id: users[users.length - 1].id,
          project_id: p.id,
          start_time: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
          duration_seconds: 7200, // 2 hours
          description: `Development for ${name}`
        }
      ]);
      console.log(`Created time entries for ${name}`);
    }
  }

  // 2. Create a Leave Request
  const { error: leaveErr } = await supabase.from('leave_requests').insert([
    {
      user_id: users[0].id,
      type: 'vacation',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      reason: 'Family vacation',
      status: 'pending'
    }
  ]);
  if (leaveErr) console.error('Error creating leave request:', leaveErr);
  else console.log('Dummy leave request created.');
}

createDummyRequests();
