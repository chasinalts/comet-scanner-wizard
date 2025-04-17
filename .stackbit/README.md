# Stackbit Configuration

This directory contains configuration files for Stackbit.

## Structure

- `models/` - Contains model definitions for content types
- `presets/` - Contains preset configurations for content types

## Environment Variables

The following environment variables are used by the application:

- `VITE_SUPABASE_URL` - The URL of your Supabase instance
- `VITE_SUPABASE_ANON_KEY` - The anonymous key for your Supabase instance

These are defined in the `.env.stackbit` file.

## Development

To run the development server with Stackbit:

```bash
npm run stackbit:dev
```

This will start the development server on port 8090.

## Deployment

To deploy the application:

```bash
npm run build
```

This will build the application for production.
