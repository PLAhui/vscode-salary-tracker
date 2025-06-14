/**
 * 薪资追踪器类型定义
 */

/**
 * 薪资计算模式枚举
 */
export enum SalaryMode {
  /** 固定工作时间模式（月薪制） */
  FIXED_SCHEDULE = 'fixed_schedule',
  /** 按时计薪模式（小时制） */
  HOURLY = 'hourly'
}

/**
 * 固定工作时间配置
 */
export interface FixedScheduleConfig {
  /** 月薪金额 */
  monthlySalary: number;
  /** 工作开始时间（24小时制，如 9 表示9:00） */
  workStartHour: number;
  /** 工作结束时间（24小时制，如 20 表示20:00） */
  workEndHour: number;
  /** 工作日数组（0=周日, 1=周一, ..., 6=周六） */
  workDays: number[];
}

/**
 * 按时计薪配置
 */
export interface HourlyConfig {
  /** 小时薪资 */
  hourlySalary: number;
  /** VSCode启动时自动开始 */
  autoStartOnLaunch: boolean;
}

/**
 * 薪资追踪器配置接口
 */
export interface SalaryConfig {
  /** 薪资计算模式 */
  salaryMode: SalaryMode;
  /** 固定工作时间配置 */
  fixedSchedule: FixedScheduleConfig;
  /** 按时计薪配置 */
  hourly: HourlyConfig;
  /** 日薪金额（兼容旧版本） */
  dailySalary: number;
  /** 每日工作小时数（兼容旧版本） */
  workHoursPerDay: number;
  /** 货币符号 */
  currency: string;
  /** 自动开始计时 */
  autoStart: boolean;
  /** 在状态栏显示 */
  showInStatusBar: boolean;
  /** 更新间隔（毫秒） */
  updateInterval: number;
  /** 工作日数组（兼容旧版本） */
  workDays: number[];
  /** 实时更新频率（毫秒） */
  realTimeUpdateInterval: number;
  /** 启用高频率更新 */
  enableHighFrequencyUpdate: boolean;
  /** 自定义动画指示器 */
  customIndicators: string[];
  /** 启用动画指示器 */
  enableIndicators: boolean;
  /** 自定义状态图标 */
  statusIcons: {
    running: string;
    paused: string;
    stopped: string;
  };
  /** 启用状态图标 */
  enableStatusIcons: boolean;
}

/**
 * 工作时间记录接口
 */
export interface WorkTimeRecord {
  /** 开始时间 */
  startTime: Date;
  /** 结束时间（可选，正在进行中时为空） */
  endTime?: Date;
  /** 是否暂停 */
  isPaused: boolean;
  /** 暂停时长（毫秒） */
  pausedDuration: number;
}

/**
 * 日收入统计接口
 */
export interface DailyEarnings {
  /** 日期 */
  date: string;
  /** 工作时长（小时） */
  workedHours: number;
  /** 收入金额 */
  earnings: number;
  /** 工作记录 */
  workRecords: WorkTimeRecord[];
}

/**
 * 追踪器状态枚举
 */
export enum TrackerStatus {
  /** 停止 */
  STOPPED = 'stopped',
  /** 运行中 */
  RUNNING = 'running',
  /** 暂停 */
  PAUSED = 'paused'
}

/**
 * 追踪器状态接口
 */
export interface TrackerState {
  /** 当前状态 */
  status: TrackerStatus;
  /** 今日开始时间 */
  todayStartTime?: Date;
  /** 今日工作时长（毫秒） */
  todayWorkedTime: number;
  /** 今日收入 */
  todayEarnings: number;
  /** 当前会话开始时间 */
  currentSessionStart?: Date;
  /** 暂停开始时间 */
  pauseStartTime?: Date;
  /** 总暂停时长（毫秒） */
  totalPausedTime: number;
}

/**
 * 事件类型
 */
export type TrackerEvent = 'start' | 'pause' | 'resume' | 'stop' | 'reset' | 'update';

/**
 * 事件监听器类型
 */
export type TrackerEventListener = (state: TrackerState) => void;
