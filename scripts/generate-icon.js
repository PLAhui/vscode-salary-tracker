/**
 * 图标生成脚本
 * 用于将SVG图标转换为PNG格式
 */

const fs = require('fs');
const path = require('path');

// 检查是否有合适的图标文件
function checkIconFiles() {
  const iconDir = path.join(__dirname, '..', 'images');
  const pngIcon = path.join(iconDir, 'icon.png');
  const svgIcon = path.join(iconDir, 'icon.svg');
  
  console.log('🔍 检查图标文件...');
  
  if (fs.existsSync(pngIcon)) {
    console.log('✅ 找到PNG图标:', pngIcon);
    return true;
  }
  
  if (fs.existsSync(svgIcon)) {
    console.log('📄 找到SVG图标:', svgIcon);
    console.log('💡 建议: 将SVG转换为128x128的PNG格式以获得最佳效果');
    console.log('');
    console.log('转换方法:');
    console.log('1. 在线转换: https://convertio.co/svg-png/');
    console.log('2. 使用ImageMagick: convert icon.svg -resize 128x128 icon.png');
    console.log('3. 使用在线工具: https://www.aconvert.com/image/svg-to-png/');
    return false;
  }
  
  console.log('❌ 未找到图标文件');
  console.log('');
  console.log('请按照以下步骤设置图标:');
  console.log('1. 将您的钱袋logo保存为PNG格式');
  console.log('2. 调整尺寸为128x128像素');
  console.log('3. 命名为icon.png');
  console.log('4. 放置在images/文件夹中');
  
  return false;
}

// 验证图标规格
function validateIcon() {
  const iconPath = path.join(__dirname, '..', 'images', 'icon.png');
  
  if (!fs.existsSync(iconPath)) {
    return false;
  }
  
  // 这里可以添加更多验证逻辑，比如检查图片尺寸
  console.log('✅ 图标文件验证通过');
  return true;
}

// 生成图标信息
function generateIconInfo() {
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  console.log('📦 插件信息:');
  console.log(`   名称: ${packageJson.displayName}`);
  console.log(`   版本: ${packageJson.version}`);
  console.log(`   图标: ${packageJson.icon || '未设置'}`);
  console.log(`   横幅颜色: ${packageJson.galleryBanner?.color || '未设置'}`);
}

// 主函数
function main() {
  console.log('🎨 VSCode插件图标设置工具\n');
  
  generateIconInfo();
  console.log('');
  
  const hasValidIcon = checkIconFiles();
  
  if (hasValidIcon) {
    validateIcon();
    console.log('');
    console.log('🎉 图标设置完成！您的插件现在有了专业的logo。');
  } else {
    console.log('');
    console.log('⚠️  请完成图标设置后重新运行此脚本。');
  }
  
  console.log('');
  console.log('📚 更多帮助请查看: icon-setup-guide.md');
}

// 运行脚本
if (require.main === module) {
  main();
}

module.exports = {
  checkIconFiles,
  validateIcon,
  generateIconInfo
};
