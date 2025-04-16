# Supabase Setup Guide for COMET Scanner Wizard

This guide will help you set up Supabase for your COMET Scanner Wizard application to ensure your data persists across devices and sessions.

## 1. Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Sign up or log in to your account
3. Click "New Project"
4. Enter a project name (e.g., "comet-scanner-wizard")
5. Set a secure database password (save this somewhere safe)
6. Choose a region closest to your users
7. Click "Create new project"

## 2. Set Up Database Tables

1. Once your project is created, go to the "SQL Editor" in the left sidebar
2. Copy the contents of the `supabase-setup.sql` file in this repository
3. Paste it into the SQL Editor
4. Click "Run" to execute the SQL and create the necessary tables and policies

## 3. Create Storage Bucket

1. Go to the "Storage" section in the left sidebar
2. Click "Create new bucket"
3. Name it "images"
4. Choose "Private" for the bucket type (we'll handle access through our application)
5. Click "Create bucket"

## 4. Set Up Storage Policies

1. In the Storage section, click on the "Policies" tab
2. Click "Add Policy" for the "images" bucket
3. Choose "Custom Policy"
4. Set the policy name to "Allow public read access"
5. For the definition, use:
   ```sql
   bucket_id = 'images' AND auth.role() = 'authenticated'
   ```
6. Select all permissions (SELECT, INSERT, UPDATE, DELETE)
7. Click "Save Policy"

## 5. Get API Credentials

1. Go to the "Settings" section in the left sidebar
2. Click on "API" in the submenu
3. You'll find your:
   - Project URL (e.g., `https://your-project-id.supabase.co`)
   - `anon` public key

## 6. Configure Environment Variables

Update your `.env.local` file with the Supabase configuration:

```
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Replace the placeholder values with the actual values from your Supabase project.

## 7. Authentication Setup (Optional)

If you want to use Supabase for authentication:

1. Go to the "Authentication" section in the left sidebar
2. Click on "Providers" in the submenu
3. Enable the authentication providers you want to use (Email, Google, GitHub, etc.)
4. Configure each provider according to your needs

## 8. Testing Your Supabase Setup

1. Start your development server:
   ```
   npm run dev
   ```
2. Navigate to your admin dashboard
3. Try uploading a banner image and some scanner variations
4. Check the Supabase dashboard to verify that data is being stored correctly

## Troubleshooting

If you encounter issues with your Supabase setup:

1. Check the browser console for error messages
2. Verify that your environment variables are set correctly
3. Check the Supabase dashboard for any error logs
4. Ensure that your database tables and storage buckets are set up correctly
5. Verify that your RLS policies are not too restrictive

## Migration from Firebase

If you're migrating from Firebase, the application includes a migration utility that will automatically transfer your data from Firebase to Supabase when you first load the application after the switch.

The migration process:
1. Checks if you have existing data in Firebase
2. Transfers images and content metadata to Supabase
3. Preserves all your existing content

No manual migration steps are required!
