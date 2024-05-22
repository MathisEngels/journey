import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import robots from 'astro-robots';
import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
    site: 'https://journey.mathisengels.fr',
    i18n: {
        locales: ['fr', 'en'],
        defaultLocale: 'fr',
        routing: {
            prefixDefaultLocale: true,
        },
    },
    integrations: [
        react(),
        tailwind({
            applyBaseStyles: false,
        }),
        mdx(),
        sitemap(),
        robots(),
    ],
    output: 'server',
    adapter: vercel(),
});
