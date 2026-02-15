# SKILL.md - Step 4.5 替换内容

## 替换位置：第 330-416 行

### 旧内容（删除）：
```
⚠️ **重要**：上面示例中的时长（75秒）仅是占位符。**不要使用硬编码值！** 应按照下面的 Step 4.5 计算正确的时长。

---

### Step 4.5: 配置动态时长（关键）

开场和教程场景的时长**必须匹配**你的实际视频长度。使用提供的脚本检测两个视频的时长：

```bash
# 获取两个视频的时长（推荐）
python scripts/get-video-duration.py \
  public/assets/host-video.mp4 \
  public/assets/screen-recording.mp4 \
  --remotion-config

# 输出示例：
# ==================================================
# Remotion 配置
# ==================================================
#
# // 在 TutorialVideo.tsx 中
# const OPENING_DURATION = 240; // 8.0秒 @ 30fps（来自 host-video.mp4）
# const BRAND_DURATION = 150; // 5秒 @ 30fps
# const TUTORIAL_DURATION = 1800; // 60.0秒 @ 30fps（来自 screen-recording.mp4）
# const SUBSCRIBE_DURATION = 150; // 5秒 @ 30fps
#
# // 在 Root.tsx 中
# durationInFrames=2340, // 78秒 @ 30fps
#
# // 场景分解：
# // 开场: 8.0秒（来自 host-video.mp4）
# // 品牌: 5.0秒（固定）
# // 教程: 60.0秒（来自 screen-recording.mp4）
# // 订阅: 5.0秒（固定）
# // 总计: 78.0秒
```

**在 TutorialVideo.tsx 中更新配置：**

... (省略详细代码)

**在 Root.tsx 中更新：**

... (省略详细代码)

**验证：**
配置后，在 Remotion Studio 预览中验证：
```bash
npm run dev
# 打开 http://localhost:3002
# 检查时间线显示正确的时长
```
```

### 新内容（替换为）：
```
---

### 🎉 自动时长计算

**✨ 无需手动计算时长！**

项目使用 Remotion 的 `calculateMetadata` 功能，会在启动时自动：
1. 加载 `host-video.mp4` 和 `screen-recording.mp4` 的元数据
2. 计算每个场景的时长
3. 输出总时长到控制台

**查看时长信息**：
启动项目后，打开浏览器控制台（按 F12），你会看到：
```
🎬 自动计算视频时长:
  开场: 14.7s (441 帧)
  品牌: 5.0s (150 帧)
  教程: 179.7s (5391 帧)
  订阅: 5.0s (150 帧)
  总计: 204.4s (6132 帧)
```

**更换视频时**：
- 直接替换 `public/assets/` 中的视频文件
- 刷新浏览器
- 时长会自动重新计算！

**容错处理**：
如果视频无法加载，会使用默认值：
- 开场视频：默认 5 秒
- 教程视频：默认 60 秒
- 总时长：默认 75 秒

**工作原理**：
- Remotion 在启动时调用 `calculateMetadata`
- 使用浏览器原生 API 加载视频元数据
- 并行加载两个视频，提高性能
- 计算结果通过 props 传递给组件

**验证**：
```bash
npm run dev
# 打开 http://localhost:3000
# 1. 打开浏览器控制台（F12）
# 2. 查看时长输出信息
# 3. 检查时间线显示的总帧数
```

---
```
