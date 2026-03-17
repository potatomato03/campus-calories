/**
 * Campus Calories v2.0 - Supabase Configuration
 * Cloud database and authentication setup
 */

const SUPABASE_URL = 'https://mdlyfncfsricxlvuiqej.supabase.co';
// Get this from: Supabase Dashboard > Settings > API > Project API Keys > anon/public
const SUPABASE_ANON_KEY = 'sb_publishable_P6Hg4MJt0oneW4ItHpvfnw_K9lvxE_5';

let supabaseClient = null;

function initSupabase() {
  try {
    if (typeof supabase !== 'undefined' && supabase.createClient) {
      supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log('Supabase client initialized');
      return supabaseClient;
    }
  } catch (err) {
    console.warn('Supabase initialization failed:', err);
  }
  console.warn('Supabase JS library not loaded — running in offline-only mode');
  return null;
}

function getSupabase() {
  return supabaseClient;
}

function isSupabaseConfigured() {
  return supabaseClient !== null && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY';
}
