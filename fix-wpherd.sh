#!/bin/bash

# WPHerd Security Fix Script
# This script removes the quarantine attribute that causes the "damaged" error

echo "🔧 WPHerd Security Fix"
echo "======================"
echo ""

# Check if WPHerd exists in Applications
if [ ! -d "/Applications/WPHerd.app" ]; then
    echo "❌ WPHerd.app not found in Applications folder"
    echo "Please install WPHerd first by dragging it to Applications"
    exit 1
fi

echo "✅ Found WPHerd.app in Applications"
echo ""

# Remove quarantine attribute
echo "🔓 Removing quarantine attribute..."
sudo xattr -rd com.apple.quarantine /Applications/WPHerd.app

if [ $? -eq 0 ]; then
    echo "✅ Successfully removed quarantine attribute"
    echo ""
    echo "🚀 WPHerd should now open normally!"
    echo "You can launch it from Applications or Spotlight"
else
    echo "❌ Failed to remove quarantine attribute"
    echo "Please try the manual method:"
    echo "1. Right-click WPHerd.app in Applications"
    echo "2. Select 'Open' from the menu"
    echo "3. Click 'Open' when prompted"
fi

echo ""
echo "📖 For more help, visit: https://github.com/ObayedMamur/WPHerd"
