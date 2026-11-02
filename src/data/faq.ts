export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  relatedGuideUrl?: string;
}

export const faqList: FAQItem[] = [
  {
    id: "faq-1",
    question: "CTC 金龙鱼机场是什么？",
    answer: "CTC（行业常称金龙鱼机场）是一家主要采用现代 Shadowsocks-2022（SS-2022）加密隧道协议的高速网络互联服务。其服务网络涵盖公网直连、BGP 公网中转以及企业级 IEPL 国际内网专线节点，节点覆盖香港、日本、台湾、新加坡、美国、欧洲及东南亚。本站 ctcjichang.sbs 是专注于 CTC 环境排错、设备设置对照与网络自检的专业服务门户。",
    category: "品牌与服务",
    relatedGuideUrl: "/guides/ctc-wifi-mobile-network/"
  },
  {
    id: "faq-2",
    question: "CTC 金龙鱼有哪些线路类型？",
    answer: "根据公开技术资料，CTC 包含三种主要架构：一是‘公网直连线路’（包含独立的 CTC02 直连分线），直连境外节点，受公网国际出口拥堵影响；二是‘公网中转线路’，国内多线 BGP 服务器接入并通过跨境优化中转转发，时延与抖动大幅降低；三是‘IEPL 国际专线’，采用点对点物理内网专线不过公网国际出口，晚高峰几乎无丢包与速率下降。",
    category: "线路技术",
    relatedGuideUrl: "/pricing/"
  },
  {
    id: "faq-3",
    question: "CTC 套餐价格在哪里核对？",
    answer: "本站展示的历史参考套餐为 SE-100G（参考年付 ¥238）、SE-360G（参考年付 ¥688）及 SE-800G（参考年付 ¥1500）。由于服务商会根据专线成本与服务器容量动态调整在售套餐、计费周期与限时策略，所有确切售价、流量配额及账户开通资格请以通过本站指定入口进入的实时结算页面为准，本站绝不提供未经核验的虚假现价。",
    category: "资费与购买",
    relatedGuideUrl: "/pricing/"
  },
  {
    id: "faq-4",
    question: "为什么不同 Wi-Fi 下节点连接情况不同？",
    answer: "不同 Wi-Fi 的上游宽带运营商（电信、联通、移动、广电等）以及本地局域网路由策略存在巨大差异。例如：某些公共或公司 Wi-Fi 开启了 UDP 协议拦截或非标端口防火墙，导致 SS-2022 握手包被直接丢弃；某些路由器配置了有污染的本地 DNS，未解析到正确的入口 IP；而家庭 Wi-Fi 如果开启了 IPV6 或双重透明网关，也可能与本地客户端的代理分流规则发生冲突。",
    category: "网络环境",
    relatedGuideUrl: "/guides/ctc-wifi-mobile-network/"
  },
  {
    id: "faq-5",
    question: "Windows 系统代理与 TUN 有什么区别？",
    answer: "系统代理（System Proxy）是通过 Windows 注册表为系统设置 HTTP/HTTPS/Socks5 代理环境变量，仅对遵循系统代理设置的浏览器及支持 HTTP 代理的应用程序生效；而 TUN（虚拟网卡）模式是在操作系统网络协议栈中创建一层虚拟网络适配器，通过底层路由表将本机所有 TCP、UDP 及 DNS 流量接管转发，使命令行（Git/SSH）、游戏及不遵守系统代理的应用也能全面走代理。",
    category: "客户端技术",
    relatedGuideUrl: "/guides/ctc-windows-proxy/"
  },
  {
    id: "faq-6",
    question: "OPPO 手机后台限制会影响连接吗？",
    answer: "会产生直接影响。ColorOS 等定制 Android 系统为了延长续航，具备激进的后台电池管理与冻结机制。当代理软件在后台运行且手机息屏或切换应用时，系统可能会切断其网络套接字或终止 VPN 守护进程。建议在‘设置 - 电池 - 应用耗电管理’中将客户端设为‘允许完全后台行为’，并在多任务后台给客户端卡片加上小锁，以防连接频繁被杀。",
    category: "移动设备",
    relatedGuideUrl: "/guides/ctc-android-background/"
  },
  {
    id: "faq-7",
    question: "iPhone VPN 配置失败如何检查？",
    answer: "在 iOS 设备上遇到配置失败，首先检查系统时间设置：SS-2022 协议要求设备时间与国际标准时误差在 30 秒以内，请在‘设置 - 通用 - 日期与时间’中确保‘自动设置’开启；其次，首次安装 Shadowrocket、Stash 或 Loon 等客户端时必须在弹出的系统对话框中点击‘允许添加 VPN 配置’并输入锁屏密码；最后，若仍失败可尝试在系统‘设置 - VPN 与设备管理’中删除旧描述文件并重新导入订阅。",
    category: "移动设备",
    relatedGuideUrl: "/guides/ctc-ios-connectivity/"
  },
  {
    id: "faq-8",
    question: "校园网认证未完成会影响连接吗？",
    answer: "会直接导致连接失败且节点全部超时。校园网或酒店 Wi-Fi 通常设有 Web 强制认证门户（Captive Portal），在通过浏览器登录学号或手机验证码之前，局域网网关处于隔离状态，会重定向所有 HTTP 请求并阻断所有外部协议流量。在此状态下开启客户端会导致代理应用死锁在重定向死循环中，必须先关闭代理完成网页认证，确认本地宽带能正常访问基础网页后再启动客户端连接。",
    category: "网络环境",
    relatedGuideUrl: "/guides/ctc-campus-public-wifi/"
  },
  {
    id: "faq-9",
    question: "自检报告需要包含哪些信息？",
    answer: "一份高效的自检报告应清晰包含：1. 客户端软件名称与具体内核版本；2. 操作系统类型及版本（如 Win 11 23H2、iOS 18、ColorOS 15）；3. 当前网络环境（家庭电信千兆、移动 5G 热点、校园局域网）；4. 故障特征（如节点测速全红、显示已连但浏览器超时、仅切换网络时断开）；5. 已尝试过的排查动作（如已校准时间、已开启 DOH、已重启客户端）。本站诊断中心支持一键生成规范格式报告。",
    category: "故障诊断",
    relatedGuideUrl: "/guides/ctc-support-report/"
  },
  {
    id: "faq-10",
    question: "遇到连接问题如何保护账户信息？",
    answer: "排查故障与截图反馈时，必须注意账户与隐私安全：绝对不要在技术论坛、聊天群组或公共工单中公开完整的订阅链接、订阅 Token 密钥、用户登录密码或 API 秘钥；发送客户端运行日志或诊断截图时，务必将日志中的真实 IP、专属 Token 字符串及个人邮箱进行马赛克打码遮挡，防止凭据泄露导致订阅被恶意盗刷或配额被耗尽。",
    category: "安全与隐私",
    relatedGuideUrl: "/guides/ctc-support-report/"
  }
];
