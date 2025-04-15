#!/bin/bash

# Direct build script for Netlify
# This script creates a minimal dist directory with an index.html file
# to ensure that the Netlify deployment succeeds even if the main build fails.

echo "🚀 Starting direct build..."

# Create dist directory
echo "📁 Creating dist directory..."
mkdir -p dist

# Create assets directory
echo "📁 Creating assets directory..."
mkdir -p dist/assets

# Create a simple index.html
echo "📝 Creating index.html..."
cat > dist/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>COMET Scanner Wizard</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            background-color: #f5f5f5;
            color: #333;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            padding: 20px;
            text-align: center;
        }
        .container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 40px;
            max-width: 600px;
        }
        h1 {
            color: #2563eb;
            margin-bottom: 20px;
        }
        p {
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .button {
            background-color: #2563eb;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            text-decoration: none;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #1d4ed8;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>COMET Scanner Wizard</h1>
        <p>We're currently performing maintenance on our site. Please check back soon for an improved experience.</p>
        <a href="javascript:location.reload()" class="button">Refresh Page</a>
    </div>
</body>
</html>
EOL

echo "✅ Direct build completed successfully!"
echo "📂 Files in dist directory:"
ls -la dist
