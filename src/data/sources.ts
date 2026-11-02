export interface SourceItem {
  id: string;
  sourceUrl: string;
  sourceName: string;
  retrievedAt: string;
  factType: 'live_api' | 'public_archive' | 'affiliate_target';
  status: 'verified' | 'historical_archive' | 'active_target';
  verifiedItems: string[];
  disclaimedItems: string[];
}

export const sourceRegistry: SourceItem[] = [
  {
    id: "jinglongyu-live",
    sourceUrl: "https://www.jinglongyu.com/api/v1/guest/comm/config",
    sourceName: "CTC 官方接口端点 (jinglongyu.com)",
    retrievedAt: "2026-10-31 15:17",
    factType: "live_api",
    status: "verified",
    verifiedItems: [
      "接口返回 200 OK，站点运行 V2Board 基础架构",
      "强邀请制处于开启状态 (is_invite_force: 1)",
      "注册邮箱受白名单限制，当前允许 gmail.com 与 qq.com 后缀",
      "未向未登录访客开放公开资费 fetch 接口（保护机制）"
    ],
    disclaimedItems: [
      "未登录状态无法自动化读取当前实时在售价格与剩余节点库存"
    ]
  },
  {
    id: "guatizi-archive",
    sourceUrl: "https://guatizi.com/sites/172.html/",
    sourceName: "挂梯子网络技术归档与评测库",
    retrievedAt: "2026-10-31 15:17",
    factType: "public_archive",
    status: "historical_archive",
    verifiedItems: [
      "记录别称：CTC 又名金龙鱼机场",
      "记录线路特性：直连、公网中转与 IEPL 专线，另有全直连 CTC02 分线",
      "记录节点地区：香港、日本、台湾、新加坡、美国、越南、欧洲（德国）、土耳其",
      "记录历史公告：2025年12月29日协议切为 SS-2022；2026年1月7日阿里云 GTM 故障转手工模式；2025年11月 DOH 防污染说明",
      "记录历史套餐基准：SE-100G (¥238/年)、SE-360G (¥688/年)、SE-800G (¥1500/年)"
    ],
    disclaimedItems: [
      "三周年 7 折优惠码「三周年快乐」活动时间为 2025-09-24 至 10-31，已完全过期，不可继续使用",
      "不限时按量付费流量包已在历史版本取消，不能列为当前在售产品"
    ]
  },
  {
    id: "designated-affiliate",
    sourceUrl: "https://varnexa.lingdongaff.com/#/?code=HHoxxHGa",
    sourceName: "指定注册与开通直达通道",
    retrievedAt: "2026-10-31 15:17",
    factType: "affiliate_target",
    status: "active_target",
    verifiedItems: [
      "目标链接有效响应 HTTP 200，提供统一注册转接流程",
      "携带官方邀请码标识，满足强制邀请码注册要求"
    ],
    disclaimedItems: [
      "本站保持第三方导航与自检工具中立性，透明提示跳转目标，不伪装为不可核实的内部结算中枢"
    ]
  }
];
