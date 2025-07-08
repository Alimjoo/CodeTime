const fs = require('fs');
const path = require('path');

// 优化构建包大小
function optimizePackage(buildPath) {
  console.log('开始优化构建包大小...');
  
  let totalSaved = 0;
  
  // 删除不必要的语言包（只保留中文和英文）
  const localesDir = path.join(buildPath, 'locales');
  if (fs.existsSync(localesDir)) {
    const localeFiles = fs.readdirSync(localesDir);
    localeFiles.forEach(file => {
      if (!file.includes('zh-CN') && !file.includes('en-US')) {
        const filePath = path.join(localesDir, file);
        try {
          const stats = fs.statSync(filePath);
          fs.unlinkSync(filePath);
          totalSaved += stats.size;
          console.log(`删除语言包: ${file}`);
        } catch (err) {
          console.log(`无法删除语言包: ${file}`);
        }
      }
    });
  }
  
  // 删除大型不必要的文件
  const filesToDelete = [
    'LICENSES.chromium.html',      // 6.8MB - Chromium许可证
    'd3dcompiler_47.dll',          // 4.9MB - DirectX编译器
    'vk_swiftshader.dll',          // 5.1MB - Vulkan软件渲染器
    'vulkan-1.dll',                // 915KB - Vulkan图形API
    'vk_swiftshader_icd.json',     // Vulkan配置
    'chrome_200_percent.pak',      // 180KB - 高DPI资源
    'LICENSE.electron.txt',        // 许可证文件
    'version'                      // 版本文件
  ];
  
  filesToDelete.forEach(fileName => {
    const filePath = path.join(buildPath, fileName);
    if (fs.existsSync(filePath)) {
      try {
        const stats = fs.statSync(filePath);
        fs.unlinkSync(filePath);
        totalSaved += stats.size;
        console.log(`删除文件: ${fileName} (${(stats.size / (1024 * 1024)).toFixed(2)}MB)`);
      } catch (err) {
        console.log(`无法删除: ${fileName}`);
      }
    }
  });
  
  console.log(`总共节省空间: ${(totalSaved / (1024 * 1024)).toFixed(2)}MB`);
  console.log('构建优化完成！');
}

// 支持作为 electron-builder 的 afterPack 钩子
module.exports = async function(context) {
  await optimizePackage(context.appOutDir);
};

// 支持直接运行
if (require.main === module) {
  const buildDir = path.join(__dirname, 'dist', 'win-unpacked');
  if (fs.existsSync(buildDir)) {
    optimizePackage(buildDir);
  } else {
    console.log('构建目录不存在，请先执行构建');
  }
} 