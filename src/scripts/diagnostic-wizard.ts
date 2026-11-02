/**
 * Rule-Based Diagnostic Wizard for CTC Connection Self-Check Center
 * Strictly client-side, zero tracking, rule-driven decision tree
 */

export interface DiagnosticRule {
  title: string;
  steps: {
    id: string;
    label: string;
    detail: string;
    actionTip: string;
  }[];
  primaryRecommendation: string;
  relatedArticleUrl: string;
  relatedArticleTitle: string;
}

export const DIAGNOSTIC_DECISION_TREE: Record<string, Record<string, DiagnosticRule>> = {
  // Windows
  windows: {
    'connected-no-web': {
      title: "Windows 系统：已连接但网页无法加载排查",
      steps: [
        {
          id: 'step-win-1',
          label: "1. 本地基础网络连通性验证",
          detail: "先确认关闭客户端或直连状态下，能否正常打开百度、Bing 或本地局域网路由器管理页（192.168.1.1）。",
          actionTip: "若直连均无法上网，说明物理网线/本地 Wi-Fi 欠费或断网，应优先恢复基础网络。"
        },
        {
          id: 'step-win-2',
          label: "2. 系统代理注册表与浏览器代理冲突排查",
          detail: "进入 Windows‘设置 - 网络和 Internet - 代理’，检查‘使用代理服务器’开关及端口是否与客户端一致；检查 Chrome/Edge 是否安装了 SwitchyOmega 等强制代理插件。",
          actionTip: "多个代理扩展或异常退出残留的注册表代理常导致端口无法监听，可尝试重启客户端代理开关。"
        },
        {
          id: 'step-win-3',
          label: "3. 客户端分流规则与 TUN 虚拟网卡模式检查",
          detail: "确认客户端处于‘规则模式（Rule）’而非‘直连模式（Direct）’；若浏览器正常但其他软件无法联网，开启 TUN 虚拟网卡模式接管全局流量。",
          actionTip: "使用 Clash Verge Rev 或 Sing-box 时，首次开启 TUN 需授权管理员权限以安装虚拟网卡驱动。"
        },
        {
          id: 'step-win-4',
          label: "4. 加密 DNS (DOH) 与节点连接状态验证",
          detail: "检查客户端配置文件中是否配置了公共加密 DOH（如腾讯 https://doh.pub/dns-query），防止运营商 DNS 劫持返回错误入口 IP。",
          actionTip: "在客户端中对该节点执行一次延迟测试，若节点本身出现握手异常，尝试切换至其他区域备用节点。"
        }
      ],
      primaryRecommendation: "建议优先检查系统代理设置与浏览器插件冲突，必要时开启 TUN 模式接管底层网络。",
      relatedArticleUrl: "/guides/ctc-windows-proxy/",
      relatedArticleTitle: "《CTC 金龙鱼 Windows 11 连接检查：系统代理、浏览器代理与 TUN 模式区别》"
    },
    'client-cannot-connect': {
      title: "Windows 系统：客户端握手失败排查",
      steps: [
        {
          id: 'step-win-c1',
          label: "1. 设备系统时钟与 NTP 同步校验",
          detail: "Shadowsocks-2022 协议对时间戳要求极其严苛，时差超过 30 秒将导致协议层握手直接被服务端丢弃。",
          actionTip: "进入 Windows‘日期和时间’设置，点击‘立即同步’确保时间与标准北京时间完全一致。"
        },
        {
          id: 'step-win-c2',
          label: "2. 客户端内核版本对 SS-2022 协议兼容性",
          detail: "旧版早停更客户端不支持 SS-2022 规范，会导致‘unsupported cipher’或静默连接失败。",
          actionTip: "升级为支持 2022 规范的最新版 Clash Verge Rev、Mihomo Party 或 Sing-box。"
        },
        {
          id: 'step-win-c3',
          label: "3. 防火墙与第三方杀毒软件拦截排查",
          detail: "检查 Windows Defender 或火绒等安全工具是否阻断了代理核心程序的网络端口监听权限。",
          actionTip: "将客户端内核进程加入安全软件信任白名单。"
        }
      ],
      primaryRecommendation: "绝大多数 Windows SS-2022 无法连接源于系统时间偏差或客户端内核过旧，请优先核对这两项。",
      relatedArticleUrl: "/guides/ctc-windows-proxy/",
      relatedArticleTitle: "《CTC 金龙鱼 Windows 11 连接检查：系统代理、浏览器代理与 TUN 模式区别》"
    },
    'node-timeout': {
      title: "Windows 系统：节点全量超时排查",
      steps: [
        {
          id: 'step-win-t1',
          label: "1. 订阅更新与最新入口 IP 检索",
          detail: "服务商遇到运营商通报或入口调整时会更换前置 IP，旧配置中的入口 IP 可能已停止路由响应。",
          actionTip: "在客户端配置列表点击‘更新订阅’，拉取最新节点配置后再行测试。"
        },
        {
          id: 'step-win-t2',
          label: "2. 本地宽带运营商阻断排查",
          detail: "尝试开启手机热点，将电脑连接至手机 5G/4G 网络进行交叉对照测试。",
          actionTip: "若热点正常但宽带超时，说明本地 ISP 暂时屏蔽了特定中转入口端口。"
        }
      ],
      primaryRecommendation: "请立即点击‘更新订阅’获取最新入口解析，并配置 DOH 规避 DNS 污染。",
      relatedArticleUrl: "/guides/ctc-wifi-mobile-network/",
      relatedArticleTitle: "《CTC 金龙鱼切换 Wi-Fi 和手机流量后无法连接？网络环境检查指南》"
    },
    'sub-update-fail': {
      title: "Windows 系统：订阅拉取更新失败排查",
      steps: [
        {
          id: 'step-win-s1',
          label: "1. 订阅链接完整性与特殊字符检查",
          detail: "复制订阅链接时确保前后无多余空格、换行或转义符截断。",
          actionTip: "在浏览器无痕窗口中直接粘贴订阅链接访问，查看是否能正常下载配置文本。"
        },
        {
          id: 'step-win-s2',
          label: "2. 订阅下载节点代理环境排查",
          detail: "部分托管服务器位于境外，直连可能受阻；但若当前代理已断开，客户端无法借由自身下载订阅。",
          actionTip: "可临时开启客户端的‘直连更新’，或更换订阅转换前端域名。"
        }
      ],
      primaryRecommendation: "建议核实订阅链接完整性，或在浏览器中直接验证下载接口状态。",
      relatedArticleUrl: "/guides/ctc-support-report/",
      relatedArticleTitle: "《CTC 金龙鱼连接问题怎么反馈？自检报告、错误信息整理与客服沟通模板》"
    }
  },

  // Android
  android: {
    'network-switch-disconnect': {
      title: "Android 设备：Wi-Fi 与蜂窝网络切换断流排查",
      steps: [
        {
          id: 'step-and-1',
          label: "1. 手机网络重新分配状态验证",
          detail: "Wi-Fi 切断到 4G/5G 建立数据连接通常需要 2–5 秒，期间数据通道处于暂时中断状态。",
          actionTip: "确认手机状态栏已出现 5G/4G 信号图标且网络流量正常流通。"
        },
        {
          id: 'step-and-2',
          label: "2. 代理客户端后台保活与电池无限制优化",
          detail: "ColorOS、MIUI/HyperOS、EMUI 等系统在网络切换时会触发低功耗管理，杀死或挂起 VPN 守护进程。",
          actionTip: "在‘应用信息 - 电池’中选择‘无限制 / 允许完全后台运行’，并在任务切换页锁定应用卡片。"
        },
        {
          id: 'step-and-3',
          label: "3. 虚拟专用网络（VPN）常开设置检查",
          detail: "Android 原生支持‘始终开启的 VPN’功能，防止底层网络接口迁移时隧道掉线。",
          actionTip: "在手机系统‘设置 - 更多连接 - VPN’中，点击齿轮图标开启‘始终开启的 VPN’。"
        }
      ],
      primaryRecommendation: "Android 切换断连核心是系统杀后台策略与 VPN 重连机制，请配置后台电池白名单与常开 VPN。",
      relatedArticleUrl: "/guides/ctc-android-background/",
      relatedArticleTitle: "《CTC 金龙鱼安卓手机频繁断开怎么办？OPPO、小米与华为后台设置指南》"
    },
    'client-cannot-connect': {
      title: "Android 设备：客户端启动与权限异常排查",
      steps: [
        {
          id: 'step-and-c1',
          label: "1. 系统时间与自动同步检查",
          detail: "Shadowsocks-2022 协议握手依赖准确的系统时间，时差超限无法通过鉴权。",
          actionTip: "在系统设置中确保开启‘使用网络提供的时间’。"
        },
        {
          id: 'step-and-c2',
          label: "2. VPN 配置描述文件授予权限",
          detail: "首次启动客户端必须在弹窗中点击‘确定’允许创建 VPN 连接。",
          actionTip: "若有其他 VPN 应用占用，先彻底关闭其他代理应用再启动本客户端。"
        }
      ],
      primaryRecommendation: "检查自动对时设置，并确保系统 VPN 建立权限未被手机管家拦截。",
      relatedArticleUrl: "/guides/ctc-android-background/",
      relatedArticleTitle: "《CTC 金龙鱼安卓手机频繁断开怎么办？OPPO、小米与华为后台设置指南》"
    },
    'connected-no-web': {
      title: "Android 设备：显示已连接但无网络排查",
      steps: [
        {
          id: 'step-and-w1',
          label: "1. 检查路由模式分流规则",
          detail: "确认客户端设置为‘规则路由（Bypass LAN & China）’，避免国内应用误走境外节点导致超时。",
          actionTip: "检查应用分流黑白名单是否误排除了当前浏览器。"
        },
        {
          id: 'step-and-w2',
          label: "2. 私人 DNS（DoT）与代理冲突排查",
          detail: "Android 系统的‘私人 DNS’设置若配置了不可达的域名，会导致所有应用解析死锁。",
          actionTip: "进入系统‘设置 - 连接与共享 - 私人 DNS’，暂时切换为‘自动’或‘关闭’进行测试。"
        }
      ],
      primaryRecommendation: "请关闭系统设置中的第三方私人 DNS，并检查客户端分流规则是否误封锁了本地连接。",
      relatedArticleUrl: "/guides/ctc-wifi-mobile-network/",
      relatedArticleTitle: "《CTC 金龙鱼切换 Wi-Fi 和手机流量后无法连接？网络环境检查指南》"
    }
  },

  // iPhone & iPad
  ios: {
    'client-cannot-connect': {
      title: "iOS 设备：VPN 配置与连接失败排查",
      steps: [
        {
          id: 'step-ios-1',
          label: "1. 系统‘日期与时间’自动校准验证",
          detail: "SS-2022 协议要求设备系统时间与国际标准时差距小于 30 秒，手动调快/慢将导致解密失败。",
          actionTip: "进入‘设置 - 通用 - 日期与时间’，确保‘自动设置’开关处于开启状态。"
        },
        {
          id: 'step-ios-2',
          label: "2. 客户端 VPN 描述文件配置重置",
          detail: "iOS 经常因网络或系统更新导致旧的 VPN Profile 挂死或出现接口权限受损。",
          actionTip: "进入‘设置 - 通用 - VPN 与设备管理’，删除原有的客户端 VPN 配置后重新打开 App 授权创建。"
        },
        {
          id: 'step-ios-3',
          label: "3. 客户端（Shadowrocket / Stash / Loon）版本更新",
          detail: "过旧的客户端版本不支持现代 SS-2022 语法，会导致订阅解析错误或无法连接。",
          actionTip: "通过 App Store 将客户端更新至最新稳定版。"
        }
      ],
      primaryRecommendation: "绝大多数 iOS 握手报错是由于系统时间误差或旧版描述文件残留，按步骤重置即可恢复。",
      relatedArticleUrl: "/guides/ctc-ios-connectivity/",
      relatedArticleTitle: "《CTC 金龙鱼 iPhone 和 iPad 使用检查：VPN 权限、客户端配置与连接问题》"
    },
    'connected-no-web': {
      title: "iOS 设备：已连接但 Safari/应用无法加载排查",
      steps: [
        {
          id: 'step-ios-w1',
          label: "1. 本地网络权限授权检查",
          detail: "iOS 14+ 要求客户端必须拥有‘本地网络’权限才能正常与局域网路由通信。",
          actionTip: "在‘设置 - 客户端应用’中确保‘本地网络’开关已开启。"
        },
        {
          id: 'step-ios-w2',
          label: "2. 检查‘配置 / 分流规则’模式",
          detail: "确认客户端底栏选中‘配置（Config / Rule）’模式而非‘全局直连’或错误的测试规则。",
          actionTip: "在客户端中重新下载并应用默认分流配置文件。"
        }
      ],
      primaryRecommendation: "核对客户端是否具备本地网络权限，并将分流策略恢复为标准配置模式。",
      relatedArticleUrl: "/guides/ctc-ios-connectivity/",
      relatedArticleTitle: "《CTC 金龙鱼 iPhone 和 iPad 使用检查：VPN 权限、客户端配置与连接问题》"
    }
  },

  // Campus & Public Wi-Fi
  campus: {
    'node-timeout': {
      title: "校园网 / 公共 Wi-Fi：网络认证与防火墙限制排查",
      steps: [
        {
          id: 'step-cam-1',
          label: "1. 校园 Web 认证门户（Captive Portal）验证",
          detail: "未通过 Web 登录前，公共网关会劫持所有请求至内网认证页，外部代理协议无法建立任何连接。",
          actionTip: "务必先彻底关闭代理，打开任意未加密网页（如 example.com），完成学号/手机号登录并确认能直连上网。"
        },
        {
          id: 'step-cam-2',
          label: "2. 校园防火墙非标端口与 UDP 阻断排查",
          detail: "部分校园网或企业网严格屏蔽了非 80/443 端口的外部连接，或拦截了 Shadowsocks 流量。",
          actionTip: "尝试切换使用 443 端口的节点，或使用手机 4G/5G 热点进行对照测试确认阻断范围。"
        },
        {
          id: 'step-cam-3',
          label: "3. 校园 DNS 污染与 DOH 配置",
          detail: "校园网内网 DNS 通常存在强制重定向，导致节点入口域名解析到内网回环地址。",
          actionTip: "在客户端配置中开启 DOH（如 https://doh.pub/dns-query），并删除未加密的内网 DNS 服务器。"
        }
      ],
      primaryRecommendation: "必须先关代理完成校园 Web 认证，随后开启 DOH 规避内网 DNS 劫持。",
      relatedArticleUrl: "/guides/ctc-campus-public-wifi/",
      relatedArticleTitle: "《校园网和公共 Wi-Fi 无法使用 CTC 金龙鱼？网络认证与连接限制检查方法》"
    },
    'connected-no-web': {
      title: "校园网 / 公共 Wi-Fi：已连接但无法访问排查",
      steps: [
        {
          id: 'step-cam-w1',
          label: "1. 校园认证是否由于超时被下线",
          detail: "公共 Wi-Fi 往往设有 2–8 小时自动掉线机制，被踢下线后外部连接全部阻断。",
          actionTip: "关闭客户端，刷新浏览器查看是否重新弹出了校园网登录页面。"
        },
        {
          id: 'step-cam-w2',
          label: "2. 客户端 TUN 模式路由抢占检查",
          detail: "部分 TUN 虚拟网卡会将校园网本地验证网段（如 10.x.x.x 或 172.x.x.x）误纳入代理路由。",
          actionTip: "将校园内网网段加入客户端直连白名单列表。"
        }
      ],
      primaryRecommendation: "检查校园网认证有效时长，并将校园本地网段加入客户端分流白名单。",
      relatedArticleUrl: "/guides/ctc-campus-public-wifi/",
      relatedArticleTitle: "《校园网和公共 Wi-Fi 无法使用 CTC 金龙鱼？网络认证与连接限制检查方法》"
    }
  },

  // Home Wi-Fi
  homewifi: {
    'connected-no-web': {
      title: "家庭 Wi-Fi：软路由与多重代理冲突排查",
      steps: [
        {
          id: 'step-home-1',
          label: "1. 检查是否存在主路由/旁路由双重透明代理",
          detail: "若家庭网络已部署了 OpenWrt 等软路由代理，设备端再次开启客户端会引发 NAT 端口环路冲突。",
          actionTip: "在设备上关闭客户端测试能否直接通过家庭软路由上网，避免多层重复代理。"
        },
        {
          id: 'step-home-2',
          label: "2. IPv6 泄露与优先解析冲突排查",
          detail: "家庭宽带分配了公网 IPv6 后，操作系统可能优先通过未代理的 IPv6 接口发起请求导致分流失败。",
          actionTip: "在客户端设置中开启‘IPv6 阻断 / 禁用 IPv6 解析’或在路由器中暂时关闭 IPv6 测试。"
        }
      ],
      primaryRecommendation: "核查家庭软路由透明代理设置，并在客户端中关闭 IPv6 优先以防分流环路。",
      relatedArticleUrl: "/guides/ctc-wifi-mobile-network/",
      relatedArticleTitle: "《CTC 金龙鱼切换 Wi-Fi 和手机流量后无法连接？网络环境检查指南》"
    }
  }
};
