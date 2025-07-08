#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

/**
 * 专业版本发布脚本
 * 自动化处理版本更新、构建、Git提交和GitHub发布
 */

const COLORS = {
  RESET: '\x1b[0m',
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m'
};

function log(message, color = COLORS.RESET) {
  console.log(`${color}${message}${COLORS.RESET}`);
}

function error(message) {
  log(`❌ ${message}`, COLORS.RED);
}

function success(message) {
  log(`✅ ${message}`, COLORS.GREEN);
}

function info(message) {
  log(`ℹ️  ${message}`, COLORS.BLUE);
}

function warning(message) {
  log(`⚠️  ${message}`, COLORS.YELLOW);
}

class ReleaseManager {
  constructor() {
    this.packageJsonPath = path.join(__dirname, 'package.json');
    this.mainJsPath = path.join(__dirname, 'src', 'main.js');
    this.changelogPath = path.join(__dirname, 'CHANGELOG.md');
  }

  async run() {
    try {
      log('\n🚀 CodeTime 专业版本发布工具', COLORS.CYAN);
      log('=' .repeat(50), COLORS.CYAN);
      
      // 1. 检查Git状态
      await this.checkGitStatus();
      
      // 2. 读取当前版本
      const currentVersion = await this.getCurrentVersion();
      info(`当前版本: ${currentVersion}`);
      
      // 3. 询问新版本号
      const newVersion = await this.promptNewVersion(currentVersion);
      
      // 4. 更新版本号
      await this.updateVersions(newVersion);
      
      // 5. 构建应用
      await this.buildApplication();
      
      // 6. 提交到Git
      await this.commitToGit(newVersion);
      
      // 7. 创建Git标签
      await this.createGitTag(newVersion);
      
      // 8. 推送到GitHub
      await this.pushToGitHub(newVersion);
      
      success('\n🎉 版本发布完成！');
      info(`📦 新版本 ${newVersion} 已成功发布`);
      info(`🔗 GitHub: https://github.com/abnb0208/CodeTime/releases/tag/v${newVersion}`);
      
    } catch (err) {
      error(`\n发布失败: ${err.message}`);
      process.exit(1);
    }
  }

  async checkGitStatus() {
    info('检查Git状态...');
    try {
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      if (status.trim()) {
        warning('工作目录有未提交的更改:');
        console.log(status);
        
        // 询问是否继续
        const readline = require('readline');
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        const answer = await new Promise(resolve => {
          rl.question('是否继续发布? (y/N): ', resolve);
        });
        rl.close();
        
        if (answer.toLowerCase() !== 'y') {
          throw new Error('用户取消发布');
        }
      }
      success('Git状态检查通过');
    } catch (err) {
      if (err.message === '用户取消发布') throw err;
      error('Git状态检查失败，请确保在Git仓库中运行');
      throw err;
    }
  }

  async getCurrentVersion() {
    try {
      const packageJson = JSON.parse(await fs.readFile(this.packageJsonPath, 'utf8'));
      return packageJson.version;
    } catch (err) {
      throw new Error(`读取package.json失败: ${err.message}`);
    }
  }

  async promptNewVersion(currentVersion) {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const versionParts = currentVersion.split('.').map(Number);
    const suggestions = {
      patch: `${versionParts[0]}.${versionParts[1]}.${versionParts[2] + 1}`,
      minor: `${versionParts[0]}.${versionParts[1] + 1}.0`,
      major: `${versionParts[0] + 1}.0.0`
    };

    console.log('\n版本类型选择:');
    console.log(`1. Patch (${suggestions.patch}) - 修复bug`);
    console.log(`2. Minor (${suggestions.minor}) - 新功能`);
    console.log(`3. Major (${suggestions.major}) - 重大更新`);
    console.log(`4. 自定义版本号`);

    const choice = await new Promise(resolve => {
      rl.question('\n请选择 (1-4): ', resolve);
    });

    let newVersion;
    switch (choice) {
      case '1':
        newVersion = suggestions.patch;
        break;
      case '2':
        newVersion = suggestions.minor;
        break;
      case '3':
        newVersion = suggestions.major;
        break;
      case '4':
        newVersion = await new Promise(resolve => {
          rl.question('请输入自定义版本号: ', resolve);
        });
        break;
      default:
        newVersion = suggestions.patch;
    }

    rl.close();

    // 验证版本格式
    if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
      throw new Error('版本号格式无效，应为 x.y.z 格式');
    }

    return newVersion;
  }

  async updateVersions(newVersion) {
    info(`更新版本号到 ${newVersion}...`);
    
    // 更新 package.json
    const packageJson = JSON.parse(await fs.readFile(this.packageJsonPath, 'utf8'));
    packageJson.version = newVersion;
    await fs.writeFile(this.packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    
    // 更新 main.js 中的版本配置
    let mainJs = await fs.readFile(this.mainJsPath, 'utf8');
    mainJs = mainJs.replace(
      /version: "[^"]+"/,
      `version: "${newVersion}"`
    );
    await fs.writeFile(this.mainJsPath, mainJs);
    
    success('版本号更新完成');
  }

  async buildApplication() {
    info('开始构建应用...');
    try {
      // 清理之前的构建（使用原生方式）
      const fs = require('fs');
      const path = require('path');
      
      const distPath = path.join(__dirname, 'dist');
      const buildPath = path.join(__dirname, 'build');
      
      // 删除目录的函数
      const deleteDir = (dirPath) => {
        if (fs.existsSync(dirPath)) {
          fs.rmSync(dirPath, { recursive: true, force: true });
          info(`已清理目录: ${dirPath}`);
        }
      };
      
      deleteDir(distPath);
      deleteDir(buildPath);
      
      // 构建Windows版本
      info('开始构建Windows版本...');
      execSync('npm run build-win', { stdio: 'inherit' });
      
      success('应用构建完成');
    } catch (err) {
      throw new Error(`构建失败: ${err.message}`);
    }
  }

  async commitToGit(version) {
    info('提交更改到Git...');
    try {
      execSync('git add .', { stdio: 'inherit' });
      execSync(`git commit -m "🚀 Release v${version}

- 版本更新到 ${version}
- 完成应用构建和优化
- 更新版本追踪系统

更多详情请查看 CHANGELOG.md"`, { stdio: 'inherit' });
      
      success('Git提交完成');
    } catch (err) {
      throw new Error(`Git提交失败: ${err.message}`);
    }
  }

  async createGitTag(version) {
    info(`创建Git标签 v${version}...`);
    try {
      execSync(`git tag -a v${version} -m "Release v${version}"`, { stdio: 'inherit' });
      success('Git标签创建完成');
    } catch (err) {
      throw new Error(`创建标签失败: ${err.message}`);
    }
  }

  async pushToGitHub(version) {
    info('推送到GitHub...');
    try {
      execSync('git push origin main', { stdio: 'inherit' });
      execSync(`git push origin v${version}`, { stdio: 'inherit' });
      success('推送到GitHub完成');
      
      info('GitHub Release将通过GitHub Actions自动创建');
      info('构建产物将自动上传到Releases页面');
    } catch (err) {
      throw new Error(`推送失败: ${err.message}`);
    }
  }
}

// 运行发布脚本
if (require.main === module) {
  const releaseManager = new ReleaseManager();
  releaseManager.run();
}

module.exports = ReleaseManager; 