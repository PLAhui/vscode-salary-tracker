import * as vscode from 'vscode';
import { SalaryConfig } from './types';

/**
 * 配置管理器
 * 负责管理插件的所有配置项
 */
export class ConfigManager {
  private static readonly CONFIG_SECTION = 'salaryTracker';
  
  /**
   * 获取当前配置
   * @returns 薪资追踪器配置
   */
  public static getConfig(): SalaryConfig {
    const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);

    return {
      dailySalary: config.get<number>('dailySalary', 500),
      workHoursPerDay: config.get<number>('workHoursPerDay', 8),
      currency: config.get<string>('currency', '¥'),
      autoStart: config.get<boolean>('autoStart', false),
      showInStatusBar: config.get<boolean>('showInStatusBar', true),
      updateInterval: config.get<number>('updateInterval', 500), // 默认500ms更新
      workDays: config.get<number[]>('workDays', [1, 2, 3, 4, 5]),
      realTimeUpdateInterval: config.get<number>('realTimeUpdateInterval', 250), // 实时更新250ms
      enableHighFrequencyUpdate: config.get<boolean>('enableHighFrequencyUpdate', true),
      customIndicators: config.get<string[]>('customIndicators', ['⚡', '💰', '📈', '✨']),
      enableIndicators: config.get<boolean>('enableIndicators', true),
      statusIcons: config.get<{running: string; paused: string; stopped: string}>('statusIcons', {
        running: '$(play)',
        paused: '$(debug-pause)',
        stopped: '$(primitive-square)'
      }),
      enableStatusIcons: config.get<boolean>('enableStatusIcons', true)
    };
  }
  
  /**
   * 更新配置项
   * @param key 配置键
   * @param value 配置值
   * @param target 配置目标（全局或工作区）
   */
  public static async updateConfig<K extends keyof SalaryConfig>(
    key: K,
    value: SalaryConfig[K],
    target: vscode.ConfigurationTarget = vscode.ConfigurationTarget.Global
  ): Promise<void> {
    const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);
    await config.update(key, value, target);
  }
  
  /**
   * 重置配置为默认值
   */
  public static async resetConfig(): Promise<void> {
    const config = vscode.workspace.getConfiguration(this.CONFIG_SECTION);
    const defaultConfig: SalaryConfig = {
      dailySalary: 500,
      workHoursPerDay: 8,
      currency: '¥',
      autoStart: false,
      showInStatusBar: true,
      updateInterval: 500,
      workDays: [1, 2, 3, 4, 5],
      realTimeUpdateInterval: 250,
      enableHighFrequencyUpdate: true,
      customIndicators: ['⚡', '💰', '📈', '✨'],
      enableIndicators: true,
      statusIcons: {
        running: '$(play)',
        paused: '$(debug-pause)',
        stopped: '$(primitive-square)'
      },
      enableStatusIcons: true
    };

    for (const [key, value] of Object.entries(defaultConfig)) {
      await config.update(key, value, vscode.ConfigurationTarget.Global);
    }
  }
  
  /**
   * 监听配置变化
   * @param callback 配置变化回调函数
   * @returns 配置变化监听器的销毁函数
   */
  public static onConfigChanged(callback: (config: SalaryConfig) => void): vscode.Disposable {
    return vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration(this.CONFIG_SECTION)) {
        callback(this.getConfig());
      }
    });
  }
  
  /**
   * 验证配置是否有效
   * @param config 要验证的配置
   * @returns 验证结果和错误信息
   */
  public static validateConfig(config: SalaryConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (config.dailySalary < 0) {
      errors.push('日薪不能为负数');
    }
    
    if (config.workHoursPerDay < 1 || config.workHoursPerDay > 24) {
      errors.push('每日工作小时数必须在1-24之间');
    }
    
    if (config.updateInterval < 100) {
      errors.push('更新间隔不能小于100毫秒');
    }
    
    if (!Array.isArray(config.workDays) || config.workDays.length === 0) {
      errors.push('工作日配置无效');
    } else {
      const invalidDays = config.workDays.filter(day => day < 0 || day > 6);
      if (invalidDays.length > 0) {
        errors.push('工作日必须在0-6之间（0=周日，6=周六）');
      }
    }

    if (!Array.isArray(config.customIndicators)) {
      errors.push('自定义指示器必须是数组');
    } else if (config.customIndicators.length === 0) {
      errors.push('自定义指示器数组不能为空');
    } else {
      const invalidIndicators = config.customIndicators.filter(indicator =>
        typeof indicator !== 'string' || indicator.trim().length === 0
      );
      if (invalidIndicators.length > 0) {
        errors.push('自定义指示器必须是非空字符串');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * 获取每小时薪资
   * @param config 配置对象
   * @returns 每小时薪资
   */
  public static getHourlySalary(config?: SalaryConfig): number {
    const currentConfig = config || this.getConfig();
    return currentConfig.dailySalary / currentConfig.workHoursPerDay;
  }
  
  /**
   * 检查今天是否为工作日
   * @param config 配置对象
   * @param date 要检查的日期，默认为今天
   * @returns 是否为工作日
   */
  public static isWorkDay(config?: SalaryConfig, date?: Date): boolean {
    const currentConfig = config || this.getConfig();
    const checkDate = date || new Date();
    const dayOfWeek = checkDate.getDay();
    
    return currentConfig.workDays.includes(dayOfWeek);
  }
}
