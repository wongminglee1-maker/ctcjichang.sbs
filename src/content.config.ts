import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.string(),
    category: z.string(),
    readTime: z.string(),
    keywords: z.array(z.string()),
    author: z.string().default('CTC 网络自检实验室')
  })
});

export const collections = {
  articles
};
