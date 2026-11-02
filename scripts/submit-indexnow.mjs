import fs from 'node:fs';
import path from 'node:path';

console.log('=== [5/6] IndexNow 搜索引擎主动推送脚本 ===\n');

const HOST = 'ctcjichang.sbs';
const SITEMAP_PATH = './dist/sitemap.xml';

// 1. Get or generate IndexNow Key
const envKey = process.env.INDEXNOW_KEY;
const KEY = envKey || '7a8f9c2d1e4b5a6c3e2d1f0a9b8c7d6e';

console.log(`- 目标域名: https://${HOST}`);
console.log(`- IndexNow 密钥: ${KEY.slice(0, 6)}...${KEY.slice(-4)}`);

// 2. Ensure Key verification file exists in public & dist
const keyFileName = `${KEY}.txt`;
const publicKeyPath = path.join('./public', keyFileName);
const distKeyPath = path.join('./dist', keyFileName);

fs.writeFileSync(publicKeyPath, KEY, 'utf-8');
if (fs.existsSync('./dist')) {
  fs.writeFileSync(distKeyPath, KEY, 'utf-8');
  console.log(`✓ 密钥验证文件已写入: ${distKeyPath}`);
}

const keyLocation = `https://${HOST}/${keyFileName}`;
console.log(`- 密钥验证地址 (keyLocation): ${keyLocation}`);

// 3. Extract URLs from sitemap
if (!fs.existsSync(SITEMAP_PATH)) {
  console.error(`❌ 未找到 sitemap 文件: ${SITEMAP_PATH}，请先执行 npm run build`);
  process.exit(1);
}

const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf-8');
const locMatches = [...sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g)];
const urlList = locMatches
  .map(m => m[1].trim())
  .filter(url => url.startsWith(`https://${HOST}/`));

console.log(`✓ 从 Sitemap 解析到 ${urlList.length} 个正式页面 URL：`);
urlList.forEach(u => console.log(`  • ${u}`));

// 4. Construct Payload
const payload = {
  host: HOST,
  key: KEY,
  keyLocation: keyLocation,
  urlList: urlList
};

// 5. Submit to IndexNow API (Bing / Yandex / IndexNow)
async function submitIndexNow() {
  const endpoint = 'https://api.indexnow.org/indexnow';
  console.log(`\n正在推送至 IndexNow 统一端点: ${endpoint} ...`);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'CTC-IndexNow-Auditor/1.0'
      },
      body: JSON.stringify(payload)
    });

    console.log(`- HTTP 响应状态码: ${response.status} (${response.statusText})`);

    switch (response.status) {
      case 200:
        console.log('✅ IndexNow 提交成功 (200 OK)：URL 已被引擎接收并排入爬取队列。');
        break;
      case 202:
        console.log('✅ IndexNow 请求已接受 (202 Accepted)：密钥待进一步验证中。');
        break;
      case 400:
        console.error('❌ 400 Bad Request: 请求参数格式或 JSON 无效。');
        break;
      case 403:
        console.error('❌ 403 Forbidden: 密钥无效或 keyLocation 无法访问。请确保站点已发布且密钥验证文件可正常 HTTP 访问。');
        break;
      case 422:
        console.error('❌ 422 Unprocessable Entity: URL 列表不属于该 Host 或包含无效 URL。');
        break;
      case 429:
        console.warn('⚠️ 429 Too Many Requests: 提交频次受限，请稍后重试。');
        break;
      default:
        console.log(`- 收到响应代码 ${response.status}`);
    }

    console.log('\n⚠️ 重要合规说明：');
    console.log('1. IndexNow 接口调用成功表示已向搜索引擎发送抓取通知，不等于页面已经被搜索引擎立即收录并展现。');
    console.log('2. 真实收录周期取决于 Bing/Google 的抓取调度、站点权威度与内容质量。请避免短时间内无意义频繁重复提交。');

  } catch (err) {
    console.warn(`⚠️ 无法连接 IndexNow 端点（可能受本地网络代理或防火墙影响）: ${err.message}`);
    console.log('此为离线开发环境网络限制，线上 Cloudflare Pages 部署后可自动化或通过 Webhook 执行。');
  }
}

submitIndexNow();
