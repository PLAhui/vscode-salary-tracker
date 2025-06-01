# 薪资追踪器自定义配置示例

## 🎨 状态栏自定义示例

### 1. 极简风格（无图标）
```json
{
  "salaryTracker.enableStatusIcons": false,
  "salaryTracker.enableIndicators": true,
  "salaryTracker.customIndicators": ["💰"]
}
```
**效果**: `¥125.523 💰`

### 2. 商务风格
```json
{
  "salaryTracker.statusIcons": {
    "running": "$(dollar)",
    "paused": "$(debug-pause)",
    "stopped": "$(primitive-square)"
  },
  "salaryTracker.customIndicators": ["$", "€", "£", "¥"]
}
```
**效果**: `$(dollar) ¥125.523 $`

### 3. 可爱风格
```json
{
  "salaryTracker.statusIcons": {
    "running": "🤑",
    "paused": "😴",
    "stopped": "😊"
  },
  "salaryTracker.customIndicators": ["💰", "💵", "💎", "🎉"]
}
```
**效果**: `🤑 ¥125.523 💰`

### 4. 游戏风格
```json
{
  "salaryTracker.statusIcons": {
    "running": "⚔️",
    "paused": "🛡️",
    "stopped": "🏠"
  },
  "salaryTracker.customIndicators": ["⭐", "💫", "✨", "🌟"]
}
```
**效果**: `⚔️ ¥125.523 ⭐`

### 5. 文字风格
```json
{
  "salaryTracker.statusIcons": {
    "running": "RUN",
    "paused": "PAUSE",
    "stopped": "STOP"
  },
  "salaryTracker.customIndicators": ["UP", "$$", "++", ">>"]
}
```
**效果**: `RUN ¥125.523 UP`

## ⚙️ 完整配置示例

### 高效工作者配置
```json
{
  "salaryTracker.dailySalary": 800,
  "salaryTracker.workHoursPerDay": 8,
  "salaryTracker.currency": "¥",
  "salaryTracker.autoStart": true,
  "salaryTracker.enableHighFrequencyUpdate": true,
  "salaryTracker.realTimeUpdateInterval": 250,
  "salaryTracker.enableStatusIcons": true,
  "salaryTracker.statusIcons": {
    "running": "$(play)",
    "paused": "$(debug-pause)",
    "stopped": "$(primitive-square)"
  },
  "salaryTracker.enableIndicators": true,
  "salaryTracker.customIndicators": ["⚡", "💰", "📈", "✨"],
  "salaryTracker.workDays": [1, 2, 3, 4, 5]
}
```

### 自由职业者配置
```json
{
  "salaryTracker.dailySalary": 600,
  "salaryTracker.workHoursPerDay": 6,
  "salaryTracker.currency": "$",
  "salaryTracker.autoStart": false,
  "salaryTracker.enableHighFrequencyUpdate": true,
  "salaryTracker.enableStatusIcons": true,
  "salaryTracker.statusIcons": {
    "running": "💻",
    "paused": "☕",
    "stopped": "🏖️"
  },
  "salaryTracker.enableIndicators": true,
  "salaryTracker.customIndicators": ["💵", "💰", "🎯", "🚀"],
  "salaryTracker.workDays": [1, 2, 3, 4, 5, 6]
}
```

### 极简主义者配置
```json
{
  "salaryTracker.enableStatusIcons": false,
  "salaryTracker.enableIndicators": false,
  "salaryTracker.currency": "",
  "salaryTracker.enableHighFrequencyUpdate": false,
  "salaryTracker.updateInterval": 1000
}
```
**效果**: `125.523`

## 🎯 特殊用途配置

### 1. 多货币显示
```json
{
  "salaryTracker.currency": "💰",
  "salaryTracker.customIndicators": ["$", "€", "£", "¥"]
}
```

### 2. 进度导向
```json
{
  "salaryTracker.customIndicators": ["📊", "📈", "📉", "🎯"]
}
```

### 3. 时间导向
```json
{
  "salaryTracker.statusIcons": {
    "running": "⏰",
    "paused": "⏸️",
    "stopped": "⏹️"
  },
  "salaryTracker.customIndicators": ["⏱️", "⏲️", "⏰", "🕐"]
}
```

## 🔧 VSCode图标参考

常用的VSCode图标：
- `$(play)` - 播放 ▶️
- `$(debug-pause)` - 暂停 ⏸️
- `$(primitive-square)` - 停止 ⏹️
- `$(clock)` - 时钟 🕐
- `$(dollar)` - 美元 💲
- `$(triangle-right)` - 三角形 ▶
- `$(circle-filled)` - 实心圆 ●
- `$(record)` - 录制 ⏺️

更多图标请参考：https://microsoft.github.io/vscode-codicons/dist/codicon.html

## 💡 自定义建议

1. **保持一致性**：选择风格一致的图标和指示器
2. **考虑可读性**：确保在不同主题下都能清晰显示
3. **避免过长**：状态栏空间有限，避免使用过长的文字
4. **测试效果**：修改后观察实际显示效果
5. **备份配置**：保存好用的配置以便恢复

## 🚀 快速应用

1. 复制上述任一配置示例
2. 打开VSCode设置 (`Ctrl+,`)
3. 搜索 "salaryTracker"
4. 粘贴配置或逐项修改
5. 保存后立即生效

享受您的个性化薪资追踪体验！ 💻✨
