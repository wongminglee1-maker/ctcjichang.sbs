export interface PricingPlan {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  billingCycle: string;
  trafficMonthly: string;
  deviceLimit: string;
  highlight: boolean;
  statusText: string;
  isVerifiedLive: boolean;
  features: string[];
  notes: string;
}

export const pricingNotice = {
  title: "价格核验与透明度说明",
  disclaimer: "具体价格、流量及开通条件请以实际订购页面为准。",
  explanation: "本站根据 2026 年公开技术档案与历史归档列出以下基准套餐配置。由于机场服务商可能依据服务器成本及容量策略动态调整上架套餐、折扣周期与邀请码要求，当前价格标为【待核实】，绝不虚构即时结算价格。",
  inviteRequirement: "注意：官方注册接口检测显示严格启用邀请制（is_invite_force: 1），请通过有效邀请链接进入以完成账户激活。"
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "se-100g",
    name: "SE-100G",
    subtitle: "个人轻量自检与日常互联",
    price: "¥238",
    billingCycle: "年付（参考基准价）",
    trafficMonthly: "100 GB / 月（每月重置）",
    deviceLimit: "参考历史未限制严格并发 / 依当前规则为准",
    highlight: false,
    statusText: "价格与在售状态待核实",
    isVerifiedLive: false,
    features: [
      "月流量 100GB（周期循环充沛）",
      "Shadowsocks-2022 现代隧道协议",
      "覆盖亚太与欧美主流服务节点",
      "支持基础公网中转通道",
      "兼容主流客户端自动订阅更新"
    ],
    notes: "适合个人网页查阅、社交通信及轻量科研资料下载。"
  },
  {
    id: "se-360g",
    name: "SE-360G",
    subtitle: "多设备工作流与高码率音视频",
    price: "¥688",
    billingCycle: "年付（参考基准价）",
    trafficMonthly: "360 GB / 月（每月重置）",
    deviceLimit: "多端协同办公 / 依当前规则为准",
    highlight: true,
    statusText: "价格与在售状态待核实",
    isVerifiedLive: false,
    features: [
      "月流量 360GB（超清流媒体无忧）",
      "全面解锁 4K 视频、EMBY 及音乐串流",
      "支持直连、BGP 中转及部分专线入口",
      "高优先级服务工单响应通道",
      "支持多操作系统同时在线同步"
    ],
    notes: "主力生产力推荐，兼顾居家宽带与移动流量双场景。"
  },
  {
    id: "se-800g",
    name: "SE-800G",
    subtitle: "大带宽密集传输与企业级需求",
    price: "¥1500",
    billingCycle: "年付（参考基准价）",
    trafficMonthly: "800 GB / 月（每月重置）",
    deviceLimit: "团队共享 / 依当前规则为准",
    highlight: false,
    statusText: "价格与在售状态待核实",
    isVerifiedLive: false,
    features: [
      "月流量 800GB（大容量代码拉取与数据传输）",
      "全量 IEPL 国际内网专线节点调度",
      "极低抖动常数级低延迟保障",
      "晚高峰大带宽无 QOS 限速策略",
      "支持配置 DOH 规避复杂网络 DNS 污染"
    ],
    notes: "面向高频跨国视频会议、大型项目部署及重度跨国数据流转。"
  }
];
