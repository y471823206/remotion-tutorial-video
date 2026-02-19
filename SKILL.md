---
name: remotion-tutorial-video
description: This skill should be used when users want to create professional tutorial videos with talking avatars using Remotion. Converts prepared assets (host video, screen recording, logo, music) into polished tutorial videos with automatic subtitles, PIP overlay, and cinematic scenes. Ideal for educational content creators who need consistent video production workflows.
---

# Remotion 教程视频生成器

## ⚠️ 写给 AI 的话

**将此 SKILL.md 视为"执行脚本"而非"参考资料"**

### 执行原则
- ✅ **严格按阶段顺序执行** - 必须完成当前阶段的所有任务后才能进入下一阶段
- ✅ **不要跳过交互询问** - 即使用户已提供部分信息，仍需确认所有必要信息
- ✅ **明确询问，不要假设** - 不要推断用户偏好，必须明确询问

### 代码修改规则（⚠️ 极其重要）

**禁止随意修改模板代码！** 只修改以下位置：

**允许修改的位置：**
1. `Root.tsx` 中的 `defaultProps` - 仅修改用户提供的值（标题、品牌名等）
2. `public/assets/` 目录 - 复制/转换用户的素材文件

**禁止修改的位置：**
1. ❌ 所有组件文件（OpeningScene.tsx, ScreenRecording.tsx 等）- **完全从模板复制，一字不改**
2. ❌ `calculateMetadata` 函数 - **保持模板原样**
3. ❌ `staticFile()` 函数调用 - **不要移除或修改**
4. ❌ 组件的 import 语句和类型定义

**正确做法：**
- 组件文件：直接从 `assets/templates/` 复制，**一字不改**
- 配置文件：只修改 defaultProps 中的值（标题、品牌名、文件路径等）

**错误示例：**
```tsx
// ❌ 错误：去掉 staticFile()
<Img src={avatarImage} />

// ❌ 错误：添加默认值逻辑
<Img src={avatarImage || "assets/avatar.jpg"} />

// ✅ 正确：保持模板原样
<Img src={staticFile(avatarImage)} />
```

### 检查点机制
每个阶段开始前和结束后，确认：
- [ ] 前一阶段的所有任务已完成
- [ ] 用户提供了所有必需的信息
- [ ] 任何偏差都需要明确告知用户并确认
- [ ] 组件文件完全按模板复制，无任何修改

---

## ⚠️ 语言要求

**所有与用户的交互必须使用中文（简体中文）。**

此 skill 将原始视频素材转换为包含讲解头像、自动字幕和动画场景的专业教程视频。

## 功能说明

生成高质量教程视频，包含：
- **开场场景** - 真人开场视频（**动态时长**）
- **品牌场景** - Logo 动画展示（5秒）
- **教程场景** - 画中画头像 + 自动字幕（**动态时长**）
- **订阅场景** - 订阅号召（5秒）

开场和教程场景的时长**自动匹配**你的视频长度：
- 开场场景 = 你的 host-video.mp4 时长
- 教程场景 = 你的 screen-recording.mp4 时长
- 总时长 = 10秒（品牌 + 订阅）+ host_video_duration + screen_recording_duration

整个视频制作流程通过 Remotion 自动化完成，用户只需准备素材。

## 模板文件说明

**项目创建方式**：使用 Remotion 官方命令创建项目

```bash
npx create-video@latest <项目名称>
cd <项目名称>
```

**Skill 在 `assets/templates/` 目录中提供了完整的配置文件**（用于创建完整的教程视频项目）：

**根目录文件：**
- `package.json` - 参考文件，包含所有必需的依赖（用于检查缺失的依赖：`framer-motion`、`@remotion/captions` 等）
- `remotion.config.ts` - Remotion 配置（包含 Tailwind 支持，如果模板项目缺少则复制）
- `tsconfig.json` - TypeScript 配置（通常模板项目已有，无需复制）
- `postcss.config.mjs` - PostCSS 配置（Tailwind 必需，如果模板项目缺少则复制）
- `eslint.config.mjs` - ESLint 配置（如果模板项目缺少则复制）

**src 目录文件：**
- `src/index.css` - Tailwind CSS 导入（如果模板项目缺少则复制）
- `src/index.ts` - Remotion 入口文件（通常模板项目已有）
- `src/lib/constants.ts` - 常量定义（FPS、时长等，需要创建）

**工作流程：**
1. 使用 Remotion 官方模板创建项目（选择 "Prompt to Video" 模板）
2. 检查并安装缺失的依赖（主要是 `framer-motion` 和 `@remotion/captions`）
3. 从 skill 模板复制缺失的配置文件（如 `postcss.config.mjs`、`remotion.config.ts` 等）
4. 创建必要的目录和文件（如 `src/lib/constants.ts`）

详细信息参见 [`assets/templates/README.md`](assets/templates/README.md)

## 何时使用此 Skill

当用户请求以下内容时使用此 skill：
- "创建教程视频"
- "生成教程视频"
- "制作教程视频"
- "帮我做一个带字幕的教程视频"
- "Create a tutorial video with me in it"
- "Generate a talking head tutorial"
- "Make a professional video from my screen recording"
- "I have a video and want to add subtitles and production value"
- 转换"八格教程"（8-grid tutorials）为视频

## 🔄 工作流程（严格按顺序执行）

**⚠️ 必须按阶段顺序完成每个阶段的所有任务后，才能进入下一阶段。**

---

### 阶段 1: 前置准备

> **目标**: 验证环境并创建项目框架
> **进入条件**: 无
> **完成标志**: 项目已创建，所有组件文件已生成

#### 1.1 环境验证

在开始任何教程视频项目之前，**必须验证所有必需的依赖项是否已安装**。

**运行环境检查脚本：**
```bash
python scripts/check-environment.py
```

此脚本将验证：
- ✓ Node.js 18+ 已安装
- ✓ npm 可用
- ✓ FFmpeg 已安装并可访问
- ✓ Python 3.8+ 已安装
- ✓ faster-whisper 已安装（用于字幕生成）
- ✓ pydub 已安装（用于音频标准化）

**⚠️ 重要说明：**
- 此脚本**只检测**依赖项，**不会自动安装**
- 如果检测到缺少依赖，脚本会显示详细的安装指南
- 用户需要**手动安装**缺少的依赖项

**安装依赖后重新运行检查：**
```bash
python scripts/check-environment.py --verbose
```

⚠️ **在所有检查通过之前不要继续！** 缺少依赖会导致后续步骤失败。

#### 1.2 项目创建方式选择

在开始之前，需要确定是创建新项目还是使用现有项目。

**询问用户：**

```
请选择项目创建方式：

1️⃣ 创建新项目（推荐）
   - 使用 Remotion 官方模板创建
   - 自动生成所有组件和配置文件
   - 适合从零开始

2️⃣ 使用现有项目
   - 在现有 Remotion 项目中添加教程视频
   - 需要验证项目结构

请输入选项（1 或 2）：
```

**如果选择创建新项目：**

1. 引导用户创建 Remotion 项目：
   ```bash
   npx create-video@latest <项目名称>
   cd <项目名称>
   ```

2. 检查并安装缺失依赖：
   ```bash
   npm install framer-motion @remotion/captions
   ```

3. 从 `assets/templates/` 复制缺失的配置文件：
   - `postcss.config.mjs` → 项目根目录（如果缺少）
   - `src/index.css` → `src/` 目录（如果缺少）
   - `src/lib/constants.ts` → `src/lib/` 目录（创建）

4. **立即生成所有组件文件**：
   - OpeningScene.tsx
   - ScreenRecording.tsx
   - VisualHammer.tsx
   - BilibiliSubscribe.tsx
   - TutorialVideo.tsx

5. 配置 Root.tsx 注册组合

**如果选择使用现有项目：**

1. 验证项目是否为有效的 Remotion 项目
2. 检查项目结构
3. 如果缺少组件，在后续阶段中生成


### 阶段 2: 需求收集（分4次询问）

> **目标**: 收集所有必需的项目信息
> **进入条件**: 阶段 1 完成
> **完成标志**: 用户提供了所有信息（或选择使用默认值）
> **⚠️ 重要**: 必须分4次询问，不要一次性问完

#### 2.1 第1次询问 - 素材文件路径
```
请提供以下信息：

1️⃣ 素材文件路径（MP4格式）
真人开场视频路径（必需）：
录制教程视频路径（必需）：
```

#### 2.2 第2次询问 - 标题信息
```
2️⃣ 标题信息
视频标题（可选）：
视频副标题（可选）：
```

#### 2.3 第3次询问 - 品牌信息
```
3️⃣ 品牌信息
品牌中文名称（可选，不填则默认"久久AI记"）：
品牌英文名称（可选，不填则默认"JiuJiu AI Notes"）：
Logo图片路径（可选，不填则默认）：
背景音乐路径（可选，建议5秒，不填则默认）：
```

#### 2.4 第4次询问 - 字幕生成
```
4️⃣ 字幕生成
是否需要生成字幕？（1是/0否）：
```

**⚠️ 重要：询问方式要求**
- **分4次询问**：按照上述格式，依次询问素材文件路径、标题信息、品牌信息、字幕生成
- **可选项处理**：不填按回车表示无标题/使用默认值
- **素材文件路径**：只询问路径，用户会通过对话框提供路径，不要弹文件选择框
- **字幕生成**：使用数字选择（1是/0否），直接回车默认为否
- **所有询问必须使用中文（简体中文）**

**技术要求：**
- 所有视频必须是 H.264 编码以确保兼容性
- 真人开场视频建议为竖屏（9:16 宽高比）
- 屏幕录制应匹配目标输出分辨率（推荐 1920x1080）
- 音频文件应为 MP3 格式

---

### 阶段 3: 素材准备

> **目标**: 将用户提供的素材复制到项目
> **进入条件**: 阶段 2 完成（用户提供了素材路径）
> **完成标志**: 所有素材文件已复制到 public/assets/

#### 3.1 视频格式检测与转换（⚠️ 必须执行）

**浏览器只支持 H.264 编码的 MP4 视频！** 在复制素材前，必须检测并转换视频格式。

**检测视频编码：**
```bash
# 检测开场视频编码
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 "/path/to/host-video.mp4"

# 检测录屏视频编码
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 "/path/to/screen-recording.mp4"
```

**判断标准：**
- 如果输出是 `h264` 或 `264` → ✅ 格式正确，直接复制
- 如果输出是 `hevc`、`h265`、`mpeg4` 或其他 → ❌ 需要转换

**自动转换命令（如需要）：**
```bash
# 转换开场视频
ffmpeg -i "/path/to/original-video.mp4" \
  -c:v libx264 -preset fast -profile:v baseline -level 3.0 \
  -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart \
  public/assets/host-video.mp4 -y

# 转换录屏视频
ffmpeg -i "/path/to/original-recording.mov" \
  -c:v libx264 -preset fast -profile:v baseline -level 3.0 \
  -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart \
  public/assets/screen-recording.mp4 -y
```

**转换参数说明：**
- `-c:v libx264` - 使用 H.264 编码
- `-profile:v baseline` - 基线配置，最大兼容性
- `-pix_fmt yuv420p` - 标准像素格式
- `-movflags +faststart` - 优化网络播放
- `-preset fast` - 转换速度与质量的平衡

#### 3.2 复制素材文件

**操作步骤：**

1. **真人开场视频** (`host-video.mp4`)
   - 如果格式正确，直接复制
   - 如果格式不正确，先转换再复制
   - 推荐分辨率：1080x1920（竖屏）或 1920x1080（横屏）

2. **屏幕录制** (`screen-recording.mp4`)
   - 支持 `.mov`、`.mp4` 等格式
   - 如果是 MOV 或其他格式，需要转换为 MP4
   - 推荐分辨率：1920x1080

3. **复制默认资源**（如果用户未提供）
   - Logo: `skill/assets/example/logo.jpg`
   - Avatar: `skill/assets/example/avatar.jpg`
   - Music: `skill/assets/example/music.mp3`

4. **项目目录设置**
   - 创建 `public/assets/` 目录（如果不存在）
   - 将所有转换后的视频复制到 `public/assets/`
   - 将默认资源复制到 `public/assets/`

---


### 阶段 4: 项目配置

> **目标**: 配置项目并更新组件
> **进入条件**: 阶段 3 完成
> **完成标志**: Root.tsx 配置正确，组件已集成

#### 4.1 更新 Root.tsx

根据用户提供的信息更新 `src/Root.tsx`：

```tsx
defaultProps={{
  title: "用户提供的标题",
  subtitle: "用户提供的副标题",
  hostVideoUrl: "/assets/host-video.mp4",
  screenRecordingUrl: "/assets/screen-recording.mp4",
  logoImageUrl: "/assets/logo.png",
  musicUrl: "/assets/music.mp3",
}}
```

#### 4.2 计算视频时长

**总时长计算**：
- 开场场景 = host-video.mp4 的实际时长（帧数 = 时长秒数 × 30 fps）
- 品牌场景 = 5 秒（150 帧）
- 教程场景 = screen-recording.mp4 的实际时长（帧数 = 时长秒数 × 30 fps）
- 订阅场景 = 5 秒（150 帧）

更新 `durationInFrames` 为总帧数。

#### 4.3 验证组件

确保以下组件存在：
- OpeningScene.tsx
- ScreenRecording.tsx
- VisualHammer.tsx
- BilibiliSubscribe.tsx
- TutorialVideo.tsx

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

---

### 阶段 5: 后期处理（可选）

> **目标**: 生成字幕和音频处理
> **进入条件**: 阶段 4 完成
> **完成标志**: 字幕文件已生成（如果用户选择生成）

#### 5.1 生成字幕（如果用户选择）

使用提供的脚本从屏幕录制音频生成字幕：

```bash
python scripts/generate-captions.py public/assets/screen-recording.mp4 --language zh
```

输出：`public/assets/captions.json`

#### 5.2 音频标准化（可选）

标准化音频电平以获得一致的音量：

```bash
python scripts/normalize-audio.py public/assets/screen-recording.mp4
```

---

### 阶段 6: 预览渲染

> **目标**: 启动预览服务器并指导用户渲染
> **进入条件**: 阶段 5 完成（或跳过）
> **完成标志**: 服务器运行中，用户可以在浏览器中预览

#### 6.1 启动预览

**在浏览器中预览：**
```bash
npm start
```

然后导航到 `http://localhost:3001` 并：
- 选择 "TutorialVideo" 组合
- 预览所有场景
- 验证时长、字幕和过渡
- 如需要调整默认 props

#### 6.2 渲染视频

```bash
# 渲染到默认输出
npx remotion render TutorialVideo out/tutorial-video.mp4

# 或使用 Remotion Studio UI 以自定义设置渲染
```

#### 6.3 质量检查

渲染后，验证：
- 视频打开并流畅播放
- 音频清晰且平衡
- 字幕与语音同步
- 场景之间过渡流畅
- Logo 和品牌元素可见
- 主持人视频画中画位置正确

---

## 常见问题排查

### 常见问题

**问题**："视频无法播放或显示黑屏"
- **解决方案**：确保所有视频都是 H.264 编码。使用 HandBrake 或 FFmpeg 重新编码：
  ```bash
  ffmpeg -i input.mp4 -c:v libx264 -c:a aac output.mp4
  ```

**问题**："字幕不同步"
- **解决方案**：使用 `generate-captions.py` 重新生成字幕并验证 `captions.json` 中的时间戳

**问题**："音频太安静或太大声"
- **解决方案**：在音频轨道上运行 `normalize-audio.py`

**问题**："主持人视频画中画覆盖重要内容"
- **解决方案**：在 `ScreenRecording.tsx` 中调整画中画位置（默认：右下角）

**问题**："Remotion Studio 显示组合错误"
- **解决方案**：检查 `remotion.config.ts` 并确保所有 props 与组件期望匹配

---

## 高级定制

### 理解场景时长

视频由4个不同时长规则的场景组成：

```tsx
// 动态时长场景（必须匹配你的实际视频！）
const OPENING_DURATION = <来自 get-video-duration.py>;  // 例如：8秒主持人视频 = 240帧
const TUTORIAL_DURATION = <来自 get-video-duration.py>; // 例如：60秒屏幕录制 = 1800帧

// 固定时长场景（除非你想改，否则不要改）
const BRAND_DURATION = 5 * 30;      // 5秒 @ 30fps
const SUBSCRIBE_DURATION = 5 * 30;   // 5秒 @ 30fps

// 总时长计算
const TOTAL_DURATION = OPENING_DURATION + BRAND_DURATION +
                       TUTORIAL_DURATION + SUBSCRIBE_DURATION;
```

**重要**：始终运行 `get-video-duration.py host-video.mp4 screen-recording.mp4 --remotion-config` 来获取你特定视频的**两个**时长值。

### 添加更多场景

在 `TutorialVideo.tsx` 序列中插入其他场景：

```tsx
<Seq from={OPENING_DURATION + BRAND_DURATION} duration={NEW_SCENE_DURATION}>
  <NewScene {...props} />
</Seq>
```

### 自定义字幕样式

编辑 `ScreenRecording.tsx` 来更改：
- 字体大小、颜色和字体族
- 背景不透明度和颜色
- 位置和内边距
- 动画效果

### 品牌定制

在以下位置替换品牌：
- `VisualHammer.tsx` - Logo 动画样式
- `BilibiliSubscribe.tsx` - CTA 文本和颜色
- 各个组件中的配色方案

---

## 参考资料

详细信息参考：
- **安装和依赖**，参见 `references/installation-guide.md`
- **素材准备要求**，参见 `references/asset-preparation.md`
- **完整工作流示例**，参见 `references/workflow-examples.md`
- **环境验证**：`python scripts/check-environment.py`

---

## 注意事项

- Remotion 中的所有素材路径相对于 `public/` 目录
- 字幕生成需要 Python 和 faster-whisper
- 视频渲染是 CPU 密集型的；渲染期间关闭其他应用
- 对于较长的视频（>5分钟），考虑拆分为多个组合
- 完整渲染前测试预览以尽早发现问题

---

## 示例命令摘要

```bash
# 完整工作流
mkdir -p public/assets
cp /path/to/host-video.mp4 public/assets/
cp /path/to/screen-recording.mp4 public/assets/
cp /path/to/logo.jpg public/assets/
cp /path/to/music.mp3 public/assets/

# 关键：获取两个视频的时长
python scripts/get-video-duration.py \
  public/assets/host-video.mp4 \
  public/assets/screen-recording.mp4 \
  --remotion-config

# 生成字幕
python scripts/generate-captions.py public/assets/screen-recording.mp4

# 预览（验证时长正确）
npm run dev  # 打开 localhost:3002

# 渲染
npx remotion render TutorialVideo out/video.mp4
```

**注意**：`get-video-duration.py` 步骤至关重要 - 它告诉你开场和教程场景的准确帧数。

---

## 成功标准

成功的教程视频应该：
- 从头到尾流畅播放没有错误
- 有清晰、同步的字幕
- 在教程场景显示主持人头像画中画
- 在开场/品牌场景显示品牌 logo 和标题
- 在订阅场景包含清晰的号召行动
- 全程音频电平平衡
- **开场场景时长匹配你的 host-video.mp4 实际长度**
- **教程场景时长匹配你的 screen-recording.mp4 实际长度**
- 总时长 = 10秒（固定场景）+ host_video_duration + screen_recording_duration
