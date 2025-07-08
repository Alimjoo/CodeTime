const fs = require('fs');
const path = require('path');

// 支持作为afterPack钩子调用
module.exports = async function(context) {
  const buildDir = context.appOutDir;
  await optimizeBuild(buildDir);
};

// 也支持直接调用
if (require.main === module) {
  const buildDir = path.join(__dirname, 'dist', 'win-unpacked');
  optimizeBuild(buildDir);
}

async function optimizeBuild(buildDir) {
  console.log('开始深度优化构建包...');
  
  const localesDir = path.join(buildDir, 'locales');

  // 删除除中文和英文外的所有语言包
  if (fs.existsSync(localesDir)) {
    const files = fs.readdirSync(localesDir);
    files.forEach(file => {
      if (!file.includes('zh-CN') && !file.includes('en-US')) {
        const filePath = path.join(localesDir, file);
        try {
          fs.unlinkSync(filePath);
          console.log(`删除语言包: ${file}`);
        } catch (err) {
          console.log(`无法删除: ${file}`);
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
  'libGLESv2.dll',               // 7.5MB - OpenGL ES图形库 (可能影响硬件加速)
  'libEGL.dll',                  // 484KB - EGL图形库
  'ffmpeg.dll',                  // 2.8MB - 媒体编解码器 (如果不需要视频/音频)
  'chrome_200_percent.pak',      // 180KB - 高DPI资源
  'v8_context_snapshot.bin',     // 483KB - V8快照文件
  'icudtl.dat',                  // 10MB - 国际化数据 (可能影响某些功能)
  'snapshot_blob.bin',           // 172KB - V8快照
  'LICENSE.electron.txt',        // 许可证文件
  'version'                      // 版本文件
];

// 尝试保留基本功能的文件删除列表
const conservativeDelete = [
  'LICENSES.chromium.html',      // 6.8MB - 绝对安全删除
  'd3dcompiler_47.dll',          // 4.9MB - DirectX编译器，简单应用不需要
  'vk_swiftshader.dll',          // 5.1MB - Vulkan软件渲染器
  'vulkan-1.dll',                // 915KB - Vulkan图形API
  'vk_swiftshader_icd.json',     // Vulkan配置
  'chrome_200_percent.pak',      // 180KB - 高DPI资源，可用chrome_100_percent.pak
  'LICENSE.electron.txt',        // 许可证文件
  'version'                      // 版本文件
];

let totalSaved = 0;

// 使用保守的删除策略
conservativeDelete.forEach(fileName => {
  const filePath = path.join(buildDir, fileName);
  if (fs.existsSync(filePath)) {
    try {
      const stats = fs.statSync(filePath);
      const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      fs.unlinkSync(filePath);
      totalSaved += stats.size;
      console.log(`删除文件: ${fileName} (${fileSizeMB}MB)`);
    } catch (err) {
      console.log(`无法删除: ${fileName}`);
    }
  }
});

// 创建一个标识文件，表明已经过优化
const optimizedFlag = path.join(buildDir, 'OPTIMIZED');
fs.writeFileSync(optimizedFlag, `Optimized at ${new Date().toISOString()}\nSaved: ${(totalSaved / (1024 * 1024)).toFixed(2)}MB`);

  console.log(`总共节省空间: ${(totalSaved / (1024 * 1024)).toFixed(2)}MB`);
  console.log('保守优化完成！应用应该能正常运行。');

  // 显示最终构建大小
  try {
    const finalSize = getFolderSize(buildDir);
    console.log(`优化后应用大小: ${(finalSize / (1024 * 1024)).toFixed(2)}MB`);
  } catch (err) {
    console.log('无法计算最终大小');
  }
}

function getFolderSize(folderPath) {
  let totalSize = 0;
  
  function calculateSize(currentPath) {
    const stats = fs.statSync(currentPath);
    if (stats.isFile()) {
      totalSize += stats.size;
    } else if (stats.isDirectory()) {
      const files = fs.readdirSync(currentPath);
      files.forEach(file => {
        calculateSize(path.join(currentPath, file));
      });
    }
  }
  
  calculateSize(folderPath);
  return totalSize;
}