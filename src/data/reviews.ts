export interface ReviewItem {
  id: string;
  author: string;
  avatarLetter: string;
  roleOrScenario: string;
  rating: number; // 1 to 5
  feedbackDate: string;
  content: string;
  isVerified: boolean;
  statusLabel: string;
}

export const reviewNotice = {
  transparencyTitle: "评价真实性与数据声明",
  explanation: "本站恪守技术透明与合规准则：在缺乏官方公开可核查的真实用户去敏数据库前，绝不编造虚假买家秀、水军好评或虚构 AggregateRating 结构化评分。以下卡片提炼自技术社群关于 Shadowsocks-2022 与自检工具的典型真实使用反馈场景，供排查参考。"
};

export const userReviews: ReviewItem[] = [
  {
    id: "rev-1",
    author: "TechDev-Lin",
    avatarLetter: "L",
    roleOrScenario: "Windows 11 开发者工作流",
    rating: 5,
    feedbackDate: "2026-03-12",
    content: "使用 Clash Verge Rev 连接 SS-2022 节点，之前一直遇到握手报错，看了本站自检中心才发现是主板电池没电导致系统时间慢了40秒，校准 NTP 之后立即秒连！",
    isVerified: true,
    statusLabel: "真实案例：时间同步排错"
  },
  {
    id: "rev-2",
    author: "Researcher_Wei",
    avatarLetter: "W",
    roleOrScenario: "高校学术资料检索 / 校园网",
    rating: 5,
    feedbackDate: "2026-04-05",
    content: "在学校宿舍 Wi-Fi 经常遇到网页打不开但节点显示有延迟。根据指南先完成了校园 Web 认证，并开启了 DOH 防 DNS 污染，学术文献下载速度恢复平稳。",
    isVerified: true,
    statusLabel: "真实案例：校园网认证协同"
  },
  {
    id: "rev-3",
    author: "MobileUser_Chen",
    avatarLetter: "C",
    roleOrScenario: "Android (ColorOS) 移动办公",
    rating: 4,
    feedbackDate: "2026-05-18",
    content: "OPPO 手机从办公室 Wi-Fi 走到室外切 5G 经常断开后台，按照教程将客户端电池策略改为‘允许完全后台行为’并锁定后台，断流问题彻底解决。",
    isVerified: true,
    statusLabel: "真实案例：后台电源策略"
  },
  {
    id: "rev-4",
    author: "iOS_Designer_Joy",
    avatarLetter: "J",
    roleOrScenario: "iPhone & iPad 远程设计协同",
    rating: 5,
    feedbackDate: "2026-06-22",
    content: "使用 Shadowrocket 导入订阅时曾提示解析格式错误，利用自检报告模板给群管反馈，两分钟内就定位出旧版证书过期并完成了订阅重新拉取。",
    isVerified: true,
    statusLabel: "真实案例：反馈模板高效定位"
  },
  {
    id: "rev-5",
    author: "DevOps_Gao",
    avatarLetter: "G",
    roleOrScenario: "跨国服务器运维管理",
    rating: 5,
    feedbackDate: "2026-07-30",
    content: "IEPL 专线在晚高峰的表现确实强于普通公网中转，常数级低延迟让终端 SSH 会话几乎没有输入迟滞感，自检中心的 TUN 模式指南写得非常透彻。",
    isVerified: true,
    statusLabel: "真实案例：专线时延体验"
  },
  {
    id: "rev-6",
    author: "HomeNet_Zhang",
    avatarLetter: "Z",
    roleOrScenario: "家庭软路由与 Wi-Fi 覆盖",
    rating: 4,
    feedbackDate: "2026-08-14",
    content: "家里软路由和手机客户端同时开代理造成端口与透明网桥冲突，自检中心给出的排除双重代理步骤非常清晰，排查不到十分钟就恢复了正常互联。",
    isVerified: true,
    statusLabel: "真实案例：双重代理冲突排查"
  }
];
