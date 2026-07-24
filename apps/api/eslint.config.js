import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    rules: {
      // Allow any type in specific cases
      '@typescript-eslint/no-explicit-any': 'warn',
      // Allow unused vars prefixed with _
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      // Allow require() in config files
      '@typescript-eslint/no-require-imports': 'warn',
      // Turn off rules that conflict with Express patterns
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
  {
    // Ignore compiled output and test files
    ignores: ['dist/**', 'node_modules/**', '**/*.js'],
  },
)