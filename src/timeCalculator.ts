import { WorkTimeRecord, TrackerState } from './types';

/**
 * 时间计算工具类
 * 提供各种时间相关的计算功能
 */
export class TimeCalculator {
  
  /**
   * 计算工作时长（毫秒）
   * @param startTime 开始时间
   * @param endTime 结束时间，默认为当前时间
   * @param pausedDuration 暂停时长（毫秒）
   * @returns 实际工作时长（毫秒）
   */
  public static calculateWorkedTime(
    startTime: Date,
    endTime: Date = new Date(),
    pausedDuration: number = 0
  ): number {
    const totalTime = endTime.getTime() - startTime.getTime();
    return Math.max(0, totalTime - pausedDuration);
  }
  
  /**
   * 计算工作记录的总时长
   * @param records 工作记录数组
   * @returns 总工作时长（毫秒）
   */
  public static calculateTotalWorkedTime(records: WorkTimeRecord[]): number {
    return records.reduce((total, record) => {
      if (record.endTime) {
        return total + this.calculateWorkedTime(
          record.startTime,
          record.endTime,
          record.pausedDuration
        );
      } else {
        // 正在进行中的记录
        return total + this.calculateWorkedTime(
          record.startTime,
          new Date(),
          record.pausedDuration
        );
      }
    }, 0);
  }
  
  /**
   * 将毫秒转换为小时
   * @param milliseconds 毫秒数
   * @returns 小时数（保留2位小数）
   */
  public static millisecondsToHours(milliseconds: number): number {
    return Math.round((milliseconds / (1000 * 60 * 60)) * 100) / 100;
  }
  
  /**
   * 将毫秒转换为可读的时间格式
   * @param milliseconds 毫秒数
   * @returns 格式化的时间字符串（如：2h 30m 15s）
   */
  public static formatDuration(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    const parts: string[] = [];
    
    if (hours > 0) {
      parts.push(`${hours}h`);
    }
    if (minutes > 0) {
      parts.push(`${minutes}m`);
    }
    if (seconds > 0 || parts.length === 0) {
      parts.push(`${seconds}s`);
    }
    
    return parts.join(' ');
  }
  
  /**
   * 将毫秒转换为简短的时间格式
   * @param milliseconds 毫秒数
   * @returns 简短格式的时间字符串（如：02:30:15）
   */
  public static formatDurationShort(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  /**
   * 计算基于时长的收入
   * @param workedTimeMs 工作时长（毫秒）
   * @param hourlySalary 每小时薪资
   * @param precision 金额精度（最小单位）
   * @returns 收入金额（按精度四舍五入）
   */
  public static calculateEarnings(workedTimeMs: number, hourlySalary: number, precision: number = 0.001): number {
    const workedHours = workedTimeMs / (1000 * 60 * 60); // 更精确的小时计算
    const earnings = workedHours * hourlySalary;
    // 使用更高精度进行计算，然后按照精度进行四舍五入
    return Math.round(earnings / precision) * precision;
  }
  
  /**
   * 获取今天的开始时间（00:00:00）
   * @param date 指定日期，默认为今天
   * @returns 今天开始时间
   */
  public static getTodayStart(date: Date = new Date()): Date {
    const today = new Date(date);
    today.setHours(0, 0, 0, 0);
    return today;
  }
  
  /**
   * 获取今天的结束时间（23:59:59.999）
   * @param date 指定日期，默认为今天
   * @returns 今天结束时间
   */
  public static getTodayEnd(date: Date = new Date()): Date {
    const today = new Date(date);
    today.setHours(23, 59, 59, 999);
    return today;
  }
  
  /**
   * 检查两个日期是否为同一天
   * @param date1 日期1
   * @param date2 日期2
   * @returns 是否为同一天
   */
  public static isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
  
  /**
   * 获取日期的字符串表示（YYYY-MM-DD）
   * @param date 日期对象
   * @returns 日期字符串
   */
  public static getDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  
  /**
   * 计算预计完成时间
   * @param state 追踪器状态
   * @param targetHours 目标工作小时数
   * @returns 预计完成时间，如果已完成则返回null
   */
  public static calculateEstimatedCompletion(
    state: TrackerState,
    targetHours: number
  ): Date | null {
    const workedHours = this.millisecondsToHours(state.todayWorkedTime);
    
    if (workedHours >= targetHours) {
      return null; // 已完成目标
    }
    
    const remainingHours = targetHours - workedHours;
    const remainingMs = remainingHours * 60 * 60 * 1000;
    
    return new Date(Date.now() + remainingMs);
  }

  /**
   * 解析时间字符串为小时和分钟
   * @param timeStr 时间字符串（格式：HH:MM）
   * @returns {hour: number, minute: number} 或 null（如果格式错误）
   */
  public static parseTimeString(timeStr: string): { hour: number; minute: number } | null {
    const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) {
      return null;
    }
    
    const hour = parseInt(match[1], 10);
    const minute = parseInt(match[2], 10);
    
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return null;
    }
    
    return { hour, minute };
  }

  /**
   * 检查当前时间是否在工作时间段内
   * @param workStartTime 工作开始时间（格式：HH:MM）
   * @param workEndTime 工作结束时间（格式：HH:MM）
   * @param currentTime 当前时间，默认为现在
   * @returns 是否在工作时间段内
   */
  public static isInWorkTimeRange(
    workStartTime: string,
    workEndTime: string,
    currentTime: Date = new Date()
  ): boolean {
    const startTime = this.parseTimeString(workStartTime);
    const endTime = this.parseTimeString(workEndTime);
    
    if (!startTime || !endTime) {
      return true; // 如果时间格式错误，默认允许工作
    }
    
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTotalMinutes = currentHour * 60 + currentMinute;
    
    const startTotalMinutes = startTime.hour * 60 + startTime.minute;
    const endTotalMinutes = endTime.hour * 60 + endTime.minute;
    
    // 处理跨天的情况（如：22:00 - 06:00）
    if (startTotalMinutes > endTotalMinutes) {
      return currentTotalMinutes >= startTotalMinutes || currentTotalMinutes <= endTotalMinutes;
    } else {
      return currentTotalMinutes >= startTotalMinutes && currentTotalMinutes <= endTotalMinutes;
    }
  }

  /**
   * 获取指定日期的工作时间段开始时间
   * @param date 指定日期
   * @param workStartTime 工作开始时间（格式：HH:MM）
   * @returns 工作开始时间的Date对象
   */
  public static getWorkStartDateTime(date: Date, workStartTime: string): Date | null {
    const startTime = this.parseTimeString(workStartTime);
    if (!startTime) {
      return null;
    }
    
    const workStart = new Date(date);
    workStart.setHours(startTime.hour, startTime.minute, 0, 0);
    return workStart;
  }

  /**
   * 获取指定日期的工作时间段结束时间
   * @param date 指定日期
   * @param workEndTime 工作结束时间（格式：HH:MM）
   * @returns 工作结束时间的Date对象
   */
  public static getWorkEndDateTime(date: Date, workEndTime: string): Date | null {
    const endTime = this.parseTimeString(workEndTime);
    if (!endTime) {
      return null;
    }
    
    const workEnd = new Date(date);
    workEnd.setHours(endTime.hour, endTime.minute, 0, 0);
    return workEnd;
  }
}
