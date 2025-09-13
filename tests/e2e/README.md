# E2E Tests for LNN Legal Desktop

This directory contains comprehensive end-to-end tests for the LNN Legal Desktop application using Playwright.

## Test Coverage

The E2E tests cover the following functionality:

### Core Application Tests
- ✅ App launch and dashboard display
- ✅ Navigation between all pages
- ✅ Responsive design across devices
- ✅ Accessibility features
- ✅ Performance and load times
- ✅ Error handling and edge cases

### Case Management Tests
- ✅ Add case by CNR using mock provider
- ✅ Case detail navigation and display
- ✅ Case creation workflow
- ✅ Case search functionality

### Task Management Tests
- ✅ Move tasks across Kanban board
- ✅ Log work on tasks
- ✅ Task creation and assignment
- ✅ Task status transitions

### Automation Rules Tests
- ✅ Hearing prep task automation (creates task 3 days before hearing)
- ✅ Order processing automation (creates task +1 day after order upload)
- ✅ Blocked task notifications (notify after 48 hours)
- ✅ SLA breach notifications

### Integration Tests
- ✅ Mock eCourts provider integration
- ✅ Mock Karnataka High Court provider integration
- ✅ CNR lookup functionality
- ✅ Court provider connection testing

### Backup and Restore Tests
- ✅ Export backup functionality
- ✅ Verify ZIP file contents
- ✅ Restore from backup
- ✅ Data integrity verification

### Electron Integration Tests
- ✅ IPC communication testing
- ✅ Native notifications
- ✅ Desktop integration features

## Test Structure

```
tests/e2e/
├── README.md                           # This file
├── test-config.ts                      # Test configuration and mock data
├── helpers/
│   └── test-helpers.ts                 # Test utility functions
├── legal-desktop-e2e.spec.ts           # Main E2E tests
├── electron-integration.spec.ts        # Electron-specific tests
└── comprehensive-e2e.spec.ts           # Comprehensive test suite
```

## Running Tests

### Prerequisites
1. Install dependencies: `pnpm install`
2. Install Playwright browsers: `pnpm test:e2e:install`
3. Start the web application: `pnpm dev:web`

### Test Commands

```bash
# Run all E2E tests
pnpm test:e2e

# Run tests with UI mode (interactive)
pnpm test:e2e:ui

# Run tests in headed mode (visible browser)
pnpm test:e2e:headed

# Run tests in debug mode
pnpm test:e2e:debug

# Show test report
pnpm test:e2e:report
```

### Running Specific Tests

```bash
# Run specific test file
npx playwright test legal-desktop-e2e.spec.ts

# Run specific test by name
npx playwright test --grep "should add a case by CNR"

# Run tests for specific browser
npx playwright test --project=chromium
```

## Test Configuration

The test configuration is defined in `test-config.ts` and includes:

- **URLs**: Base URLs for different environments
- **Test Data**: Mock data for cases, hearings, tasks, and providers
- **Mock Providers**: Configuration for eCourts and KHC providers
- **Automation Rules**: Settings for automated task creation
- **Performance Thresholds**: Expected response times
- **Browser Settings**: Browser-specific configurations

## Mock Data

The tests use comprehensive mock data including:

### Mock Cases
- Case numbers, titles, courts, and stages
- Party information
- Hearing schedules
- Task assignments

### Mock Providers
- **eCourts Provider**: CNR lookup, case search, cause list
- **KHC Provider**: Case lookup, cause list, order download
- Error scenarios and captcha handling

### Mock Automation Rules
- Hearing prep task creation (3 days before hearing)
- Order processing tasks (+1 day after upload)
- Blocked task notifications (48 hours)
- SLA breach notifications

## Test Helpers

The `TestHelpers` class provides utility functions for:

- Navigation between pages
- Creating mock data
- Testing automation rules
- Verifying backup/restore functionality
- Testing responsive design
- Accessibility testing

## Browser Support

Tests run on:
- ✅ Chromium (Chrome/Edge)
- ✅ Firefox
- ✅ WebKit (Safari)

## Continuous Integration

The tests are configured for CI/CD with:
- Automatic browser installation
- Parallel test execution
- Retry on failure
- HTML report generation
- Screenshot capture on failure

## Debugging Tests

### Debug Mode
```bash
pnpm test:e2e:debug
```

### UI Mode
```bash
pnpm test:e2e:ui
```

### Headed Mode
```bash
pnpm test:e2e:headed
```

### Trace Viewer
```bash
npx playwright show-trace trace.zip
```

## Test Data Management

### Creating Test Data
Tests use mock data defined in `test-config.ts`. For real data testing:

1. Create test database with seed data
2. Use `pnpm seed` to populate test data
3. Configure tests to use real data instead of mocks

### Cleaning Up
Tests automatically clean up data after execution using the `cleanupTestData()` helper.

## Performance Testing

Tests include performance benchmarks:
- Page load time: < 5 seconds
- Navigation time: < 2 seconds
- API response time: < 3 seconds
- Backup creation time: < 30 seconds

## Accessibility Testing

Tests verify:
- Keyboard navigation
- ARIA labels and roles
- Focus management
- Screen reader compatibility

## Future Enhancements

Planned improvements:
- [ ] Visual regression testing
- [ ] Cross-browser compatibility testing
- [ ] Mobile device testing
- [ ] Load testing
- [ ] Security testing
- [ ] API integration testing

## Troubleshooting

### Common Issues

1. **Browser not found**: Run `pnpm test:e2e:install`
2. **Port conflicts**: Ensure port 3000 is available
3. **Test timeouts**: Increase timeout in `playwright.config.ts`
4. **Mock data issues**: Check `test-config.ts` configuration

### Debug Tips

1. Use `--headed` mode to see browser actions
2. Use `--debug` mode for step-by-step execution
3. Check test reports for detailed failure information
4. Use trace viewer for complex debugging

## Contributing

When adding new tests:

1. Follow the existing test structure
2. Add appropriate mock data to `test-config.ts`
3. Use helper functions from `TestHelpers`
4. Include both positive and negative test cases
5. Add performance benchmarks where applicable
6. Update this README with new test coverage

