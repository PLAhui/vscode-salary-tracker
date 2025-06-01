// 薪资追踪器前端脚本

(function() {
  const vscode = acquireVsCodeApi();

  // DOM元素引用
  let elements = {};

  // 当前状态
  let currentState = null;
  let currentConfig = null;
  let frontendUpdateTimer = null;

  // 初始化DOM元素引用
  function initializeElements() {
    elements = {
      statusIndicator: document.getElementById('statusIndicator'),
      statusIcon: document.getElementById('statusIcon'),
      statusText: document.getElementById('statusText'),
      earningsAmount: document.getElementById('earningsAmount'),
      workedTime: document.getElementById('workedTime'),
      progress: document.getElementById('progress'),
      estimatedCompletion: document.getElementById('estimatedCompletion'),
      startBtn: document.getElementById('startBtn'),
      pauseBtn: document.getElementById('pauseBtn'),
      stopBtn: document.getElementById('stopBtn'),
      resetBtn: document.getElementById('resetBtn'),
      openSettingsBtn: document.getElementById('openSettingsBtn'),
      dailySalary: document.getElementById('dailySalary'),
      workHours: document.getElementById('workHours'),
      enableIndicators: document.getElementById('enableIndicators'),
      customIndicators: document.getElementById('customIndicators'),
      workDayInfo: document.getElementById('workDayInfo'),
      workDayMessage: document.getElementById('workDayMessage')
    };

    // 检查元素是否正确获取
    const missingElements = [];
    for (const [key, element] of Object.entries(elements)) {
      if (!element) {
        missingElements.push(key);
      }
    }

    if (missingElements.length > 0) {
      console.error('缺失的DOM元素:', missingElements);
    }
  }
  
  // 初始化事件监听器
  function initializeEventListeners() {
    console.log('初始化事件监听器...');

    // 控制按钮事件
    if (elements.startBtn) {
      elements.startBtn.addEventListener('click', () => {
        console.log('开始按钮被点击');
        vscode.postMessage({ type: 'start' });
      });
    }

    if (elements.pauseBtn) {
      elements.pauseBtn.addEventListener('click', () => {
        console.log('暂停按钮被点击');
        vscode.postMessage({ type: 'pause' });
      });
    }

    if (elements.stopBtn) {
      elements.stopBtn.addEventListener('click', () => {
        console.log('停止按钮被点击');
        vscode.postMessage({ type: 'stop' });
      });
    }

    if (elements.resetBtn) {
      elements.resetBtn.addEventListener('click', () => {
        console.log('重置按钮被点击');
        if (confirm('确定要重置今日的薪资追踪数据吗？')) {
          vscode.postMessage({ type: 'reset' });
        }
      });
    }

    if (elements.openSettingsBtn) {
      elements.openSettingsBtn.addEventListener('click', () => {
        console.log('设置按钮被点击');
        vscode.postMessage({ type: 'openSettings' });
      });
    }

    // 配置输入事件
    if (elements.dailySalary) {
      elements.dailySalary.addEventListener('change', (e) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value) && value >= 0) {
          console.log('更新日薪配置:', value);
          vscode.postMessage({
            type: 'updateConfig',
            key: 'dailySalary',
            value: value
          });
        }
      });
    }

    if (elements.workHours) {
      elements.workHours.addEventListener('change', (e) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value) && value >= 1 && value <= 24) {
          console.log('更新工作时长配置:', value);
          vscode.postMessage({
            type: 'updateConfig',
            key: 'workHoursPerDay',
            value: value
          });
        }
      });
    }

    // 启用指示器复选框事件
    if (elements.enableIndicators) {
      elements.enableIndicators.addEventListener('change', (e) => {
        const value = e.target.checked;
        console.log('更新指示器启用状态:', value);
        vscode.postMessage({
          type: 'updateConfig',
          key: 'enableIndicators',
          value: value
        });
      });
    }

    // 自定义指示器输入事件
    if (elements.customIndicators) {
      elements.customIndicators.addEventListener('change', (e) => {
        const value = e.target.value.trim();
        if (value) {
          // 将逗号分隔的字符串转换为数组，并去除空白
          const indicators = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
          if (indicators.length > 0) {
            console.log('更新自定义指示器:', indicators);
            vscode.postMessage({
              type: 'updateConfig',
              key: 'customIndicators',
              value: indicators
            });
          }
        }
      });
    }

    console.log('事件监听器初始化完成');
  }
  
  // 更新UI状态
  function updateUI(data) {
    currentState = data.state;
    currentConfig = data.config;

    updateStatusDisplay();
    updateStatsDisplay();
    updateControlButtons();
    updateConfigInputs();
    updateWorkDayInfo(data.isWorkDay);

    // 始终启动前端实时更新定时器以确保数据同步
    startFrontendTimer();
  }

  // 启动前端实时更新定时器
  function startFrontendTimer() {
    // 停止现有定时器
    stopFrontendTimer();

    if (!currentConfig) return;

    const updateInterval = currentConfig.enableHighFrequencyUpdate
      ? currentConfig.realTimeUpdateInterval
      : 500;

    frontendUpdateTimer = setInterval(() => {
      if (currentState && currentState.status === 'running' && currentState.todayStartTime) {
        // 实时计算当前收入
        const now = new Date();
        const totalElapsed = now.getTime() - new Date(currentState.todayStartTime).getTime();
        const currentWorkedTime = Math.max(0, totalElapsed - currentState.totalPausedTime);

        // 计算实时收入
        const hourlySalary = currentConfig.dailySalary / currentConfig.workHoursPerDay;
        const currentEarnings = (currentWorkedTime / (1000 * 60 * 60)) * hourlySalary;

        // 格式化金额（保留3位小数以显示更精确的变化）
        const formattedEarnings = currentEarnings.toFixed(3);

        // 更新显示
        const newEarnings = `${currentConfig.currency}${formattedEarnings}`;
        if (elements.earningsAmount.textContent !== newEarnings) {
          elements.earningsAmount.classList.add('updating');
          elements.earningsAmount.textContent = newEarnings;
          setTimeout(() => {
            elements.earningsAmount.classList.remove('updating');
          }, 300);
        }

        // 更新工作时间
        const newWorkedTime = formatDuration(currentWorkedTime);
        if (elements.workedTime.textContent !== newWorkedTime) {
          elements.workedTime.classList.add('updating');
          elements.workedTime.textContent = newWorkedTime;
          setTimeout(() => {
            elements.workedTime.classList.remove('updating');
          }, 300);
        }

        // 更新进度
        const workedHours = currentWorkedTime / (1000 * 60 * 60);
        const progressPercent = Math.min(100, (workedHours / currentConfig.workHoursPerDay) * 100);
        const newProgress = `${progressPercent.toFixed(1)}%`;
        if (elements.progress.textContent !== newProgress) {
          elements.progress.classList.add('updating');
          elements.progress.textContent = newProgress;
          setTimeout(() => {
            elements.progress.classList.remove('updating');
          }, 300);
        }

        // 更新预计完成时间
        if (progressPercent < 100) {
          const remainingHours = currentConfig.workHoursPerDay - workedHours;
          const remainingMs = remainingHours * 60 * 60 * 1000;
          const completionTime = new Date(Date.now() + remainingMs);
          const newCompletion = completionTime.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
          });
          if (elements.estimatedCompletion.textContent !== newCompletion) {
            elements.estimatedCompletion.textContent = newCompletion;
          }
        } else if (progressPercent >= 100) {
          if (elements.estimatedCompletion.textContent !== '已完成 🎉') {
            elements.estimatedCompletion.textContent = '已完成 🎉';
          }
        }
      }
    }, updateInterval);
  }

  // 停止前端实时更新定时器
  function stopFrontendTimer() {
    if (frontendUpdateTimer) {
      clearInterval(frontendUpdateTimer);
      frontendUpdateTimer = null;
    }
  }
  
  // 更新状态显示
  function updateStatusDisplay() {
    const { status } = currentState;
    const { currency } = currentConfig;

    // 更新状态指示器
    elements.statusIndicator.className = `status-indicator ${status}`;

    // 更新状态图标和文本
    switch (status) {
      case 'running':
        elements.statusIcon.textContent = '⏱️';
        elements.statusText.textContent = '计时中';
        break;
      case 'paused':
        elements.statusIcon.textContent = '⏸️';
        elements.statusText.textContent = '已暂停';
        break;
      case 'stopped':
        elements.statusIcon.textContent = '⏹️';
        elements.statusText.textContent = '已停止';
        break;
    }

    // 更新收入显示（添加动画效果）
    const newEarnings = `${currency}${currentState.todayEarnings.toFixed(2)}`;
    if (elements.earningsAmount.textContent !== newEarnings) {
      // 添加更新动画类
      elements.earningsAmount.classList.add('updating');
      elements.earningsAmount.textContent = newEarnings;

      // 移除动画类
      setTimeout(() => {
        elements.earningsAmount.classList.remove('updating');
      }, 300);
    }
  }
  
  // 更新统计显示
  function updateStatsDisplay() {
    // 工作时间（添加动画效果）
    const workedTimeMs = currentState.todayWorkedTime;
    const newWorkedTime = formatDuration(workedTimeMs);
    if (elements.workedTime.textContent !== newWorkedTime) {
      elements.workedTime.classList.add('updating');
      elements.workedTime.textContent = newWorkedTime;
      setTimeout(() => {
        elements.workedTime.classList.remove('updating');
      }, 300);
    }

    // 进度（添加动画效果）
    const workedHours = workedTimeMs / (1000 * 60 * 60);
    const targetHours = currentConfig.workHoursPerDay;
    const progressPercent = Math.min(100, (workedHours / targetHours) * 100);
    const newProgress = `${progressPercent.toFixed(1)}%`;
    if (elements.progress.textContent !== newProgress) {
      elements.progress.classList.add('updating');
      elements.progress.textContent = newProgress;
      setTimeout(() => {
        elements.progress.classList.remove('updating');
      }, 300);
    }
    
    // 预计完成时间
    if (currentState.status === 'running' && progressPercent < 100) {
      const remainingHours = targetHours - workedHours;
      const remainingMs = remainingHours * 60 * 60 * 1000;
      const completionTime = new Date(Date.now() + remainingMs);
      elements.estimatedCompletion.textContent = completionTime.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (progressPercent >= 100) {
      elements.estimatedCompletion.textContent = '已完成 🎉';
    } else {
      elements.estimatedCompletion.textContent = '--:--';
    }
  }
  
  // 更新控制按钮状态
  function updateControlButtons() {
    const { status } = currentState;
    
    switch (status) {
      case 'stopped':
        elements.startBtn.disabled = false;
        elements.startBtn.innerHTML = '<span class="btn-icon">▶️</span> 开始计时';
        elements.pauseBtn.disabled = true;
        elements.stopBtn.disabled = true;
        break;
      case 'running':
        elements.startBtn.disabled = true;
        elements.pauseBtn.disabled = false;
        elements.stopBtn.disabled = false;
        break;
      case 'paused':
        elements.startBtn.disabled = false;
        elements.startBtn.innerHTML = '<span class="btn-icon">▶️</span> 继续计时';
        elements.pauseBtn.disabled = true;
        elements.stopBtn.disabled = false;
        break;
    }
  }
  
  // 更新配置输入
  function updateConfigInputs() {
    elements.dailySalary.value = currentConfig.dailySalary;
    elements.workHours.value = currentConfig.workHoursPerDay;
  }
  
  // 更新工作日信息
  function updateWorkDayInfo(isWorkDay) {
    if (isWorkDay) {
      elements.workDayMessage.textContent = '今天是工作日';
      elements.workDayInfo.style.display = 'none';
    } else {
      elements.workDayMessage.textContent = '今天不是工作日';
      elements.workDayInfo.style.display = 'block';
    }
  }
  
  // 格式化时长
  function formatDuration(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  // 监听来自扩展的消息
  window.addEventListener('message', event => {
    const message = event.data;
    
    switch (message.type) {
      case 'update':
        updateUI(message.data);
        break;
    }
  });
  
  // 初始化函数
  function initialize() {
    initializeElements();
    initializeEventListeners();

    // 请求初始数据
    vscode.postMessage({ type: 'ready' });
  }

  // 确保DOM加载完成后再初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();
