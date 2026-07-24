import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Where to find tests
    include: ['src/**/*.{test,spec}.ts'],
    // Never fail silently on zero tests in a directory
    // but don't fail the whole suite if some dirs are empty
    passWithNoTests: false,
    // Test environment
    environment: 'node',
    // Setup files run before each test file
    setupFiles: [],
    // Coverage settings for later
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.spec.ts',
        'src/server.ts',
        'dist/**',
      ],
    },
    // Timeout per test
    testTimeout: 10000,
  },
})