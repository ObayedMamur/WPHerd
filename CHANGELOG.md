# Changelog

All notable changes to WPHerd will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-28

### 🎉 First Official Release

This is the first stable release of WPHerd - a powerful desktop application for setting up WordPress installations with Laravel Herd using WP-CLI commands.

### ✨ Added
- **Smart Auto-Generation**: Enter site title and automatically generate folder name, site URL, and database name
- **Progress Bars**: Visual progress tracking (0-100%) during command execution
- **Terminal Output**: Real-time command execution display with authentic terminal styling
- **Step-by-Step Feedback**: See each command as it executes with detailed progress
- **Auto-Launch**: Automatically opens WordPress site in browser after successful installation
- **Tabbed Interface**: Clean Basic and Advanced configuration tabs
- **Real-time Updates**: Form changes reflect immediately in command preview (no save buttons needed)
- **Auto-Capitalization Prevention**: Technical fields stay lowercase for better UX
- **Debug Settings**: Enable WP_DEBUG options with live PHP code preview
- **Theme & Plugin Installation**: Install and activate themes/plugins during setup
- **Database Management**: Full control over database settings with sensible defaults
- **WordPress Version Selection**: Choose from latest or specific WordPress versions
- **Professional UI/UX**: Modern, responsive design with WordPress & Herd inspired styling

### 🛠️ Technical Features
- **Tauri v2**: Modern desktop app framework with Rust backend
- **React 18**: Latest React with Vite for fast development
- **Command Generation**: Intelligent WP-CLI command building
- **Database Creation**: Automatic MySQL database creation before WordPress installation
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Cross-Platform Icons**: Complete icon set for macOS, Windows, and Linux

### 📋 Requirements
- macOS (Apple Silicon or Intel)
- Laravel Herd installed and running
- WP-CLI installed
- MySQL/MariaDB running (via Herd)

### 🎯 Use Cases
- **Laravel Developers**: Quick WordPress setup alongside Laravel projects
- **WordPress Developers**: Rapid local development environment setup
- **Agencies**: Standardized WordPress installation process
- **Students**: Learning WordPress development with proper local setup

### 📦 Distribution
- **GitHub Releases**: Official distribution via GitHub
- **DMG Package**: Native macOS installer (3.35 MB)
- **Source Code**: Open source with MIT license

### 🔗 Links
- **Repository**: https://github.com/ObayedMamur/WPHerd
- **Issues**: https://github.com/ObayedMamur/WPHerd/issues
- **Author**: [Obayed Mamur](https://obayedmamur.com)

---

## Future Releases

### Planned Features
- [ ] Windows and Linux support
- [ ] Code signing for macOS
- [ ] Auto-updater functionality
- [ ] Custom theme/plugin repositories
- [ ] Backup and restore functionality
- [ ] Multi-site installation support
- [ ] Integration with popular WordPress tools

### Contributing
We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

---

**Made with ❤️ for the WordPress community**
