import fs from 'node:fs';
import path from 'node:path';

const DIST_DIR = './dist';
const REGISTER_URL = 'https://varnexa.lingdongaff.com/#/?code=HHoxxHGa';

console.log('=== [3/6] 审计：链接完整性与目标透明度检测 ===\n');

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
let hasError = false;
let totalLinksChecked = 0;
let registerLinksFound = 0;

for (const filePath of htmlFiles) {
  const relPath = path.relative(DIST_DIR, filePath).replace(/\\/g, '/');
  const html = fs.readFileSync(filePath, 'utf-8');

  // Extract all hrefs
  const hrefMatches = [...html.matchAll(/href="([^"#]+)(?:#[^"]*)?"/g)];

  for (const match of hrefMatches) {
    const href = match[1];
    totalLinksChecked++;

    if (match[0].includes('varnexa.lingdongaff.com')) {
      registerLinksFound++;
      if (!match[0].includes(REGISTER_URL)) {
        console.error(`❌ [${relPath}] 注册链接不匹配指定 URL: ${match[0]}`);
        hasError = true;
      }
      continue;
    }

    // Check internal links
    if (href.startsWith('/')) {
      // Internal link
      let targetFile;
      if (href.endsWith('.xml') || href.endsWith('.txt') || href.endsWith('.svg') || href.endsWith('.png') || href.endsWith('.css') || href.endsWith('.js') || href.includes('/_astro/')) {
        targetFile = path.join(DIST_DIR, href.slice(1));
      } else {
        const cleanPath = href.replace(/\/$/, '');
        targetFile = path.join(DIST_DIR, cleanPath, 'index.html');
      }

      if (!fs.existsSync(targetFile)) {
        console.error(`❌ [${relPath}] 发现失效内链: href="${href}" -> 目标文件不存在: ${targetFile}`);
        hasError = true;
      }
    }
  }
}

console.log(`✓ 扫描了 ${htmlFiles.length} 个静态页面，检查了 ${totalLinksChecked} 处链接`);
console.log(`✓ 验证了 ${registerLinksFound} 处用户指定注册链接（已严格匹配 code=HHoxxHGa）`);

console.log('\n=== 链接审计结果 ===');
if (hasError) {
  console.error('❌ 链接审计未通过，存在需修复的死链！');
  process.exit(1);
} else {
  console.log('✅ 所有内部链接、注册直达链接及静态资源文件全部通畅！');
}
