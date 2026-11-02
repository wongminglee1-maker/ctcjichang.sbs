export interface BrandInfo {
  name: string;
  shortName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  domain: string;
  registerUrl: string;
  channelUrl: string;
  primaryPositioning: string;
  description: string;
  auditDate: string;
  announcements: {
    date: string;
    title: string;
    summary: string;
    status: 'historical' | 'expired' | 'verified';
    note: string;
  }[];
  verificationNotes: {
    field: string;
    verifiedState: string;
    source: string;
    isVerifiedLive: boolean;
  }[];
}

export const brandData: BrandInfo = {
  name: "CTC 金龙鱼",
  shortName: "CTC",
  tagline: "连接有序，体验自由",
  heroHeadline: "CTC 金龙鱼｜连接有序，体验自由",
  heroSubheadline: "了解 CTC 金龙鱼的节点线路、订阅服务及设备连接方式，通过清晰的指南和互动自检工具排查常见网络问题。",
  domain: "https://ctcjichang.sbs/",
  registerUrl: "https://varnexa.lingdongaff.com/#/?code=HHoxxHGa",
  channelUrl: "https://t.me/ctcuser",
  primaryPositioning: "CTC 网络环境与设备连接自检中心",
  description: "CTC（又称金龙鱼机场）是一家以 Shadowsocks-2022 协议为主、涵盖直连、公网中转与 IEPL 专线的网络连接服务。本站作为设备连接与网络自检中心，提供详尽的环境排查、系统设置对照与规范反馈支持。",
  auditDate: "2026-10-31",
  announcements: [
    {
      date: "2026-01-07",
      title: "阿里云 GTM 自动化解析故障说明",
      summary: "曾启用阿里云 GTM 进行 IP 自动切换，发生旧 IP 未及时剔除下线问题，已切换为手工维护模式。",
      status: "historical",
      note: "历史运维记录，反映历史入口调度曾有调整，不能代表当前即时网络质量。"
    },
    {
      date: "2025-12-29",
      title: "节点协议升级为 Shadowsocks-2022",
      summary: "从原传统 SS 全面升级为 SS-2022 协议，要求客户端软件支持并开启时间同步校准。",
      status: "historical",
      note: "使用前需确保客户端版本兼容，设备时钟误差不可超过限制。"
    },
    {
      date: "2025-11-15",
      title: "DNS 污染与加密 DOH 推荐配置",
      summary: "建议配置腾讯 DOH（https://doh.pub/dns-query）以避免运营商未加密 DNS 返回错误入口 IP。",
      status: "historical",
      note: "属于防污染配置建议，适用于规则托管或自建配置客户端。"
    },
    {
      date: "2025-09-24",
      title: "三周年全场折扣及年付赠送活动",
      summary: "三周年活动期间曾提供全场7折及年付加赠1个月时长。",
      status: "expired",
      note: "已于 2025 年 10 月 31 日正式截止，当前不适用该促销码。"
    }
  ],
  verificationNotes: [
    {
      field: "注册机制",
      verifiedState: "需邀请码注册 (is_invite_force: 1)，仅支持 gmail.com 和 qq.com 邮箱后缀",
      source: "https://www.jinglongyu.com/api/v1/guest/comm/config 实测读取",
      isVerifiedLive: true
    },
    {
      field: "分线独立性",
      verifiedState: "存在 CTC02 直连分线，为完全直连架构，不可与 CTC 主服务的中转/IEPL 混淆",
      source: "https://guatizi.com/sites/172.html/ 公开档案",
      isVerifiedLive: true
    },
    {
      field: "流媒体/附加服务",
      verifiedState: "参考资料提及提供 EMBY 增值服务，实际账号开通以订购后台权限为准",
      source: "https://guatizi.com/sites/172.html/",
      isVerifiedLive: false
    },
    {
      field: "当前在线节点数与延迟",
      verifiedState: "无法在非登录状态下自动化采集实时拓扑，本站坚决不编造假节点与伪延迟数据",
      source: "本站独立合规准则",
      isVerifiedLive: false
    }
  ]
};
