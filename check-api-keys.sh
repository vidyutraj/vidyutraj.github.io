#!/bin/bash
# Security check script to detect API keys in git history

echo "🔒 Checking for API key leaks in git history..."
echo ""

# Check for .env files in git history
echo "1. Checking for .env files in git history..."
if git log --all --full-history --source -- ".env" ".env.local" | grep -q "commit"; then
  echo "   ⚠️  WARNING: .env files found in git history!"
  echo "   Run: git filter-branch to remove them"
else
  echo "   ✓ No .env files in git history"
fi

# Check for actual API key patterns
echo ""
echo "2. Checking for API key patterns (gsk_*, sk-*)..."
if git log --all -p | grep -E "gsk_[a-zA-Z0-9]{20,}|sk-[a-zA-Z0-9]{20,}" | head -1 | grep -q .; then
  echo "   ⚠️  WARNING: Potential API keys found in git history!"
  echo "   Review the output above and remove if needed"
else
  echo "   ✓ No API keys found in git history"
fi

# Check if .env is currently tracked
echo ""
echo "3. Checking if .env is tracked by git..."
if git ls-files | grep -q "\.env$"; then
  echo "   ⚠️  WARNING: .env file is tracked! Remove it with:"
  echo "   git rm --cached .env"
else
  echo "   ✓ .env is not tracked"
fi

# Check if .env is ignored
echo ""
echo "4. Checking if .env is properly ignored..."
if git check-ignore .env > /dev/null 2>&1; then
  echo "   ✓ .env is properly ignored"
else
  echo "   ⚠️  WARNING: .env is NOT ignored! Add it to .gitignore"
fi

echo ""
echo "✅ Security check complete!"

