export interface NetworkRoute {
  id: string;
  name: string;
  badge: string;
  principle: string;
  scenario: string;
  stability: string;
  verificationStatus: string;
  details: string[];
}

export interface RegionNode {
  code: string;
  name: string;
  flag: string;
  category: 'Asia' | 'America' | 'Europe';
  verifiedSource: string;
}

export const networkRoutes: NetworkRoute[] = [
  {
    id: "direct",
    name: "公网直连线路",
    badge: "基础互联",
    principle: "客户端发起请求后，流量直接通过公共互联网路由传输至境外服务端点，不经过国内中转服务器跳板。",
    scenario: "轻度网页浏览、跨国学术查阅及对网络峰值抖动容忍度较高的日常访问。",
    stability: "受国际出口带宽及当地 ISP 路由拥堵影响较大，晚高峰时延波动可能较为明显。",
    verificationStatus: "已核查公开技术档案（CTC02分线亦采用此机制）",
    details: [
      "架构直接透明，无中间跳板损耗",
      "对运营商出口质量与 QoS 限制敏感",
      "建议配合加密 DNS 防止解析劫持"
    ]
  },
  {
    id: "transit",
    name: "公网中转线路",
    badge: "流量调度",
    principle: "国内客户端先连接至国内优质 BGP 入口节点，由国内服务器通过跨境优化通道或公网隧道转发至海外目标落地机。",
    scenario: "晚高峰流媒体观看、跨国协作办公、游戏更新以及多设备并发访问。",
    stability: "有效规避本地宽带国际出口波动，国内段延迟低且抖动小，遇运营商封锁需调度入口 IP。",
    verificationStatus: "参考历史公告，2025年11月至2026年1月曾有入口 IP 调度与维护记录",
    details: [
      "国内 BGP 入口多线接入，减少跨网互通阻碍",
      "需定期更新订阅以同步最新入口解析",
      "兼顾带宽吞吐量与部署成本"
    ]
  },
  {
    id: "iepl",
    name: "IEPL 国际专线",
    badge: "企业级高可靠",
    principle: "采用国际以太网私网专线（International Ethernet Private Line），物理隔离过境传输，不经过公共国际互联出口。",
    scenario: "高频跨国视频会议、低时延敏感业务、企业远程运维及敏感时期的可靠连接保障。",
    stability: "端到端专网传输，抖动极低且不受公网骨干网拥塞与审查丢包干扰，可靠性高。",
    verificationStatus: "公开资料收录，具体可用配额以订购后台实际开通权限为准",
    details: [
      "物理内网专线互联，几乎零丢包率",
      "时延稳定呈常数级，晚高峰无降速",
      "带宽成本较高，通常配置于高阶订阅"
    ]
  }
];

export const regionNodes: RegionNode[] = [
  { code: "HK", name: "中国香港", flag: "🇭🇰", category: "Asia", verifiedSource: "guatizi 历史公开节点目录" },
  { code: "JP", name: "日本 (东京/大阪)", flag: "🇯🇵", category: "Asia", verifiedSource: "guatizi 历史公开节点目录" },
  { code: "TW", name: "中国台湾", flag: "🇹🇼", category: "Asia", verifiedSource: "guatizi 历史公开节点目录" },
  { code: "SG", name: "新加坡", flag: "🇸🇬", category: "Asia", verifiedSource: "guatizi 历史公开节点目录" },
  { code: "US", name: "美国 (西海岸/东海岸)", flag: "🇺🇸", category: "America", verifiedSource: "guatizi 历史公开节点目录" },
  { code: "VN", name: "越南", flag: "🇻🇳", category: "Asia", verifiedSource: "guatizi 历史公开节点目录" },
  { code: "DE", name: "德国 (法兰克福)", flag: "🇩🇪", category: "Europe", verifiedSource: "guatizi 历史公开节点目录" },
  { code: "TR", name: "土耳其", flag: "🇹🇷", category: "Europe", verifiedSource: "guatizi 历史公开节点目录" }
];

export const protocolInfo = {
  name: "Shadowsocks-2022 (SS-2022)",
  type: "现代加密隧道协议",
  updateHistory: "2025年12月29日全站协议切换升级",
  keyRequirements: [
    "严格要求客户端操作系统时钟校准，时差须在 30 秒以内，否则握手校验失败",
    "旧版客户端（如不再维护的早期原版 CFW、Surfboard 早期版本）可能无法解析 SS-2022 配置",
    "推荐使用支持 2022 规范的 Clash Verge Rev、Mihomo Party、Sing-box、Loon、Surge、Stash 等"
  ]
};
