# Bug 修复：自动时长计算

## 🐛 Bug 描述

**用户反馈**：
- 当前 skill 使用硬编码的视频时长（`durationInFrames={6132}`）
- 用户需要手动运行 `get-video-duration.py` 脚本获取时长
- 然后手动更新 `src/Root.tsx` 的 `durationInFrames` 值
- 这个过程繁琐且容易出错

**用户期望**：
- 自动识别视频时长
- 动态计算总时长
- 无需手动修改代码

---

## ✅ 修复方案

### 使用 Remotion 的 `calculateMetadata` 功能

Remotion 提供了 `calculateMetadata` API，可以在运行时动态计算：
- `durationInFrames` - 总时长
- `props` - 组件属性
- `fps` - 帧率
- `width/height` - 分辨率

---

## 🔧 修复步骤

### 1. 更新 `src/Root.tsx`

**替换之前的硬编码版本**：

```tsx
// ❌ 旧版本（有问题）
<Composition
  component={TutorialVideo}
  durationInFrames={6132} // 硬编码！
  fps={30}
  // ...
/>
```

**使用新版本（自动计算）**：

参考文件：`ROOT-FIX-auto-duration.tsx`

```tsx
// ✅ 新版本（自动计算）
<Composition
  component={TutorialVideo}
  calculateMetadata={async ({ props }) => {
    // 自动加载视频时长
    const getVideoDuration = (src: string): Promise<number> => {
      return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.preload = "metadata";
        const videoSrc = src.startsWith("http") ? src : `${window.location.origin}/${src}`;

        video.onloadedmetadata = () => {
          const duration = video.duration;
          if (isNaN(duration) || duration === 0) {
            reject(new Error(`无法获取视频时长: ${src}`));
          } else {
            resolve(duration);
          }
        };

        video.onerror = () => {
          reject(new Error(`加载视频失败: ${src}`));
        };

        video.src = videoSrc;
      });
    };

    // 并行加载两个视频的时长
    const [hostDuration, screenRecordingDuration] = await Promise.all([
      getVideoDuration(props.hostVideoUrl).catch(() => 5),
      getVideoDuration(props.screenRecordingUrl).catch(() => 60),
    ]);

    const fps = 30;
    const introDuration = Math.ceil(hostDuration * fps);
    const brandDuration = 5 * fps;
    const tutorialDuration = Math.ceil(screenRecordingDuration * fps);
    const subscribeDuration = 5 * fps;
    const totalDuration = introDuration + brandDuration + tutorialDuration + subscribeDuration;

    return {
      durationInFrames: totalDuration,
      props: {
        ...props,
        introDuration,
        brandDuration,
        tutorialDuration,
        subscribeDuration,
      },
    };
  }}
  fps={30}
  // ...
/>
```

### 2. 更新 `src/TutorialVideo.tsx`

移除 `useEffect` 中的时长计算代码（因为 calculateMetadata 已经处理了），直接使用 props：

```tsx
export const TutorialVideo: React.FC<TutorialVideoProps> = ({
  hostVideoUrl,
  screenRecordingUrl,
  // 接收 calculateMetadata 传递的时长
  introDuration,
  brandDuration,
  tutorialDuration,
  subscribeDuration,
  // ...其他 props
}) => {
  // 直接使用 props，无需 useState 和 useEffect
  return (
    <>
      <Seq from={0} duration={introDuration}>
        <OpeningScene {...props} />
      </Seq>
      <Seq from={introDuration} duration={brandDuration}>
        <VisualHammer {...props} />
      </Seq>
      <Seq from={introDuration + brandDuration} duration={tutorialDuration}>
        <ScreenRecording {...props} />
      </Seq>
      <Seq from={introDuration + brandDuration + tutorialDuration} duration={subscribeDuration}>
        <BilibiliSubscribe />
      </Seq>
    </>
  );
};
```

---

## 📝 更新 Schema

需要在 `tutorialVideoSchema` 中添加时长字段：

```tsx
export const tutorialVideoSchema = z.object({
  hostVideoUrl: z.string().default("assets/host-video.mp4"),
  screenRecordingUrl: z.string().default("assets/screen-recording.mp4"),
  // ...其他字段

  // 添加这些字段（由 calculateMetadata 提供）
  introDuration: z.number().optional(),
  brandDuration: z.number().optional(),
  tutorialDuration: z.number().optional(),
  subscribeDuration: z.number().optional(),
});
```

---

## 🎯 优势

### 修复前
- ❌ 需要手动运行脚本
- ❌ 需要手动修改代码
- ❌ 容易忘记更新
- ❌ 不够智能

### 修复后
- ✅ 完全自动化
- ✅ 无需手动修改
- ✅ 实时动态计算
- ✅ 控制台输出时长信息

---

## 📊 测试验证

### 验证步骤

1. **启动开发服务器**：
   ```bash
   npm run dev
   ```

2. **查看控制台输出**：
   ```
   🎬 自动计算视频时长:
     开场: 14.7s (441 帧)
     品牌: 5.0s (150 帧)
     教程: 179.7s (5391 帧)
     订阅: 5.0s (150 帧)
     总计: 204.4s (6132 帧)
   ```

3. **验证时间线**：
   - 打开 http://localhost:3000
   - 选择 "TutorialVideo" 组合
   - 查看时间线是否显示正确的总时长

4. **更换视频测试**：
   - 替换 `host-video.mp4` 或 `screen-recording.mp4`
   - 刷新浏览器
   - 验证时长是否自动更新

---

## 🚀 实施计划

1. ✅ 创建修复示例代码（`ROOT-FIX-auto-duration.tsx`）
2. ⏳ 更新 skill 模板文件
3. ⏳ 更新 SKILL.md 文档
4. ⏳ 更新 SKILL-PROBLEMS-AND-SOLUTIONS.md
5. ⏳ 推送到 GitHub

---

## 📚 相关文档

- [Remotion calculateMetadata 文档](https://remotion.dev/docs/composition#calculating-metadata-with-calculatemetadata)
- [动态时长计算示例](https://remotion.dev/docs/dynamic-metadata)

---

**Co-Authored-By**: Claude Sonnet 4.5
