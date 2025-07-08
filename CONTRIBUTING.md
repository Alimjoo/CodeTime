# Contributing to CodeTime

Thank you for your interest in contributing to CodeTime! 🎉 We welcome contributions from everyone, whether you're fixing bugs, adding features, improving documentation, or helping with translations.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Translation Guidelines](#translation-guidelines)
- [Coding Standards](#coding-standards)
- [Recognition](#recognition)

## 📜 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Git](https://git-scm.com/)
- A GitHub account
- Basic knowledge of JavaScript, HTML, CSS
- Familiarity with Electron (helpful but not required)

### First Contribution

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/CodeTime.git
   cd CodeTime
   ```
3. **Create a branch** for your contribution:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** and commit them
5. **Push to your fork** and submit a pull request

## 🛠️ Development Setup

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run in development mode with hot reload
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Package for distribution
npm run dist
```

### Project Structure

```
CodeTime/
├── src/
│   ├── main.js           # Main Electron process
│   ├── renderer.js       # Renderer process
│   ├── index.html        # Main UI
│   └── styles.css        # Styles
├── .github/              # GitHub workflows and templates
├── favicon_io/           # App icons
├── version-config.json   # Version configuration
├── package.json          # Dependencies and scripts
└── README.md            # Project documentation
```

## 🎯 Contributing Guidelines

### Types of Contributions We Welcome

- 🐛 **Bug fixes**
- ✨ **New features**
- 📝 **Documentation improvements**
- 🌍 **Translations**
- 🎨 **UI/UX improvements**
- ⚡ **Performance optimizations**
- 🧪 **Tests**

### Before You Start

1. **Check existing issues** to see if your idea is already being discussed
2. **Open an issue** for new features before implementing them
3. **Start small** - smaller PRs are easier to review and merge
4. **Follow the coding standards** outlined below

## 📬 Pull Request Process

### Creating a Pull Request

1. **Ensure your code follows our standards**
2. **Add tests** for new functionality
3. **Update documentation** if needed
4. **Ensure all tests pass**
5. **Write a clear commit message**

### Pull Request Template

```markdown
## 📝 Description
Brief description of the changes

## 🔗 Related Issue
Fixes #(issue number)

## 🧪 Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] Cross-platform testing (if applicable)

## 📸 Screenshots
Add screenshots for UI changes

## ✅ Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

### Review Process

1. **Automated checks** must pass (CI/CD, linting, tests)
2. **Code review** by maintainers
3. **Testing** on different platforms if needed
4. **Approval** and merge

## 🐛 Issue Reporting

### Before Submitting an Issue

1. **Search existing issues** to avoid duplicates
2. **Update to the latest version** to see if the issue persists
3. **Gather system information** (OS, version, etc.)

### Creating Quality Issues

- **Use descriptive titles**
- **Provide detailed descriptions**
- **Include steps to reproduce**
- **Add screenshots/videos** if helpful
- **Specify your environment**

## 🌍 Translation Guidelines

### Supported Languages

- English (primary)
- 中文简体 (Chinese Simplified)
- More languages coming soon!

### Adding Translations

1. **Check the `i18n` object** in `src/renderer.js`
2. **Add your language code** (e.g., `'fr-FR'` for French)
3. **Translate all keys** following the existing structure
4. **Test your translations** in the application
5. **Submit a pull request**

### Translation Standards

- **Maintain consistency** with UI terminology
- **Keep translations concise** to fit UI elements
- **Use appropriate formality** for your language
- **Test on actual UI** to ensure proper display

Example:
```javascript
'fr-FR': {
    title: 'CodeTime',
    dailyGoal: 'Objectif Quotidien',
    incomeStats: 'Statistiques de Revenus',
    // ... other translations
}
```

## 📏 Coding Standards

### JavaScript Style

- **Use ES6+ features** where appropriate
- **Follow consistent naming conventions**:
  - `camelCase` for variables and functions
  - `PascalCase` for classes
  - `UPPER_CASE` for constants
- **Add comments** for complex logic
- **Use meaningful variable names**

### Code Formatting

```javascript
// Good
async function updateProjectsList() {
    if (appData.projects.length === 0) {
        elements.noProjects.style.display = 'block';
        return;
    }
    
    elements.noProjects.style.display = 'none';
    elements.projectsList.innerHTML = '';
    
    appData.projects.forEach(project => {
        const projectElement = createProjectElement(project);
        elements.projectsList.appendChild(projectElement);
    });
}
```

### Commit Message Guidelines

Use the conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
- `feat(ui): add dark theme support`
- `fix(tracking): resolve timer synchronization issue`
- `docs(readme): update installation instructions`

## 🏆 Recognition

### Contributors

All contributors will be:
- **Listed in our README**
- **Mentioned in release notes** for significant contributions
- **Invited to our Discord community** (coming soon)
- **Given appropriate GitHub labels** (contributor, translator, etc.)

### Types of Recognition

- 🥇 **Core Contributors**: Regular contributors with significant impact
- 🌍 **Translators**: Help make CodeTime accessible worldwide
- 🐛 **Bug Hunters**: Excel at finding and reporting issues
- 📝 **Documentation**: Improve guides and help content
- 🎨 **Designers**: Contribute to UI/UX improvements

## 📞 Getting Help

### Where to Ask Questions

- **GitHub Discussions** - General questions and ideas
- **GitHub Issues** - Bug reports and feature requests
- **Email** - support@walleyx.com for private matters

### Response Times

- **Bug reports**: 24-48 hours
- **Feature requests**: 3-5 days
- **Pull requests**: 2-7 days
- **General questions**: 1-3 days

## 📚 Resources

### Learning Resources

- [Electron Documentation](https://electronjs.org/docs)
- [Node.js Documentation](https://nodejs.org/docs)
- [JavaScript MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

### Development Tools

- **VS Code** with recommended extensions
- **GitHub Desktop** for Git GUI
- **Electron Fiddle** for quick prototyping

---

## 🎉 Thank You!

Thank you for taking the time to contribute to CodeTime! Every contribution, no matter how small, helps make this project better for developers worldwide.

**Happy coding!** 🚀

---

*This contributing guide is inspired by the best practices from successful open-source projects and is continuously updated based on community feedback.* 