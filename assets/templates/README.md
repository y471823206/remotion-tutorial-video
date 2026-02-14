# Remotion 教程视频模板文件

此目录包含创建完整 Remotion 教程视频项目所需的所有模板文件。

## 📁 文件清单

### 根目录配置文件
- ✅ `package.json` - 依赖配置（使用固定版本 4.0.421）
- ✅ `remotion.config.ts` - Remotion 配置（简化版，无 Tailwind）
- ✅ `tsconfig.json` - TypeScript 配置

### 源代码文件
- ✅ `src/index.ts` - **入口文件（使用 registerRoot）**
- ✅ `src/lib/transcript.ts` - **字幕加载函数（必需）**
- ✅ `src/lib/types.ts` - **类型定义（必需）**

### 组件文件（从 assets/components/tutorial/ 复制）
- `OpeningScene.tsx` - 开场场景
- `ScreenRecording.tsx` - 教程场景
- `VisualHammer.tsx` - 品牌场景
- `BilibiliSubscribe.tsx` - 订阅场景
- `TutorialVideo.tsx` - 主组合

## 🚀 快速开始

### 方法 1: 手动创建项目

```bash
# 1. 创建项目目录
mkdir my-tutorial && cd my-tutorial

# 2. 复制配置文件
cp /path/to/skill/assets/templates/package.json .
cp /path/to/skill/assets/templates/remotion.config.ts .
cp /path/to/skill/assets/templates/tsconfig.json .

# 3. 创建源代码目录
mkdir -p src/lib

# 4. 复制源代码文件
cp /path/to/skill/assets/templates/src/index.ts src/
cp /path/to/skill/assets/templates/src/lib/* src/lib/

# 5. 复制组件文件
cp /path/to/skill/assets/components/tutorial/*.tsx src/

# 6. 创建 assets 目录
mkdir -p public/assets

# 7. 安装依赖
npm install

# 8. 启动开发服务器
npm run dev
```

### 方法 2: 一键复制（推荐）

```bash
# 创建项目并复制所有模板文件
mkdir my-tutorial && cd my-tutorial
cp -r /path/to/skill/assets/templates/* .
cp -r /path/to/skill/assets/components/tutorial/* src/
mkdir -p public/assets
npm install
npm run dev
```

## ⚠️ 关键注意事项

### 1. 必须使用 registerRoot()

**错误** ❌：
```tsx
// src/index.ts
export { RemotionRoot };
```

**正确** ✅：
```tsx
// src/index.ts
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";
registerRoot(RemotionRoot);
```

### 2. 必须使用固定版本 4.0.421

**错误** ❌：
```json
{
  "dependencies": {
    "@remotion/cli": "^4.0.0",
    "remotion": "latest"
  }
}
```

**正确** ✅：
```json
{
  "dependencies": {
    "@remotion/cli": "4.0.421",
    "remotion": "4.0.421"
  }
}
```

**原因**：`@remotion/media-parser` 最新版本只有 4.0.421，使用 `^4.0.0` 会尝试安装 4.0.422 导致冲突。

### 3. lib/transcript.ts 和 lib/types.ts 是必需的

`ScreenRecording.tsx` 组件依赖这两个文件：
- `transcript.ts` - 提供 `loadCaptions()` 函数
- `types.ts` - 提供 `TranscriptionResult` 类型

### 4. remotion.config.ts 默认不包含 Tailwind

为了避免依赖问题，默认配置不包含 Tailwind。如果需要 Tailwind：

1. 安装依赖：
```bash
npm install @remotion/tailwind-v4
```

2. 更新 `remotion.config.ts`：
```typescript
import { enableTailwind } from '@remotion/tailwind-v4';
Config.overrideWebpackConfig(enableTailwind);
```

## 📂 完整项目结构

```
my-tutorial/
├── package.json           # ✅ 固定版本 4.0.421
├── remotion.config.ts     # ✅ 简化配置
├── tsconfig.json
├── src/
│   ├── index.ts           # ✅ 使用 registerRoot()
│   ├── Root.tsx           # 组合注册
│   ├── TutorialVideo.tsx  # 主组合
│   ├── OpeningScene.tsx
│   ├── ScreenRecording.tsx
│   ├── VisualHammer.tsx
│   ├── BilibiliSubscribe.tsx
│   └── lib/
│       ├── transcript.ts  # ✅ 必需
│       └── types.ts      # ✅ 必需
└── public/
    └── assets/
        ├── host-video.mp4
        ├── screen-recording.mp4
        ├── avatar.jpg
        ├── logo.jpg
        ├── music.mp3
        └── captions.json
```

## ✅ 验证清单

项目创建后，验证以下内容：

- [ ] `src/index.ts` 包含 `registerRoot(RemotionRoot)`
- [ ] `package.json` 使用固定版本 `4.0.421`（没有 `^` 符号）
- [ ] `src/lib/transcript.ts` 存在
- [ ] `src/lib/types.ts` 存在
- [ ] `npm install` 成功无错误
- [ ] `npm run dev` 成功启动
- [ ] 浏览器可以访问 http://localhost:3000
- [ ] 可以看到 "TutorialVideo" 组合

## 🐛 常见问题

### 问题 1: "Waiting for registerRoot() to get called"

**解决方案**：检查 `src/index.ts` 是否使用了 `registerRoot()`

### 问题 2: "Cannot find module '@remotion/media-parser@4.0.422'"

**解决方案**：检查 `package.json` 是否使用固定版本 `4.0.421`

### 问题 3: "Cannot resolve './lib/transcript'"

**解决方案**：
1. 确认 `src/lib/transcript.ts` 存在
2. 检查导入路径是否为 `./lib/transcript`（不是 `../../lib/transcript`）

### 问题 4: "Cannot find module '@remotion/tailwind-v4'"

**解决方案**：
- 方案 A：删除 `remotion.config.ts` 中的 Tailwind 配置
- 方案 B：安装 `npm install @remotion/tailwind-v4`

## 📚 相关文档

- [SKILL.md](../SKILL.md) - 主文档
- [SKILL-PROBLEMS-AND-SOLUTIONS.md](../SKILL-PROBLEMS-AND-SOLUTIONS.md) - 问题与解决方案
- [SKILL-UPDATE-PATCH.md](../SKILL-UPDATE-PATCH.md) - 更新补丁
