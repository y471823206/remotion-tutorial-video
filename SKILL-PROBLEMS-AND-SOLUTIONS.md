# Skill 问题总结与解决方案

本文档记录了在实际使用 skill 创建 Remotion 教程视频项目时遇到的所有问题，以及如何通过优化 skill 来避免这些问题。

---

## 📋 问题清单

### 1. 根组件注册问题 ⭐️ 严重

**问题描述**：
浏览器显示错误：`Waiting for registerRoot() to get called`

**根本原因**：
- `src/index.ts` 使用了错误的导出方式
- Remotion 4.x 需要调用 `registerRoot()` 而不是直接导出

**错误代码**：
```tsx
// ❌ 错误
import { Composition } from "remotion";
import { RemotionRoot } from "./Root";
export { RemotionRoot };
```

**正确代码**：
```tsx
// ✅ 正确
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";
registerRoot(RemotionRoot);
```

**影响**：
- 导致浏览器无法加载预览
- 用户无法查看视频

**解决方案**：
- 在 skill 的 `assets/templates/src/index.ts` 中提供正确的模板
- 在 SKILL.md 的 Step 3（创建新项目）中明确说明需要使用 `registerRoot()`

---

### 2. 依赖版本兼容性问题 ⭐️ 严重

**问题描述**：
```
Error: Cannot find module '@remotion/media-parser@4.0.422'
```

**根本原因**：
- `remotion` 包的最新版本是 4.0.422
- 但 `@remotion/media-parser` 的最新版本只有 4.0.421
- 使用 `^4.0.0` 或 `latest` 会导致版本不匹配

**错误配置**：
```json
{
  "dependencies": {
    "@remotion/cli": "^4.0.0",
    "remotion": "^4.0.0"
  }
}
```

**正确配置**：
```json
{
  "dependencies": {
    "@remotion/cli": "4.0.421",
    "@remotion/captions": "4.0.421",
    "remotion": "4.0.421"
  }
}
```

**影响**：
- npm install 失败
- 无法安装依赖

**解决方案**：
- 在 SKILL.md 中添加 Step 0.1：版本兼容性说明
- 提供固定的 package.json 模板（使用 4.0.421）
- 明确说明不要使用 `^` 符号或 `latest`

---

### 3. 缺失必需文件问题 ⭐️ 严重

**问题描述**：
```
Error: Can't resolve './lib/transcript'
Error: Can't resolve './lib/types'
```

**根本原因**：
- 组件 `ScreenRecording.tsx` 依赖 `lib/transcript.ts` 和 `lib/types.ts`
- 但 skill 没有提供这些文件的模板
- 组件导入路径不正确（使用了 `../../lib/transcript` 而不是 `./lib/transcript`）

**缺失的文件**：
- `src/lib/transcript.ts` - 字幕加载函数
- `src/lib/types.ts` - TypeScript 类型定义

**解决方案**：
- 在 skill 的 `assets/components/` 或 `assets/templates/src/lib/` 中提供这些文件
- 确保组件使用正确的导入路径（`./lib/transcript`）
- 在 SKILL.md 的 Step 3 中列出所有需要创建的文件

---

### 4. 配置文件问题 ⭐️ 中等

**问题描述**：
```
Error: Cannot find module '@remotion/tailwind-v4'
```

**根本原因**：
- `remotion.config.ts` 中配置了 Tailwind 支持
- 但没有安装 `@remotion/tailwind-v4` 包
- 或者项目根本不需要 Tailwind

**错误配置**：
```typescript
import { enableTailwind } from '@remotion/tailwind-v4';
Config.overrideWebpackConfig(enableTailwind);
```

**解决方案**：
- 提供简化版的 `remotion.config.ts`（不包含 Tailwind）
- 或者明确说明如果需要 Tailwind，必须安装对应的包

---

### 5. 组件导入路径问题 ⭐️ 中等

**问题描述**：
```
Error: Can't resolve './tutorial/OpeningScene'
Error: Can't resolve '../../lib/transcript'
```

**根本原因**：
- 组件文件直接在 `src/` 目录，但导入路径使用了 `./tutorial/`
- 或者路径层级不正确

**解决方案**：
- 确保导入路径与实际文件结构匹配
- 提供清晰的项目结构说明

---

## 🔧 完整解决方案

### 方案 1: 更新 skill 模板文件

**需要创建/更新的文件**：

1. **`assets/templates/src/index.ts`**（根组件注册模板）
```tsx
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

registerRoot(RemotionRoot);
```

2. **`assets/templates/src/lib/transcript.ts`**（字幕加载）
```typescript
import { staticFile } from "remotion";
import type { TranscriptionResult } from "./types";

export async function loadCaptions(
  filePath: string
): Promise<TranscriptionResult[]> {
  try {
    const response = await fetch(staticFile(filePath));
    if (!response.ok) {
      throw new Error(`Failed to load captions: ${response.statusText}`);
    }
    const data = await response.json();

    // 支持两种格式
    if (Array.isArray(data)) {
      return data;
    } else if (data.captions && Array.isArray(data.captions)) {
      return data.captions;
    } else {
      console.warn("Unexpected captions format:", data);
      return [];
    }
  } catch (error) {
    console.error("Error loading captions:", error);
    return [];
  }
}
```

3. **`assets/templates/src/lib/types.ts`**（类型定义）
```typescript
export interface TranscriptionResult {
  text: string;
  start: number;
  end: number;
}

export interface CaptionResponse {
  captions: TranscriptionResult[];
}
```

4. **`assets/templates/remotion.config.ts`**（简化配置）
```typescript
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
```

5. **`assets/templates/package.json`**（固定版本）
```json
{
  "name": "remotion-tutorial-video",
  "version": "1.0.0",
  "description": "Tutorial video with Remotion",
  "scripts": {
    "start": "remotion studio",
    "build": "remotion render",
    "dev": "remotion studio"
  },
  "dependencies": {
    "@remotion/cli": "4.0.421",
    "@remotion/captions": "4.0.421",
    "remotion": "4.0.421",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/node": "^20.0.0",
    "framer-motion": "^11.0.0",
    "typescript": "^5.0.0"
  }
}
```

---

### 方案 2: 更新 SKILL.md 文档

**在 Step 3（创建新项目）中添加详细步骤**：

```markdown
**如果选择创建新项目**：

1. **创建项目基础结构**：
   ```bash
   mkdir <项目名称> && cd <项目名称>
   ```

2. **创建 package.json**（使用固定版本）：
   ```bash
   # 从 skill 模板复制
   cp assets/templates/package.json .
   ```

3. **安装依赖**：
   ```bash
   npm install
   ```

4. **创建配置文件**：
   ```bash
   # 从 skill 模板复制
   cp assets/templates/remotion.config.ts .
   cp assets/templates/tsconfig.json .
   ```

5. **创建源代码结构**：
   ```bash
   mkdir -p src/lib
   ```

6. **复制所有必需文件**：
   ```bash
   # 入口文件（重要：使用 registerRoot）
   cp assets/templates/src/index.ts src/

   # 组件文件
   cp assets/components/tutorial/*.tsx src/

   # lib 工具文件
   cp assets/templates/src/lib/*.ts src/lib/
   ```

7. **创建 public/assets 目录**：
   ```bash
   mkdir -p public/assets
   ```

8. **验证项目结构**：
   ```bash
   # 应该包含以下文件
   src/
   ├── index.ts          # ✅ 必须使用 registerRoot()
   ├── Root.tsx          # 组合注册
   ├── TutorialVideo.tsx # 主组合
   ├── OpeningScene.tsx  # 开场场景
   ├── ScreenRecording.tsx # 教程场景
   ├── VisualHammer.tsx  # 品牌场景
   ├── BilibiliSubscribe.tsx # 订阅场景
   └── lib/
       ├── transcript.ts # ✅ 必需：字幕加载
       └── types.ts      # ✅ 必需：类型定义
   ```

**⚠️ 关键注意事项**：
1. **不要使用 `npx create-video`** - 它是交互式的，容易出错
2. **必须使用固定版本 4.0.421** - 避免依赖冲突
3. **index.ts 必须调用 registerRoot()** - 否则无法预览
4. **lib/transcript.ts 和 lib/types.ts 是必需的** - ScreenRecording 组件依赖它们
```

---

### 方案 3: 创建完整的模板项目

**最佳方案**：在 skill 中提供一个完整可用的模板项目

**目录结构**：
```
assets/
  template-project/         # 完整的 Remotion 教程视频模板
    package.json            # 固定版本 4.0.421
    remotion.config.ts      # 简化配置（无 Tailwind）
    tsconfig.json
    src/
      index.ts             # ✅ 使用 registerRoot()
      Root.tsx             # 预配置的组合
      TutorialVideo.tsx
      OpeningScene.tsx
      ScreenRecording.tsx
      VisualHammer.tsx
      BilibiliSubscribe.tsx
      lib/
        transcript.ts       # ✅ 必需
        types.ts           # ✅ 必需
    public/
      assets/
        .gitkeep
```

**使用方式**：
```bash
# 直接复制整个模板
cp -r assets/template-project/* <项目目录>/
cd <项目目录>
npm install
```

---

## 📊 问题优先级

| 问题 | 严重性 | 阻塞预览 | 已解决 |
|------|--------|----------|--------|
| 根组件注册 | ⭐️⭐️⭐️ 严重 | ✅ 是 | ✅ 是 |
| 依赖版本冲突 | ⭐️⭐️⭐️ 严重 | ✅ 是 | ✅ 是 |
| 缺失 lib 文件 | ⭐️⭐️⭐️ 严重 | ✅ 是 | ✅ 是 |
| 配置文件问题 | ⭐️⭐️ 中等 | ✅ 是 | ✅ 是 |
| 导入路径错误 | ⭐️⭐️ 中等 | ✅ 是 | ✅ 是 |

---

## ✅ 验证清单

创建新项目时，应该验证：

- [ ] `src/index.ts` 使用 `registerRoot(RemotionRoot)`
- [ ] `package.json` 使用固定版本 `4.0.421`（不用 `^` 或 `latest`）
- [ ] `src/lib/transcript.ts` 和 `src/lib/types.ts` 存在
- [ ] `remotion.config.ts` 不包含未安装的依赖（如 Tailwind）
- [ ] 所有组件导入路径正确
- [ ] `public/assets/` 目录存在
- [ ] 默认素材已复制（logo.jpg, avatar.jpg, music.mp3）
- [ ] `npm run dev` 可以成功启动
- [ ] 浏览器可以访问 http://localhost:3000
- [ ] 可以看到 "TutorialVideo" 组合

---

## 🎯 建议

1. **立即应用**：在 skill 中创建完整的模板项目（方案 3）
2. **更新文档**：将解决方案整合到 SKILL.md
3. **添加验证步骤**：在 Step 7（预览和渲染）中添加验证清单
4. **提供快速修复指南**：在 references/ 中创建故障排除文档

---

## 📝 相关文件

- **SKILL.md** - 主文档（需要更新）
- **SKILL-UPDATE-PATCH.md** - 补丁集合（已部分更新）
- **SKILL-PROBLEMS-AND-SOLUTIONS.md** - 本文档（新增）
- **references/troubleshooting.md** - 待创建：故障排除指南
