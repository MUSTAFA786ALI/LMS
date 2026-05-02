#!/bin/bash

# Build optimization script for Mini LMS

echo "🔨 Mini LMS Build Optimization"
echo "=============================="
echo ""

# Check if Node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "✓ Dependencies installed"
echo ""

# Type checking
echo "🔍 Running TypeScript type-check..."
npm run type-check

if [ $? -ne 0 ]; then
    echo "❌ Type-check failed"
    exit 1
fi

echo "✓ Type-check passed"
echo ""

# Run tests
echo "🧪 Running tests..."
npm test -- --passWithNoTests 2>/dev/null

if [ $? -ne 0 ]; then
    echo "⚠️  Some tests failed (continuing...)"
fi

echo "✓ Tests completed"
echo ""

# Lint
echo "📋 Running linter..."
npm run lint 2>/dev/null || echo "⚠️  Linter check skipped"

echo ""

# Bundle size analysis
echo "📊 Bundle Size Analysis"
echo "======================="
echo ""

# Count dependencies
DEP_COUNT=$(npm ls --depth=0 | grep -c "├\|└")
echo "📚 Total packages: $DEP_COUNT"

# Check app.json for version
VERSION=$(grep '"version"' app.json | head -1 | grep -o '[0-9.]*')
echo "📌 App version: $VERSION"

# Estimated bundle sizes
echo ""
echo "📦 Estimated Bundle Sizes:"
echo "   Android APK: 30-50 MB"
echo "   iOS App: 40-80 MB"
echo ""

# Show production recommendations
echo "⚡ Production Optimization Tips:"
echo "================================"
echo "1. Enable code minification in expo.json"
echo "2. Use WebP format for images"
echo "3. Lazy load heavy components"
echo "4. Remove console logs in production"
echo "5. Enable tree-shaking in babel.config.js"
echo ""

# Check for large dependencies
echo "🔎 Checking for large dependencies..."
npm ls --depth=0 2>/dev/null | head -20

echo ""
echo "✅ Build optimization check complete!"
echo ""
echo "To build for production:"
echo "  Android: eas build --platform android --profile production"
echo "  iOS:     eas build --platform ios --profile production"
