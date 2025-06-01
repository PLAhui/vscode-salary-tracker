/**
 * 测试新的薪资模式功能
 */

const vscode = require('vscode');

async function testSalaryModes() {
  console.log('开始测试薪资模式功能...');
  
  try {
    // 测试配置获取
    const config = vscode.workspace.getConfiguration('salaryTracker');
    
    // 测试固定工作时间模式配置
    console.log('测试固定工作时间模式配置...');
    await config.update('salaryMode', 'fixed_schedule', vscode.ConfigurationTarget.Global);
    await config.update('fixedSchedule', {
      monthlySalary: 15000,
      workStartHour: 9,
      workEndHour: 18,
      workDays: [1, 2, 3, 4, 5]
    }, vscode.ConfigurationTarget.Global);
    
    console.log('固定工作时间模式配置完成');
    
    // 测试按时计薪模式配置
    console.log('测试按时计薪模式配置...');
    await config.update('salaryMode', 'hourly', vscode.ConfigurationTarget.Global);
    await config.update('hourly', {
      hourlySalary: 100,
      autoStartOnLaunch: true
    }, vscode.ConfigurationTarget.Global);
    
    console.log('按时计薪模式配置完成');
    
    console.log('✅ 薪资模式功能测试完成！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 如果在VSCode环境中运行
if (typeof vscode !== 'undefined') {
  testSalaryModes();
} else {
  console.log('请在VSCode扩展环境中运行此测试');
}
