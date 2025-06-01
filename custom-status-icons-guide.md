# 状态栏图标自定义指南

## 功能概述

现在您可以完全自定义状态栏中金额前的状态图标，包括：
- 🔧 **启用/禁用状态图标**：完全去掉前面的图标
- 🎨 **自定义图标样式**：使用VSCode图标或emoji
- ⚡ **实时切换**：无需重启VSCode即可生效

## 配置选项

### 1. 启用/禁用状态图标
```json
{
  "salaryTracker.enableStatusIcons": true  // false则完全去掉图标
}
```

### 2. 自定义状态图标
```json
{
  "salaryTracker.statusIcons": {
    "running": "$(play)",           // 运行状态图标
    "paused": "$(debug-pause)",     // 暂停状态图标  
    "stopped": "$(primitive-square)" // 停止状态图标
  }
}
```

## 使用方法

### 方法一：通过侧边栏面板配置
1. 打开VSCode侧边栏的"薪资追踪"面板
2. 在"快速设置"区域找到状态图标配置选项：
   - ☑️ **启用状态栏前的状态图标**：勾选/取消勾选
   - 📝 **运行状态图标**：输入自定义图标
   - 📝 **暂停状态图标**：输入自定义图标  
   - 📝 **停止状态图标**：输入自定义图标
3. 修改后自动保存并生效

### 方法二：通过VSCode设置
1. 按 `Ctrl+,` (Windows/Linux) 或 `Cmd+,` (Mac) 打开设置
2. 搜索 "salaryTracker"
3. 找到相关配置项进行修改

## 图标类型支持

### VSCode内置图标
使用 `$(图标名)` 格式，例如：
- `$(play)` - 播放图标 ▶️
- `$(debug-pause)` - 暂停图标 ⏸️
- `$(primitive-square)` - 方形图标 ⏹️
- `$(triangle-right)` - 三角形 ▶
- `$(circle-filled)` - 实心圆 ●
- `$(record)` - 录制图标 ⏺️
- `$(clock)` - 时钟图标 🕐
- `$(dollar)` - 美元符号 💲

### Emoji图标
直接输入emoji，例如：
- `▶️` - 播放
- `⏸️` - 暂停
- `⏹️` - 停止
- `💰` - 金钱袋
- `💵` - 钞票
- `⚡` - 闪电
- `🔥` - 火焰
- `⭐` - 星星

### 文字图标
使用简单文字，例如：
- `RUN` - 运行
- `PAUSE` - 暂停
- `STOP` - 停止
- `$` - 美元符号
- `¥` - 人民币符号

## 配置示例

### 示例1：完全去掉图标
```json
{
  "salaryTracker.enableStatusIcons": false
}
```
**效果**：状态栏显示为 `¥123.45 ⚡`

### 示例2：使用emoji图标
```json
{
  "salaryTracker.enableStatusIcons": true,
  "salaryTracker.statusIcons": {
    "running": "💰",
    "paused": "⏸️", 
    "stopped": "💤"
  }
}
```
**效果**：
- 运行时：`💰 ¥123.45 ⚡`
- 暂停时：`⏸️ ¥123.45`
- 停止时：`💤 ¥0.00`

### 示例3：使用文字图标
```json
{
  "salaryTracker.statusIcons": {
    "running": "$",
    "paused": "||",
    "stopped": "■"
  }
}
```

### 示例4：混合使用
```json
{
  "salaryTracker.statusIcons": {
    "running": "$(play)",
    "paused": "⏸️",
    "stopped": "STOP"
  }
}
```

## 快速配置预设

### 极简风格（无图标）
```json
{
  "salaryTracker.enableStatusIcons": false,
  "salaryTracker.enableIndicators": true,
  "salaryTracker.customIndicators": ["💰"]
}
```

### 商务风格
```json
{
  "salaryTracker.statusIcons": {
    "running": "$(dollar)",
    "paused": "$(debug-pause)",
    "stopped": "$(primitive-square)"
  }
}
```

### 可爱风格
```json
{
  "salaryTracker.statusIcons": {
    "running": "🤑",
    "paused": "😴",
    "stopped": "😊"
  }
}
```

## 常见问题

### Q: 修改后没有立即生效？
A: 配置会自动生效，如果没有变化，请检查：
1. 配置格式是否正确
2. 是否启用了 `enableStatusIcons`
3. 尝试重新加载VSCode窗口

### Q: VSCode图标不显示？
A: 确保图标名称正确，格式为 `$(图标名)`。可以参考VSCode官方图标列表。

### Q: 如何找到更多VSCode图标？
A: 
1. 访问 VSCode图标库：https://microsoft.github.io/vscode-codicons/dist/codicon.html
2. 使用格式：`$(图标名)`

### Q: 可以使用自定义图片吗？
A: 目前只支持文字、emoji和VSCode内置图标，不支持自定义图片。

## 技术说明

- 配置实时生效，无需重启VSCode
- 支持配置验证，无效配置会使用默认值
- 兼容所有VSCode主题
- 不影响其他扩展的状态栏显示

## 更新日志

- v1.1.0: 新增状态图标自定义功能
- 支持完全禁用状态图标
- 支持VSCode图标、emoji和文字
- 添加侧边栏快速配置界面
