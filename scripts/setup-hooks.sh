#!/bin/bash
# Setup script to install SDD git hooks
# Run this after cloning the repository

set -e

echo "🔧 Setting up SDD git hooks..."

# Check if .git directory exists
if [ ! -d ".git" ]; then
  echo "❌ Error: Not a git repository"
  exit 1
fi

# Install pre-commit hook
PRECOMMIT_SOURCE="scripts/hooks/pre-commit"
PRECOMMIT_DEST=".git/hooks/pre-commit"

if [ ! -f "$PRECOMMIT_SOURCE" ]; then
  echo "❌ Error: pre-commit hook not found at $PRECOMMIT_SOURCE"
  exit 1
fi

cp "$PRECOMMIT_SOURCE" "$PRECOMMIT_DEST"
chmod +x "$PRECOMMIT_DEST"
echo "✅ pre-commit hook installed"

# Install post-commit hook
POSTCOMMIT_SOURCE="scripts/hooks/post-commit"
POSTCOMMIT_DEST=".git/hooks/post-commit"

if [ ! -f "$POSTCOMMIT_SOURCE" ]; then
  echo "❌ Error: post-commit hook not found at $POSTCOMMIT_SOURCE"
  exit 1
fi

cp "$POSTCOMMIT_SOURCE" "$POSTCOMMIT_DEST"
chmod +x "$POSTCOMMIT_DEST"
echo "✅ post-commit hook installed"

echo ""
echo "🎉 SDD hooks installed successfully!"
echo ""
echo "Hooks installed:"
echo "  - pre-commit: Blocks code changes without task updates"
echo "  - post-commit: Verifies task status and acceptance criteria"
echo ""
echo "To bypass pre-commit: Use [skip-sdd] in commit message (emergency only)"
