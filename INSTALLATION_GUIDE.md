# 📥 WPHerd Installation Guide

## 🚀 Quick Installation

### Step 1: Download
Download `WPHerd_1.0.0_aarch64.dmg` from the [latest release](https://github.com/ObayedMamur/WPHerd/releases/latest).

### Step 2: Install
1. Open the downloaded DMG file
2. Drag WPHerd to the Applications folder
3. Eject the DMG

### Step 3: First Launch
⚠️ **Important**: Since WPHerd isn't code-signed yet, macOS will show a security warning.

#### Option A: Right-Click Method (Recommended)
1. Go to Applications folder
2. **Right-click** on WPHerd.app
3. Select **"Open"** from the menu
4. Click **"Open"** when prompted about unidentified developer
5. WPHerd will launch and work normally from now on

#### Option B: Terminal Method
```bash
# Remove quarantine attribute
sudo xattr -rd com.apple.quarantine /Applications/WPHerd.app
```

#### Option C: System Preferences
1. Try to open WPHerd normally (it will fail)
2. Go to **System Preferences** → **Security & Privacy**
3. Click **"Open Anyway"** next to the WPHerd message
4. Enter your password when prompted

## 🔒 Why This Happens

This security warning appears because:
- WPHerd isn't code-signed with an Apple Developer certificate
- macOS protects users from potentially harmful software
- This is normal for open-source apps distributed outside the App Store

## ✅ Is WPHerd Safe?

**Yes, absolutely!** WPHerd is:
- ✅ **Open Source**: All code is visible on GitHub
- ✅ **No Network Access**: Only runs local commands
- ✅ **No Data Collection**: Doesn't send any data anywhere
- ✅ **Community Verified**: Built with trusted technologies (Tauri + React)

## 🛡️ Future Updates

We're working on:
- **Code Signing**: Apple Developer certificate for seamless installation
- **Notarization**: Apple's security verification process
- **Auto-Updates**: Built-in update mechanism

## 🆘 Need Help?

If you encounter any issues:
1. [Create an issue](https://github.com/ObayedMamur/WPHerd/issues/new) on GitHub
2. Include your macOS version and error details
3. We'll help you get WPHerd running!

---

**Made with ❤️ for the WordPress community**
