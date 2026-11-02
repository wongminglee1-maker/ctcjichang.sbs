import fs from 'node:fs';
import path from 'node:path';

console.log('=== [4/6] 审计：站内与跨域名 (ctcjichang.lol / mom) 重复内容检测 ===\n');

const CURRENT_ARTICLES_DIR = './src/content/articles';
const SIBLING_LOL_DIR = '../ctcjichang.lol/src/content/articles';
const SIBLING_MOM_DIR = '../ctcjichang.mom/src/content/articles';

// Tokenizer for Chinese text (character 3-grams)
function getNGrams(text, n = 3) {
  const clean = text.replace(/[\s\p{P}\p{S}]/gu, '');
  const ngrams = new Set();
  for (let i = 0; i <= clean.length - n; i++) {
    ngrams.add(clean.slice(i, i + n));
  }
  return ngrams;
}

function calculateJaccard(setA, setB) {
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return intersection / union;
}

function loadArticles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
  return files.map(file => {
    const raw = fs.readFileSync(path.join(dir, file), 'utf-8');
    const parts = raw.split('---');
    const header = parts[1] || '';
    const body = parts.slice(2).join('---').trim();
    
    const titleMatch = header.match(/title:\s*["']?([^"'\n]+)/i);
    const title = titleMatch ? titleMatch[1] : file;

    return {
      file,
      title,
      body,
      ngrams: getNGrams(body, 3)
    };
  });
}

const currentArticles = loadArticles(CURRENT_ARTICLES_DIR);
console.log(`✓ 已加载当前站点 6 篇原创文章进行站内相似度比对`);

let hasHighDuplicate = false;

// 1. Internal Pairwise Comparison
console.log('\n--- 1. 站内文章两两相似度比对 ---');
for (let i = 0; i < currentArticles.length; i++) {
  for (let j = i + 1; j < currentArticles.length; j++) {
    const sim = calculateJaccard(currentArticles[i].ngrams, currentArticles[j].ngrams);
    const percent = (sim * 100).toFixed(1);
    if (sim > 0.35) {
      console.warn(`⚠️ 站内高相似风险: ${currentArticles[i].file} vs ${currentArticles[j].file} (${percent}%)`);
      hasHighDuplicate = true;
    } else {
      console.log(`  • ${currentArticles[i].file} vs ${currentArticles[j].file}: ${percent}% (正常差异)`);
    }
  }
}

// 2. Cross-domain Comparison with ctcjichang.lol
console.log('\n--- 2. 跨站比对：ctcjichang.sbs vs ctcjichang.lol ---');
const lolArticles = loadArticles(SIBLING_LOL_DIR);
if (lolArticles.length === 0) {
  console.warn('⚠️ 未检测到 ctcjichang.lol 文章目录，无法执行该站跨站比对');
} else {
  console.log(`✓ 成功读取 ctcjichang.lol 下 ${lolArticles.length} 篇文章：`);
  let maxLolSim = 0;
  let maxLolPair = '';

  for (const cur of currentArticles) {
    for (const lol of lolArticles) {
      const sim = calculateJaccard(cur.ngrams, lol.ngrams);
      if (sim > maxLolSim) {
        maxLolSim = sim;
        maxLolPair = `${cur.file} vs ${lol.file}`;
      }
      if (sim > 0.35) {
        console.error(`❌ 跨域名内容雷同超标: ${cur.file} 与 lol/${lol.file} 相似度高达 ${(sim * 100).toFixed(1)}%`);
        hasHighDuplicate = true;
      }
    }
  }
  console.log(`  ✓ 最大相似度对: ${maxLolPair} -> ${(maxLolSim * 100).toFixed(1)}% (低于 35% 差异化红线)`);
}

// 3. Cross-domain Comparison with ctcjichang.mom
console.log('\n--- 3. 跨站比对：ctcjichang.sbs vs ctcjichang.mom ---');
const momArticles = loadArticles(SIBLING_MOM_DIR);
if (momArticles.length === 0) {
  console.warn('⚠️ 未检测到 ctcjichang.mom 文章目录，无法执行该站跨站比对');
} else {
  console.log(`✓ 成功读取 ctcjichang.mom 下 ${momArticles.length} 篇文章：`);
  let maxMomSim = 0;
  let maxMomPair = '';

  for (const cur of currentArticles) {
    for (const mom of momArticles) {
      const sim = calculateJaccard(cur.ngrams, mom.ngrams);
      if (sim > maxMomSim) {
        maxMomSim = sim;
        maxMomPair = `${cur.file} vs ${mom.file}`;
      }
      if (sim > 0.35) {
        console.error(`❌ 跨域名内容雷同超标: ${cur.file} 与 mom/${mom.file} 相似度高达 ${(sim * 100).toFixed(1)}%`);
        hasHighDuplicate = true;
      }
    }
  }
  console.log(`  ✓ 最大相似度对: ${maxMomPair} -> ${(maxMomSim * 100).toFixed(1)}% (低于 35% 差异化红线)`);
}

// 4. Titles and Metas uniqueness check
console.log('\n--- 4. 页面 Title 与 Description 唯一性比对 ---');
const distDir = './dist';
if (fs.existsSync(distDir)) {
  const titles = new Map();
  const descriptions = new Map();
  const htmlFiles = fs.readdirSync(distDir, { recursive: true }).filter(f => f.endsWith('.html'));

  for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(distDir, file), 'utf-8');
    const tMatch = content.match(/<title>([^<]+)<\/title>/i);
    const dMatch = content.match(/<meta name="description" content="([^"]+)"/i);

    if (tMatch) {
      const t = tMatch[1].trim();
      if (titles.has(t)) {
        console.error(`❌ 发现重复 Title: "${t}" 同时存在于 ${titles.get(t)} 和 ${file}`);
        hasHighDuplicate = true;
      } else {
        titles.set(t, file);
      }
    }

    if (dMatch) {
      const d = dMatch[1].trim();
      if (descriptions.has(d)) {
        console.error(`❌ 发现重复 Description: 同时存在于 ${descriptions.get(d)} 和 ${file}`);
        hasHighDuplicate = true;
      } else {
        descriptions.set(d, file);
      }
    }
  }
  console.log(`  ✓ 检查了 ${titles.size} 个唯一 Title 与 ${descriptions.size} 个唯一 Meta Description`);
}

console.log('\n=== 重复内容与跨域名差异化审计结果 ===');
if (hasHighDuplicate) {
  console.error('❌ 存在高相似雷同内容，未达到跨站差异化要求！');
  process.exit(1);
} else {
  console.log('✅ 站内文章及跨域名 (ctcjichang.lol / mom) 差异化检测全部通过！内容高度独立！');
}
