# SDD Pre-Commit Hook

## Purpose

Enforces Spec-Driven Development (SDD) workflow by preventing commits that change code without updating `tasks.md`.

## How It Works

The pre-commit hook checks:
1. **Are code files being committed?** (`.ts`, `.tsx`, `.js`, `.jsx`)
2. **Is `tasks.md` also being updated?**

If code changes without task updates → **Commit blocked** ❌

## Installation

### First Time Setup
```bash
./scripts/setup-hooks.sh
```

### Manual Installation
```bash
cp scripts/hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

## Usage

### Normal Workflow (Allowed ✅)
```bash
# 1. Update tasks.md with new task or status change
vim .kiro/specs/ecobid-marketplace/tasks.md

# 2. Make code changes
vim frontend/src/pages/NewFeature.tsx

# 3. Stage both files
git add .kiro/specs/ecobid-marketplace/tasks.md
git add frontend/src/pages/NewFeature.tsx

# 4. Commit
git commit -m "feat: Add new feature (ITER5-1)"
# ✅ Commit allowed - tasks.md was updated
```

### Blocked Scenario (Violation ❌)
```bash
# 1. Make code changes
vim frontend/src/pages/NewFeature.tsx

# 2. Stage only code
git add frontend/src/pages/NewFeature.tsx

# 3. Try to commit
git commit -m "feat: Add new feature"
# ❌ BLOCKED - tasks.md not updated
```

### Emergency Bypass (Use Sparingly ⚠️)
```bash
# For hotfixes, critical bugs, or documentation-only changes
git commit -m "hotfix: Critical production bug [skip-sdd]"
# ✅ Allowed with bypass flag
```

## What Gets Checked

### Code Files (Checked)
- `*.ts` - TypeScript
- `*.tsx` - React TypeScript
- `*.js` - JavaScript
- `*.jsx` - React JavaScript

### Excluded Files (Not Checked)
- `*.test.ts` - Test files
- `*.spec.ts` - Spec files
- `*.config.ts` - Config files
- `*.d.ts` - Type definitions
- Documentation files (`.md`)
- Configuration files (`.json`, `.yml`)

## Error Messages

### SDD Violation
```
❌ SDD VIOLATION DETECTED

Code files were changed but tasks.md was not updated.

SDD Workflow requires:
  1. Create task in .kiro/specs/*/tasks.md
  2. Get approval
  3. Implement code
  4. Update task status

Changed code files:
  - frontend/src/pages/NewFeature.tsx

To fix:
  1. Update tasks.md with task status
  2. Stage tasks.md: git add .kiro/specs/*/tasks.md
  3. Commit again

To bypass (emergency only):
  Add [skip-sdd] to commit message
```

## When to Use Bypass

**Allowed:**
- Hotfixes for production bugs
- Reverting broken commits
- Fixing typos in comments
- Updating dependencies

**Not Allowed:**
- New features
- Refactoring
- Bug fixes that require testing
- Any change that affects functionality

## Troubleshooting

### Hook Not Running
```bash
# Check if hook is executable
ls -la .git/hooks/pre-commit

# Make it executable
chmod +x .git/hooks/pre-commit
```

### Hook Running on Wrong Files
The hook checks file extensions. If you're using a different language, update the hook:
```bash
vim .git/hooks/pre-commit
# Add your file extensions to the check
```

### Disable Hook Temporarily
```bash
# Option 1: Use bypass flag
git commit -m "message [skip-sdd]"

# Option 2: Skip all hooks (not recommended)
git commit --no-verify -m "message"

# Option 3: Disable hook
mv .git/hooks/pre-commit .git/hooks/pre-commit.disabled
```

## Integration with CI/CD

The hook runs locally. For CI/CD enforcement, add a check in your pipeline:

```yaml
# .github/workflows/sdd-check.yml
name: SDD Compliance Check
on: [pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: Check SDD compliance
        run: |
          # Check if code files changed
          CODE_CHANGED=$(git diff --name-only origin/main...HEAD | grep -E '\.(ts|tsx|js|jsx)$' | grep -v -E '\.(test|spec|config|d)\.' || true)
          # Check if tasks.md changed
          TASKS_CHANGED=$(git diff --name-only origin/main...HEAD | grep 'tasks.md' || true)
          
          if [ -n "$CODE_CHANGED" ] && [ -z "$TASKS_CHANGED" ]; then
            echo "❌ SDD violation: Code changed without tasks.md update"
            exit 1
          fi
```

## Philosophy

**Why enforce this?**
- Prevents ad-hoc coding
- Ensures all work is tracked
- Maintains project documentation
- Forces planning before implementation
- Creates audit trail of decisions

**The rule:**
> "If it's not in tasks.md, it doesn't exist."

## See Also

- [AGENTS.md](../../AGENTS.md) - SDD workflow rules
- [tasks.md](./.kiro/specs/ecobid-marketplace/tasks.md) - Task tracking
- [SDD Methodology](https://example.com/sdd) - Full methodology
