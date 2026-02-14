---
name: remotion-tutorial-video
description: This skill should be used when users want to create professional tutorial videos with talking avatars using Remotion. Converts prepared assets (host video, screen recording, logo, music) into polished tutorial videos with automatic subtitles, PIP overlay, and cinematic scenes. Ideal for educational content creators who need consistent video production workflows.
---

# Remotion 教程视频生成器

## ⚠️ 语言要求

**所有与用户的交互必须使用中文（简体中文）。**

此 skill 将原始视频素材转换为包含讲解头像、自动字幕和电影级场景过渡的专业教程视频。

## 功能说明

生成高质量教程视频，包含：
- **开场场景** - 主持人介绍（**动态时长**）
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

## 工作流程

**⚠️ 重要：正确的执行顺序！**

**执行顺序：**
1. **Step 0**: 验证环境
2. **Step 3**: 选择项目（新建或使用现有）← **必须先执行！**
   - **如果新建项目**：创建项目后立即生成所有组件文件（OpeningScene.tsx、ScreenRecording.tsx、VisualHammer.tsx、BilibiliSubscribe.tsx、TutorialVideo.tsx）和配置文件，不需要后续再复制
   - **如果选择现有项目**：验证项目有效性
3. **Step 1**: 收集信息和素材路径（引导填写，不弹选择框）
4. **Step 2**: 准备素材
5. **Step 4**: 集成组件（仅当选择现有项目且缺少组件时生成 tsx 文件）
6. **Step 5**: 生成字幕（可选）
7. **Step 6**: 音频标准化（可选）
8. **Step 7**: 预览和渲染

---

### Step 0: 验证环境（关键步骤）

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
- 对于 Python 包（faster-whisper、pydub），可以使用 `pip install` 命令安装
- 对于系统工具（Node.js、FFmpeg），需要从官网下载或使用包管理器安装

**如果检测失败**，请参阅 `references/installation-guide.md` 中的安装指南或：
- **Node.js**: 从 [nodejs.org](https://nodejs.org/) 下载（版本 18+）
- **FFmpeg**: 通过包管理器安装：
  - Windows: `choco install ffmpeg`
  - macOS: `brew install ffmpeg`
  - Linux: `sudo apt install ffmpeg`
- **Python 包**: `pip install faster-whisper pydub`

**安装依赖后重新运行检查：**
```bash
python scripts/check-environment.py --verbose
```

⚠️ **在所有检查通过之前不要继续！** 缺少依赖会导致后续步骤失败。

---

### Step 3: 选择项目方式（必须先执行此步骤！）

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
   - 适合已有 Remotion 项目

请输入选项（1 或 2）：
```

**如果选择创建新项目：**

1. 引导用户创建 Remotion 项目：
   ```bash
   npx create-video@latest <项目名称>
   cd <项目名称>
   ```

   在创建时选择 **"Prompt to Video"** 模板。

2. 检查并安装缺失依赖：
   ```bash
   # 对比 skill 提供的 package.json
   npm list framer-motion
   npm list @remotion/captions

   # 如果缺失，安装它们
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
3. 如果缺少组件，在 Step 4 中生成

---

### Step 1: 收集必需信息

开始之前，从用户处收集以下信息：

**素材文件路径（用户可以直接提供文件路径或上传文件）：**
- **真人开场视频**：文件路径（必需）
- **录制教程视频**：文件路径（必需）
- **Logo图片**：文件路径（可选）
- **背景音乐**：文件路径（可选，建议5秒）

**品牌信息（可选）：**
- **品牌中文名称**：品牌的中文名称（可选，不填则默认显示"久久AI记"）
- **品牌英文名称**：品牌的英文名称（可选，不填则默认显示"JiuJiu AI Notes"）

**询问用户时的示例问题（必须使用中文，分4次询问，引导填写，不弹选择框）：**

**第1次询问 - 素材文件路径：**
```
请提供以下信息：

1️⃣ 素材文件路径（MP4格式）
真人开场视频路径（必需）：
录制教程视频路径（必需）：
```

**第2次询问 - 标题信息：**
```
2️⃣ 标题信息
视频标题（可选）：
视频副标题（可选）：
```

**第3次询问 - 品牌信息：**
```
3️⃣ 品牌信息
品牌中文名称（可选，不填则默认"久久AI记"）：
品牌英文名称（可选，不填则默认"JiuJiu AI Notes"）：
Logo图片路径（可选，不填则默认）：
背景音乐路径（可选，建议5秒，不填则默认）：
```

**第4次询问 - 字幕生成：**
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

### Step 2: 素材准备

引导用户准备素材：

1. **真人开场视频** (`host-video.mp4`)
   - 录制你自己介绍主题的视频（5-10秒）
   - 确保良好的光线和清晰的声音
   - 导出为 H.264 MP4 格式
   - 推荐分辨率：1080x1920（竖屏）或 1920x1080（横屏）

2. **屏幕录制** (`screen-recording.mp4`)
   - 录制教程内容
   - 包含清晰的语音解说
   - 导出为 H.264 MP4 格式
   - 推荐分辨率：1920x1080

3. **品牌 Logo** (`jiujiu-logo.jpg` 或 `.png`)
   - 高质量 logo 图片
   - 透明 PNG 效果更好

4. **背景音乐** (`music.mp3`，可选)
   - 纯音乐或环境音乐
   - 确保与语音解说的音量平衡

5. **项目目录设置**
   - 创建新的 Remotion 项目或使用现有项目
   - 创建 `public/assets/` 目录
   - 将所有准备好的素材复制到 `public/assets/`

---

### Step 4: 组件集成

**仅当选择现有项目且缺少组件时执行此步骤。**

从 `assets/components/` 复制并集成以下组件：

1. **OpeningScene.tsx** - 带标题动画的主持人介绍
2. **ScreenRecording.tsx** - 带画中画头像和字幕的屏幕录制
3. **VisualHammer.tsx** - Logo 旋转品牌动画
4. **BilibiliSubscribe.tsx** - 号召行动场景
5. **TutorialVideo.tsx** - 编排所有场景的主组合

更新 `src/Root.tsx` 以注册组合：

```tsx
import { TutorialVideo } from './TutorialVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        component={TutorialVideo}
        durationInFrames={75 * 30} // 75秒 @ 30fps
        fps={30}
        height={1080}
        width={1920}
        id="TutorialVideo"
        defaultProps={{
          title: "用户标题",
          subtitle: "用户副标题",
          hostVideo: "/assets/host-video.mp4",
          screenRecording: "/assets/screen-recording.mp4",
          logo: "/assets/jiujiu-logo.jpg",
          music: "/assets/music.mp3",
        }}
      />
    </>
  );
};
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

```tsx
// 从 get-video-duration.py 输出获取这些值
const OPENING_DURATION = 240; // 8.0秒 @ 30fps（来自 host-video.mp4）
const BRAND_DURATION = 150; // 5秒 @ 30fps
const TUTORIAL_DURATION = 1800; // 60.0秒 @ 30fps（来自 screen-recording.mp4）
const SUBSCRIBE_DURATION = 150; // 5秒 @ 30fps

// 然后在序列中使用
<Seq from={0} duration={OPENING_DURATION}>
  <OpeningScene {...props} />
</Seq>

<Seq from={OPENING_DURATION} duration={BRAND_DURATION}>
  <VisualHammer {...props} />
</Seq>

<Seq from={OPENING_DURATION + BRAND_DURATION} duration={TUTORIAL_DURATION}>
  <ScreenRecording {...props} />
</Seq>

<Seq from={OPENING_DURATION + BRAND_DURATION + TUTORIAL_DURATION} duration={SUBSCRIBE_DURATION}>
  <BilibiliSubscribe {...props} />
</Seq>
```

**在 Root.tsx 中更新：**

```tsx
<Composition
  component={TutorialVideo}
  durationInFrames={240 + 150 + 1800 + 150} // 2340总帧数
  // 或：8秒 + 5秒 + 60秒 + 5秒 = 78秒
  fps={30}
  height={1080}
  width={1920}
  id="TutorialVideo"
  // ...defaultProps
/>
```

**验证：**
配置后，在 Remotion Studio 预览中验证：
```bash
npm run dev
# 打开 http://localhost:3002
# 检查时间线显示正确的时长
```

---

### Step 5: 字幕生成（自动）

使用提供的脚本从屏幕录制音频生成字幕：

```bash
# 在 scripts/ 目录
python generate-captions.py ../public/assets/screen-recording.mp4 --language zh

# 输出：../public/assets/captions.json
```

此脚本使用 faster-whisper 来：
- 从屏幕录制提取音频
- 生成准确的时间戳
- 创建带开始/结束时间的字幕片段
- 将繁体中文转换为简体中文（--language zh 时自动转换）
- 输出与 ScreenRecording 组件兼容的 JSON 格式

**语言支持：**
- `--language zh`：中文，繁体→简体转换（推荐）
- `--language zh-CN`：仅简体中文
- `--language zh-TW`：仅繁体中文
- `--language auto`：自动检测（可能输出繁体中文）
- `--no-convert`：禁用繁体→简体转换

**前置条件：**
```bash
# 安装 faster-whisper 用于语音识别
pip install faster-whisper

# 安装 OpenCC 用于中文转换（可选但推荐）
pip install opencc-python-reimplemented
```

**注意：** 如果脚本失败，确保 faster-whisper 已安装：
```bash
pip install faster-whisper
```

---

### Step 6: 音频标准化（可选）

标准化音频电平以获得一致的音量：

```bash
# 在 scripts/ 目录
python normalize-audio.py ../public/assets/screen-recording.mp4

# 创建音频的标准化版本
```

---

### Step 7: 预览和渲染

**在浏览器中预览：**
```bash
npm run dev
```

然后导航到 `http://localhost:3002` 并：
- 选择 "TutorialVideo" 组合
- 预览所有场景
- 验证时长、字幕和过渡
- 如需要调整默认 props

**渲染视频：**
```bash
# 渲染到默认输出
npx remotion render TutorialVideo out/tutorial-video.mp4

# 或使用 Remotion Studio UI 以自定义设置渲染
```

**替代方案：批量渲染**
```bash
npm run render -- --host assets/host-video.mp4 --screen assets/screen-recording.mp4
```

---

### Step 8: 质量检查

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
