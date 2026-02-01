import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: [
            'esbuild.js',
            'increase-version.js',
            'public/**',
            'node_modules/**',
        ],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['src/rooms/layouts/**/*.ts'],
        rules: {
            'no-multi-spaces': 'off',
        },
    },
    {
        files: ['src/site/**/*.{ts,tsx}'],
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: ['../*'],
                            message: 'Use @/site/* path aliases instead of relative imports.',
                        },
                    ],
                },
            ],
        },
    },
);

