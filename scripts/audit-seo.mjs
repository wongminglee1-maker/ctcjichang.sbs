import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = './dist';

console.log('=== [2/6] 审计：技术 SEO 与元数据合规检测 ===\n');

let hasError = false;

// 1. Check robots.txt
const robotsPath = path.join(DIST_DIR, 'robots.txt');
if (!fs.existsSync(robotsPath)) {
  console.error('❌ 缺少 dist/robots.txt');
  hasError = true;
} else {
  const robots = fs.readFileSync(robotsPath, 'utf-8');
  if (robots.includes('User-agent: *') && robots.includes('sitemap.xml')) {
    console.log('✓ robots.txt 结构完备且包含 Sitemap 指引');
  } else {
    console.error('❌ robots.txt 内容不完整');
    hasError = true;
  }
}

// 2. Check sitemap.xml
const sitemapPath = path.join(DIST_DIR, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  console.error('❌ 缺少 dist/sitemap.xml');
  hasError = true;
} else {
  const sitemap = fs.readFileSync(sitemapPath, 'utf-8');
  const urlsCount = (sitemap.match(/<loc>/g) || []).length;
  console.log(`✓ sitemap.xml 存在，包含 ${urlsCount} 个正式 URL`);
  if (!sitemap.includes('https://ctcjichang.sbs/guides/ctc-windows-proxy/')) {
    console.error('❌ sitemap.xml 未收录关键文章');
    hasError = true;
  }
}

// 3. Scan HTML files
function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = getHtmlFiles(DIST_DIR);
console.log(`\n扫描到 ${htmlFiles.length} 个静态 HTML 页面：`);

for (const filePath of htmlFiles) {
  const relPath = path.relative(DIST_DIR, filePath).replace(/\\/g, '/');
  const html = fs.readFileSync(filePath, 'utf-8');

  // Skip 404 for certain index checks
  const is404 = relPath.includes('404');

  // Check Title
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    console.error(`❌ [${relPath}] 缺少有效 <title>`);
    hasError = true;
  }

  // Check Meta Description
  const descMatch = html.match(/<meta name="description" content="([^"]+)"/i);
  if (!descMatch || !descMatch[1].trim()) {
    console.error(`❌ [${relPath}] 缺少有效 meta description`);
    hasError = true;
  }

  // Check H1
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!h1Match || !h1Match[1].trim()) {
    console.error(`❌ [${relPath}] 缺少 <h1> 标签`);
    hasError = true;
  }

  // Check Canonical
  const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/i);
  if (!canonicalMatch) {
    console.error(`❌ [${relPath}] 缺少规范链接 <link rel="canonical">`);
    hasError = true;
  } else if (!canonicalMatch[1].startsWith('https://ctcjichang.sbs/')) {
    console.error(`❌ [${relPath}] Canonical 域名不正确: ${canonicalMatch[1]}`);
    hasError = true;
  }

  // Check robots meta (must not have erroneous noindex on indexable pages)
  if (!is404 && html.includes('content="noindex"')) {
    console.error(`❌ [${relPath}] 发现错误配置的 noindex 标识！`);
    hasError = true;
  }

  // Check Schema.org JSON-LD scripts specifically
  const jsonLdMatches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  for (const jsonLd of jsonLdMatches) {
    const jsonContent = jsonLd[1];
    if (jsonContent.includes('AggregateRating')) {
      console.error(`❌ [${relPath}] JSON-LD 中包含未经核实的虚假 AggregateRating 结构化数据！`);
      hasError = true;
    }
  }

  console.log(`  ✓ [${relPath}] Title: "${titleMatch ? titleMatch[1].slice(0, 30) + '...' : ''}" | Canonical: OK`);
}

console.log('\n=== 技术 SEO 审计结果 ===');
if (hasError) {
  console.error('❌ 技术 SEO 审计未通过，存在需修复项！');
  process.exit(1);
} else {
  console.log('✅ 所有静态页面的 Title、Description、H1、Canonical、Robots、Sitemap 与 Schema 全部合格！');
}
