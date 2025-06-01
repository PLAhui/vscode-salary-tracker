/**
 * 测试实时更新功能
 * 验证薪资数据是否能够自动更新显示
 */

const vscode = require('vscode');

async function testRealtimeUpdate() {
  console.log('🧪 开始测试实时更新功能...');
  
  try {
    // 1. 测试配置获取
    console.log('📋 测试配置获取...');
    const config = vscode.workspace.getConfiguration('salaryTracker');
    const updateInterval = config.get('updateInterval', 500);
    const realTimeUpdateInterval = config.get('realTimeUpdateInterval', 250);
    const enableHighFrequencyUpdate = config.get('enableHighFrequencyUpdate', true);
    
    console.log(`✅ 配置获取成功:`);
    console.log(`   - 更新间隔: ${updateInterval}ms`);
    console.log(`   - 实时更新间隔: ${realTimeUpdateInterval}ms`);
    console.log(`   - 启用高频更新: ${enableHighFrequencyUpdate}`);
    
    // 2. 测试命令执行
    console.log('\n🎮 测试命令执行...');
    
    // 开始计时
    console.log('▶️ 执行开始计时命令...');
    await vscode.commands.executeCommand('salaryTracker.start');
    console.log('✅ 开始计时命令执行成功');
    
    // 等待一段时间观察更新
    console.log('\n⏱️ 等待5秒观察实时更新...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 暂停计时
    console.log('⏸️ 执行暂停计时命令...');
    await vscode.commands.executeCommand('salaryTracker.pause');
    console.log('✅ 暂停计时命令执行成功');
    
    // 继续计时
    console.log('▶️ 执行继续计时命令...');
    await vscode.commands.executeCommand('salaryTracker.start');
    console.log('✅ 继续计时命令执行成功');
    
    // 再等待一段时间
    console.log('\n⏱️ 再等待3秒观察实时更新...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 停止计时
    console.log('⏹️ 执行停止计时命令...');
    await vscode.commands.executeCommand('salaryTracker.stop');
    console.log('✅ 停止计时命令执行成功');
    
    // 3. 测试状态显示
    console.log('\n📊 测试状态显示...');
    await vscode.commands.executeCommand('salaryTracker.showStats');
    console.log('✅ 状态显示命令执行成功');
    
    // 4. 测试面板显示
    console.log('\n🖼️ 测试面板显示...');
    await vscode.commands.executeCommand('salaryTracker.showPanel');
    console.log('✅ 面板显示命令执行成功');
    
    console.log('\n🎉 实时更新功能测试完成！');
    console.log('\n📝 测试结果说明:');
    console.log('   - 如果状态栏显示的薪资数据在计时过程中实时跳动更新，说明修复成功');
    console.log('   - 如果侧边栏面板中的数据也在实时更新，说明webview更新正常');
    console.log('   - 如果数据停留在固定值不变，说明还需要进一步调试');
    
  } catch (error) {
    console.error('❌ 测试过程中出现错误:', error);
    vscode.window.showErrorMessage(`实时更新测试失败: ${error.message}`);
  }
}

// 导出测试函数
module.exports = { testRealtimeUpdate };

// 如果直接运行此脚本
if (require.main === module) {
  console.log('⚠️ 此脚本需要在VSCode扩展环境中运行');
  console.log('请在VSCode中打开命令面板，运行相关测试命令');
}
