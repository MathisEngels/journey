import { defineCollection, z } from 'astro:content';

const POICollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
    }),
});

export const collections = {
    POI: POICollection,
};
