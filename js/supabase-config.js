/**
 * Campus Calories v2.0 - Supabase Configuration
 * Cloud database and authentication setup
 */

const SUPABASE_URL = 'https://mdlyfncfsricxlvuiqej.supabase.co';
// Get this from: Supabase Dashboard > Settings > API > Project API Keys > anon/public
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kbHlmbmNmc3JpY3hsdnVpcWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3ODg1NjcsImV4cCI6MjA4OTM2NDU2N30.BxymTI7FeTtXsKvJKoBydXxGJISLmN4E2FP0Tk9muaM';

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
