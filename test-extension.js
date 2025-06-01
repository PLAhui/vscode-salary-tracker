// 简单的插件测试脚本
const fs = require('fs');
const path = require('path');

console.log('🧪 测试薪资追踪器插件...\n');

// 检查必要文件是否存在
const requiredFiles = [
  'package.json',
  'out/extension.js',
  'out/salaryTracker.js',
  'out/configManager.js',
  'out/statusBarProvider.js',
  'out/webviewProvider.js',
  'out/timeCalculator.js',
  'out/types.js',
  'media/main.css',
  'media/main.js',
  'media/reset.css',
  'media/vscode.css'
];

console.log('📁 检查文件结构...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - 文件不存在`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('\n🎉 所有必要文件都存在！');
} else {
  console.log('\n❌ 某些文件缺失，请检查构建过程。');
  process.exit(1);
}

// 检查package.json配置
console.log('\n📋 检查package.json配置...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const requiredFields = [
    'name',
    'displayName',
    'description',
    'version',
    'engines',
    'main',
    'contributes'
  ];
  
  requiredFields.forEach(field => {
    if (packageJson[field]) {
      console.log(`✅ ${field}: ${typeof packageJson[field] === 'object' ? 'configured' : packageJson[field]}`);
    } else {
      console.log(`❌ ${field}: 缺失`);
    }
  });
  
  // 检查命令配置
  if (packageJson.contributes && packageJson.contributes.commands) {
    console.log(`✅ 命令数量: ${packageJson.contributes.commands.length}`);
  }
  
  // 检查配置项
  if (packageJson.contributes && packageJson.contributes.configuration) {
    const configProps = packageJson.contributes.configuration.properties;
    console.log(`✅ 配置项数量: ${Object.keys(configProps || {}).length}`);
  }
  
} catch (error) {
  console.log(`❌ package.json解析错误: ${error.message}`);
}

// 检查TypeScript编译输出
console.log('\n🔧 检查编译输出...');
try {
  const extensionJs = fs.readFileSync('out/extension.js', 'utf8');
  
  if (extensionJs.includes('activate')) {
    console.log('✅ activate函数存在');
  } else {
    console.log('❌ activate函数缺失');
  }
  
  if (extensionJs.includes('deactivate')) {
    console.log('✅ deactivate函数存在');
  } else {
    console.log('❌ deactivate函数缺失');
  }
  
} catch (error) {
  console.log(`❌ 读取编译输出错误: ${error.message}`);
}

console.log('\n📊 项目统计:');
console.log(`- TypeScript源文件: ${fs.readdirSync('src').filter(f => f.endsWith('.ts')).length}`);
console.log(`- JavaScript编译文件: ${fs.readdirSync('out').filter(f => f.endsWith('.js')).length}`);
console.log(`- 媒体资源文件: ${fs.readdirSync('media').length}`);

console.log('\n🚀 插件开发完成！');
console.log('\n📝 下一步操作:');
console.log('1. 在VSCode中按F5启动扩展开发主机');
console.log('2. 在新窗口中测试插件功能');
console.log('3. 使用命令面板搜索"薪资追踪"相关命令');
console.log('4. 检查状态栏和侧边栏显示');
console.log('5. 测试配置修改功能');

console.log('\n💡 功能特性:');
console.log('- ⏱️  实时薪资追踪');
console.log('- 📊 状态栏显示');
console.log('- 🎛️  侧边栏控制面板');
console.log('- ⚙️  灵活配置选项');
console.log('- 💾 数据持久化');
console.log('- 📅 工作日设置');
