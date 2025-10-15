import { ScrollArea } from "@/components/ui/scroll-area";
import MarkdownPreview from "./MarkdownPreview";

const pageContent: Record<string, string> = {
  "getting-started": `# Getting Started with Manager

Welcome to **Manager**, the ultimate multi-purpose Minecraft plugin!

## What is Manager?

Manager is a comprehensive plugin designed to [[streamline server development]] and make server management effortless. Whether you're running a small community server or a large network, Manager has the tools you need.

## Quick Start

To get started with Manager, follow these simple steps:

1. Download the plugin from our website
2. Place the JAR file in your \`\`plugins\`\` folder
3. Restart your server
4. Configure the plugin using \`\`/manager config\`\`

## Key Features

- **Easy Configuration**: Simple YAML-based configuration
- **Performance Optimized**: Minimal resource usage
- **Regular Updates**: Active development and support
- **Community Driven**: Join our [Discord](https://discord.gg/manager) for help

{{<Need Help?>
Join our Discord community for support and updates!
We're here to help you get the most out of Manager.
}}`,

  "installation": `# Installation Guide

## Requirements

Before installing Manager, ensure your server meets these requirements:

- [[Minecraft Server Version]]: 1.16.5 or higher
- [[Java Version]]: Java 16 or higher
- [[RAM]]: Minimum 2GB available

## Installation Steps

### Step 1: Download

Download the latest version of Manager from our official website.

### Step 2: Install

Place the downloaded \`\`Manager.jar\`\` file into your server's \`\`plugins\`\` folder.

### Step 3: Start Server

Start or restart your Minecraft server. The plugin will automatically generate configuration files.

### Step 4: Configure

Edit the configuration file located at:

\`\`'yaml'
plugins/Manager/config.yml
\`\`

{{<Important Note>
Always backup your server before installing new plugins!
}}`,

  "configuration": `# Configuration

## Main Configuration

The main configuration file is located at \`\`plugins/Manager/config.yml\`\`

## Basic Settings

\`\`'yaml'
# Manager Configuration
enable-features:
  auto-save: true
  performance-mode: false
  
database:
  type: sqlite
  host: localhost
  port: 3306
\`\`

## Feature Configuration

Each feature can be enabled or disabled independently:

- [[Auto-Save]]: Automatically saves player data
- [[Performance Mode]]: Optimizes for high-load servers
- [[Debug Mode]]: Enables detailed logging

{{<Pro Tip>
Enable debug mode if you encounter any issues - it helps with troubleshooting!
}}`,

  "commands": `# Commands Reference

## Basic Commands

All commands require the \`\`manager.use\`\` permission.

### Main Command

\`\`/manager\`\` - Opens the main menu

### Configuration Commands

- \`\`/manager reload\`\` - Reloads the configuration
- \`\`/manager config\`\` - Opens config editor
- \`\`/manager help\`\` - Shows help menu

## Admin Commands

These commands require [[admin permissions]]:

\`\`'java'
/manager admin reset
/manager admin backup
/manager admin stats
\`\`

{{<Command Usage>
Use \`\`/manager help [command]\`\` for detailed information about any command!
}}`,

  "permissions": `# Permissions

## Permission Nodes

### Basic Permissions

- \`\`manager.use\`\` - Access to basic commands
- \`\`manager.help\`\` - View help pages

### Admin Permissions

- [[manager.admin]] - Full administrative access
- [[manager.reload]] - Reload configuration
- [[manager.config]] - Edit configuration

## Setting Up Permissions

Example using LuckPerms:

\`\`'shell'
/lp group default permission set manager.use true
/lp group admin permission set manager.admin true
\`\`

{{<Best Practice>
Always use a permission plugin like LuckPerms for better control!
}}`,

  "features": `# Features Overview

Manager includes a comprehensive set of features:

## Core Features

### 1. Auto-Save System
Automatically saves player data at configurable intervals.

### 2. Performance Monitoring
[[Real-time performance metrics]] and optimization suggestions.

### 3. Backup Management
Automated backup system with customizable schedules.

## Advanced Features

\`\`'java'
// Example API usage
ManagerAPI.getBackupManager().createBackup();
\`\`

{{<Feature Highlight>
Performance monitoring includes TPS tracking, memory usage, and entity counts!
}}`,

  "api": `# API Documentation

## Getting Started with the API

Manager provides a comprehensive [API](https://github.com/manager/api) for developers.

## Basic Usage

\`\`'java'
// Get the Manager API instance
ManagerAPI api = Manager.getAPI();

// Access features
BackupManager backups = api.getBackupManager();
ConfigManager config = api.getConfigManager();
\`\`

## Events

Listen to Manager events:

\`\`'java'
@EventHandler
public void onManagerBackup(ManagerBackupEvent event) {
    // Handle backup event
    String backupName = event.getBackupName();
}
\`\`

{{<Developer Note>
The API is fully documented on our [GitHub Wiki](https://github.com/manager/wiki)
}}`,
};

interface WikiContentProps {
  pageId: string;
}

const WikiContent = ({ pageId }: WikiContentProps) => {
  const content = pageContent[pageId] || "# Page Not Found\n\nThis page doesn't exist yet.";

  return (
    <div className="flex-1 w-full overflow-hidden">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
          <MarkdownPreview content={content} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default WikiContent;
