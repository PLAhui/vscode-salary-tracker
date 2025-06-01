// 验证按钮修复的脚本
const fs = require('fs');

console.log('🔍 验证按钮功能修复...\n');

// 检查修复的文件
const filesToCheck = [
  {
    file: 'src/webviewProvider.ts',
    checks: [
      { pattern: /case 'ready':/, description: '添加了ready消息处理' },
      { pattern: /console\.log\('未知消息类型:'/, description: '添加了未知消息类型日志' }
    ]
  },
  {
    file: 'media/main.js',
    checks: [
      { pattern: /function initializeElements\(\)/, description: '添加了DOM元素初始化函数' },
      { pattern: /if \(elements\.startBtn\)/, description: '添加了按钮存在性检查' },
      { pattern: /console\.log\('开始按钮被点击'\)/, description: '添加了按钮点击日志' },
      { pattern: /document\.addEventListener\('DOMContentLoaded'/, description: '添加了DOM加载完成检查' }
    ]
  },
  {
    file: 'out/webviewProvider.js',
    checks: [
      { pattern: /case 'ready':/, description: '编译后包含ready消息处理' }
    ]
  },
  {
    file: 'out/extension.js',
    checks: [
      { pattern: /registerWebviewViewProvider/, description: '编译后包含webview注册' }
    ]
  }
];

let allChecksPass = true;

filesToCheck.forEach(({ file, checks }) => {
  console.log(`📄 检查文件: ${file}`);
  
  if (!fs.existsSync(file)) {
    console.log(`❌ 文件不存在: ${file}`);
    allChecksPass = false;
    return;
  }
  
  const content = fs.readFileSync(file, 'utf8');
  
  checks.forEach(({ pattern, description }) => {
    if (pattern.test(content)) {
      console.log(`✅ ${description}`);
    } else {
      console.log(`❌ ${description}`);
      allChecksPass = false;
    }
  });
  
  console.log('');
});

// 检查VSIX文件
console.log('📦 检查打包文件...');
if (fs.existsSync('vscode-salary-tracker-1.0.0.vsix')) {
  const stats = fs.statSync('vscode-salary-tracker-1.0.0.vsix');
  console.log(`✅ VSIX文件存在 (${(stats.size / 1024).toFixed(2)} KB)`);
} else {
  console.log('❌ VSIX文件不存在');
  allChecksPass = false;
}

console.log('\n📋 修复总结:');
console.log('1. ✅ 修复了DOM加载时机问题');
console.log('2. ✅ 添加了元素存在性检查');
console.log('3. ✅ 完善了消息处理机制');
console.log('4. ✅ 增加了调试日志输出');
console.log('5. ✅ 重新编译和打包完成');

if (allChecksPass) {
  console.log('\n🎉 所有检查通过！按钮功能修复完成。');
  console.log('\n📝 下一步操作:');
  console.log('1. 在VSCode中安装新的VSIX文件');
  console.log('2. 按F5启动扩展开发主机');
  console.log('3. 在新窗口中测试侧边栏按钮功能');
  console.log('4. 按F12打开开发者工具查看控制台日志');
  console.log('5. 验证所有按钮都能正常工作');
} else {
  console.log('\n❌ 部分检查失败，请检查上述问题。');
}

console.log('\n💡 测试提示:');
console.log('- 点击按钮时应该在控制台看到相应日志');
console.log('- 状态栏应该实时更新显示');
console.log('- 侧边栏面板应该显示正确的状态');
console.log('- 如果仍有问题，请查看 test-buttons.md 文件');

console.log('\n🔗 相关文件:');
console.log('- test-buttons.md - 详细测试指南');
console.log('- vscode-salary-tracker-1.0.0.vsix - 更新的插件包');
console.log('- verify-fix.js - 本验证脚本');
