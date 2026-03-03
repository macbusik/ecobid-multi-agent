#!/bin/bash
# Setup script to install SDD pre-commit hook
# Run this after cloning the repository

set -e

echo "🔧 Setting up SDD pre-commit hook..."

# Check if .git directory exists
if [ ! -d ".git" ]; then
  echo "❌ Error: Not a git repository"
  exit 1
fi

# Copy pre-commit hook
HOOK_SOURCE="scripts/hooks/pre-commit"
HOOK_DEST=".git/hooks/pre-commit"

if [ ! -f "$HOOK_SOURCE" ]; then
  echo "❌ Error: Hook source not found at $HOOK_SOURCE"
  exit 1
fi

cp "$HOOK_SOURCE" "$HOOK_DEST"
chmod +x "$HOOK_DEST"

echo "✅ Pre-commit hook installed"
echo ""
echo "The hook will:"
echo "  - Check if code changes have corresponding tasks.md updates"
echo "  - Block commits that violate SDD workflow"
echo "  - Allow bypass with [skip-sdd] in commit message (emergency only)"
echo ""
echo "To test: Try committing code without updating tasks.md"
