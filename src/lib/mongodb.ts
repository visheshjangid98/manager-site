import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = 'mongodb+srv://drkvoid:drkvoid98280@mydicordbot.wsrhai6.mongodb.net/';
const DB_NAME = 'manager-wiki';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export interface WikiPage {
  _id?: string;
  id: string;
  title: string;
  content: string;
  order: number;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Category {
  _id?: string;
  id: string;
  name: string;
  order: number;
  createdAt?: Date;
}

export interface Announcement {
  _id?: string;
  id: string;
  text: string;
  icon: string;
  backgroundColor: string;
  enabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export async function getWikiPages(): Promise<WikiPage[]> {
  const { db } = await connectToDatabase();
  const pages = await db.collection<WikiPage>('pages')
    .find({})
    .sort({ order: 1 })
    .toArray();
  return pages;
}

export async function getWikiPage(id: string): Promise<WikiPage | null> {
  const { db } = await connectToDatabase();
  const page = await db.collection<WikiPage>('pages').findOne({ id });
  return page;
}

export async function createWikiPage(page: Omit<WikiPage, '_id' | 'createdAt' | 'updatedAt'>): Promise<WikiPage> {
  const { db } = await connectToDatabase();
  const newPage = {
    ...page,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await db.collection('pages').insertOne(newPage);
  return newPage as WikiPage;
}

export async function updateWikiPage(id: string, updates: Partial<WikiPage>): Promise<void> {
  const { db } = await connectToDatabase();
  await db.collection('pages').updateOne(
    { id },
    { $set: { ...updates, updatedAt: new Date() } }
  );
}

export async function deleteWikiPage(id: string): Promise<void> {
  const { db } = await connectToDatabase();
  await db.collection('pages').deleteOne({ id });
}

export async function getCategories(): Promise<Category[]> {
  const { db } = await connectToDatabase();
  const categories = await db.collection<Category>('categories')
    .find({})
    .sort({ order: 1 })
    .toArray();
  return categories;
}

export async function createCategory(category: Omit<Category, '_id' | 'createdAt'>): Promise<Category> {
  const { db } = await connectToDatabase();
  const newCategory = {
    ...category,
    createdAt: new Date(),
  };
  await db.collection('categories').insertOne(newCategory);
  return newCategory as Category;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<void> {
  const { db } = await connectToDatabase();
  await db.collection('categories').updateOne({ id }, { $set: updates });
}

export async function deleteCategory(id: string): Promise<void> {
  const { db } = await connectToDatabase();
  await db.collection('categories').deleteOne({ id });
}

export async function getAnnouncement(): Promise<Announcement | null> {
  const { db } = await connectToDatabase();
  const announcement = await db.collection<Announcement>('announcements')
    .findOne({ enabled: true });
  return announcement;
}

export async function updateAnnouncement(announcement: Omit<Announcement, '_id' | 'createdAt'>): Promise<void> {
  const { db } = await connectToDatabase();
  const existing = await db.collection('announcements').findOne({ id: announcement.id });

  if (existing) {
    await db.collection('announcements').updateOne(
      { id: announcement.id },
      { $set: { ...announcement, updatedAt: new Date() } }
    );
  } else {
    await db.collection('announcements').insertOne({
      ...announcement,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

export async function seedInitialData(): Promise<void> {
  const { db } = await connectToDatabase();

  const pageCount = await db.collection('pages').countDocuments();
  if (pageCount === 0) {
    const defaultPages: WikiPage[] = [
      {
        id: "getting-started",
        title: "Getting Started",
        category: "Introduction",
        order: 0,
        content: `# Getting Started with Manager

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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "installation",
        title: "Installation",
        category: "Introduction",
        order: 1,
        content: `# Installation Guide

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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "configuration",
        title: "Configuration",
        category: "Setup",
        order: 2,
        content: `# Configuration

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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "commands",
        title: "Commands",
        category: "Setup",
        order: 3,
        content: `# Commands Reference

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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "permissions",
        title: "Permissions",
        category: "Setup",
        order: 4,
        content: `# Permissions

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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "features",
        title: "Features Overview",
        category: "Advanced",
        order: 5,
        content: `# Features Overview

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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "api",
        title: "API Usage",
        category: "Advanced",
        order: 6,
        content: `# API Documentation

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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await db.collection('pages').insertMany(defaultPages);
  }

  const categoryCount = await db.collection('categories').countDocuments();
  if (categoryCount === 0) {
    const defaultCategories: Category[] = [
      { id: "introduction", name: "Introduction", order: 0, createdAt: new Date() },
      { id: "setup", name: "Setup", order: 1, createdAt: new Date() },
      { id: "advanced", name: "Advanced", order: 2, createdAt: new Date() },
    ];

    await db.collection('categories').insertMany(defaultCategories);
  }

  const announcementCount = await db.collection('announcements').countDocuments();
  if (announcementCount === 0) {
    const defaultAnnouncement: Announcement = {
      id: "main",
      text: "Welcome to Manager! Check out our new features in the latest update.",
      icon: "info",
      backgroundColor: "#3b82f6",
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('announcements').insertOne(defaultAnnouncement);
  }
}
