module.exports = {
    env: {
        browser: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:astro/recommended',
        'plugin:astro/jsx-a11y-recommended',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    overrides: [
        {
            files: ['*.astro'],
            parser: 'astro-eslint-parser',
            parserOptions: {
                parser: '@typescript-eslint/parser',
                extraFileExtensions: ['.astro'],
            },
            rules: {},
        },
    ],
    root: true,
};
