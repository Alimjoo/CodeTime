const { ipcRenderer } = require('electron');

// 国际化文本
const i18n = {
    'zh-CN': {
        title: 'CodeTime',
        dailyGoal: '每日目标',
        incomeStats: '收入统计',
        projectManagement: '项目管理',
        activeProjects: '进行中的项目',
        todayIncome: '今日收入',
        monthIncome: '本月收入',
        yearIncome: '今年收入',
        todayProgress: '今日进度',
        recordIncome: '记录收入',
        addProject: '添加项目',
        noProjects: '还没有项目，点击右上角添加新项目',
        settings: '设置',
        about: '关于',
        language: '语言',
        theme: '主题',
        currency: '货币符号',
        exportData: '导出数据',
        importData: '导入数据',
        checkUpdates: '检查更新',
        totalTime: '总时间',
        actualTime: '实际时间',
        projectName: '项目名称',
        amount: '金额',
        description: '描述',
        relatedProject: '关联项目',
        save: '保存',
        cancel: '取消',
        delete: '删除',
        confirm: '确定',
        close: '关闭',
        // 新增翻译
        goalDescription: '坚持每天达成目标，积少成多！',
        setDailyGoal: '设置每日目标',
        dailyGoalAmount: '每日目标金额 (元)',
        enterGoalAmount: '输入每日目标金额',
        addNewProject: '添加新项目',
        enterProjectName: '输入项目名称',
        incomeAmount: '收入金额 (元)',
        enterIncomeAmount: '输入收入金额',
        incomeDescription: '收入说明',
        incomeDescriptionPlaceholder: '例如：项目A尾款',
        selectProject: '选择项目（可选）',
        incomeRecords: '收入记录',
        clearRecords: '清空记录',
        projectDetails: '项目详情',
        noRecords: '暂无收入记录',
        dataManagement: '数据管理',
        interfaceSettings: '界面设置',
        appSettings: '应用设置',
        autoCheckUpdates: '自动检查更新',
        exportAsJSON: '导出为 JSON',
        exportAsCSV: '导出为 CSV',
        exportAsExcel: '导出为 Excel',
        glassmorphism: '玻璃态（默认）',
        darkTheme: '深色主题',
        lightTheme: '浅色主题',
        chineseSimplified: '中文简体',
        english: 'English',
        rmb: '人民币 (¥)',
        usd: '美元 ($)',
        // 错误和确认消息
        enterValidGoalAmount: '请输入有效的目标金额',
        enterProjectName: '请输入项目名称',
        projectNameExists: '项目名称已存在',
        enterValidIncomeAmount: '请输入有效的收入金额',
        enterIncomeDescription: '请输入收入说明',
        confirmDeleteRecord: '确定要删除这条收入记录吗？',
        confirmMergeData: '是否要与现有数据合并？点击"确定"合并，"取消"替换。',
        currentLatestVersion: '当前已是最新版本！\n版本: {version}',
        // 通知消息
        projectCompleted: '项目{projectName}已完成！总时间: {totalTime}, 实际时间: {actualTime}',
        incomeRecordAdded: '收入记录已添加：{currency}{amount}',
        projectDeleted: '项目{projectName}已删除',
        dataExportSuccess: '数据已成功导出到: {path}',
        dataImportMergeSuccess: '数据导入并智能合并成功！避免了重复数据。',
        dataImportSuccess: '数据导入成功！',
        exportFailed: '导出失败: {message}',
        importFailed: '导入失败: {message}',
        updateCheckFailed: '检查更新失败: {error}',
        checkingForUpdates: '正在检查更新...',
        releaseNotes: '更新说明',
        breakingUpdate: '重大更新',
        downloadNow: '是否现在下载？',
        unknownError: '未知错误',
        // 关于信息
        aboutContent: 'CodeTime v1.0.0\n一款针对程序员而做的时间和金钱规划助手\n\n开发: 上海万来云边科技服务有限公司\n网站: @WalleyX.com\n版权: © 2025 万来云边科技\n\n感谢程序员朋友们的支持！',
        // 更新检查
        updateAvailable: '发现新版本 {latestVersion}！\n当前版本: {currentVersion}',
        // 项目管理相关
        noProjectsMessage: '还没有项目，点击右上角添加新项目',
        activeProjectsTitle: '进行中的项目',
        // 设置相关
        interfaceSettings: '界面设置',
        dataManagement: '数据管理',
        appSettings: '应用设置',
        // 其他
        noRecordsMessage: '暂无收入记录',
        confirmOperation: '确认操作',
        confirmOperationMessage: '确定要执行此操作吗？',
        selectProjectOptional: '选择项目（可选）',
        confirmClearRecords: '确定要清空所有收入记录吗？此操作不可恢复！',
        workSessions: '工作会话',
        times: '次',
        createdTime: '创建时间',
        deleteProject: '删除项目',
        confirmDeleteProject: '确定要删除项目 "{projectName}" 吗？此操作不可恢复！'
    },
    'en-US': {
        title: 'CodeTime',
        dailyGoal: 'Daily Goal',
        incomeStats: 'Income Statistics',
        projectManagement: 'Project Management',
        activeProjects: 'Active Projects',
        todayIncome: 'Today Income',
        monthIncome: 'Month Income',
        yearIncome: 'Year Income',
        todayProgress: 'Today Progress',
        recordIncome: 'Record Income',
        addProject: 'Add Project',
        noProjects: 'No projects yet, click + to add new project',
        settings: 'Settings',
        about: 'About',
        language: 'Language',
        theme: 'Theme',
        currency: 'Currency',
        exportData: 'Export Data',
        importData: 'Import Data',
        checkUpdates: 'Check Updates',
        totalTime: 'Total Time',
        actualTime: 'Actual Time',
        projectName: 'Project Name',
        amount: 'Amount',
        description: 'Description',
        relatedProject: 'Related Project',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        confirm: 'Confirm',
        close: 'Close',
        // 新增翻译
        goalDescription: 'Achieve your daily goals consistently!',
        setDailyGoal: 'Set Daily Goal',
        dailyGoalAmount: 'Daily Goal Amount',
        enterGoalAmount: 'Enter daily goal amount',
        addNewProject: 'Add New Project',
        enterProjectName: 'Enter project name',
        incomeAmount: 'Income Amount',
        enterIncomeAmount: 'Enter income amount',
        incomeDescription: 'Income Description',
        incomeDescriptionPlaceholder: 'e.g., Project A final payment',
        selectProject: 'Select Project (Optional)',
        incomeRecords: 'Income Records',
        clearRecords: 'Clear Records',
        projectDetails: 'Project Details',
        noRecords: 'No income records yet',
        dataManagement: 'Data Management',
        interfaceSettings: 'Interface Settings',
        appSettings: 'App Settings',
        autoCheckUpdates: 'Auto Check Updates',
        exportAsJSON: 'Export as JSON',
        exportAsCSV: 'Export as CSV',
        exportAsExcel: 'Export as Excel',
        glassmorphism: 'Glassmorphism (Default)',
        darkTheme: 'Dark Theme',
        lightTheme: 'Light Theme',
        chineseSimplified: '中文简体',
        english: 'English',
        rmb: 'RMB (¥)',
        usd: 'USD ($)',
        // 错误和确认消息
        enterValidGoalAmount: 'Please enter a valid goal amount',
        enterProjectName: 'Please enter project name',
        projectNameExists: 'Project name already exists',
        enterValidIncomeAmount: 'Please enter a valid income amount',
        enterIncomeDescription: 'Please enter income description',
        confirmDeleteRecord: 'Are you sure you want to delete this income record?',
        confirmMergeData: 'Do you want to merge with existing data? Click "OK" to merge, "Cancel" to replace.',
        currentLatestVersion: 'You are already using the latest version!\nVersion: {version}',
        // 通知消息
        projectCompleted: 'Project {projectName} completed! Total time: {totalTime}, Actual time: {actualTime}',
        incomeRecordAdded: 'Income record added: {currency}{amount}',
        projectDeleted: 'Project {projectName} deleted',
        dataExportSuccess: 'Data exported successfully to: {path}',
        dataImportMergeSuccess: 'Data imported and merged successfully! Duplicates avoided.',
        dataImportSuccess: 'Data imported successfully!',
        exportFailed: 'Export failed: {message}',
        importFailed: 'Import failed: {message}',
        updateCheckFailed: 'Update check failed: {error}',
        checkingForUpdates: 'Checking for updates...',
        releaseNotes: 'Release Notes',
        breakingUpdate: 'Breaking Update',
        downloadNow: 'Download now?',
        unknownError: 'Unknown error',
        // 关于信息
        aboutContent: 'CodeTime v1.0.0\nA time and money planning assistant for programmers\n\nDeveloper: Shanghai Wanlai Yunbian Technology Service Co., Ltd.\nWebsite: @WalleyX.com\nCopyright: © 2025 Wanlai Yunbian Technology\n\nThank you for your support!',
        // 更新检查
        updateAvailable: 'New version {latestVersion} available!\nCurrent version: {currentVersion}',
        // 项目管理相关
        noProjectsMessage: 'No projects yet, click + to add new project',
        activeProjectsTitle: 'Active Projects',
        // 设置相关
        interfaceSettings: 'Interface Settings',
        dataManagement: 'Data Management',
        appSettings: 'App Settings',
        // 其他
        noRecordsMessage: 'No income records yet',
        confirmOperation: 'Confirm Operation',
        confirmOperationMessage: 'Are you sure you want to perform this operation?',
        selectProjectOptional: 'Select Project (Optional)',
        confirmClearRecords: 'Are you sure you want to clear all income records? This action cannot be undone!',
        workSessions: 'Work Sessions',
        times: 'times',
        createdTime: 'Created Time',
        deleteProject: 'Delete Project',
        confirmDeleteProject: 'Are you sure you want to delete project "{projectName}"? This action cannot be undone!'
    }
};

// 全局变量
let appData = {};
let timers = {}; // 存储各个项目的计时器
let currentProject = null; // 当前选中的项目
let currentLanguage = 'zh-CN';
let currentTheme = 'glassmorphism';
let currentCurrency = '¥';

// DOM 元素
const elements = {
    // 标题栏控制
    minimizeBtn: document.getElementById('minimize-btn'),
    closeBtn: document.getElementById('close-btn'),
    
    // 每日目标
    dailyGoalAmount: document.getElementById('daily-goal-amount'),
    editGoalBtn: document.getElementById('edit-goal-btn'),
    
    // 收入统计
    todayIncome: document.getElementById('today-income'),
    monthIncome: document.getElementById('month-income'),
    yearIncome: document.getElementById('year-income'),
    todayProgressText: document.getElementById('today-progress-text'),
    todayProgress: document.getElementById('today-progress'),
    viewRecordsBtn: document.getElementById('view-records-btn'),
    
    // 项目管理
    projectsList: document.getElementById('projects-list'),
    noProjects: document.getElementById('no-projects'),
    addProjectBtn: document.getElementById('add-project-btn'),
    addProjectQuickBtn: document.getElementById('add-project-quick-btn'),
    
    // 活跃项目
    activeProjectsCard: document.getElementById('active-projects-card'),
    activeProjectsList: document.getElementById('active-projects-list'),
    pauseAllBtn: document.getElementById('pause-all-btn'),
    
    // 快速操作
    addMoneyBtn: document.getElementById('add-money-btn'),
    
    // 编辑目标弹窗
    editGoalModal: document.getElementById('edit-goal-modal'),
    goalAmount: document.getElementById('goal-amount'),
    goalModalCloseBtn: document.getElementById('goal-modal-close-btn'),
    goalModalCancelBtn: document.getElementById('goal-modal-cancel-btn'),
    goalModalSaveBtn: document.getElementById('goal-modal-save-btn'),
    
    // 添加项目弹窗
    addProjectModal: document.getElementById('add-project-modal'),
    projectName: document.getElementById('project-name'),
    projectSuggestions: document.getElementById('project-suggestions'),
    projectModalCloseBtn: document.getElementById('project-modal-close-btn'),
    projectModalCancelBtn: document.getElementById('project-modal-cancel-btn'),
    projectModalSaveBtn: document.getElementById('project-modal-save-btn'),
    
    // 收入弹窗
    moneyModal: document.getElementById('money-modal'),
    moneyAmount: document.getElementById('money-amount'),
    moneyDescription: document.getElementById('money-description'),
    moneyProject: document.getElementById('money-project'),
    moneyModalCloseBtn: document.getElementById('money-modal-close-btn'),
    moneyModalCancelBtn: document.getElementById('money-modal-cancel-btn'),
    moneyModalSaveBtn: document.getElementById('money-modal-save-btn'),
    
    // 收入记录查看弹窗
    recordsModal: document.getElementById('records-modal'),
    recordsList: document.getElementById('records-list'),
    recordsModalCloseBtn: document.getElementById('records-modal-close-btn'),
    recordsModalCloseBtn2: document.getElementById('records-modal-close-btn2'),
    clearRecordsBtn: document.getElementById('clear-records-btn'),
    
    // 项目详情弹窗
    projectDetailModal: document.getElementById('project-detail-modal'),
    projectDetailTitle: document.getElementById('project-detail-title'),
    projectStats: document.getElementById('project-stats'),
    projectDetailCloseBtn: document.getElementById('project-detail-close-btn'),
    projectDetailCloseBtn2: document.getElementById('project-detail-close-btn2'),
    deleteProjectBtn: document.getElementById('delete-project-btn'),
    
    // 确认删除弹窗
    confirmModal: document.getElementById('confirm-modal'),
    confirmTitle: document.getElementById('confirm-title'),
    confirmMessage: document.getElementById('confirm-message'),
    confirmCancelBtn: document.getElementById('confirm-cancel-btn'),
    confirmOkBtn: document.getElementById('confirm-ok-btn'),
    
    // 设置和关于
    aboutBtn: document.getElementById('about-btn'),
    settingsBtn: document.getElementById('settings-btn'),
    settingsModal: document.getElementById('settings-modal'),
    settingsModalCloseBtn: document.getElementById('settings-modal-close-btn'),
    settingsModalCloseBtn2: document.getElementById('settings-modal-close-btn2'),
    languageSelect: document.getElementById('language-select'),
    themeSelect: document.getElementById('theme-select'),
    currencySelect: document.getElementById('currency-select'),
    autoCheckUpdates: document.getElementById('auto-check-updates'),
    exportJsonBtn: document.getElementById('export-json-btn'),
    exportCsvBtn: document.getElementById('export-csv-btn'),
    exportExcelBtn: document.getElementById('export-excel-btn'),
    importDataBtn: document.getElementById('import-data-btn'),
    checkUpdatesBtn: document.getElementById('check-updates-btn')
};

// 初始化应用
async function initApp() {
    try {
        appData = await ipcRenderer.invoke('load-data');
        
        // 初始化设置
        initializeSettings();
        
        updateUI();
        setupEventListeners();
        
        // 每秒更新一次UI（用于实时更新计时器）
        setInterval(updateUI, 1000);
        
        console.log('CodeTime initialization completed');
    } catch (error) {
        console.error('初始化失败:', error);
    }
}

// 更新UI显示
function updateUI() {
    updateIncomeStats();
    updateProjectsList();
    updateActiveProjects();
    updateProjectSelect();
}

// 计算收入统计
function calculateIncomeStats() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    let todayIncome = 0;
    let monthIncome = 0;
    let yearIncome = 0;
    
    appData.incomeRecords.forEach(record => {
        const recordDate = new Date(record.date);
        
        if (recordDate.toDateString() === today.toDateString()) {
            todayIncome += record.amount;
        }
        
        if (recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear) {
            monthIncome += record.amount;
        }
        
        if (recordDate.getFullYear() === currentYear) {
            yearIncome += record.amount;
        }
    });
    
    return { todayIncome, monthIncome, yearIncome };
}

// 更新收入统计显示
function updateIncomeStats() {
    const { todayIncome, monthIncome, yearIncome } = calculateIncomeStats();
    
    elements.dailyGoalAmount.textContent = `${currentCurrency}${appData.dailyGoal.toLocaleString()}`;
    elements.todayIncome.textContent = `${currentCurrency}${todayIncome.toLocaleString()}`;
    elements.monthIncome.textContent = `${currentCurrency}${monthIncome.toLocaleString()}`;
    elements.yearIncome.textContent = `${currentCurrency}${yearIncome.toLocaleString()}`;
    
    // 更新今日进度
    const todayProgress = appData.dailyGoal > 0 ? Math.min((todayIncome / appData.dailyGoal) * 100, 100) : 0;
    elements.todayProgressText.textContent = `${todayProgress.toFixed(1)}%`;
    elements.todayProgress.style.width = `${todayProgress}%`;
}

// 更新项目列表
function updateProjectsList() {
    if (appData.projects.length === 0) {
        elements.noProjects.style.display = 'block';
        // 移除其他动态生成的项目元素，但保留 no-projects 元素
        const dynamicElements = elements.projectsList.querySelectorAll('.project-item');
        dynamicElements.forEach(el => el.remove());
        return;
    }
    
    elements.noProjects.style.display = 'none';
    elements.projectsList.innerHTML = '';
    
    appData.projects.forEach(project => {
        const projectElement = createProjectElement(project);
        elements.projectsList.appendChild(projectElement);
    });
}

// 创建项目元素
function createProjectElement(project) {
    const div = document.createElement('div');
    div.className = 'project-item';
    if (project.isActive) {
        div.classList.add('active');
    }
    
    const totalTimeStr = formatTime(project.totalTime || 0);
    const actualTimeStr = formatTime(project.actualTime || 0);
    
    div.innerHTML = `
        <div class="project-info">
            <div class="project-name">${project.name}</div>
            <div class="project-stats">总时间: ${totalTimeStr} | 实际时间: ${actualTimeStr}</div>
        </div>
        <div class="project-controls">
            <button class="project-btn start-btn" onclick="startProject('${project.id}')" title="开始项目"></button>
            <button class="project-btn pause-btn" onclick="pauseProject('${project.id}')" title="暂停项目"></button>
            <button class="project-btn stop-btn" onclick="stopProject('${project.id}')" title="完成项目"></button>
        </div>
    `;
    
    // 点击项目名称查看详情
    div.querySelector('.project-info').addEventListener('click', () => {
        showProjectDetail(project);
    });
    
    return div;
}

// 更新活跃项目显示
function updateActiveProjects() {
    const activeProjects = appData.activeProjects || [];
    
    if (activeProjects.length === 0) {
        elements.activeProjectsCard.style.display = 'none';
        return;
    }
    
    elements.activeProjectsCard.style.display = 'block';
    elements.activeProjectsList.innerHTML = '';
    
    activeProjects.forEach(activeProject => {
        const project = appData.projects.find(p => p.id === activeProject.projectId);
        if (project) {
            const element = createActiveProjectElement(project, activeProject);
            elements.activeProjectsList.appendChild(element);
        }
    });
}

// 创建活跃项目元素
function createActiveProjectElement(project, activeProject) {
    const div = document.createElement('div');
    div.className = 'active-project-item';
    
    const currentTime = Date.now();
    const startTime = activeProject.startTime;
    const pausedTime = activeProject.pausedTime || 0;
    const runningTime = activeProject.isPaused ? 0 : currentTime - startTime - pausedTime;
    const totalRunningTime = (currentTime - startTime - pausedTime) / 1000;
    
    div.innerHTML = `
        <div class="active-project-info">
            <div class="active-project-name">${project.name}</div>
            <div class="active-project-time">
                运行时间: ${formatTime(Math.max(0, totalRunningTime))} 
                ${activeProject.isPaused ? '(已暂停)' : ''}
            </div>
        </div>
        <div class="active-project-controls">
            <button class="project-btn pause-btn" onclick="pauseProject('${project.id}')" title="暂停"></button>
            <button class="project-btn stop-btn" onclick="stopProject('${project.id}')" title="完成"></button>
        </div>
    `;
    
    return div;
}

// 格式化时间显示
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    } else {
        return `${secs}s`;
    }
}

// 开始项目
async function startProject(projectId) {
    const project = appData.projects.find(p => p.id === projectId);
    if (!project) return;
    
    // 检查项目是否已经在活跃列表中
    const existingActive = appData.activeProjects.find(ap => ap.projectId === projectId);
    if (existingActive) {
        // 如果暂停了，则恢复
        if (existingActive.isPaused) {
            existingActive.isPaused = false;
            existingActive.pauseStartTime = null;
        }
    } else {
        // 添加到活跃项目列表
        appData.activeProjects.push({
            projectId: projectId,
            startTime: Date.now(),
            isPaused: false,
            pausedTime: 0
        });
    }
    
    project.isActive = true;
    await saveData();
    updateUI();
}

// 暂停项目
async function pauseProject(projectId) {
    const activeProject = appData.activeProjects.find(ap => ap.projectId === projectId);
    if (!activeProject) return;
    
    if (activeProject.isPaused) {
        // 恢复项目
        const pauseDuration = Date.now() - activeProject.pauseStartTime;
        activeProject.pausedTime += pauseDuration;
        activeProject.isPaused = false;
        activeProject.pauseStartTime = null;
    } else {
        // 暂停项目
        activeProject.isPaused = true;
        activeProject.pauseStartTime = Date.now();
    }
    
    await saveData();
    updateUI();
}

// 停止项目
async function stopProject(projectId) {
    const project = appData.projects.find(p => p.id === projectId);
    const activeProject = appData.activeProjects.find(ap => ap.projectId === projectId);
    
    if (!project || !activeProject) return;
    
    // 计算总时间和实际时间
    const currentTime = Date.now();
    const totalTime = (currentTime - activeProject.startTime) / 1000;
    const actualTime = (currentTime - activeProject.startTime - activeProject.pausedTime) / 1000;
    
    // 更新项目数据
    project.totalTime = (project.totalTime || 0) + totalTime;
    project.actualTime = (project.actualTime || 0) + actualTime;
    project.isActive = false;
    
    // 记录工作会话
    if (!project.sessions) project.sessions = [];
    project.sessions.push({
        startTime: activeProject.startTime,
        endTime: currentTime,
        totalTime: totalTime,
        actualTime: actualTime,
        pausedTime: activeProject.pausedTime
    });
    
    // 从活跃项目列表中移除
    appData.activeProjects = appData.activeProjects.filter(ap => ap.projectId !== projectId);
    
    await saveData();
    updateUI();
    
            showNotification(t('projectCompleted', {
            projectName: `"${project.name}"`,
            totalTime: formatTime(totalTime),
            actualTime: formatTime(actualTime)
        }));
}

// 显示通知
function showNotification(message) {
    // 这里可以添加系统通知或应用内通知
    console.log('Notification:', message);
}

// 更新项目选择下拉框
function updateProjectSelect() {
    elements.moneyProject.innerHTML = `<option value="">${t('selectProjectOptional')}</option>`;
    appData.projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name;
        elements.moneyProject.appendChild(option);
    });
}

// 设置事件监听器
function setupEventListeners() {
    // 标题栏控制
    elements.minimizeBtn.addEventListener('click', () => {
        ipcRenderer.invoke('minimize-window');
    });
    
    elements.closeBtn.addEventListener('click', () => {
        ipcRenderer.invoke('close-window');
    });
    
    // 编辑目标
    elements.editGoalBtn.addEventListener('click', showEditGoalModal);
    elements.goalModalCloseBtn.addEventListener('click', hideEditGoalModal);
    elements.goalModalCancelBtn.addEventListener('click', hideEditGoalModal);
    elements.goalModalSaveBtn.addEventListener('click', saveGoal);
    
    // 添加项目
    elements.addProjectBtn.addEventListener('click', showAddProjectModal);
    elements.addProjectQuickBtn.addEventListener('click', showAddProjectModal);
    elements.projectModalCloseBtn.addEventListener('click', hideAddProjectModal);
    elements.projectModalCancelBtn.addEventListener('click', hideAddProjectModal);
    elements.projectModalSaveBtn.addEventListener('click', saveProject);
    
    // 项目名称输入智能提示
    elements.projectName.addEventListener('input', handleProjectNameInput);
    
    // 记录收入
    elements.addMoneyBtn.addEventListener('click', showMoneyModal);
    elements.moneyModalCloseBtn.addEventListener('click', hideMoneyModal);
    elements.moneyModalCancelBtn.addEventListener('click', hideMoneyModal);
    elements.moneyModalSaveBtn.addEventListener('click', saveMoneyRecord);
    
    // 查看收入记录
    elements.viewRecordsBtn.addEventListener('click', showRecordsModal);
    elements.recordsModalCloseBtn.addEventListener('click', hideRecordsModal);
    elements.recordsModalCloseBtn2.addEventListener('click', hideRecordsModal);
    elements.clearRecordsBtn.addEventListener('click', clearAllRecords);
    
    // 项目详情
    elements.projectDetailCloseBtn.addEventListener('click', hideProjectDetailModal);
    elements.projectDetailCloseBtn2.addEventListener('click', hideProjectDetailModal);
    elements.deleteProjectBtn.addEventListener('click', deleteCurrentProject);
    
    // 确认对话框
    elements.confirmCancelBtn.addEventListener('click', hideConfirmModal);
    elements.confirmOkBtn.addEventListener('click', confirmAction);
    
    // 暂停所有项目
    elements.pauseAllBtn.addEventListener('click', pauseAllProjects);
    
    // 设置和关于
    elements.aboutBtn.addEventListener('click', showAbout);
    elements.settingsBtn.addEventListener('click', showSettingsModal);
    elements.settingsModalCloseBtn.addEventListener('click', hideSettingsModal);
    elements.settingsModalCloseBtn2.addEventListener('click', hideSettingsModal);
    
    // 设置选项变化
    elements.languageSelect.addEventListener('change', (e) => {
        changeLanguage(e.target.value);
    });
    
    elements.themeSelect.addEventListener('change', (e) => {
        changeTheme(e.target.value);
    });
    
    elements.currencySelect.addEventListener('change', (e) => {
        changeCurrency(e.target.value);
    });
    
    elements.autoCheckUpdates.addEventListener('change', (e) => {
        appData.settings.autoCheckUpdates = e.target.checked;
        saveData();
    });
    
    // 数据管理
    elements.exportJsonBtn.addEventListener('click', () => exportData('json'));
    elements.exportCsvBtn.addEventListener('click', () => exportData('csv'));
    elements.exportExcelBtn.addEventListener('click', () => exportData('xlsx'));
    elements.importDataBtn.addEventListener('click', importData);
    elements.checkUpdatesBtn.addEventListener('click', checkForUpdates);
    
    // 点击模态框背景关闭
    [elements.editGoalModal, elements.addProjectModal, elements.moneyModal, elements.recordsModal, elements.projectDetailModal, elements.confirmModal, elements.settingsModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// 显示编辑目标弹窗
function showEditGoalModal() {
    elements.goalAmount.value = appData.dailyGoal;
    elements.editGoalModal.style.display = 'flex';
    elements.goalAmount.focus();
}

// 隐藏编辑目标弹窗
function hideEditGoalModal() {
    elements.editGoalModal.style.display = 'none';
}

// 保存目标
async function saveGoal() {
    const amount = parseFloat(elements.goalAmount.value);
    if (isNaN(amount) || amount <= 0) {
        alert(t('enterValidGoalAmount'));
        return;
    }
    
    appData.dailyGoal = amount;
    await saveData();
    updateUI();
    hideEditGoalModal();
}

// 显示添加项目弹窗
function showAddProjectModal() {
    elements.projectName.value = '';
    elements.projectSuggestions.innerHTML = '';
    elements.projectSuggestions.style.display = 'none';
    elements.addProjectModal.style.display = 'flex';
    elements.projectName.focus();
}

// 隐藏添加项目弹窗
function hideAddProjectModal() {
    elements.addProjectModal.style.display = 'none';
}

// 处理项目名称输入（智能提示）
function handleProjectNameInput() {
    const input = elements.projectName.value.trim();
    const suggestions = elements.projectSuggestions;
    
    if (input.length < 2) {
        suggestions.style.display = 'none';
        return;
    }
    
    // 从历史项目中获取建议
    const existingNames = appData.projects.map(p => p.name);
    const matches = existingNames.filter(name => 
        name.toLowerCase().includes(input.toLowerCase()) && name !== input
    );
    
    if (matches.length > 0) {
        suggestions.innerHTML = '';
        matches.forEach(match => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = match;
            item.addEventListener('click', () => {
                elements.projectName.value = match;
                suggestions.style.display = 'none';
            });
            suggestions.appendChild(item);
        });
        suggestions.style.display = 'block';
    } else {
        suggestions.style.display = 'none';
    }
}

// 保存项目
async function saveProject() {
    const name = elements.projectName.value.trim();
    if (!name) {
        alert(t('enterProjectName'));
        return;
    }
    
    // 检查是否已存在同名项目
    if (appData.projects.some(p => p.name === name)) {
        alert(t('projectNameExists'));
        return;
    }
    
    const project = {
        id: await ipcRenderer.invoke('generate-id'),
        name: name,
        createdAt: Date.now(),
        isActive: false,
        totalTime: 0,
        actualTime: 0,
        sessions: []
    };
    
    appData.projects.push(project);
    await saveData();
    updateUI();
    hideAddProjectModal();
}

// 显示收入记录弹窗
function showMoneyModal() {
    elements.moneyAmount.value = '';
    elements.moneyDescription.value = '';
    elements.moneyProject.value = '';
    elements.moneyModal.style.display = 'flex';
    elements.moneyAmount.focus();
}

// 隐藏收入记录弹窗
function hideMoneyModal() {
    elements.moneyModal.style.display = 'none';
}

// 保存收入记录
async function saveMoneyRecord() {
    const amount = parseFloat(elements.moneyAmount.value);
    const description = elements.moneyDescription.value.trim();
    const projectId = elements.moneyProject.value;
    
    if (isNaN(amount) || amount <= 0) {
        alert(t('enterValidIncomeAmount'));
        return;
    }
    
    if (!description) {
        alert(t('enterIncomeDescription'));
        return;
    }
    
    const record = {
        id: await ipcRenderer.invoke('generate-id'),
        amount: amount,
        description: description,
        projectId: projectId,
        projectName: projectId ? appData.projects.find(p => p.id === projectId)?.name : '',
        date: Date.now()
    };
    
    appData.incomeRecords.push(record);
    await saveData();
    updateUI();
    hideMoneyModal();
    
            showNotification(t('incomeRecordAdded', {
            currency: currentCurrency,
            amount: amount.toLocaleString()
        }));
}

// 显示收入记录列表
function showRecordsModal() {
    updateRecordsList();
    elements.recordsModal.style.display = 'flex';
}

// 隐藏收入记录列表
function hideRecordsModal() {
    elements.recordsModal.style.display = 'none';
}

// 更新收入记录列表
function updateRecordsList() {
    const recordsList = elements.recordsList;
    
    if (appData.incomeRecords.length === 0) {
        recordsList.innerHTML = `<div class="no-records">${t('noRecordsMessage')}</div>`;
        return;
    }
    
    recordsList.innerHTML = '';
    
    // 按日期降序排列
    const sortedRecords = [...appData.incomeRecords].sort((a, b) => b.date - a.date);
    
    sortedRecords.forEach(record => {
        const item = document.createElement('div');
        item.className = 'record-item';
        
        const date = new Date(record.date);
        const dateStr = date.toLocaleDateString('zh-CN');
        
        item.innerHTML = `
            <div class="record-info">
                <div class="record-description">${record.description}</div>
                <div class="record-date">${dateStr} ${record.projectName ? `- ${record.projectName}` : ''}</div>
            </div>
            <div class="record-amount">¥${record.amount.toLocaleString()}</div>
            <button class="record-delete" onclick="deleteRecord('${record.id}')" title="删除">×</button>
        `;
        
        recordsList.appendChild(item);
    });
}

// 删除收入记录
async function deleteRecord(recordId) {
    if (confirm(t('confirmDeleteRecord'))) {
        appData.incomeRecords = appData.incomeRecords.filter(r => r.id !== recordId);
        await saveData();
        updateUI();
        updateRecordsList();
    }
}

// 清空所有记录
function clearAllRecords() {
    showConfirmModal(t('clearRecords'), t('confirmClearRecords'), () => {
        appData.incomeRecords = [];
        saveData();
        updateUI();
        updateRecordsList();
    });
}

// 显示项目详情
function showProjectDetail(project) {
    currentProject = project;
    elements.projectDetailTitle.textContent = `${project.name} - ${t('projectDetails')}`;
    
    const totalTimeStr = formatTime(project.totalTime || 0);
    const actualTimeStr = formatTime(project.actualTime || 0);
    const sessionsCount = project.sessions ? project.sessions.length : 0;
    
    elements.projectStats.innerHTML = `
        <div class="stat-item">
            <div class="stat-label">${t('totalTime')}</div>
            <div class="stat-value">${totalTimeStr}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">${t('actualTime')}</div>
            <div class="stat-value">${actualTimeStr}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">${t('workSessions')}</div>
            <div class="stat-value">${sessionsCount} ${t('times')}</div>
        </div>
        <div class="stat-item">
            <div class="stat-label">${t('createdTime')}</div>
            <div class="stat-value">${new Date(project.createdAt).toLocaleDateString(currentLanguage === 'zh-CN' ? 'zh-CN' : 'en-US')}</div>
        </div>
    `;
    
    elements.projectDetailModal.style.display = 'flex';
}

// 隐藏项目详情
function hideProjectDetailModal() {
    elements.projectDetailModal.style.display = 'none';
    currentProject = null;
}

// 删除当前项目
function deleteCurrentProject() {
    if (!currentProject) return;
    
    showConfirmModal(t('deleteProject'), t('confirmDeleteProject', { projectName: currentProject.name }), async () => {
        // 从活跃项目中移除
        appData.activeProjects = appData.activeProjects.filter(ap => ap.projectId !== currentProject.id);
        
        // 从项目列表中移除
        appData.projects = appData.projects.filter(p => p.id !== currentProject.id);
        
        await saveData();
        updateUI();
        hideProjectDetailModal();
        
        showNotification(t('projectDeleted', {
            projectName: `"${currentProject.name}"`
        }));
    });
}

// 暂停所有项目
async function pauseAllProjects() {
    appData.activeProjects.forEach(activeProject => {
        if (!activeProject.isPaused) {
            activeProject.isPaused = true;
            activeProject.pauseStartTime = Date.now();
        }
    });
    
    await saveData();
    updateUI();
}

// 显示确认对话框
function showConfirmModal(title, message, callback) {
    elements.confirmTitle.textContent = title;
    elements.confirmMessage.textContent = message;
    elements.confirmModal.style.display = 'flex';
    
    // 存储回调函数
    elements.confirmModal.confirmCallback = callback;
}

// 隐藏确认对话框
function hideConfirmModal() {
    elements.confirmModal.style.display = 'none';
    elements.confirmModal.confirmCallback = null;
}

// 确认操作
function confirmAction() {
    if (elements.confirmModal.confirmCallback) {
        elements.confirmModal.confirmCallback();
    }
    hideConfirmModal();
}

// 保存数据
async function saveData() {
    try {
        await ipcRenderer.invoke('save-data', appData);
    } catch (error) {
        console.error('保存数据失败:', error);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initApp);

// 导出函数供HTML调用
window.startProject = startProject;
window.pauseProject = pauseProject;
window.stopProject = stopProject;
window.deleteRecord = deleteRecord;

// 国际化函数
function t(key, params = {}) {
    let text = i18n[currentLanguage] && i18n[currentLanguage][key] ? i18n[currentLanguage][key] : key;
    
    // 替换参数
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });
    
    return text;
}

// 更新界面语言
function updateLanguage() {
    document.title = t('title');
    
    // 更新所有带有 data-i18n 属性的元素
    const elementsWithI18n = document.querySelectorAll('[data-i18n]');
    elementsWithI18n.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key);
        
        // 特殊处理一些包含动态内容的元素
        if (key === 'todayProgress') {
            const progressSpan = element.querySelector('#today-progress-text');
            if (progressSpan) {
                element.innerHTML = `${translation}: <span id="today-progress-text">${progressSpan.textContent}</span>`;
            } else {
                element.textContent = translation;
            }
        } else {
            element.textContent = translation;
        }
    });
    
    // 更新应用标题
    const appTitle = document.querySelector('.app-title');
    if (appTitle) {
        appTitle.textContent = t('title');
    }
    
    // 更新按钮文本
    const recordIncomeBtn = document.querySelector('#add-money-btn');
    if (recordIncomeBtn) {
        recordIncomeBtn.textContent = t('recordIncome');
    }
    
    const addProjectBtn = document.querySelector('#add-project-quick-btn');
    if (addProjectBtn) {
        addProjectBtn.textContent = t('addProject');
    }
    
    // 更新模态框内容
    updateModalLanguage();
    
    // 更新货币符号显示
    updateCurrencyDisplay();
    
    // 更新动态内容
    updateDynamicContent();
    
    // 更新tooltips
    updateTooltips();
}

// 更新模态框语言
function updateModalLanguage() {
    // 目标设置模态框
    const goalModalTitle = document.querySelector('#edit-goal-modal .modal-header h3');
    if (goalModalTitle) goalModalTitle.textContent = t('setDailyGoal');
    
    const goalAmountLabel = document.querySelector('#edit-goal-modal label[for="goal-amount"]');
    if (goalAmountLabel) goalAmountLabel.textContent = t('dailyGoalAmount');
    
    const goalAmountInput = document.querySelector('#goal-amount');
    if (goalAmountInput) goalAmountInput.placeholder = t('enterGoalAmount');
    
    // 项目模态框
    const projectModalTitle = document.querySelector('#add-project-modal .modal-header h3');
    if (projectModalTitle) projectModalTitle.textContent = t('addNewProject');
    
    const projectNameLabel = document.querySelector('#add-project-modal label[for="project-name"]');
    if (projectNameLabel) projectNameLabel.textContent = t('projectName');
    
    const projectNameInput = document.querySelector('#project-name');
    if (projectNameInput) projectNameInput.placeholder = t('enterProjectName');
    
    // 收入模态框
    const moneyModalTitle = document.querySelector('#money-modal .modal-header h3');
    if (moneyModalTitle) moneyModalTitle.textContent = t('recordIncome');
    
    const moneyAmountLabel = document.querySelector('#money-modal label[for="money-amount"]');
    if (moneyAmountLabel) moneyAmountLabel.textContent = t('incomeAmount');
    
    const moneyAmountInput = document.querySelector('#money-amount');
    if (moneyAmountInput) moneyAmountInput.placeholder = t('enterIncomeAmount');
    
    const moneyDescLabel = document.querySelector('#money-modal label[for="money-description"]');
    if (moneyDescLabel) moneyDescLabel.textContent = t('incomeDescription');
    
    const moneyDescInput = document.querySelector('#money-description');
    if (moneyDescInput) moneyDescInput.placeholder = t('incomeDescriptionPlaceholder');
    
    const moneyProjectLabel = document.querySelector('#money-modal label[for="money-project"]');
    if (moneyProjectLabel) moneyProjectLabel.textContent = t('relatedProject');
    
    // 收入记录模态框
    const recordsModalTitle = document.querySelector('#records-modal .modal-header h3');
    if (recordsModalTitle) recordsModalTitle.textContent = t('incomeRecords');
    
    const clearRecordsBtn = document.querySelector('#clear-records-btn');
    if (clearRecordsBtn) clearRecordsBtn.textContent = t('clearRecords');
    
    // 项目详情模态框
    const projectDetailTitle = document.querySelector('#project-detail-title');
    if (projectDetailTitle) projectDetailTitle.textContent = t('projectDetails');
    
    // 设置模态框
    const settingsModalTitle = document.querySelector('#settings-modal .modal-header h3');
    if (settingsModalTitle) settingsModalTitle.textContent = t('settings');
    
    // 更新按钮文本
    const saveButtons = document.querySelectorAll('.save-btn');
    saveButtons.forEach(btn => {
        if (btn.textContent.includes('保存') || btn.textContent.includes('Save')) {
            btn.textContent = t('save');
        }
        if (btn.textContent.includes('添加') || btn.textContent.includes('Add')) {
            btn.textContent = t('addProject');
        }
    });
    
    const cancelButtons = document.querySelectorAll('.cancel-btn');
    cancelButtons.forEach(btn => {
        if (btn.textContent.includes('取消') || btn.textContent.includes('Cancel')) {
            btn.textContent = t('cancel');
        }
        if (btn.textContent.includes('关闭') || btn.textContent.includes('Close')) {
            btn.textContent = t('close');
        }
    });
    
    const deleteButtons = document.querySelectorAll('.danger-btn');
    deleteButtons.forEach(btn => {
        if (btn.textContent.includes('删除') || btn.textContent.includes('Delete')) {
            btn.textContent = t('delete');
        }
    });
    
    // 更新选择项目的选项
    const moneyProjectSelect = document.querySelector('#money-project');
    if (moneyProjectSelect) {
        const firstOption = moneyProjectSelect.querySelector('option[value=""]');
        if (firstOption) {
            firstOption.textContent = t('selectProjectOptional');
        }
    }
}

// 更新货币符号显示
function updateCurrencyDisplay() {
    const { todayIncome, monthIncome, yearIncome } = calculateIncomeStats();
    
    elements.dailyGoalAmount.textContent = `${currentCurrency}${appData.dailyGoal.toLocaleString()}`;
    elements.todayIncome.textContent = `${currentCurrency}${todayIncome.toLocaleString()}`;
    elements.monthIncome.textContent = `${currentCurrency}${monthIncome.toLocaleString()}`;
    elements.yearIncome.textContent = `${currentCurrency}${yearIncome.toLocaleString()}`;
}

// 更新动态内容
function updateDynamicContent() {
    // 更新项目列表
    updateProjectsList();
    
    // 更新收入记录列表
    if (elements.recordsModal.style.display === 'flex') {
        updateRecordsList();
    }
    
    // 更新活跃项目列表
    updateActiveProjects();
}

// 更新tooltips
function updateTooltips() {
    const elementsWithTooltip = document.querySelectorAll('[data-tooltip]');
    elementsWithTooltip.forEach(element => {
        const key = element.getAttribute('data-tooltip');
        const translation = t(key);
        element.setAttribute('title', translation);
    });
}

// 切换主题
function changeTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    // 保存设置
    appData.settings.theme = theme;
    saveData();
}

// 切换语言
function changeLanguage(language) {
    currentLanguage = language;
    document.documentElement.setAttribute('lang', language);
    
    // 保存设置
    appData.settings.language = language;
    saveData();
    
    // 更新界面
    updateLanguage();
}

// 切换货币
function changeCurrency(currency) {
    currentCurrency = currency;
    
    // 保存设置
    appData.settings.currency = currency;
    saveData();
    
    // 更新显示
    updateCurrencyDisplay();
}

// 显示设置弹窗
function showSettingsModal() {
    // 加载当前设置
    elements.languageSelect.value = currentLanguage;
    elements.themeSelect.value = currentTheme;
    elements.currencySelect.value = currentCurrency;
    elements.autoCheckUpdates.checked = appData.settings.autoCheckUpdates !== false;
    
    elements.settingsModal.style.display = 'flex';
}

// 隐藏设置弹窗
function hideSettingsModal() {
    elements.settingsModal.style.display = 'none';
}

// 显示关于对话框
async function showAbout() {
    try {
        const result = await ipcRenderer.invoke('show-about', currentLanguage || 'zh-CN');
        if (!result || !result.success) {
            console.error('显示关于对话框失败:', result?.error || 'Unknown error');
            // 如果IPC调用失败，显示简单的alert作为后备
            alert(t('aboutContent'));
        }
    } catch (error) {
        console.error('显示关于对话框失败:', error);
        // 如果IPC调用失败，显示简单的alert作为后备
        alert(t('aboutContent'));
    }
}

// 导出数据
async function exportData(format) {
    try {
        const result = await ipcRenderer.invoke('export-data', format, appData);
        if (result.success) {
            showNotification(t('dataExportSuccess', { path: result.path }));
        } else {
            alert(t('exportFailed', { message: result.message }));
        }
    } catch (error) {
        alert(t('exportFailed', { message: error.message }));
    }
}

// 导入数据
async function importData() {
    try {
        const result = await ipcRenderer.invoke('import-data');
        if (result.success) {
            if (result.merged) {
                // 数据已在后端智能合并
                appData = result.data;
                await saveData();
                
                // 更新设置
                if (appData.settings) {
                    currentLanguage = appData.settings.language || 'zh-CN';
                    currentTheme = appData.settings.theme || 'glassmorphism';
                    currentCurrency = appData.settings.currency || '¥';
                    
                    changeTheme(currentTheme);
                    changeLanguage(currentLanguage);
                    changeCurrency(currentCurrency);
                }
                
                updateUI();
                hideSettingsModal();
                showNotification(t('dataImportMergeSuccess'));
            } else {
                // 询问用户是否要合并数据
                const shouldMerge = confirm(t('confirmMergeData'));
                
                if (shouldMerge) {
                    // 合并数据
                    if (result.data.incomeRecords) {
                        appData.incomeRecords = [...appData.incomeRecords, ...result.data.incomeRecords];
                    }
                    if (result.data.projects) {
                        appData.projects = [...appData.projects, ...result.data.projects];
                    }
                } else {
                    // 替换数据
                    appData = { ...appData, ...result.data };
                }
                
                await saveData();
                updateUI();
                hideSettingsModal();
                showNotification(t('dataImportSuccess'));
            }
        } else {
            alert(t('importFailed', { message: result.message }));
        }
    } catch (error) {
        alert(t('importFailed', { message: error.message }));
    }
}

// 检查更新
async function checkForUpdates() {
    try {
        // 显示检查中的提示
        showNotification(t('checkingForUpdates'));
        
        const result = await ipcRenderer.invoke('check-updates');
        
        if (result.success && result.hasUpdate) {
            // 构建更新提示消息
            let updateMessage = t('updateAvailable', {
                latestVersion: result.latestVersion,
                currentVersion: result.currentVersion
            });
            
            if (result.releaseNotes) {
                updateMessage += '\n\n' + t('releaseNotes') + ':\n' + result.releaseNotes.substring(0, 200);
                if (result.releaseNotes.length > 200) {
                    updateMessage += '...';
                }
            }
            
            if (result.isBreaking) {
                updateMessage = '⚠️ ' + t('breakingUpdate') + '\n\n' + updateMessage;
            }
            
            if (confirm(updateMessage + '\n\n' + t('downloadNow'))) {
                // 打开下载页面
                require('electron').shell.openExternal(result.downloadUrl);
            }
        } else if (result.success && !result.hasUpdate) {
            // 当前已是最新版本
            alert(t('currentLatestVersion', { version: result.currentVersion }));
        } else {
            // 检查失败
            const errorMsg = result.error || t('unknownError');
            alert(t('updateCheckFailed', { error: errorMsg }));
        }
    } catch (error) {
        console.error('检查更新失败:', error);
        alert(t('updateCheckFailed', { error: error.message }));
    }
}

// 初始化设置
function initializeSettings() {
    if (appData.settings) {
        currentLanguage = appData.settings.language || 'zh-CN';
        currentTheme = appData.settings.theme || 'glassmorphism';
        currentCurrency = appData.settings.currency || '¥';
        
        // 应用设置
        changeTheme(currentTheme);
        changeLanguage(currentLanguage);
        changeCurrency(currentCurrency);
    }
}