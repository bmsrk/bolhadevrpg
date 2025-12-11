# E2E Tests

This directory contains end-to-end tests for BolhaDev RPG using Playwright.

## Running Tests

```bash
# Run all tests
npm run test:e2e

# Run tests in UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run specific test
npx playwright test --grep "should load the start screen"

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Coverage

The test suite covers:
- **Start screen**: Loading and initial UI
- **Class selection**: Navigation to class selection and display of all archetypes
- **Game start**: Starting the game with a selected class
- **Location navigation**: Moving between different locations
- **Rest action**: Using the rest/heal functionality
- **Combat**: Entering combat and using combat actions
- **Cross-browser compatibility**: Testing on Chrome, Firefox, Safari, and mobile devices
- **Responsive design**: Testing on different viewport sizes

## Browser Support

Tests are configured to run on:
- Desktop Chrome (Chromium)
- Desktop Firefox
- Desktop Safari (WebKit)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

## Test Results

Current status: **8/9 tests passing**
- 1 flaky test due to random game mechanics (combat encounters are random)

## Configuration

Test configuration is in `playwright.config.ts` at the project root.

Key settings:
- Base URL: `http://localhost:3000`
- Test directory: `./e2e`
- Retry strategy: 2 retries on CI
- HTML reporter for test results
