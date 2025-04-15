#!/bin/bash

# Script to push COMET Scanner Wizard to GitHub
# Run this script from the project root directory

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== COMET Scanner Wizard GitHub Push Script ===${NC}"
echo

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: Git is not installed. Please install Git first.${NC}"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo -e "${RED}Error: This doesn't appear to be the COMET Scanner Wizard project directory.${NC}"
    echo "Please run this script from the project root directory."
    exit 1
fi

# Initialize git repository if it doesn't exist
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Initializing Git repository...${NC}"
    git init
    echo -e "${GREEN}Git repository initialized.${NC}"
else
    echo -e "${GREEN}Git repository already initialized.${NC}"
fi

# Ask for GitHub username
echo
echo -e "${YELLOW}Please enter your GitHub username:${NC}"
read github_username

# Ask for repository name or use default
echo
echo -e "${YELLOW}Please enter your GitHub repository name (or press Enter to use 'comet-scanner-wizard'):${NC}"
read github_repo
if [ -z "$github_repo" ]; then
    github_repo="comet-scanner-wizard"
fi

# Configure remote
echo
echo -e "${YELLOW}Setting up GitHub remote...${NC}"
git remote remove origin 2>/dev/null
git remote add origin "https://github.com/$github_username/$github_repo.git"
echo -e "${GREEN}Remote 'origin' set to https://github.com/$github_username/$github_repo.git${NC}"

# Add all files
echo
echo -e "${YELLOW}Adding files to Git...${NC}"
git add .
echo -e "${GREEN}Files added.${NC}"

# Commit changes
echo
echo -e "${YELLOW}Committing changes...${NC}"
git commit -m "Initial commit: COMET Scanner Wizard with performance optimizations"
echo -e "${GREEN}Changes committed.${NC}"

# Check if main branch exists, if not create it
if ! git rev-parse --verify main >/dev/null 2>&1; then
    echo -e "${YELLOW}Creating main branch...${NC}"
    git checkout -b main
    echo -e "${GREEN}Main branch created.${NC}"
fi

# Push to GitHub
echo
echo -e "${YELLOW}Pushing to GitHub...${NC}"
echo -e "${YELLOW}You will be prompted for your GitHub credentials.${NC}"
echo -e "${YELLOW}Note: If you have 2FA enabled, you'll need to use a personal access token instead of your password.${NC}"
echo

# Try pushing to main branch
git push -u origin main

# Check if push was successful
if [ $? -eq 0 ]; then
    echo
    echo -e "${GREEN}Successfully pushed to GitHub!${NC}"
    echo -e "${GREEN}Your repository is now available at: https://github.com/$github_username/$github_repo${NC}"
    echo -e "${GREEN}GitHub Pages will be available at: https://$github_username.github.io/$github_repo/${NC}"
    echo
    echo -e "${YELLOW}Note: It may take a few minutes for GitHub Actions to deploy your site.${NC}"
else
    echo
    echo -e "${RED}Failed to push to GitHub.${NC}"
    echo -e "${YELLOW}Please check your credentials and try again.${NC}"
    echo -e "${YELLOW}You can manually push with: git push -u origin main${NC}"
fi
