const { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const https = require('https');

let mainWindow;
let tray;

// 数据文件路径
const dataPath = path.join(app.getPath('userData'), 'codetime-data.json');

// 导入版本配置
const versionConfig = require('../version-config.json');

// 应用版本信息
const APP_VERSION = versionConfig.app.version;
const APP_BUILD_NUMBER = versionConfig.app.buildNumber;

// 默认数据结构
const defaultData = {
  dailyGoal: 500, // 每日目标金额
  incomeRecords: [], // 收入记录数组 [{id, amount, description, date, projectName}]
  projects: [], // 项目列表 [{id, name, createdAt, isActive, totalTime, actualTime, sessions}]
  activeProjects: [], // 当前活跃项目 [{projectId, startTime, isPaused, pausedTime}]
  monthlyStats: {}, // 月度统计 {"2024-01": {income: 5000, projects: 10}}
  yearlyStats: {}, // 年度统计 {"2024": {income: 60000, projects: 120}}
  settings: {
    autoStart: true,
    notifications: true,
    theme: 'glassmorphism',
    currency: '¥',
    language: 'zh-CN',
    lastUpdateCheck: null,
    autoCheckUpdates: true
  }
};

// 创建主窗口
function createWindow() {
  // 如果窗口已存在，直接显示并聚焦
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.show();
    mainWindow.focus();
    return;
  }

  mainWindow = new BrowserWindow({
    width: 420,
    height: 700,
    minWidth: 400,
    minHeight: 600,
    frame: false,
    transparent: true,
    resizable: true,
    alwaysOnTop: false,
    show: false, // 初始时不显示，等加载完成后再显示
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, '../favicon_io/android-chrome-512x512.png')
  });

  mainWindow.loadFile('src/index.html');

  // 页面加载完成后显示窗口
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // 开发模式下打开开发者工具
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  // 窗口关闭时隐藏到系统托盘
  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // 窗口失去焦点时隐藏（点击外部收起）
  let isBlurHandled = false;
  mainWindow.on('blur', () => {
    if (isBlurHandled) return;
    isBlurHandled = true;
    
    // 延迟执行，避免点击应用内元素时意外隐藏
    setTimeout(() => {
      if (mainWindow && !mainWindow.isDestroyed() && 
          !mainWindow.webContents.isDevToolsOpened() &&
          !mainWindow.isMinimized()) {
        
        // 检查是否有模态框打开
        mainWindow.webContents.executeJavaScript(`
          const modals = document.querySelectorAll('.modal');
          let hasOpenModal = false;
          modals.forEach(modal => {
            if (modal.style.display === 'flex') {
              hasOpenModal = true;
            }
          });
          hasOpenModal;
        `).then(hasOpenModal => {
          if (!hasOpenModal) {
        mainWindow.hide();
          }
          isBlurHandled = false;
        }).catch(() => {
          isBlurHandled = false;
        });
      } else {
        isBlurHandled = false;
      }
    }, 150);
  });

  // 窗口获得焦点时重置标志
  mainWindow.on('focus', () => {
    isBlurHandled = false;
  });

  // 窗口销毁时清空引用
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 创建系统托盘
function createTray() {
  const iconPath = path.join(__dirname, '../favicon_io/favicon-32x32.png');
  const trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  
  tray = new Tray(trayIcon);
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示CodeTime',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      }
    },
    {
      label: '退出',
      click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);
  
  tray.setContextMenu(contextMenu);
  tray.setToolTip('CodeTime - 极简时间规划助手');
  
  tray.on('double-click', () => {
    mainWindow.show();
    mainWindow.focus();
  });
}

// 初始化数据文件
async function initializeData() {
  try {
    // 检查文件是否存在
    try {
      await fs.access(dataPath);
    } catch (error) {
      // 文件不存在，创建默认数据文件
      await fs.writeFile(dataPath, JSON.stringify(defaultData, null, 2), 'utf8');
    }
  } catch (error) {
    console.error('初始化数据文件失败:', error);
  }
}

// 读取数据
async function loadData() {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    const parsedData = JSON.parse(data);
    return { ...defaultData, ...parsedData };
  } catch (error) {
    console.error('读取数据失败:', error);
    return defaultData;
  }
}

// 保存数据
async function saveData(data) {
  try {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('保存数据失败:', error);
    return false;
  }
}

// 生成唯一ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 数据导出函数
async function exportData(format, data) {
  try {
    const result = await dialog.showSaveDialog(mainWindow, {
      defaultPath: `CodeTime_backup_${new Date().toISOString().split('T')[0]}.${format}`,
      filters: [
        format === 'json' ? { name: 'JSON Files', extensions: ['json'] } :
        format === 'csv' ? { name: 'CSV Files', extensions: ['csv'] } :
        { name: 'Excel Files', extensions: ['xlsx'] }
      ]
    });

    if (!result.canceled) {
      let content = '';
      
      if (format === 'json') {
        content = JSON.stringify(data, null, 2);
      } else if (format === 'csv') {
        content = convertToCSV(data);
      } else if (format === 'xlsx') {
        // 对于Excel，我们创建一个简单的XML格式
        content = convertToExcel(data);
      }
      
      await fs.writeFile(result.filePath, content, 'utf8');
      return { success: true, path: result.filePath };
    }
    return { success: false, message: '用户取消了操作' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// 转换为CSV格式
function convertToCSV(data) {
  let csv = '';
  
  // 收入记录
  if (data.incomeRecords && data.incomeRecords.length > 0) {
    csv += '收入记录\n';
    csv += '日期,金额,描述,项目名称\n';
    data.incomeRecords.forEach(record => {
      csv += `"${record.date}","${record.amount}","${record.description || ''}","${record.projectName || ''}"\n`;
    });
    csv += '\n';
  }
  
  // 项目记录
  if (data.projects && data.projects.length > 0) {
    csv += '项目记录\n';
    csv += '项目名称,创建时间,总时间(分钟),实际时间(分钟),是否活跃\n';
    data.projects.forEach(project => {
      csv += `"${project.name}","${project.createdAt}","${project.totalTime || 0}","${project.actualTime || 0}","${project.isActive ? '是' : '否'}"\n`;
    });
  }
  
  return csv;
}

// 转换为Excel格式 (简单的XML格式)
function convertToExcel(data) {
  let xml = `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet">
<Worksheet ss:Name="收入记录">
<Table>
<Row>
<Cell><Data ss:Type="String">日期</Data></Cell>
<Cell><Data ss:Type="String">金额</Data></Cell>
<Cell><Data ss:Type="String">描述</Data></Cell>
<Cell><Data ss:Type="String">项目名称</Data></Cell>
</Row>`;

  if (data.incomeRecords) {
    data.incomeRecords.forEach(record => {
      xml += `
<Row>
<Cell><Data ss:Type="String">${record.date || ''}</Data></Cell>
<Cell><Data ss:Type="Number">${record.amount || 0}</Data></Cell>
<Cell><Data ss:Type="String">${(record.description || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</Data></Cell>
<Cell><Data ss:Type="String">${(record.projectName || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</Data></Cell>
</Row>`;
    });
  }

  xml += `</Table>
</Worksheet>
<Worksheet ss:Name="项目记录">
<Table>
<Row>
<Cell><Data ss:Type="String">项目名称</Data></Cell>
<Cell><Data ss:Type="String">创建时间</Data></Cell>
<Cell><Data ss:Type="String">总时间(分钟)</Data></Cell>
<Cell><Data ss:Type="String">实际时间(分钟)</Data></Cell>
<Cell><Data ss:Type="String">是否活跃</Data></Cell>
</Row>`;

  if (data.projects) {
    data.projects.forEach(project => {
      xml += `
<Row>
<Cell><Data ss:Type="String">${(project.name || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</Data></Cell>
<Cell><Data ss:Type="String">${project.createdAt || ''}</Data></Cell>
<Cell><Data ss:Type="Number">${project.totalTime || 0}</Data></Cell>
<Cell><Data ss:Type="Number">${project.actualTime || 0}</Data></Cell>
<Cell><Data ss:Type="String">${project.isActive ? '是' : '否'}</Data></Cell>
</Row>`;
    });
  }

  xml += `</Table>
</Worksheet>
<Worksheet ss:Name="设置信息">
<Table>
<Row>
<Cell><Data ss:Type="String">设置项</Data></Cell>
<Cell><Data ss:Type="String">值</Data></Cell>
</Row>
<Row>
<Cell><Data ss:Type="String">每日目标</Data></Cell>
<Cell><Data ss:Type="Number">${data.dailyGoal || 0}</Data></Cell>
</Row>
<Row>
<Cell><Data ss:Type="String">语言</Data></Cell>
<Cell><Data ss:Type="String">${data.settings?.language || 'zh-CN'}</Data></Cell>
</Row>
<Row>
<Cell><Data ss:Type="String">主题</Data></Cell>
<Cell><Data ss:Type="String">${data.settings?.theme || 'glassmorphism'}</Data></Cell>
</Row>
<Row>
<Cell><Data ss:Type="String">货币</Data></Cell>
<Cell><Data ss:Type="String">${data.settings?.currency || '¥'}</Data></Cell>
</Row>
<Row>
<Cell><Data ss:Type="String">导出时间</Data></Cell>
<Cell><Data ss:Type="String">${new Date().toISOString()}</Data></Cell>
</Row>
</Table>
</Worksheet>
</Workbook>`;
  
  return xml;
}

// 数据导入函数
async function importData() {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      filters: [
        { name: 'All Supported', extensions: ['json', 'csv'] },
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'CSV Files', extensions: ['csv'] }
      ],
      properties: ['openFile']
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const filePath = result.filePaths[0];
      const content = await fs.readFile(filePath, 'utf8');
      const ext = path.extname(filePath).toLowerCase();
      
      if (ext === '.json') {
        try {
          const importedData = JSON.parse(content);
          
          // 智能合并数据
          const currentData = await loadData();
          const mergedData = mergeData(currentData, importedData);
          
          return { success: true, data: mergedData, merged: true };
        } catch (parseError) {
          return { success: false, message: 'JSON文件格式错误' };
        }
      } else if (ext === '.csv') {
        // 简单的CSV解析
        const csvData = parseCSV(content);
        const currentData = await loadData();
        const mergedData = mergeData(currentData, csvData);
        
        return { success: true, data: mergedData, merged: true };
      }
    }
    return { success: false, message: '用户取消了操作' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// 智能合并数据函数
function mergeData(currentData, importedData) {
  const merged = { ...currentData };
  
  // 合并收入记录 - 避免重复
  if (importedData.incomeRecords && importedData.incomeRecords.length > 0) {
    const existingIds = new Set(merged.incomeRecords.map(r => r.id));
    const existingRecords = new Set(merged.incomeRecords.map(r => `${r.date}_${r.amount}_${r.description}`));
    
    importedData.incomeRecords.forEach(record => {
      const recordKey = `${record.date}_${record.amount}_${record.description}`;
      if (!existingIds.has(record.id) && !existingRecords.has(recordKey)) {
        merged.incomeRecords.push({
          ...record,
          id: record.id || generateId()
        });
      }
    });
  }
  
  // 合并项目 - 避免重复
  if (importedData.projects && importedData.projects.length > 0) {
    const existingProjectNames = new Set(merged.projects.map(p => p.name));
    const existingProjectIds = new Set(merged.projects.map(p => p.id));
    
    importedData.projects.forEach(project => {
      if (!existingProjectIds.has(project.id) && !existingProjectNames.has(project.name)) {
        merged.projects.push({
          ...project,
          id: project.id || generateId()
        });
      }
    });
  }
  
  // 合并设置 - 保留导入的设置
  if (importedData.settings) {
    merged.settings = {
      ...merged.settings,
      ...importedData.settings
    };
  }
  
  // 更新每日目标
  if (importedData.dailyGoal) {
    merged.dailyGoal = importedData.dailyGoal;
  }
  
  return merged;
}

// 简单的CSV解析
function parseCSV(content) {
  // 这里实现一个简单的CSV解析逻辑
  const lines = content.split('\n');
  const result = { incomeRecords: [], projects: [] };
  
  // 简化处理，只解析收入记录部分
  let isIncomeSection = false;
  
  lines.forEach(line => {
    if (line.includes('收入记录')) {
      isIncomeSection = true;
      return;
    }
    if (line.includes('项目记录')) {
      isIncomeSection = false;
      return;
    }
    if (line.includes('日期,金额,描述,项目名称')) {
      return;
    }
    
    if (isIncomeSection && line.trim()) {
      const cols = line.split(',').map(col => col.replace(/"/g, ''));
      if (cols.length >= 4) {
        result.incomeRecords.push({
          id: generateId(),
          date: cols[0],
          amount: parseFloat(cols[1]) || 0,
          description: cols[2],
          projectName: cols[3]
        });
      }
    }
  });
  
  return result;
}

// 检查更新函数
// 专业版本检查系统
class VersionChecker {
  constructor(config) {
    this.config = config;
    this.updateSources = config.updateSources
      .filter(source => source.enabled)
      .sort((a, b) => a.priority - b.priority);
  }

  async checkForUpdates() {
    const policy = this.config.updatePolicy;
    let lastError = null;

    for (const source of this.updateSources) {
      try {
        console.log(`尝试检查更新源: ${source.name}`);
        const result = await this.checkSource(source, policy.timeout);
        
        if (result.success) {
          const updateInfo = this.processUpdateInfo(result.data, source);
          console.log(`成功从 ${source.name} 获取版本信息`);
          return {
            success: true,
            hasUpdate: updateInfo.hasUpdate,
            currentVersion: APP_VERSION,
            latestVersion: updateInfo.version,
            downloadUrl: updateInfo.downloadUrl,
            releaseNotes: updateInfo.releaseNotes,
            isBreaking: updateInfo.isBreaking,
            source: source.name
          };
        }
      } catch (error) {
        console.warn(`更新源 ${source.name} 检查失败:`, error.message);
        lastError = error;
        continue;
      }
    }

    return {
      success: false,
      hasUpdate: false,
      error: lastError ? lastError.message : '所有更新源均不可用',
      currentVersion: APP_VERSION
    };
  }

  async checkSource(source, timeout) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`请求超时 (${timeout}ms)`));
      }, timeout);

      try {
        if (source.type === 'mock') {
          // 模拟数据源，用于开发和测试
          clearTimeout(timer);
          resolve({
            success: true,
            data: source.mockData
          });
          return;
        }

        if (source.type === 'github') {
          this.checkGitHubSource(source.url, (error, data) => {
            clearTimeout(timer);
            if (error) {
              reject(error);
            } else {
              resolve({ success: true, data });
            }
          });
        } else if (source.type === 'custom') {
          this.checkCustomSource(source.url, (error, data) => {
            clearTimeout(timer);
            if (error) {
              reject(error);
            } else {
              resolve({ success: true, data });
            }
          });
        } else {
          clearTimeout(timer);
          reject(new Error(`不支持的更新源类型: ${source.type}`));
        }
      } catch (error) {
        clearTimeout(timer);
        reject(error);
      }
    });
  }

  checkGitHubSource(url, callback) {
    https.get(url, {
      headers: {
        'User-Agent': 'CodeTime-UpdateChecker/1.0.0',
        'Accept': 'application/vnd.github.v3+json'
      }
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            callback(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
            return;
          }

          const release = JSON.parse(data);
          callback(null, {
            version: release.tag_name.replace(/^v/, ''),
            downloadUrl: release.html_url,
            releaseNotes: release.body || '',
            releaseDate: release.published_at,
            isBreaking: this.isBreakingRelease(release)
          });
        } catch (error) {
          callback(new Error(`解析 GitHub API 响应失败: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      callback(new Error(`GitHub API 请求失败: ${error.message}`));
    });
  }

  checkCustomSource(url, callback) {
    https.get(url, {
      headers: {
        'User-Agent': 'CodeTime-UpdateChecker/1.0.0',
        'Accept': 'application/json'
      }
    }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
            callback(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
            return;
          }

          const versionInfo = JSON.parse(data);
          callback(null, versionInfo);
        } catch (error) {
          callback(new Error(`解析自定义 API 响应失败: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      callback(new Error(`自定义 API 请求失败: ${error.message}`));
    });
  }

  processUpdateInfo(data, source) {
    const latestVersion = data.version;
    const hasUpdate = this.compareVersions(latestVersion, APP_VERSION) > 0;

    return {
      hasUpdate,
      version: latestVersion,
      downloadUrl: data.downloadUrl,
      releaseNotes: data.releaseNotes || '',
      isBreaking: data.isBreaking || false,
      releaseDate: data.releaseDate
    };
  }

  isBreakingRelease(release) {
    const body = (release.body || '').toLowerCase();
    return body.includes('breaking') || 
           body.includes('major') || 
           body.includes('不兼容') ||
           body.includes('重大更新');
  }

  compareVersions(version1, version2) {
  const v1parts = version1.split('.').map(Number);
  const v2parts = version2.split('.').map(Number);
  
  for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
    const v1part = v1parts[i] || 0;
    const v2part = v2parts[i] || 0;
    
    if (v1part > v2part) return 1;
    if (v1part < v2part) return -1;
  }
  return 0;
}
}

// 创建版本检查器实例
const versionChecker = new VersionChecker(versionConfig);

// 导出给IPC使用的检查更新函数
async function checkForUpdates() {
  try {
    const result = await versionChecker.checkForUpdates();
    console.log('版本检查结果:', result);
    return result;
  } catch (error) {
    console.error('版本检查失败:', error);
    return {
      success: false,
      hasUpdate: false,
      error: error.message,
      currentVersion: APP_VERSION
    };
  }
}



// 显示关于对话框
async function showAboutDialog(language = 'zh-CN') {
  if (!mainWindow || mainWindow.isDestroyed()) {
    console.error('主窗口不可用');
    return { success: false, error: '主窗口不可用' };
  }

  // 国际化文本
  const i18n = {
    'zh-CN': {
    title: '关于 CodeTime',
      detail: `一款针对程序员而做的时间和金钱规划助手

开发: 上海万来云边科技服务有限公司
网站: @WalleyX.com
版权: © 2025 万来云边科技

感谢程序员朋友们的支持！`,
      buttons: ['确定', 'GitHub', '检查更新'],
      newVersionTitle: '发现新版本',
      newVersionMessage: '新版本 {version} 可用',
      newVersionDetail: '当前: {current}\n最新: {latest}\n\n是否下载？',
      newVersionButtons: ['下载', '取消'],
      versionCheckTitle: '版本检查',
      versionCheckMessage: '已是最新版本',
      versionCheckDetail: '当前版本: {version}',
      versionCheckButtons: ['确定']
    },
    'en-US': {
      title: 'About CodeTime',
      detail: `A time and money planning assistant for programmers

Developer: Shanghai Wanlai Yunbian Technology Service Co., Ltd.
Website: @WalleyX.com
Copyright: © 2025 Wanlai Yunbian Technology

Thank you for your support!`,
      buttons: ['OK', 'GitHub', 'Check Updates'],
      newVersionTitle: 'New Version Available',
      newVersionMessage: 'New version {version} available',
      newVersionDetail: 'Current: {current}\nLatest: {latest}\n\nDownload now?',
      newVersionButtons: ['Download', 'Cancel'],
      versionCheckTitle: 'Version Check',
      versionCheckMessage: 'You are using the latest version',
      versionCheckDetail: 'Current version: {version}',
      versionCheckButtons: ['OK']
    }
  };

  const texts = i18n[language] || i18n['zh-CN'];

  try {
    const result = await dialog.showMessageBox(mainWindow, {
      type: 'none',
      title: texts.title,
      message: 'CodeTime v' + APP_VERSION,
      detail: texts.detail,
      buttons: texts.buttons,
      defaultId: 0,
      noLink: true,
      normalizeAccessKeys: false
    });

    if (result.response === 1) {
      // 打开GitHub
      shell.openExternal('https://github.com/abduwali/codetime');
    } else if (result.response === 2) {
      // 检查更新
      try {
        const updateResult = await checkForUpdates();
        if (updateResult.hasUpdate) {
          const updateChoice = await dialog.showMessageBox(mainWindow, {
            type: 'none',
            title: texts.newVersionTitle,
            message: texts.newVersionMessage.replace('{version}', updateResult.latestVersion),
            detail: texts.newVersionDetail.replace('{current}', updateResult.currentVersion).replace('{latest}', updateResult.latestVersion),
            buttons: texts.newVersionButtons,
            defaultId: 0,
            noLink: true,
            normalizeAccessKeys: false
          });
          
          if (updateChoice.response === 0) {
            shell.openExternal(updateResult.downloadUrl);
          }
        } else {
          await dialog.showMessageBox(mainWindow, {
            type: 'none',
            title: texts.versionCheckTitle,
            message: texts.versionCheckMessage,
            detail: texts.versionCheckDetail.replace('{version}', APP_VERSION),
            buttons: texts.versionCheckButtons,
            defaultId: 0,
            noLink: true,
            normalizeAccessKeys: false
          });
        }
      } catch (updateError) {
        console.error('检查更新失败:', updateError);
        return { success: false, error: '检查更新失败: ' + updateError.message };
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('显示关于对话框失败:', error);
    return { success: false, error: error.message };
  }
}

// IPC 事件处理
ipcMain.handle('load-data', loadData);
ipcMain.handle('save-data', (event, data) => saveData(data));
ipcMain.handle('generate-id', generateId);
ipcMain.handle('export-data', (event, format, data) => exportData(format, data));
ipcMain.handle('import-data', importData);
ipcMain.handle('check-updates', checkForUpdates);
ipcMain.handle('show-about', async (event, language = 'zh-CN') => {
  try {
    return await showAboutDialog(language);
  } catch (error) {
    console.error('IPC show-about 处理失败:', error);
    return { success: false, error: error.message };
  }
});
ipcMain.handle('get-app-version', () => APP_VERSION);
ipcMain.handle('minimize-window', () => mainWindow.minimize());
ipcMain.handle('close-window', () => mainWindow.hide());
ipcMain.handle('quit-app', () => {
  app.isQuiting = true;
  app.quit();
});

// 内存优化：定期清理内存
function optimizeMemory() {
  if (global.gc) {
    global.gc();
  }
  // 清理WebContents缓存
  if (mainWindow && mainWindow.webContents) {
    mainWindow.webContents.session.clearCache();
  }
}

// 应用准备就绪
app.whenReady().then(async () => {
  await initializeData();
  createWindow();
  createTray();
  
  // 设置应用菜单为空（隐藏默认菜单）
  Menu.setApplicationMenu(null);
  
  // 每10分钟执行一次内存优化
  setInterval(optimizeMemory, 10 * 60 * 1000);
  
  // 启动时检查更新（如果用户开启了自动检查）
  setTimeout(async () => {
    try {
      const data = await loadData();
      if (data.settings && data.settings.autoCheckUpdates !== false) {
        const lastCheck = data.settings.lastUpdateCheck;
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;
        
        // 如果距离上次检查超过1天，则自动检查更新
        if (!lastCheck || (now - lastCheck) > oneDayMs) {
          const updateResult = await checkForUpdates();
          
          // 更新最后检查时间
          data.settings.lastUpdateCheck = now;
          await saveData(data);
          
          // 如果有更新，显示通知
          if (updateResult.hasUpdate) {
            const result = await dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: '发现新版本',
              message: `CodeTime 有新版本可用！`,
              detail: `当前版本: ${updateResult.currentVersion}\n最新版本: ${updateResult.latestVersion}\n\n是否现在下载？`,
              buttons: ['立即下载', '稍后提醒', '关闭自动检查'],
              defaultId: 0
            });
            
            if (result.response === 0) {
              shell.openExternal(updateResult.downloadUrl);
            } else if (result.response === 2) {
              // 用户选择关闭自动检查
              data.settings.autoCheckUpdates = false;
              await saveData(data);
            }
          }
        }
      }
    } catch (error) {
      console.error('自动检查更新失败:', error);
    }
  }, 3000); // 启动3秒后检查更新
});

// 应用即将退出时的处理
app.on('before-quit', async (event) => {
  // 检查是否是卸载操作（通过命令行参数判断）
  const isUninstalling = process.argv.includes('--uninstall') || 
                         process.argv.includes('/uninstall') ||
                         process.argv.includes('--squirrel-uninstall');
  
  if (isUninstalling && !app.isQuiting) {
    event.preventDefault();
    
    // 显示数据导出提示
    const result = await dialog.showMessageBox(mainWindow, {
      type: 'question',
      title: '数据备份提醒',
      message: '检测到您正在卸载 CodeTime',
      detail: '为了避免丢失您的历史数据，建议先导出数据备份。\n\n您是否需要导出数据？',
      buttons: ['导出数据', '直接卸载', '取消卸载'],
      defaultId: 0,
      cancelId: 2
    });
    
    if (result.response === 0) {
      // 用户选择导出数据
      try {
        const data = await loadData();
        const exportResult = await exportData('json', data);
        
        if (exportResult.success) {
          await dialog.showMessageBox(mainWindow, {
            type: 'info',
            title: '导出成功',
            message: '数据已成功导出！',
            detail: `文件保存位置：${exportResult.path}\n\n现在可以安全卸载应用了。`,
            buttons: ['确定']
          });
        }
      } catch (error) {
        await dialog.showMessageBox(mainWindow, {
          type: 'error',
          title: '导出失败',
          message: '数据导出失败',
          detail: `错误信息：${error.message}\n\n您可以手动从以下位置复制数据文件：\n${dataPath}`,
          buttons: ['确定']
        });
      }
    } else if (result.response === 2) {
      // 用户取消卸载
      return;
    }
    
    // 继续退出流程
    app.isQuiting = true;
    app.quit();
  }
});

// 所有窗口关闭时的处理
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 防止多实例运行
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });
}