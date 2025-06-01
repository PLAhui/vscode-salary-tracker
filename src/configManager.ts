import * as vscode from 'vscode';
import { SalaryConfig, SalaryMode, FixedScheduleConfig, HourlyConfig } from './types';

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

    // 获取薪资模式
    const salaryMode = config.get<SalaryMode>('salaryMode', SalaryMode.HOURLY);

    // 获取固定工作时间配置
    const fixedSchedule: FixedScheduleConfig = config.get<FixedScheduleConfig>('fixedSchedule', {
      monthlySalary: 15000,
      workStartHour: 9,
      workEndHour: 20,
      workDays: [1, 2, 3, 4, 5]
    });

    // 获取按时计薪配置
    const hourly: HourlyConfig = config.get<HourlyConfig>('hourly', {
      hourlySalary: 62.5,
      autoStartOnLaunch: true
    });

    return {
      salaryMode,
      fixedSchedule,
      hourly,
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
      salaryMode: SalaryMode.HOURLY,
      fixedSchedule: {
        monthlySalary: 15000,
        workStartHour: 9,
        workEndHour: 20,
        workDays: [1, 2, 3, 4, 5]
      },
      hourly: {
        hourlySalary: 62.5,
        autoStartOnLaunch: true
      },
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
   * 获取每小时薪资（根据当前薪资模式）
   * @param config 配置对象
   * @returns 每小时薪资
   */
  public static getHourlySalary(config?: SalaryConfig): number {
    const currentConfig = config || this.getConfig();

    switch (currentConfig.salaryMode) {
      case SalaryMode.FIXED_SCHEDULE:
        // 固定工作时间模式：月薪 / (工作日数 * 4.33周/月 * 每日工作小时数)
        const workDaysPerWeek = currentConfig.fixedSchedule.workDays.length;
        const dailyWorkHours = currentConfig.fixedSchedule.workEndHour - currentConfig.fixedSchedule.workStartHour;
        const monthlyWorkHours = workDaysPerWeek * 4.33 * dailyWorkHours;
        return currentConfig.fixedSchedule.monthlySalary / monthlyWorkHours;

      case SalaryMode.HOURLY:
        // 按时计薪模式：直接返回小时薪资
        return currentConfig.hourly.hourlySalary;

      default:
        // 兼容旧版本
        return currentConfig.dailySalary / currentConfig.workHoursPerDay;
    }
  }

  /**
   * 检查今天是否为工作日（根据当前薪资模式）
   * @param config 配置对象
   * @param date 要检查的日期，默认为今天
   * @returns 是否为工作日
   */
  public static isWorkDay(config?: SalaryConfig, date?: Date): boolean {
    const currentConfig = config || this.getConfig();
    const checkDate = date || new Date();
    const dayOfWeek = checkDate.getDay();

    switch (currentConfig.salaryMode) {
      case SalaryMode.FIXED_SCHEDULE:
        return currentConfig.fixedSchedule.workDays.includes(dayOfWeek);

      case SalaryMode.HOURLY:
        // 按时计薪模式：任何时候都可以工作
        return true;

      default:
        // 兼容旧版本
        return currentConfig.workDays.includes(dayOfWeek);
    }
  }

  /**
   * 检查当前时间是否在工作时间内（仅对固定工作时间模式有效）
   * @param config 配置对象
   * @param date 要检查的时间，默认为当前时间
   * @returns 是否在工作时间内
   */
  public static isWorkTime(config?: SalaryConfig, date?: Date): boolean {
    const currentConfig = config || this.getConfig();

    if (currentConfig.salaryMode !== SalaryMode.FIXED_SCHEDULE) {
      // 非固定工作时间模式，任何时候都可以工作
      return true;
    }

    const checkDate = date || new Date();
    const currentHour = checkDate.getHours();

    return currentHour >= currentConfig.fixedSchedule.workStartHour &&
           currentHour < currentConfig.fixedSchedule.workEndHour;
  }

  /**
   * 检查是否应该自动开始计时
   * @param config 配置对象
   * @returns 是否应该自动开始
   */
  public static shouldAutoStart(config?: SalaryConfig): boolean {
    const currentConfig = config || this.getConfig();

    switch (currentConfig.salaryMode) {
      case SalaryMode.FIXED_SCHEDULE:
        // 固定工作时间模式：检查是否为工作日且在工作时间内
        return this.isWorkDay(currentConfig) && this.isWorkTime(currentConfig);

      case SalaryMode.HOURLY:
        // 按时计薪模式：检查是否启用了自动开始
        return currentConfig.hourly.autoStartOnLaunch;

      default:
        // 兼容旧版本
        return currentConfig.autoStart && this.isWorkDay(currentConfig);
    }
  }
}
