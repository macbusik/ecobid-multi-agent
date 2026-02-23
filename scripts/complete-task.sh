#!/bin/bash
# Task completion helper script
# Usage: ./scripts/complete-task.sh ITER1-1 "Implement getItemById handler"

TASK_ID="$1"
TASK_DESC="$2"

if [ -z "$TASK_ID" ] || [ -z "$TASK_DESC" ]; then
  echo "Usage: ./scripts/complete-task.sh <task-id> <description>"
  echo "Example: ./scripts/complete-task.sh ITER2-1 'Create item form UI'"
  exit 1
fi

# Check if there are changes
if [ -z "$(git status --porcelain)" ]; then
  echo "⚠️  No changes to commit"
  exit 0
fi

# Show what will be committed
echo "📝 Changes to commit:"
git status --short
echo ""

# Commit with conventional format
git add -A
git commit -m "feat($TASK_ID): $TASK_DESC

Auto-committed after task completion"

echo ""
echo "✅ Task completed and committed: $TASK_ID"
echo "📋 Description: $TASK_DESC"
