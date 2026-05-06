
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import * as fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to find .env file
const envPath = join(process.cwd(), '.env');
const envLocalPath = join(process.cwd(), '.env.local');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf-8');
} else if (fs.existsSync(envLocalPath)) {
  envContent = fs.readFileSync(envLocalPath, 'utf-8');
}

const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
const keyMatch = envContent.match(/VITE_SUPABASE_PUBLISHABLE_KEY=(.*)/);

if (!urlMatch || !keyMatch) {
  console.error('Could not find Supabase credentials in .env');
  process.exit(1);
}

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();

const supabase = createClient(supabaseUrl, supabaseKey);

async function explore() {
  console.log('--- CHECKING USERS TABLE SCHEMA ---');
  const { data, error } = await supabase.from('users').select('*').limit(1);
  if (error) console.error(error);
  else console.log('Sample User:', data);
}

explore();
