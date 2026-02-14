# SKILL.md 更新补丁

这个文件包含了需要应用到 SKILL.md 的关键改进。

---

## 补丁 1: 在 Step 0 之后添加版本说明（插入位置：第127行之后）

```markdown
---

### Step 0.1: Remotion 版本兼容性

**⚠️ 重要版本说明**：

由于 Remotion 生态系统的包版本存在不一致问题，**请使用 Remotion 4.0.421 版本**以确保兼容性。

**问题背景**：
- `remotion` 最新版本为 4.0.422
- 但 `@remotion/media-parser` 最新版本只有 4.0.421
- 这会导致依赖解析失败

**解决方案**：

**方案 A：在 package.json 中固定版本**（推荐）
```json
{
  "dependencies": {
    "@remotion/cli": "4.0.421",
    "@remotion/captions": "4.0.421",
    "remotion": "4.0.421"
  }
}
```

**方案 B：使用 skill 提供的 package.json 模板**
```bash
cp assets/templates/package.json <项目>/
cd <项目>
npm install
```

**验证版本**：
```bash
npm list remotion
# 应显示 remotion@4.0.421
```

**当前测试通过版本**：Remotion 4.0.421（2025-02-15）

---
```

---

## 补丁 2: 更新第3次询问（替换位置：第227-234行）

**原版本**：
```markdown
**第3次询问 - 品牌信息：**
```
3️⃣ 品牌信息
品牌中文名称（可选，不填则默认"久久AI记"）：
品牌英文名称（可选，不填则默认"JiuJiu AI Notes"）：
Logo图片路径（可选，不填则默认）：
背景音乐路径（可选，建议5秒，不填则默认）：
```
```

**改进版本**：
```markdown
**第3次询问 - 品牌信息：**
```
3️⃣ 品牌信息
品牌中文名称（可选，不填则默认"久久AI记"）：
品牌英文名称（可选，不填则默认"JiuJiu AI Notes"）：
Logo图片路径（可选，不填则使用 skill 默认示例 logo.jpg）：
画中画头像路径（可选，不填则使用 skill 默认示例 avatar.jpg）：
背景音乐路径（可选，建议5秒，不填则使用 skill 默认示例 music.mp3）：

💡 提示：skill 中提供了默认示例文件（assets/example/），如果你没有自己的素材，直接按回车即可使用默认示例。
```
```

---

## 补丁 3: 添加 Step 2.5（插入位置：第285行之后，Step 2 和 Step 4 之间）

```markdown
---

### Step 2.5: 准备默认素材（智能处理）

**Skill 默认示例文件位置**：
- Logo: `assets/example/logo.jpg`
- 画中画头像: `assets/example/avatar.jpg`
- 音乐: `assets/example/music.mp3`

**自动处理逻辑**：

1. **复制用户提供的素材**（如果提供）：
   ```bash
   # 示例：用户提供了自定义 Logo
   cp "/用户提供路径/logo.png" public/assets/custom-logo.png
   ```

2. **复制默认示例素材**（如果用户未提供）：
   ```bash
   # 如果用户未提供 Logo，复制默认示例
   cp assets/example/logo.jpg <项目>/public/assets/
   # 如果用户未提供头像，复制默认示例
   cp assets/example/avatar.jpg <项目>/public/assets/
   # 如果用户未提供音乐，复制默认示例
   cp assets/example/music.mp3 <项目>/public/assets/
   ```

3. **验证素材完整性**：
   ```bash
   ls -lh <项目>/public/assets/
   # 应包含：
   # - host-video.mp4（用户必需）
   # - screen-recording.mp4（用户必需）
   # - avatar.jpg（默认或用户自定义）
   # - logo.jpg（默认或用户自定义）
   # - music.mp3（默认或用户自定义）
   ```

**⚠️ 重要**：
- 默认示例文件总是会被复制到项目
- 用户自定义素材优先级更高（覆盖默认）
- Root.tsx 的 defaultProps 会引用这些文件

---
```

---

## 补丁 4: 更新 Step 4 的 Root.tsx 配置示例（替换位置：第300-330行附近）

**原版本**：
```tsx
<Composition
  component={TutorialVideo}
  durationInFrames={75 * 30}
  fps={30}
  height={1080}
  width={1920}
  id="TutorialVideo"
  defaultProps={{
    hostVideo: "/assets/host-video.mp4",
    screenRecording: "/assets/screen-recording.mp4",
    title: "用户标题",
    subtitle: "用户副标题",
    logo: "/assets/jiujiu-logo.jpg",
    music: "/assets/music.mp3",
  }}
/>
```

**改进版本**：
```tsx
<Composition
  component={TutorialVideo}
  durationInFrames={6132} // 根据实际视频时长计算
  fps={30}
  height={1080}
  width={1920}
  id="TutorialVideo"
  schema={tutorialVideoSchema}
  defaultProps={{
    hostVideoUrl: "assets/host-video.mp4",
    screenRecordingUrl: "assets/screen-recording.mp4",
    title: "用户提供的标题",
    subtitle: "用户提供的副标题",
    // 默认示例（如果用户未提供自定义素材）
    avatarImage: "assets/avatar.jpg", // 默认画中画头像
    logoImageUrl: "assets/logo.jpg",
    musicUrl: "assets/music.mp3",
    // 默认品牌名称
    brandNameCn: "久久AI记",
    brandNameEn: "JiuJiu AI Notes",
  }}
/>
```

---

## 补丁 5: 更新 Step 3 中创建新项目的说明（替换位置：第153-185行）

**在"如果选择创建新项目"部分添加**：

```markdown
**如果选择创建新项目**：

1. **引导用户创建 Remotion 项目**（或自动创建）：
   ```bash
   # 方法 A：使用官方模板
   npx create-video@latest <项目名称>
   cd <项目名称>
   # 选择 "Blank" 或 "Hello World" 模板

   # 方法 B：手动创建（更快，避免交互式问题）
   mkdir <项目名称> && cd <项目名称>
   # 创建 package.json（参考 assets/templates/package.json）
   # 使用固定版本：4.0.421
   ```

2. **安装依赖（使用固定版本）**：
   ```bash
   npm install
   # 确保 package.json 中使用：
   # "@remotion/cli": "4.0.421"
   # "@remotion/captions": "4.0.421"
   # "remotion": "4.0.421"
   ```

3. **复制缺失的配置文件**：
   ```bash
   # 从 skill 模板复制
   cp assets/remotion.config.ts .
   cp assets/postcss.config.mjs .
   cp assets/eslint.config.mjs .
   cp -r assets/templates/src/* src/
   ```

4. **生成所有组件文件**：
   ```bash
   # 从 assets/components/tutorial/ 复制所有组件
   cp assets/components/tutorial/*.tsx src/
   # 创建必需的 lib 文件
   mkdir -p src/lib
   # 创建 types.ts 和 transcript.ts
   ```

5. **配置 Root.tsx 注册组合**（参考补丁 4）

**⚠️ 版本兼容性**：
- 强烈建议使用 Remotion 4.0.421 版本
- 使用 `^4.0.0` 或 `latest` 可能导致依赖冲突
- 参考 Step 0.1 了解详情
```

---

## 应用说明

1. **备份原文件**：
   ```bash
   cp SKILL.md SKILL.md.backup
   ```

2. **按顺序应用补丁**：
   - 补丁 1：版本说明（最优先）
   - 补丁 2：第3次询问
   - 补丁 3：Step 2.5
   - 补丁 4：Root.tsx 配置
   - 补丁 5：Step 3 更新

3. **测试验证**：
   - 使用改进后的 skill 创建一个测试项目
   - 验证默认素材是否正确复制
   - 验证版本兼容性

4. **更新文档**：
   - 在 SKILL-IMPROVEMENTS.md 中标记已应用的改进
   - 记录任何额外的调整

---

## 改进效果

应用这些补丁后：

✅ **用户友好的询问** - 明确说明"不填则使用默认示例"
✅ **智能默认素材处理** - 自动复制默认示例到项目
✅ **一致的默认值** - Root.tsx 总是配置完整的 defaultProps
✅ **版本兼容性** - 明确使用 Remotion 4.0.421
✅ **灵活的覆盖机制** - 用户素材优先于默认示例
✅ **更清晰的文档** - 减少用户的困惑和错误

**核心原则**：让用户能够快速开始（使用默认示例），同时保留完全的自定义能力。
