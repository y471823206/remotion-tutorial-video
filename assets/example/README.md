# 示例素材文件

本目录包含教程视频的示例素材文件，用于演示和测试。

## 文件说明

### 🎵 音乐文件
**文件**: `music.mp3`
**用途**: 品牌场景背景音乐（前5秒）
**格式**: MP3
**时长**: 建议10-30秒，轻快不抢节奏
**音量**: 已标准化，适合作为背景音乐

### 🖼️ Logo文件
**文件**: `logo.jpg`
**用途**: 品牌场景展示
**格式**: JPG或PNG（推荐PNG透明背景）
**尺寸**: 建议800×800px或更大
**说明**: 你的品牌logo图片

### 👤 头像文件
**文件**: `avatar.jpg`
**用途**: 屏幕录制场景的画中画头像
**格式**: JPG或PNG
**尺寸**: 建议800×800px或更大
**说明**: 你的个人照片或头像图片

---

## 使用方式

### 在新项目中
如果你没有任何素材文件，skill会使用这些示例文件：

```bash
npm run dev
# 打开 http://localhost:3001
# TutorialVideo 组件会自动使用这些示例文件
```

### 替换示例
你可以用自己的素材文件替换这些示例文件：

```bash
# 将你的素材文件复制到 public/assets/ 目录
cp your-music.mp3 public/assets/music.mp3
cp your-logo.jpg public/assets/logo.jpg
cp your-avatar.jpg public/assets/avatar.jpg

# 然后重新运行Remotion Studio
npm run dev
```

**注意**:
- 示例文件仅用于演示，请替换为你自己的素材
- 建议文件名保持一致：`music.mp3`, `logo.jpg`, `avatar.jpg`
