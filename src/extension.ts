import * as vscode from 'vscode';
import { SalaryTracker } from './salaryTracker';
import { StatusBarProvider } from './statusBarProvider';
import { WebviewProvider } from './webviewProvider';
import { ConfigManager } from './configManager';

/**
 * 插件激活函数
 * @param context 扩展上下文
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('薪资追踪器插件已激活');
  
  // 创建核心组件
  const salaryTracker = new SalaryTracker(context);
  const statusBarProvider = new StatusBarProvider(salaryTracker);
  const webviewProvider = new WebviewProvider(context.extensionUri, salaryTracker);
  
  // 注册webview提供者
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      WebviewProvider.viewType,
      webviewProvider
    )
  );
  
  // 注册命令
  registerCommands(context, salaryTracker);
  
  // 注册配置变化监听
  context.subscriptions.push(
    ConfigManager.onConfigChanged((config) => {
      console.log('配置已更新:', config);
    })
  );
  
  // 添加到订阅列表以便清理
  context.subscriptions.push(
    salaryTracker,
    statusBarProvider,
    webviewProvider
  );
  
  // 检查是否应该自动开始
  if (salaryTracker.shouldAutoStart()) {
    salaryTracker.start();
    vscode.window.showInformationMessage('薪资追踪已自动开始');
  }
  
  // 显示欢迎消息（仅首次安装）
  showWelcomeMessage(context);
}

/**
 * 注册所有命令
 */
function registerCommands(context: vscode.ExtensionContext, salaryTracker: SalaryTracker) {
  // 开始计时命令
  const startCommand = vscode.commands.registerCommand('salaryTracker.start', async () => {
    try {
      await salaryTracker.start();
    } catch (error) {
      vscode.window.showErrorMessage(`开始计时失败: ${error}`);
    }
  });
  
  // 暂停计时命令
  const pauseCommand = vscode.commands.registerCommand('salaryTracker.pause', async () => {
    try {
      await salaryTracker.pause();
    } catch (error) {
      vscode.window.showErrorMessage(`暂停计时失败: ${error}`);
    }
  });
  
  // 停止计时命令
  const stopCommand = vscode.commands.registerCommand('salaryTracker.stop', async () => {
    try {
      await salaryTracker.stop();
    } catch (error) {
      vscode.window.showErrorMessage(`停止计时失败: ${error}`);
    }
  });
  
  // 重置计时命令
  const resetCommand = vscode.commands.registerCommand('salaryTracker.reset', async () => {
    try {
      await salaryTracker.reset();
    } catch (error) {
      vscode.window.showErrorMessage(`重置计时失败: ${error}`);
    }
  });
  
  // 打开设置命令
  const openSettingsCommand = vscode.commands.registerCommand('salaryTracker.openSettings', () => {
    vscode.commands.executeCommand('workbench.action.openSettings', 'salaryTracker');
  });
  
  // 显示面板命令
  const showPanelCommand = vscode.commands.registerCommand('salaryTracker.showPanel', () => {
    vscode.commands.executeCommand('workbench.view.explorer');
    vscode.commands.executeCommand('salaryTracker.focus');
  });
  
  // 显示今日统计命令
  const showStatsCommand = vscode.commands.registerCommand('salaryTracker.showStats', () => {
    const stats = salaryTracker.getTodayStats();
    const config = ConfigManager.getConfig();

    const message = `今日统计:
收入: ${config.currency}${stats.earnings.toFixed(2)}
工作时间: ${stats.workedHours.toFixed(2)}小时
日期: ${stats.date}`;

    vscode.window.showInformationMessage(message);
  });
  
  // 快速配置命令
  const quickConfigCommand = vscode.commands.registerCommand('salaryTracker.quickConfig', async () => {
    await showQuickConfigDialog();
  });
  
  // 添加到订阅列表
  context.subscriptions.push(
    startCommand,
    pauseCommand,
    stopCommand,
    resetCommand,
    openSettingsCommand,
    showPanelCommand,
    showStatsCommand,
    quickConfigCommand
  );
}

/**
 * 显示快速配置对话框
 */
async function showQuickConfigDialog() {
  const config = ConfigManager.getConfig();
  
  // 配置日薪
  const dailySalaryInput = await vscode.window.showInputBox({
    prompt: '请输入日薪金额（元）',
    value: config.dailySalary.toString(),
    validateInput: (value) => {
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) {
        return '请输入有效的正数';
      }
      return undefined;
    }
  });
  
  if (dailySalaryInput === undefined) {
    return; // 用户取消
  }
  
  // 配置工作时长
  const workHoursInput = await vscode.window.showInputBox({
    prompt: '请输入每日工作时长（小时）',
    value: config.workHoursPerDay.toString(),
    validateInput: (value) => {
      const num = parseFloat(value);
      if (isNaN(num) || num < 1 || num > 24) {
        return '请输入1-24之间的数字';
      }
      return undefined;
    }
  });
  
  if (workHoursInput === undefined) {
    return; // 用户取消
  }
  
  // 保存配置
  try {
    await ConfigManager.updateConfig('dailySalary', parseFloat(dailySalaryInput));
    await ConfigManager.updateConfig('workHoursPerDay', parseFloat(workHoursInput));
    
    vscode.window.showInformationMessage('配置已保存！');
  } catch (error) {
    vscode.window.showErrorMessage(`保存配置失败: ${error}`);
  }
}

/**
 * 显示欢迎消息
 */
function showWelcomeMessage(context: vscode.ExtensionContext) {
  const hasShownWelcome = context.globalState.get<boolean>('hasShownWelcome', false);
  
  if (!hasShownWelcome) {
    vscode.window.showInformationMessage(
      '欢迎使用薪资追踪器！点击状态栏或侧边栏开始追踪您的收入。',
      '快速配置',
      '查看设置'
    ).then(selection => {
      if (selection === '快速配置') {
        vscode.commands.executeCommand('salaryTracker.quickConfig');
      } else if (selection === '查看设置') {
        vscode.commands.executeCommand('salaryTracker.openSettings');
      }
    });
    
    context.globalState.update('hasShownWelcome', true);
  }
}

/**
 * 插件停用函数
 */
export function deactivate() {
  console.log('薪资追踪器插件已停用');
}
