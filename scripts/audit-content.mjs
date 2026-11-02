import fs from 'node:fs';
import path from 'node:path';

const ARTICLES_DIR = './src/content/articles';
const EXPECTED_SLUGS = [
  'ctc-wifi-mobile-network',
  'ctc-windows-proxy',
  'ctc-android-background',
  'ctc-ios-connectivity',
  'ctc-campus-public-wifi',
  'ctc-support-report'
];

console.log('=== [1/6] 审计：原创文章内容与字数检测 ===\n');

let hasError = false;

if (!fs.existsSync(ARTICLES_DIR)) {
  console.error(`❌ 文章目录不存在: ${ARTICLES_DIR}`);
  process.exit(1);
}

const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.md'));

if (files.length !== 6) {
  console.error(`❌ 期望存在 6 篇文章，实际发现 ${files.length} 篇`);
  hasError = true;
} else {
  console.log(`✓ 成功确认 6 篇原创文章文件`);
}

const allParagraphs = new Map();

for (const slug of EXPECTED_SLUGS) {
  const filePath = path.join(ARTICLES_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ 缺失关键文章: ${slug}.md`);
    hasError = true;
    continue;
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  
  // Extract body after frontmatter
  const parts = raw.split('---');
  if (parts.length < 3) {
    console.error(`❌ ${slug}.md Frontmatter 格式异常`);
    hasError = true;
    continue;
  }

  const body = parts.slice(2).join('---').trim();
  
  // Check Chinese characters count
  const cjkMatches = body.match(/[\u4e00-\u9fa5]/g) || [];
  const charCount = cjkMatches.length;

  console.log(`- 文章: ${slug}.md | 汉字数: ${charCount}`);

  if (charCount < 1000 || charCount > 1800) {
    console.error(`  ❌ 汉字数不在 1000-1800 范围内: ${charCount}`);
    hasError = true;
  } else {
    console.log(`  ✓ 汉字数合规 (1000–1800)`);
  }

  // Check headers
  if (!body.includes('## ') || !body.includes('### ')) {
    console.error(`  ❌ 缺失 H2 / H3 层次结构`);
    hasError = true;
  }

  // Check for expired promo code mentioned as active
  if (body.includes('三周年快乐') && !body.includes('过期') && !body.includes('历史')) {
    console.error(`  ❌ 包含未经标注的过期优惠码「三周年快乐」`);
    hasError = true;
  }

  // Paragraph deduplication check
  const paragraphs = body.split(/\n\s*\n/).map(p => p.trim()).filter(p => p.length > 30);
  for (const p of paragraphs) {
    const cleanP = p.replace(/[#*`\-_|]/g, '').trim();
    if (allParagraphs.has(cleanP)) {
      console.warn(`  ⚠️ 发现可能重复的段落，前次出现于: ${allParagraphs.get(cleanP)}`);
    } else {
      allParagraphs.set(cleanP, slug);
    }
  }
}

console.log('\n=== 内容审计结果 ===');
if (hasError) {
  console.error('❌ 内容审计未通过，存在需修复项！');
  process.exit(1);
} else {
  console.log('✅ 所有文章篇数、字数 (1000–1800 汉字)、结构与品牌信息全部通过！');
}
