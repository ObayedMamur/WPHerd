# WPHerd 🚀

A powerful desktop application for setting up WordPress installations with Laravel Herd using WP-CLI commands. Built with Tauri, React, and modern web technologies.

![WPHerd Logo](https://img.shields.io/badge/WPHerd-WordPress%20Installer-blue?style=for-the-badge&logo=wordpress)

## ✨ Features

### 🎯 **Smart Auto-Generation**
- **Site Title → Everything**: Enter a site title and automatically generate:
  - Folder name (lowercase, hyphenated)
  - Site URL (`.test` domain)
  - Database name
- **Real-time Preview**: See generated values instantly as you type

### 🖥️ **Professional Command Execution**
- **Progress Bars**: Visual progress tracking (0-100%)
- **Terminal Output**: Real-time command execution display
- **Step-by-Step Feedback**: See each command as it executes
- **Auto-Launch**: Opens WordPress site automatically after installation

### 🛠️ **Advanced Configuration**
- **WordPress Version Selection**: Choose from latest or specific versions
- **Database Configuration**: Full control over database settings
- **Debug Settings**: Enable WP_DEBUG with live code preview
- **Theme & Plugin Installation**: Install and activate themes/plugins during setup

### 🎨 **Modern UI/UX**
- **Tabbed Interface**: Basic and Advanced configuration tabs
- **Real-time Updates**: No save buttons needed - everything updates live
- **Auto-Capitalization Prevention**: Technical fields stay lowercase
- **Responsive Design**: Clean, professional interface

## 🚀 Quick Start

### Prerequisites
- [Laravel Herd](https://herd.laravel.com/) installed and running
- [WP-CLI](https://wp-cli.org/) installed
- MySQL/MariaDB running (via Herd)

### Installation

1. **Download the latest release**
   ```bash
   # Download from GitHub Releases
   # Or build from source (see Development section)
   ```

2. **Run WPHerd.app**
   - Open the downloaded `.dmg` file
   - Drag WPHerd to Applications
   - Launch WPHerd

### Basic Usage

1. **Enter Site Details**
   - Site Title: "My Awesome Site"
   - Admin Username: "admin"
   - Admin Password: "secure_password"
   - Admin Email: "admin@example.com"

2. **Auto-Generated Values**
   - Folder: `my-awesome-site`
   - URL: `my-awesome-site.test`
   - Database: `my-awesome-site`

3. **Execute Installation**
   - Click "Execute Install Command"
   - Watch the progress bar and terminal output
   - Site opens automatically when complete!

## 🛠️ Development

### Tech Stack
- **Frontend**: React 18, Vite
- **Backend**: Tauri v2 (Rust)
- **Styling**: Custom CSS with modern design
- **Icons**: Custom WordPress & Herd inspired design

### Setup Development Environment

1. **Clone the repository**
   ```bash
   git clone https://github.com/ObayedMamur/WPHerd.git
   cd WPHerd
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run in development mode**
   ```bash
   npm run tauri dev
   ```

4. **Build for production**
   ```bash
   npm run tauri build
   ```

### Project Structure
```
WPHerd/
├── src/                    # React frontend
│   ├── App.jsx            # Main application component
│   ├── App.css            # Styling
│   └── main.jsx           # React entry point
├── src-tauri/             # Tauri backend
│   ├── src/               # Rust source code
│   ├── icons/             # App icons
│   └── tauri.conf.json    # Tauri configuration
├── public/                # Static assets
└── package.json           # Node.js dependencies
```

## 📋 Generated Commands

### Install Command Example
```bash
cd ~/Herd &&
mkdir my-awesome-site &&
cd my-awesome-site &&
wp core download --version=latest &&
mysql -uroot -hlocalhost -e "CREATE DATABASE IF NOT EXISTS my-awesome-site;" &&
wp config create --dbname=my-awesome-site --dbuser=root --dbhost=localhost &&
wp core install --url=my-awesome-site.test --title="My Awesome Site" --admin_user=admin --admin_password=secure_password --admin_email=admin@example.com
```

### Uninstall Command Example
```bash
cd ~/Herd/my-awesome-site &&
mysql -uroot -hlocalhost -e "DROP DATABASE IF EXISTS my-awesome-site;" &&
cd ~/Herd &&
rm -rf my-awesome-site
```

## 🎛️ Configuration Options

### Basic Tab
- **Site Title**: Main site name (drives auto-generation)
- **Admin Username**: WordPress admin username
- **Admin Password**: WordPress admin password
- **Admin Email**: WordPress admin email address
- **Installation Path**: Custom installation directory

### Advanced Tab
- **WordPress Version**: Choose specific WP version
- **Database Settings**: Host, name, user, password
- **Debug Options**: WP_DEBUG, WP_DEBUG_LOG, WP_DEBUG_DISPLAY
- **Theme Installation**: Install and activate themes
- **Plugin Management**: Install and activate plugins

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Obayed Mamur**
- Website: [obayedmamur.com](https://obayedmamur.com)
- GitHub: [@ObayedMamur](https://github.com/ObayedMamur)

## 🙏 Acknowledgments

- [Laravel Herd](https://herd.laravel.com/) - Local development environment
- [WP-CLI](https://wp-cli.org/) - WordPress command line interface
- [Tauri](https://tauri.app/) - Desktop app framework
- [React](https://reactjs.org/) - Frontend framework

---

**Made with ❤️ for the WordPress community**
