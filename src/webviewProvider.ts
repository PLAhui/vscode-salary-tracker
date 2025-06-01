import * as vscode from 'vscode';
import { SalaryTracker } from './salaryTracker';
import { TrackerState, TrackerStatus } from './types';
import { ConfigManager } from './configManager';
import { TimeCalculator } from './timeCalculator';

/**
 * 侧边栏面板提供者
 * 提供详细的薪资追踪界面
 */
export class WebviewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'salaryTracker';

  private _view?: vscode.WebviewView;
  private salaryTracker: SalaryTracker;
  private updateTimer?: NodeJS.Timeout;
  
  constructor(
    private readonly _extensionUri: vscode.Uri,
    salaryTracker: SalaryTracker
  ) {
    this.salaryTracker = salaryTracker;

    // 监听追踪器状态变化
    this.salaryTracker.addEventListener('start', this.onStateChanged.bind(this));
    this.salaryTracker.addEventListener('pause', this.onStateChanged.bind(this));
    this.salaryTracker.addEventListener('stop', this.onStateChanged.bind(this));
    this.salaryTracker.addEventListener('reset', this.onStateChanged.bind(this));
    this.salaryTracker.addEventListener('update', this.onStateChanged.bind(this));

    // 启动webview更新定时器
    this.startUpdateTimer();
  }
  
  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    this._view = webviewView;
    
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };
    
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    
    // 处理来自webview的消息
    webviewView.webview.onDidReceiveMessage(
      message => {
        switch (message.type) {
          case 'ready':
            // webview准备就绪，发送初始数据
            this.updateWebview();
            break;
          case 'start':
            this.salaryTracker.start();
            break;
          case 'pause':
            this.salaryTracker.pause();
            break;
          case 'stop':
            this.salaryTracker.stop();
            break;
          case 'reset':
            this.salaryTracker.reset();
            break;
          case 'openSettings':
            vscode.commands.executeCommand('workbench.action.openSettings', 'salaryTracker');
            break;
          case 'updateConfig':
            this.updateConfig(message.key, message.value);
            break;
          default:
            console.log('未知消息类型:', message.type);
        }
      },
      undefined,
      []
    );
    
    // 初始化数据
    this.updateWebview();
  }
  
  /**
   * 状态变化处理
   */
  private onStateChanged(state: TrackerState): void {
    this.updateWebview();
  }
  
  /**
   * 更新webview内容
   */
  private updateWebview(): void {
    if (this._view) {
      const state = this.salaryTracker.getState();
      const config = ConfigManager.getConfig();
      const stats = this.salaryTracker.getTodayStats();
      
      this._view.webview.postMessage({
        type: 'update',
        data: {
          state,
          config,
          stats,
          isWorkDay: ConfigManager.isWorkDay(config)
        }
      });
    }
  }
  
  /**
   * 更新配置
   */
  private async updateConfig(key: string, value: any): Promise<void> {
    try {
      await ConfigManager.updateConfig(key as any, value);
      vscode.window.showInformationMessage(`配置 ${key} 已更新`);
    } catch (error) {
      vscode.window.showErrorMessage(`更新配置失败: ${error}`);
    }
  }
  
  /**
   * 生成HTML内容
   */
  private _getHtmlForWebview(webview: vscode.Webview): string {
    // 获取样式和脚本的URI
    const styleResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
    const styleVSCodeUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
    const styleMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.css'));
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));
    
    // 使用nonce来确保安全
    const nonce = getNonce();
    
    return `<!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${styleResetUri}" rel="stylesheet">
        <link href="${styleVSCodeUri}" rel="stylesheet">
        <link href="${styleMainUri}" rel="stylesheet">
        <title>薪资追踪器</title>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>💰 薪资追踪器</h2>
          </div>
          
          <div class="status-section">
            <div class="status-card">
              <div class="status-indicator" id="statusIndicator">
                <span id="statusIcon">⏹️</span>
                <span id="statusText">已停止</span>
              </div>
              <div class="earnings-display">
                <div class="earnings-amount" id="earningsAmount">¥0.00</div>
                <div class="earnings-label">今日收入</div>
              </div>
            </div>
          </div>
          
          <div class="stats-section">
            <div class="stat-item">
              <div class="stat-label">工作时间</div>
              <div class="stat-value" id="workedTime">00:00:00</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">完成进度</div>
              <div class="stat-value" id="progress">0%</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">预计完成</div>
              <div class="stat-value" id="estimatedCompletion">--:--</div>
            </div>
          </div>
          
          <div class="controls-section">
            <button class="control-btn primary" id="startBtn">
              <span class="btn-icon">▶️</span>
              开始计时
            </button>
            <button class="control-btn secondary" id="pauseBtn" disabled>
              <span class="btn-icon">⏸️</span>
              暂停
            </button>
            <button class="control-btn secondary" id="stopBtn" disabled>
              <span class="btn-icon">⏹️</span>
              停止
            </button>
            <button class="control-btn danger" id="resetBtn">
              <span class="btn-icon">🔄</span>
              重置
            </button>
          </div>
          
          <div class="config-section">
            <h3>快速设置</h3>
            <div class="config-item">
              <label for="dailySalary">日薪 (元)</label>
              <input type="number" id="dailySalary" min="0" step="10">
            </div>
            <div class="config-item">
              <label for="workHours">工作时长 (小时)</label>
              <input type="number" id="workHours" min="1" max="24" step="0.5">
            </div>
            <div class="config-item">
              <label for="enableIndicators">
                <input type="checkbox" id="enableIndicators">
                启用状态栏动画指示器
              </label>
            </div>
            <div class="config-item">
              <label for="customIndicators">自定义指示器 (用逗号分隔)</label>
              <input type="text" id="customIndicators" placeholder="⚡,💰,📈,✨">
              <small>支持emoji和文字，例如：⚡,💰,📈,✨ 或 $,€,£,¥</small>
            </div>
            <div class="config-item">
              <button class="control-btn secondary full-width" id="openSettingsBtn">
                <span class="btn-icon">⚙️</span>
                打开详细设置
              </button>
            </div>
          </div>
          
          <div class="info-section" id="workDayInfo">
            <div class="info-message">
              <span class="info-icon">ℹ️</span>
              <span id="workDayMessage">今天是工作日</span>
            </div>
          </div>
        </div>
        
        <script nonce="${nonce}" src="${scriptUri}"></script>
      </body>
      </html>`;
  }

  /**
   * 启动webview更新定时器
   */
  private startUpdateTimer(): void {
    this.stopUpdateTimer();

    const config = ConfigManager.getConfig();
    const updateInterval = config.enableHighFrequencyUpdate
      ? config.realTimeUpdateInterval
      : config.updateInterval;

    this.updateTimer = setInterval(() => {
      // 定时更新webview数据
      this.updateWebview();
    }, updateInterval);
  }

  /**
   * 停止webview更新定时器
   */
  private stopUpdateTimer(): void {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = undefined;
    }
  }

  /**
   * 销毁webview提供者
   */
  public dispose(): void {
    this.stopUpdateTimer();
  }
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
