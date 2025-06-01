import * as vscode from 'vscode';
import { SalaryTracker } from './salaryTracker';
import { TrackerState, TrackerStatus } from './types';
import { ConfigManager } from './configManager';
import { TimeCalculator } from './timeCalculator';

/**
 * 状态栏提供者
 * 负责在VSCode状态栏显示实时薪资信息
 */
export class StatusBarProvider {
  private statusBarItem: vscode.StatusBarItem;
  private salaryTracker: SalaryTracker;
  private isVisible: boolean = false;
  private updateTimer?: NodeJS.Timeout;
  private lastEarnings: number = 0;
  private animationCounter: number = 0;
  
  constructor(salaryTracker: SalaryTracker) {
    this.salaryTracker = salaryTracker;

    // 创建状态栏项目
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );

    // 设置点击命令
    this.statusBarItem.command = 'salaryTracker.showPanel';

    // 监听追踪器状态变化
    this.salaryTracker.addEventListener('start', this.onStateChanged.bind(this));
    this.salaryTracker.addEventListener('pause', this.onStateChanged.bind(this));
    this.salaryTracker.addEventListener('stop', this.onStateChanged.bind(this));
    this.salaryTracker.addEventListener('reset', this.onStateChanged.bind(this));
    this.salaryTracker.addEventListener('update', this.onStateChanged.bind(this));

    // 监听配置变化
    ConfigManager.onConfigChanged(this.onConfigChanged.bind(this));

    // 初始化显示
    this.updateDisplay();

    // 启动状态栏更新定时器
    this.startUpdateTimer();
  }
  
  /**
   * 状态变化处理
   */
  private onStateChanged(_state: TrackerState): void {
    this.updateDisplay();
    // 注意：不在这里控制定时器，让定时器始终运行以确保实时更新
  }
  
  /**
   * 配置变化处理
   */
  private onConfigChanged(): void {
    this.updateDisplay();
  }
  
  /**
   * 更新状态栏显示
   */
  private updateDisplay(): void {
    const config = ConfigManager.getConfig();
    
    // 检查是否应该显示
    if (!config.showInStatusBar) {
      this.hide();
      return;
    }
    
    // 检查是否为工作日
    if (!ConfigManager.isWorkDay(config)) {
      this.statusBarItem.text = `$(clock) 非工作日`;
      this.statusBarItem.tooltip = '今天不是工作日';
      this.statusBarItem.backgroundColor = undefined;
      this.show();
      return;
    }
    
    const state = this.salaryTracker.getState();
    const { text, tooltip, backgroundColor } = this.formatStatusBarContent(state, config);
    
    this.statusBarItem.text = text;
    this.statusBarItem.tooltip = tooltip;
    this.statusBarItem.backgroundColor = backgroundColor;
    
    this.show();
  }
  
  /**
   * 格式化状态栏内容
   */
  private formatStatusBarContent(state: TrackerState, config: any): {
    text: string;
    tooltip: string;
    backgroundColor?: vscode.ThemeColor;
  } {
    const currency = config.currency;
    const earnings = state.todayEarnings.toFixed(3); // 显示3位小数以便观察实时变化

    const workedTime = TimeCalculator.formatDurationShort(state.todayWorkedTime);
    const workedHours = TimeCalculator.millisecondsToHours(state.todayWorkedTime);
    const targetHours = config.workHoursPerDay;
    const progress = Math.min(100, (workedHours / targetHours) * 100);

    let icon: string = '';
    let backgroundColor: vscode.ThemeColor | undefined;

    // 根据配置决定是否显示状态图标
    if (config.enableStatusIcons) {
      switch (state.status) {
        case TrackerStatus.RUNNING:
          icon = config.statusIcons?.running || '$(play)';
          backgroundColor = new vscode.ThemeColor('statusBarItem.prominentBackground');
          break;
        case TrackerStatus.PAUSED:
          icon = config.statusIcons?.paused || '$(debug-pause)';
          backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
          break;
        case TrackerStatus.STOPPED:
          icon = config.statusIcons?.stopped || '$(primitive-square)';
          break;
      }
    }

    // 添加跳动指示器
    let animationIndicator = '';
    if (state.status === TrackerStatus.RUNNING && config.enableIndicators) {
      // 检查收入是否变化（使用更高精度检测）
      const currentEarnings = Math.round(parseFloat(earnings) * 1000) / 1000; // 保留3位小数精度
      if (Math.abs(currentEarnings - this.lastEarnings) >= 0.001) { // 检测0.001的变化
        this.lastEarnings = currentEarnings;
        // 使用自定义指示器数组的长度来循环
        this.animationCounter = (this.animationCounter + 1) % Math.max(1, config.customIndicators.length);
      }

      // 使用自定义指示器
      const indicators = config.customIndicators && config.customIndicators.length > 0
        ? config.customIndicators
        : ['⚡', '💰', '📈', '✨']; // 默认指示器作为后备
      animationIndicator = ` ${indicators[this.animationCounter]}`;
    }

    // 构建状态栏文本，如果没有图标则不添加空格
    const text = icon
      ? `${icon} ${currency}${earnings}${animationIndicator}`
      : `${currency}${earnings}${animationIndicator}`;

    const tooltip = this.createTooltip(state, config, workedTime, progress);

    return { text, tooltip, backgroundColor };
  }
  
  /**
   * 创建详细的工具提示
   */
  private createTooltip(state: TrackerState, config: any, workedTime: string, progress: number): string {
    const lines: string[] = [];

    lines.push('💰 今日薪资追踪');
    lines.push('');

    // 基本信息
    lines.push(`收入: ${config.currency}${state.todayEarnings.toFixed(3)}`);
    lines.push(`工作时间: ${workedTime}`);
    lines.push(`进度: ${progress.toFixed(1)}% (${TimeCalculator.millisecondsToHours(state.todayWorkedTime).toFixed(2)}h / ${config.workHoursPerDay}h)`);

    // 状态信息
    const statusText = this.getStatusText(state.status);
    lines.push(`状态: ${statusText}`);

    // 预计完成时间
    if (state.status === TrackerStatus.RUNNING) {
      const estimatedCompletion = TimeCalculator.calculateEstimatedCompletion(
        state,
        config.workHoursPerDay
      );

      if (estimatedCompletion) {
        const completionTime = estimatedCompletion.toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit'
        });
        lines.push(`预计完成: ${completionTime}`);
      } else {
        lines.push('🎉 今日目标已完成！');
      }
    }

    lines.push('');
    lines.push('点击查看详细信息');

    return lines.join('\n');
  }
  
  /**
   * 获取状态文本
   */
  private getStatusText(status: TrackerStatus): string {
    switch (status) {
      case TrackerStatus.RUNNING:
        return '⏱️ 计时中';
      case TrackerStatus.PAUSED:
        return '⏸️ 已暂停';
      case TrackerStatus.STOPPED:
        return '⏹️ 已停止';
      default:
        return '未知';
    }
  }
  
  /**
   * 显示状态栏项目
   */
  private show(): void {
    if (!this.isVisible) {
      this.statusBarItem.show();
      this.isVisible = true;
    }
  }
  
  /**
   * 隐藏状态栏项目
   */
  private hide(): void {
    if (this.isVisible) {
      this.statusBarItem.hide();
      this.isVisible = false;
    }
  }
  
  /**
   * 启动状态栏更新定时器
   */
  private startUpdateTimer(): void {
    this.stopUpdateTimer();

    const config = ConfigManager.getConfig();
    const updateInterval = config.enableHighFrequencyUpdate
      ? config.realTimeUpdateInterval
      : config.updateInterval;

    this.updateTimer = setInterval(() => {
      // 在所有状态下都更新状态栏以确保数据同步
      this.updateDisplay();
    }, updateInterval);
  }

  /**
   * 停止状态栏更新定时器
   */
  private stopUpdateTimer(): void {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = undefined;
    }
  }

  /**
   * 销毁状态栏提供者
   */
  public dispose(): void {
    this.stopUpdateTimer();
    this.statusBarItem.dispose();
  }
}
