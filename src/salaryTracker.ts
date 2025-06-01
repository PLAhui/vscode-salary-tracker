import * as vscode from 'vscode';
import { TrackerState, TrackerStatus, TrackerEvent, TrackerEventListener, DailyEarnings, WorkTimeRecord } from './types';
import { ConfigManager } from './configManager';
import { TimeCalculator } from './timeCalculator';

/**
 * 薪资追踪器核心类
 * 负责时间追踪、收入计算和状态管理
 */
export class SalaryTracker {
  private state: TrackerState;
  private updateTimer?: NodeJS.Timeout;
  private eventListeners: Map<TrackerEvent, TrackerEventListener[]> = new Map();
  private context: vscode.ExtensionContext;
  
  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.state = this.loadState();
    this.initializeEventListeners();
  }
  
  /**
   * 初始化事件监听器映射
   */
  private initializeEventListeners(): void {
    const events: TrackerEvent[] = ['start', 'pause', 'resume', 'stop', 'reset', 'update'];
    events.forEach(event => {
      this.eventListeners.set(event, []);
    });
  }
  
  /**
   * 从持久化存储加载状态
   */
  private loadState(): TrackerState {
    const savedState = this.context.globalState.get<TrackerState>('salaryTrackerState');
    
    if (savedState) {
      // 检查是否为新的一天，如果是则重置今日数据
      const today = TimeCalculator.getTodayStart();
      const savedDate = savedState.todayStartTime ? new Date(savedState.todayStartTime) : new Date();
      
      if (!TimeCalculator.isSameDay(today, savedDate)) {
        return this.createInitialState();
      }
      
      // 恢复日期对象
      if (savedState.todayStartTime) {
        savedState.todayStartTime = new Date(savedState.todayStartTime);
      }
      if (savedState.currentSessionStart) {
        savedState.currentSessionStart = new Date(savedState.currentSessionStart);
      }
      if (savedState.pauseStartTime) {
        savedState.pauseStartTime = new Date(savedState.pauseStartTime);
      }
      
      return savedState;
    }
    
    return this.createInitialState();
  }
  
  /**
   * 创建初始状态
   */
  private createInitialState(): TrackerState {
    return {
      status: TrackerStatus.STOPPED,
      todayWorkedTime: 0,
      todayEarnings: 0,
      totalPausedTime: 0
    };
  }
  
  /**
   * 保存状态到持久化存储
   */
  private async saveState(): Promise<void> {
    await this.context.globalState.update('salaryTrackerState', this.state);
  }
  
  /**
   * 触发事件
   */
  private emitEvent(event: TrackerEvent): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(listener => {
      try {
        listener(this.state);
      } catch (error) {
        console.error(`Error in ${event} event listener:`, error);
      }
    });
  }
  
  /**
   * 开始计时
   */
  public async start(): Promise<void> {
    if (this.state.status === TrackerStatus.RUNNING) {
      return;
    }
    
    const now = new Date();
    
    if (this.state.status === TrackerStatus.STOPPED) {
      // 全新开始
      this.state.todayStartTime = now;
      this.state.currentSessionStart = now;
      this.state.todayWorkedTime = 0;
      this.state.totalPausedTime = 0;
    } else if (this.state.status === TrackerStatus.PAUSED) {
      // 从暂停恢复
      if (this.state.pauseStartTime) {
        const pauseDuration = now.getTime() - this.state.pauseStartTime.getTime();
        this.state.totalPausedTime += pauseDuration;
      }
      this.state.currentSessionStart = now;
      this.state.pauseStartTime = undefined;
    }
    
    this.state.status = TrackerStatus.RUNNING;
    this.startUpdateTimer();
    
    await this.saveState();
    this.emitEvent('start');
    
    vscode.window.showInformationMessage('薪资追踪已开始');
  }
  
  /**
   * 暂停计时
   */
  public async pause(): Promise<void> {
    if (this.state.status !== TrackerStatus.RUNNING) {
      return;
    }
    
    this.state.status = TrackerStatus.PAUSED;
    this.state.pauseStartTime = new Date();
    this.stopUpdateTimer();
    
    await this.saveState();
    this.emitEvent('pause');
    
    vscode.window.showInformationMessage('薪资追踪已暂停');
  }
  
  /**
   * 停止计时
   */
  public async stop(): Promise<void> {
    if (this.state.status === TrackerStatus.STOPPED) {
      return;
    }
    
    this.updateWorkedTime();
    this.state.status = TrackerStatus.STOPPED;
    this.state.currentSessionStart = undefined;
    this.state.pauseStartTime = undefined;
    this.stopUpdateTimer();
    
    await this.saveState();
    this.emitEvent('stop');
    
    vscode.window.showInformationMessage('薪资追踪已停止');
  }
  
  /**
   * 重置今日数据
   */
  public async reset(): Promise<void> {
    const result = await vscode.window.showWarningMessage(
      '确定要重置今日的薪资追踪数据吗？',
      { modal: true },
      '确定',
      '取消'
    );

    if (result === '确定') {
      this.stopUpdateTimer();
      this.state = this.createInitialState();

      await this.saveState();
      this.emitEvent('reset');

      vscode.window.showInformationMessage('今日薪资追踪数据已重置');
    }
  }

  /**
   * 更新工作时间和收入
   */
  private updateWorkedTime(): void {
    if (this.state.status === TrackerStatus.RUNNING && this.state.currentSessionStart && this.state.todayStartTime) {
      const now = new Date();

      // 计算从今天开始到现在的总工作时间（减去暂停时间）
      const totalElapsed = now.getTime() - this.state.todayStartTime.getTime();
      this.state.todayWorkedTime = Math.max(0, totalElapsed - this.state.totalPausedTime);

      // 计算收入
      const config = ConfigManager.getConfig();
      const hourlySalary = ConfigManager.getHourlySalary(config);
      this.state.todayEarnings = TimeCalculator.calculateEarnings(
        this.state.todayWorkedTime,
        hourlySalary
      );

      // 更新当前会话开始时间
      this.state.currentSessionStart = now;
    }
  }

  /**
   * 启动更新定时器
   */
  private startUpdateTimer(): void {
    this.stopUpdateTimer();

    const config = ConfigManager.getConfig();
    const updateInterval = config.enableHighFrequencyUpdate
      ? config.realTimeUpdateInterval
      : config.updateInterval;

    this.updateTimer = setInterval(() => {
      this.updateWorkedTime();
      this.emitEvent('update');
    }, updateInterval);
  }

  /**
   * 停止更新定时器
   */
  private stopUpdateTimer(): void {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = undefined;
    }
  }

  /**
   * 获取当前状态（实时计算）
   */
  public getState(): TrackerState {
    // 创建状态副本
    const currentState = { ...this.state };

    // 如果正在运行，实时计算当前时间和收入
    if (currentState.status === TrackerStatus.RUNNING && currentState.todayStartTime) {
      const now = new Date();
      const totalElapsed = now.getTime() - currentState.todayStartTime.getTime();
      currentState.todayWorkedTime = Math.max(0, totalElapsed - currentState.totalPausedTime);

      // 实时计算收入
      const config = ConfigManager.getConfig();
      const hourlySalary = ConfigManager.getHourlySalary(config);
      currentState.todayEarnings = TimeCalculator.calculateEarnings(
        currentState.todayWorkedTime,
        hourlySalary
      );
    }

    return currentState;
  }

  /**
   * 添加事件监听器
   */
  public addEventListener(event: TrackerEvent, listener: TrackerEventListener): void {
    const listeners = this.eventListeners.get(event) || [];
    listeners.push(listener);
    this.eventListeners.set(event, listeners);
  }

  /**
   * 移除事件监听器
   */
  public removeEventListener(event: TrackerEvent, listener: TrackerEventListener): void {
    const listeners = this.eventListeners.get(event) || [];
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  /**
   * 获取今日统计信息
   */
  public getTodayStats(): DailyEarnings {
    const state = this.getState();
    const config = ConfigManager.getConfig();

    return {
      date: TimeCalculator.getDateString(new Date()),
      workedHours: TimeCalculator.millisecondsToHours(state.todayWorkedTime),
      earnings: state.todayEarnings,
      workRecords: [] // 简化版本，不记录详细工作记录
    };
  }

  /**
   * 检查是否应该自动开始
   */
  public shouldAutoStart(): boolean {
    const config = ConfigManager.getConfig();
    return config.autoStart && ConfigManager.isWorkDay(config);
  }

  /**
   * 销毁追踪器
   */
  public dispose(): void {
    this.stopUpdateTimer();
    this.eventListeners.clear();
  }
}
