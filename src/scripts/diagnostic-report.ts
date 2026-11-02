/**
 * CTC Connection Self-Check Report Generator
 * Generates privacy-safe, copyable diagnostic summaries
 */

export interface ReportData {
  deviceLabel: string;
  networkLabel: string;
  symptomLabel: string;
  ruleTitle: string;
  checkedSteps: string[];
  pendingSteps: string[];
  recommendation: string;
  timestamp: string;
}

export function generateDiagnosticText(data: ReportData): string {
  const lines: string[] = [
    `========================================`,
    `CTC 金龙鱼设备连接自检报告 (去敏合规版)`,
    `生成时间: ${data.timestamp}`,
    `========================================`,
    ``,
    `【1. 环境基础信息】`,
    `- 客户端/操作系统: ${data.deviceLabel}`,
    `- 网络连接环境: ${data.networkLabel}`,
    `- 遇到故障现象: ${data.symptomLabel}`,
    ``,
    `【2. 自检排查进展】`,
    `诊断规则: ${data.ruleTitle}`,
    ``,
    `已核查完成项 (${data.checkedSteps.length} 项):`,
    ...(data.checkedSteps.length > 0 
      ? data.checkedSteps.map(s => `  [✔ 已确认] ${s}`) 
      : [`  (暂未勾选已完成项)`]),
    ``,
    `待核查或未通过项 (${data.pendingSteps.length} 项):`,
    ...(data.pendingSteps.length > 0 
      ? data.pendingSteps.map(s => `  [○ 待检查] ${s}`) 
      : [`  (已全部核查完毕)`]),
    ``,
    `【3. 建议下一步排查动作】`,
    data.recommendation,
    ``,
    `【4. 隐私安全声明】`,
    `- 本自检报告为纯本地前端规则生成，未收集任何 IP、密码或订阅令牌。`,
    `- 向群组/技术客服反馈时，请勿补充原始订阅链接或含 Token 的完整日志。`,
    `========================================`
  ];

  return lines.join('\n');
}

export async function copyReportToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy diagnostic report: ', err);
    return false;
  }
}
