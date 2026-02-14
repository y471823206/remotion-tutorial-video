# Remotion Tutorial Video

<div align="center">

![Remotion Tutorial Video](https://img.shields.io/badge/Remotion-Tutorial%20Video-blue?style=for-the-badge&logo=react)

[![Download](https://img.shields.io/badge/Download-latest-green?style=for-the-badge&logo=download)](https://github.com/y471823206/remotion-tutorial-video/releases/latest/download/remotion-tutorial-video.zip)
[![Version](https://img.shields.io/badge/version-v1.0.0-blue?style=for-the-badge)](https://github.com/y471823206/remotion-tutorial-video/releases/latest)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)

**专业的 Remotion 教程视频制作 Skill**

自动将视频素材转换为包含讲解头像、自动字幕和电影级场景过渡的专业教程视频

[功能特性](#-功能特性) • [快速开始](#-快速开始) • [系统要求](#-系统要求) • [文档](#-文档)

</div>

---

## ✨ 功能特性

### 🎬 四大场景
- **开场场景** - 主持人介绍（动态时长，自动匹配视频长度）
- **品牌场景** - Logo 动画展示（5秒）
- **教程场景** - 画中画头像 + 自动字幕（动态时长）
- **订阅场景** - 订阅号召（5秒）

### 🚀 核心功能
- ✅ **自动字幕生成** - 使用 faster-whisper 生成准确字幕
- ✅ **智能时长计算** - 自动匹配素材视频长度
- ✅ **默认素材支持** - 提供 Logo、头像、音乐默认示例
- ✅ **一键项目创建** - 完整的项目模板文件
- ✅ **版本兼容性保证** - 固定使用 Remotion 4.0.421

---

## 📥 下载

### 最新版本：v1.0.0 (405KB)

[![Download zip](https://custom-icon-badges.demolab.com/badge/Download-Remotion%20Tutorial%20Video-blue?style=for-the-badge&logo=download&logoColor=white)](https://github.com/y471823206/remotion-tutorial-video/releases/latest/download/remotion-tutorial-video.zip)

**下载方式**：
1. **直接下载** - 点击上方按钮
2. ** Releases 页面** - [查看所有版本](https://github.com/y471823206/remotion-tutorial-video/releases)
3. **命令行下载**：
   ```bash
   wget https://github.com/y471823206/remotion-tutorial-video/releases/latest/download/remotion-tutorial-video.zip
   ```

---

## 🚀 快速开始

### 安装

1. **下载并解压** `remotion-tutorial-video.zip`

2. **复制到 Claude skills 目录**：
   ```bash
   # 将解压后的文件夹复制到：
   C:\Users\Admin\.claude\skills\remotion-tutorial-video
   ```

3. **在 Claude Code 中使用**：
   ```
   /remotion-tutorial-video
   ```

### 创建第一个教程视频

```bash
# 1. 验证环境
python scripts/check-environment.py

# 2. 创建项目
mkdir my-tutorial && cd my-tutorial

# 3. 复制模板文件
cp /path/to/skill/assets/templates/package.json .
cp /path/to/skill/assets/templates/remotion.config.ts .

# 4. 创建源代码结构
mkdir -p src/lib
cp /path/to/skill/assets/templates/src/index.ts src/
cp /path/to/skill/assets/templates/src/lib/* src/lib/
cp /path/to/skill/assets/components/tutorial/*.tsx src/

# 5. 安装依赖
npm install

# 6. 启动开发服务器
npm run dev
```

---

## 📋 系统要求

### 必需依赖
- **Node.js** 18+
- **npm** 或 **yarn**
- **FFmpeg**（视频处理）
- **Python** 3.8+（字幕生成）

### Python 包
- **faster-whisper**（自动生成字幕）
- **pydub**（音频标准化）

### 验证环境
```bash
python scripts/check-environment.py
```

---

## 📚 文档

- **[主文档](SKILL.md)** - 完整的使用指南
- **[问题与解决方案](SKILL-PROBLEMS-AND-SOLUTIONS.md)** - 常见问题排查
- **[更新补丁](SKILL-UPDATE-PATCH.md)** - 版本更新说明

### 关键文件说明

| 文件 | 说明 |
|------|------|
| `SKILL.md` | 主文档，包含完整工作流程 |
| `assets/templates/` | 项目模板文件 |
| `assets/components/` | React 组件 |
| `assets/example/` | 默认素材示例 |
| `scripts/` | 工具脚本 |

---

## 🐛 已知问题

### v1.0.0 修复的问题

1. ✅ **根组件注册问题** - 提供 `registerRoot()` 模板
2. ✅ **依赖版本冲突** - 固定使用 Remotion 4.0.421
3. ✅ **缺失必需文件** - 添加 `lib/transcript.ts` 和 `lib/types.ts`
4. ✅ **配置文件问题** - 简化 `remotion.config.ts`

---

## 📂 项目结构

```
remotion-tutorial-video/
├── SKILL.md                          # 主文档
├── SKILL-PROBLEMS-AND-SOLUTIONS.md  # 问题与解决方案
├── SKILL-UPDATE-PATCH.md             # 更新补丁
├── assets/
│   ├── components/tutorial/          # React 组件
│   ├── templates/                    # 项目模板
│   │   ├── src/
│   │   │   ├── index.ts             # ✅ 正确的入口文件
│   │   │   └── lib/
│   │   │       ├── transcript.ts     # ✅ 字幕加载
│   │   │       └── types.ts         # ✅ 类型定义
│   │   ├── package.json             # ✅ 固定版本 4.0.421
│   │   └── remotion.config.ts       # ✅ 简化配置
│   └── example/                      # 默认素材
│       ├── avatar.jpg
│       ├── logo.jpg
│       └── music.mp3
├── scripts/                          # 工具脚本
│   ├── check-environment.py
│   ├── generate-captions.py
│   ├── get-video-duration.py
│   └── normalize-audio.py
└── references/                       # 参考文档
```

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

MIT License

---

## 🔗 仓库地址

**GitHub**: https://github.com/y471823206/remotion-tutorial-video

---

<div align="center">

**使用 Remotion 和 faster-whisper 构建**

Made with ❤️ by [Claude Sonnet](https://claude.ai)

</div>
