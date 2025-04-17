import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Check your .env or .env.local file.');

  // Display a user-friendly error message in the UI
  const errorElement = document.createElement('div');
  errorElement.style.position = 'fixed';
  errorElement.style.top = '0';
  errorElement.style.left = '0';
  errorElement.style.width = '100%';
  errorElement.style.padding = '20px';
  errorElement.style.backgroundColor = '#f44336';
  errorElement.style.color = 'white';
  errorElement.style.textAlign = 'center';
  errorElement.style.zIndex = '9999';
  errorElement.innerHTML = `
    <h3>Failed to initialize Supabase</h3>
    <p>Please check your Supabase configuration in .env.local file.</p>
  `;

  // Add to DOM when it's ready
  if (document.body) {
    document.body.appendChild(errorElement);
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(errorElement);
    });
  }
}

// Initialize Supabase client with fallback values if needed
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export default supabase;
