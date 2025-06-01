# 薪资追踪器 VSCode 插件

<div align="center">
  <img src="https://raw.githubusercontent.com/PLAhui/vscode-salary-tracker/refs/heads/main/images/icon.png" alt="薪资追踪器Logo" width="128" height="128">
</div>

一个专为开发者设计的VSCode插件，用于实时追踪和显示当天的薪资收入。

开源地址：https://github.com/PLAhui/vscode-salary-tracker

## ✨ 功能特性

- 🕐 **实时计时追踪** - 自动追踪您的工作时间
- 💰 **实时收入显示** - 在状态栏实时显示当天收入
- 📊 **详细统计面板** - 侧边栏显示详细的工作统计
- ⚙️ **灵活配置** - 支持自定义日薪、工作时间等参数
- 📅 **工作日设置** - 可配置哪些天为工作日
- ⏸️ **暂停/恢复** - 支持暂停和恢复计时
- 🎯 **进度追踪** - 显示当天工作进度和预计完成时间
- 💾 **数据持久化** - 自动保存工作记录
- 🎨 **自定义指示器** - 可自定义状态栏金额后的动画指示器
- 🔧 **自定义状态图标** - 可自定义或完全去掉状态栏前的状态图标
- ⚡ **高频更新** - 支持高频率实时更新，让收入数据跳动更明显
- 🏢 **双薪资模式** - 支持固定工作时间模式（月薪制）和按时计薪模式（小时制）

## 🚀 快速开始

### 安装

1. 在VSCode中打开扩展市场
2. 搜索"薪资追踪器"
3. 点击安装

### 基本使用

1. **首次配置**：
   - 安装后会自动弹出配置向导
   - 设置您的日薪和每日工作时长
   - 选择工作日

2. **开始追踪**：
   - 点击状态栏的薪资显示
   - 或使用命令面板：`Ctrl+Shift+P` → "开始计时"
   - 或在侧边栏薪资追踪面板中点击"开始计时"

3. **查看收入**：
   - 状态栏实时显示当天收入
   - 侧边栏面板显示详细统计信息

## 📋 功能详解

### 状态栏显示

- 💰 实时收入金额（支持高精度显示）
- ⏱️ 当前状态图标（可自定义或禁用）
- 📈 动画指示器（可自定义符号）
- 🎯 实时跳动更新（250ms高频刷新）

### 侧边栏面板

- 📊 今日收入统计（实时更新）
- ⏰ 工作时长显示（精确到秒）
- 📈 完成进度百分比
- 🎯 预计完成时间
- 🎛️ 快速控制按钮
- ⚙️ 快速配置选项
- 🎨 自定义指示器设置
- 🔧 状态图标自定义选项

### 可用命令

- `薪资追踪: 开始计时` - 开始或恢复计时
- `薪资追踪: 暂停计时` - 暂停当前计时
- `薪资追踪: 停止计时` - 停止计时
- `薪资追踪: 重置今日计时` - 重置今天的所有数据
- `薪资追踪: 打开设置` - 打开详细设置页面
- `薪资追踪: 显示薪资面板` - 显示侧边栏面板

## ⚙️ 配置选项

### 薪资模式设置

| 配置项 | 描述 | 默认值 |
|--------|------|--------|
| `salaryTracker.salaryMode` | 薪资计算模式 | "hourly" |

**薪资模式选项：**
- `"fixed_schedule"` - 固定工作时间模式（月薪制）
- `"hourly"` - 按时计薪模式（小时制）

### 固定工作时间模式配置

| 配置项 | 描述 | 默认值 |
|--------|------|--------|
| `salaryTracker.fixedSchedule.monthlySalary` | 月薪金额（元） | 15000 |
| `salaryTracker.fixedSchedule.workStartHour` | 工作开始时间（24小时制） | 9 |
| `salaryTracker.fixedSchedule.workEndHour` | 工作结束时间（24小时制） | 20 |
| `salaryTracker.fixedSchedule.workDays` | 工作日设置 | [1,2,3,4,5] |

### 按时计薪模式配置

| 配置项 | 描述 | 默认值 |
|--------|------|--------|
| `salaryTracker.hourly.hourlySalary` | 小时薪资（元/小时） | 62.5 |
| `salaryTracker.hourly.autoStartOnLaunch` | VSCode启动时自动开始计时 | true |

### 基本设置（兼容旧版本）

| 配置项 | 描述 | 默认值 |
|--------|------|--------|
| `salaryTracker.dailySalary` | 日薪金额（元） | 500 |
| `salaryTracker.workHoursPerDay` | 每日工作小时数 | 8 |
| `salaryTracker.currency` | 货币符号 | ¥ |

### 显示设置

| 配置项 | 描述 | 默认值 |
|--------|------|--------|
| `salaryTracker.showInStatusBar` | 在状态栏显示实时收入 | true |
| `salaryTracker.updateInterval` | 更新间隔（毫秒） | 500 |
| `salaryTracker.realTimeUpdateInterval` | 实时更新间隔（毫秒） | 250 |
| `salaryTracker.enableHighFrequencyUpdate` | 启用高频率更新 | true |

### 自动化设置

| 配置项 | 描述 | 默认值 |
|--------|------|--------|
| `salaryTracker.autoStart` | VSCode启动时自动开始计时 | false |
| `salaryTracker.workDays` | 工作日设置（0=周日，1=周一...6=周六） | [1,2,3,4,5] |

### 自定义设置

| 配置项 | 描述 | 默认值 |
|--------|------|--------|
| `salaryTracker.enableIndicators` | 启用状态栏动画指示器 | true |
| `salaryTracker.customIndicators` | 自定义动画指示器 | ["⚡","💰","📈","✨"] |
| `salaryTracker.enableStatusIcons` | 启用状态栏前的状态图标 | true |
| `salaryTracker.statusIcons.running` | 运行状态图标 | "$(play)" |
| `salaryTracker.statusIcons.paused` | 暂停状态图标 | "$(debug-pause)" |
| `salaryTracker.statusIcons.stopped` | 停止状态图标 | "$(primitive-square)" |

## 🎨 界面预览

### 状态栏显示
```
▶️ ¥125.523 ⚡  [点击查看详情]
```

**自定义示例：**
```
💰 ¥125.523 📈  [使用emoji图标]
¥125.523 ✨     [禁用状态图标]
$ $125.523 💵   [自定义货币和指示器]
```

### 侧边栏面板
```
💰 薪资追踪器

⏱️ 计时中
¥125.523
今日收入

工作时间: 02:30:15
完成进度: 31.3%
预计完成: 18:30

[▶️ 开始计时] [⏸️ 暂停] [⏹️ 停止] [🔄 重置]

快速设置:
日薪: [500] 元
工作时长: [8] 小时
☑️ 启用状态栏动画指示器
自定义指示器: [⚡,💰,📈,✨]
☑️ 启用状态栏前的状态图标
运行状态图标: [$(play)]
暂停状态图标: [$(debug-pause)]
停止状态图标: [$(primitive-square)]
[⚙️ 打开详细设置]
```

## 🔧 开发和扩展

### 项目结构

```
vscode-salary-tracker/
├── src/
│   ├── extension.ts          # 主扩展文件
│   ├── salaryTracker.ts      # 核心追踪逻辑
│   ├── statusBarProvider.ts  # 状态栏提供者
│   ├── webviewProvider.ts    # 侧边栏面板提供者
│   ├── configManager.ts      # 配置管理器
│   ├── timeCalculator.ts     # 时间计算工具
│   └── types.ts              # 类型定义
├── media/                    # 前端资源
│   ├── main.css
│   ├── main.js
│   ├── reset.css
│   └── vscode.css
├── package.json              # 插件配置
└── README.md
```

### 扩展开发

插件采用模块化设计，便于扩展：

1. **添加新功能**：在相应的模块中添加方法
2. **修改UI**：编辑`media/`目录下的文件
3. **添加配置**：在`package.json`的`contributes.configuration`中添加
4. **添加命令**：在`package.json`的`contributes.commands`中添加


## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 💡 使用技巧

### 通用技巧
1. **快速配置**：使用命令面板的"快速配置"功能快速设置基本参数
2. **暂停功能**：临时离开时使用暂停功能，确保计时准确
3. **自定义指示器**：在侧边栏面板中自定义动画指示器，支持emoji和文字
4. **状态图标设置**：可以完全禁用状态图标获得极简显示，或使用emoji替换
5. **高频更新**：启用高频更新功能，让收入数据跳动更明显
6. **精度显示**：使用3位小数显示更精确的收入变化

### 固定工作时间模式技巧
7. **工作时间设置**：根据实际工作时间设置开始和结束时间，系统会自动限制计时
8. **工作日配置**：设置准确的工作日，非工作日无法开始计时
9. **月薪设置**：输入准确的月薪，系统会自动计算时薪
10. **进度追踪**：关注每日工作进度，合理安排工作时间

### 按时计薪模式技巧
11. **自动启动**：开启自动启动功能，VSCode打开时自动开始计时
12. **灵活计时**：任何时间都可以开始工作，适合自由工作时间
13. **时薪设置**：根据项目或客户设置不同的时薪标准
14. **累计统计**：关注累计工作时长，便于项目时间管理

### 模式选择建议
- **选择固定工作时间模式**：如果您有固定的上下班时间，按月薪计算
- **选择按时计薪模式**：如果您是自由职业者或按项目计费

## 🔗 相关链接

- [VSCode扩展开发文档](https://code.visualstudio.com/api)
- [TypeScript文档](https://www.typescriptlang.org/docs/)

---

**享受编码，追踪收入！** 💻💰
