import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

console.log('Supabase Config Check:', {
  url: supabaseUrl ? 'Defined' : 'UNDEFINED',
  key: supabaseKey ? `Defined (Length: ${supabaseKey.length})` : 'UNDEFINED'
});

export const supabase = createClient(supabaseUrl, supabaseKey);
