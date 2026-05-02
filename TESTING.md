# Testing Guide - Mini LMS Mobile App

## Overview

This project uses **Jest** and **React Native Testing Library** for comprehensive testing coverage.

## Test Structure

```
src/__tests__/
├── hooks/
│   ├── useAuth.test.ts
│   ├── useCourses.test.ts
│   └── useOfflineFirst.test.ts
├── components/
│   └── Button.test.tsx
├── store/
│   └── courseStore.test.ts
└── integration/
    └── authFlow.test.ts
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (auto-rerun on file changes)
```bash
npm run test:watch
```

### Generate coverage report
```bash
npm run test:coverage
```

## Test Coverage

Current coverage targets:
- **Branches**: 50%
- **Functions**: 50%
- **Lines**: 50%
- **Statements**: 50%

View coverage report:
```bash
npm run test:coverage
# Reports generated in ./coverage/ directory
```

## Test Categories

### 1. Hook Tests (`src/__tests__/hooks/`)

#### useAuth.test.ts
Tests authentication hook functionality:
- Initial state validation
- Login/register flow
- Logout state clearing
- Error handling

**Key Tests:**
```javascript
✓ should return initial state
✓ should handle login with valid credentials
✓ should handle logout
✓ should have clearError function
```

#### useCourses.test.ts
Tests course management hook:
- Bookmark functionality
- Enrollment tracking
- Course filtering/search
- Bookmark/enrollment state queries

**Key Tests:**
```javascript
✓ should check if course is bookmarked
✓ should check if course is enrolled
✓ should get bookmarked courses
✓ should handle toggle bookmark
✓ should handle add enrollment
```

#### useOfflineFirst.test.ts
Tests offline-first data strategy:
- Cache validation
- TTL checking
- Cache age formatting
- Manual refresh capability

**Key Tests:**
```javascript
✓ should return initial state
✓ should validate cache
✓ should return formatted cache age
✓ should return error when offline
```

### 2. Component Tests (`src/__tests__/components/`)

#### Button.test.tsx
Tests Button UI component:
- Rendering with label
- Press callbacks
- Different variants (primary, secondary, danger)
- Different sizes (sm, md, lg)
- Disabled state
- Loading state
- Full width layout

**Key Tests:**
```javascript
✓ should render with label
✓ should call onPress when pressed
✓ should support different variants
✓ should be disabled when isDisabled is true
✓ should show loading state
```

### 3. Store Tests (`src/__tests__/store/`)

#### courseStore.test.ts
Tests Zustand course store:
- Bookmark management (add, remove, toggle)
- Enrollment management
- Course filtering
- Error state management
- Getting bookmarked/enrolled courses

**Key Tests:**
```javascript
✓ should have initial state
✓ should add bookmark
✓ should toggle bookmark
✓ should add enrollment
✓ should get bookmarked courses
✓ should get enrolled courses
```

### 4. Integration Tests (`src/__tests__/integration/`)

#### authFlow.test.ts
Tests complete user flows:
- Login → Course Loading flow
- Logout with state clearing
- Bookmark → Enrollment flow
- Search functionality

**Key Tests:**
```javascript
✓ should load courses after user login
✓ should clear auth state after logout
✓ should handle bookmark and enrollment flow
✓ should handle search flow
```

## Mocking Strategy

### Environment Mocks (jest.setup.js)
- **AsyncStorage**: Local device storage
- **SecureStore**: Secure token storage
- **NetInfo**: Network connectivity detection
- **Notifications**: Local notification system

### Module Mocks
- API endpoints (courseAPI, authAPI)
- Network services
- Storage services

## Writing New Tests

### Template: Hook Test
```typescript
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useMyHook } from '@/src/hooks/useMyHook';

describe('useMyHook', () => {
  beforeEach(() => {
    // Setup before each test
  });

  it('should do something', async () => {
    const { result } = renderHook(() => useMyHook());

    expect(result.current.something).toBeDefined();

    await act(async () => {
      await result.current.action();
    });

    await waitFor(() => {
      expect(result.current.state).toBe('expected');
    });
  });
});
```

### Template: Component Test
```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { MyComponent } from '@/src/components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);

    expect(screen.getByText('Expected Text')).toBeTruthy();
  });

  it('should handle user interaction', () => {
    const mockCallback = jest.fn();
    render(<MyComponent onPress={mockCallback} />);

    fireEvent.press(screen.getByRole('button'));

    expect(mockCallback).toHaveBeenCalled();
  });
});
```

### Template: Store Test
```typescript
import { useMyStore } from '@/src/store/myStore';

describe('myStore', () => {
  beforeEach(() => {
    useMyStore.setState({ /* reset state */ });
  });

  it('should update state', () => {
    const state = useMyStore.getState();

    state.action();

    expect(useMyStore.getState().property).toBe('expected');
  });
});
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Reset stores/mocks before each test
3. **Async**: Use `act()` and `waitFor()` for async operations
4. **Mocking**: Mock external dependencies
5. **Naming**: Describe what test does clearly
6. **AAA Pattern**: Arrange → Act → Assert

## Continuous Integration

When running in CI/CD:
```bash
npm run type-check  # Type checking
npm test            # Run all tests
npm run test:coverage  # Generate coverage report
```

## Troubleshooting

### Test timeouts
- Increase jest timeout: `jest.setTimeout(10000)`
- Check for unresolved promises

### AsyncStorage not working
- Verify mock in jest.setup.js
- Use `waitFor()` for async operations

### Navigation errors
- Mock router/navigation in tests
- Use conditional rendering in components

## Debugging Tests

### Run single test file
```bash
npm test -- useAuth.test.ts
```

### Run with verbose output
```bash
npm test -- --verbose
```

### Debug in VSCode
Add to .vscode/launch.json:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand", "--no-coverage"],
  "console": "integratedTerminal"
}
```

## Future Test Coverage

Planned test additions:
- [ ] Screen component tests
- [ ] Form validation tests
- [ ] API client tests
- [ ] Error boundary tests
- [ ] Navigation flow tests
- [ ] Dark mode tests
- [ ] Accessibility tests
- [ ] Performance tests

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
