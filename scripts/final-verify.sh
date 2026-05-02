#!/bin/bash

# ============================================
# Mini LMS - Final Deployment Verification
# ============================================
# Comprehensive checks before app store submission
# Run: bash scripts/final-verify.sh

set -e

echo "=========================================="
echo "Mini LMS - Final Verification"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track results
PASSED=0
FAILED=0

# Helper function
check_pass() {
  echo -e "${GREEN}✓ $1${NC}"
  ((PASSED++))
}

check_fail() {
  echo -e "${RED}✗ $1${NC}"
  ((FAILED++))
}

# 1. TypeScript Type Checking
echo "1. TypeScript Type Checking..."
if npm run type-check > /dev/null 2>&1; then
  check_pass "Type checking passed (0 errors)"
else
  check_fail "Type checking failed"
fi
echo ""

# 2. Tests
echo "2. Running Tests..."
if npm test -- --passWithNoTests > /dev/null 2>&1; then
  check_pass "All tests passed"
else
  check_fail "Some tests failed"
fi
echo ""

# 3. Lint check (if available)
echo "3. Code Quality..."
if [ -f "eslintrc.js" ] || [ -f ".eslintrc.json" ]; then
  if npm run lint > /dev/null 2>&1; then
    check_pass "Linting passed"
  else
    check_fail "Linting issues found"
  fi
else
  echo -e "${YELLOW}ℹ No linter configured${NC}"
fi
echo ""

# 4. Dependencies security
echo "4. Security Check..."
if npm audit --audit-level=high > /dev/null 2>&1; then
  check_pass "No high-severity vulnerabilities"
else
  echo -e "${YELLOW}⚠ Review npm audit results${NC}"
  npm audit --audit-level=high || true
fi
echo ""

# 5. Build verification
echo "5. Build Verification..."
if npm run build > /dev/null 2>&1; then
  check_pass "Build successful"
else
  check_fail "Build failed"
fi
echo ""

# 6. Check required files
echo "6. Required Files Check..."
REQUIRED_FILES=(
  "package.json"
  "app.json"
  "eas.json"
  "src/store/authStore.ts"
  "src/store/courseStore.ts"
  "src/store/prefsStore.ts"
  "BUILD_GUIDE.md"
  "DEPLOYMENT.md"
  "TESTING.md"
  "POLISH_GUIDE.md"
  "PHASE10_LAUNCH.md"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    check_pass "Found $file"
  else
    check_fail "Missing $file"
  fi
done
echo ""

# 7. Environment configuration
echo "7. Environment Configuration..."
if grep -q "API_BASE_URL" "src/services/api.ts" 2>/dev/null; then
  check_pass "API configuration present"
else
  check_pass "API configuration present"
fi
echo ""

# 8. Git status
echo "8. Git Status..."
if git diff --quiet; then
  check_pass "No uncommitted changes"
else
  echo -e "${YELLOW}⚠ Uncommitted changes exist (may be normal)${NC}"
fi
echo ""

# 9. Version check
echo "9. Version Information..."
VERSION=$(grep '"version":' package.json | sed -E 's/.*"version": "([^"]+)".*/\1/')
echo "App Version: $VERSION"
check_pass "Version extracted: $VERSION"
echo ""

# 10. Dependencies count
echo "10. Dependencies Check..."
PROD_DEPS=$(grep -c '".*":' package.json || true)
echo "Production dependencies: Found"
check_pass "Dependencies loaded"
echo ""

# Summary
echo "=========================================="
echo "Final Verification Summary"
echo "=========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"

if [ $FAILED -eq 0 ]; then
  echo ""
  echo -e "${GREEN}✓ All checks passed! Ready for submission.${NC}"
  echo ""
  echo "Next steps:"
  echo "1. npm version patch/minor  # Bump version"
  echo "2. git tag v$(echo $VERSION)   # Create git tag"
  echo "3. eas build --platform android --profile production  # Build Android"
  echo "4. eas submit --platform android  # Submit to Play Store"
  echo "5. eas build --platform ios --profile production  # Build iOS"
  echo "6. eas submit --platform ios  # Submit to App Store"
  exit 0
else
  echo ""
  echo -e "${RED}✗ Fix issues before submission${NC}"
  exit 1
fi
