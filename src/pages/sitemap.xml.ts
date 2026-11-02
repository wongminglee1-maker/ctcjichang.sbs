import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const articles = await getCollection('articles');
  const today = '2026-10-31';

  const staticPages = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: 'pricing/', priority: '0.9', changefreq: 'weekly' },
    { path: 'diagnostics/', priority: '0.9', changefreq: 'weekly' },
    { path: 'guides/', priority: '0.9', changefreq: 'weekly' },
    { path: 'about/', priority: '0.6', changefreq: 'monthly' },
    { path: 'privacy/', priority: '0.5', changefreq: 'monthly' },
    { path: 'terms/', priority: '0.5', changefreq: 'monthly' }
  ];

  const pageEntries = staticPages.map((p) => ({
    loc: `https://ctcjichang.sbs/${p.path}`,
    lastmod: today,
    priority: p.priority,
    changefreq: p.changefreq
  }));

  const articleEntries = articles.map((a) => ({
    loc: `https://ctcjichang.sbs/guides/${a.id}/`,
    lastmod: a.data.publishDate || today,
    priority: '0.8',
    changefreq: 'weekly'
  }));

  const allEntries = [...pageEntries, ...articleEntries];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries
  .map(
    (item) => `  <url>
    <loc>${item.loc}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8'
    }
  });
};
