# 开发者文档

## 🏗️ 项目架构

### 核心模块

```
src/
├── extension.ts          # 主入口，插件激活和命令注册
├── salaryTracker.ts      # 核心追踪逻辑，状态管理
├── configManager.ts      # 配置管理，设置读写
├── statusBarProvider.ts  # 状态栏显示组件
├── webviewProvider.ts    # 侧边栏面板组件
├── timeCalculator.ts     # 时间计算工具类
└── types.ts              # TypeScript类型定义
```

### 设计模式

- **观察者模式**：事件监听和状态更新
- **单例模式**：配置管理器
- **工厂模式**：组件创建
- **策略模式**：时间计算策略

## 🔧 开发环境

### 必需工具
- Node.js 16+
- VSCode 1.74+
- TypeScript 4.9+

### 开发命令
```bash
# 安装依赖
npm install

# 编译TypeScript
npm run compile

# 监听模式编译
npm run watch

# 代码检查
npm run lint

# 运行测试
npm test

# 打包插件
npm run package
```

## 📝 代码规范

### TypeScript规范
- 使用严格模式
- 所有公共方法必须有JSDoc注释
- 使用接口定义数据结构
- 避免使用any类型

### 命名规范
- 类名：PascalCase
- 方法名：camelCase
- 常量：UPPER_SNAKE_CASE
- 文件名：camelCase

### 注释规范
```typescript
/**
 * 方法描述
 * @param param1 参数1描述
 * @param param2 参数2描述
 * @returns 返回值描述
 */
public methodName(param1: string, param2: number): boolean {
  // 实现逻辑
}
```

## 🧪 测试策略

### 单元测试
- 测试核心业务逻辑
- 测试配置管理功能
- 测试时间计算准确性

### 集成测试
- 测试组件间交互
- 测试VSCode API集成
- 测试用户界面响应

### 手动测试
- 功能完整性测试
- 用户体验测试
- 性能测试

## 🔄 扩展开发

### 添加新功能

1. **定义接口**：在types.ts中添加类型定义
2. **实现逻辑**：创建新的模块文件
3. **集成组件**：在extension.ts中注册
4. **更新UI**：修改webview和状态栏
5. **添加配置**：在package.json中添加设置项

### 添加新命令

1. **package.json**：在contributes.commands中添加
2. **extension.ts**：注册命令处理函数
3. **实现逻辑**：在相应模块中实现
4. **测试验证**：确保命令正常工作

### 添加新配置

1. **package.json**：在contributes.configuration中添加
2. **configManager.ts**：更新配置接口和方法
3. **使用配置**：在相关模块中读取配置
4. **UI更新**：在webview中添加配置界面

## 🎨 UI开发

### Webview开发
- HTML结构在webviewProvider.ts中定义
- CSS样式在media/main.css中
- JavaScript逻辑在media/main.js中
- 遵循VSCode主题规范

### 状态栏开发
- 使用VSCode StatusBarItem API
- 支持点击交互
- 显示实时更新信息
- 提供详细的tooltip

## 📊 性能优化

### 内存管理
- 及时清理事件监听器
- 避免内存泄漏
- 合理使用缓存

### 计算优化
- 避免频繁的DOM操作
- 使用防抖和节流
- 优化时间计算算法

### 用户体验
- 快速响应用户操作
- 平滑的动画效果
- 合理的错误提示

## 🔒 安全考虑

### 数据安全
- 敏感数据加密存储
- 避免数据泄露
- 合理的权限控制

### 代码安全
- 输入验证
- 错误处理
- 安全的API调用

## 📦 发布流程

### 版本管理
1. 更新版本号
2. 更新CHANGELOG
3. 创建Git标签
4. 构建发布包

### 质量检查
1. 代码审查
2. 功能测试
3. 性能测试
4. 兼容性测试

### 发布步骤
1. 运行完整测试套件
2. 构建生产版本
3. 创建VSIX包
4. 发布到市场

## 🐛 调试技巧

### VSCode调试
- 使用F5启动调试模式
- 设置断点调试
- 查看控制台输出
- 使用开发者工具

### 日志记录
```typescript
// 开发环境日志
console.log('Debug info:', data);

// 生产环境日志
vscode.window.showInformationMessage('操作完成');
```

### 常见问题
- 检查TypeScript编译错误
- 验证package.json配置
- 确认API使用正确
- 测试不同VSCode版本

## 🤝 贡献指南

### 提交代码
1. Fork项目
2. 创建功能分支
3. 编写代码和测试
4. 提交Pull Request

### 代码审查
- 检查代码质量
- 验证功能正确性
- 确保测试覆盖
- 审查文档更新

### 问题报告
- 使用Issue模板
- 提供详细信息
- 包含复现步骤
- 附加相关截图

---

**Happy Coding!** 🚀
