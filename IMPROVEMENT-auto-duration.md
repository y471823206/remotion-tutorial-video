# Skill 改进：自动时长计算功能

## 🎯 改进目标

**问题**：用户需要手动运行 `get-video-duration.py` 脚本，然后手动更新 Root.tsx 的 `durationInFrames` 值。

**解决**：使用 Remotion 的 `calculateMetadata` API，在项目启动时自动计算视频时长。

---

## ✅ 已更新的文件

### 1. `assets/templates/Root.tsx`

**改进内容**：
- ✅ 使用 `calculateMetadata` 自动计算视频时长
- ✅ 移除硬编码的 `durationInFrames`
- ✅ 并行加载两个视频的元数据
- ✅ 在控制台输出时长信息
- ✅ 失败时使用默认值（75秒）

**关键代码**：
```tsx
<Composition
  component={TutorialVideo}
  calculateMetadata={async ({ props }) => {
    // 自动加载视频时长
    const [hostDuration, screenRecordingDuration] = await Promise.all([
      getVideoDuration(props.hostVideoUrl).catch(() => 5),
      getVideoDuration(props.screenRecordingUrl).catch(() => 60),
    ]);

    const totalDuration = introDuration + brandDuration + tutorialDuration + subscribeDuration;

    return {
      durationInFrames: totalDuration,  // 自动计算！
      props: { ...props, introDuration, brandDuration, ... }
    };
  }}
/>
```

### 2. `assets/templates/TutorialVideo.tsx`

**改进内容**：
- ✅ 移除 `useState` 和 `useEffect` 中的时长计算代码
- ✅ 从 props 接收 `calculateMetadata` 传递的时长
- ✅ 简化组件逻辑，提高性能

**关键变化**：
```tsx
// ❌ 旧版本：在组件内部计算时长
const [durations, setDurations] = useState({ intro: 5 * fps, ... });
useEffect(() => {
  const loadDurations = async () => { ... };
  loadDurations();
}, []);

// ✅ 新版本：从 props 接收
export const TutorialVideo: React.FC<TutorialVideoProps> = ({
  introDuration,  // 由 calculateMetadata 提供
  brandDuration,
  tutorialDuration,
  subscribeDuration,
}) => {
  const intro = introDuration || 5 * fps;  // fallback
  // ...
}
```

---

## 📝 SKILL.md 需要的更新

### 移除 Step 4.5

**旧的 Step 4.5**（需要删除）：
```
### Step 4.5: 配置动态时长（关键）

开场和教程场景的时长**必须匹配**你的实际视频长度。使用提供的脚本检测两个视频的时长：

```bash
python scripts/get-video-duration.py \
  public/assets/host-video.mp4 \
  public/assets/screen-recording.mp4 \
  --remotion-config
```
```

**替换为**（添加到 Step 4 后面）：
```
### 🎉 自动时长计算

**✨ 无需手动计算时长！**

项目使用 Remotion 的 `calculateMetadata` 功能，会在启动时自动：
1. 加载 `host-video.mp4` 和 `screen-recording.mp4` 的元数据
2. 计算每个场景的时长
3. 输出总时长到控制台

**查看时长信息**：
启动项目后，打开浏览器控制台（F12），你会看到：
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

**注意**：如果视频无法加载，会使用默认值：
- 开场视频：默认 5 秒
- 教程视频：默认 60 秒
```

---

## 🚀 用户使用流程对比

### 旧流程（有问题）

1. 创建项目
2. 复制视频到 `public/assets/`
3. **运行脚本获取时长** ❌
   ```bash
   python scripts/get-video-duration.py ... --remotion-config
   ```
4. **手动更新 Root.tsx** ❌
5. 启动项目
6. 如果视频更换 → 重复步骤 3-5

### 新流程（自动）

1. 创建项目
2. 复制视频到 `public/assets/`
3. 启动项目
4. **自动计算时长** ✅（查看控制台）
5. 如果视频更换 → 刷新浏览器即可

---

## 📊 技术细节

### calculateMetadata 工作原理

1. **时机**：Remotion Studio 启动时或刷新浏览器时
2. **方式**：使用浏览器原生 API (`<video>.onloadedmetadata`)
3. **性能**：并行加载两个视频，提高速度
4. **容错**：加载失败时使用默认值，不会阻塞项目

### 时长计算公式

```typescript
总时长 = Math.ceil(开场视频时长 * 30fps)     // introDuration
        + 5 * 30                              // brandDuration (固定)
        + Math.ceil(教程视频时长 * 30fps)     // tutorialDuration
        + 5 * 30                              // subscribeDuration (固定)
```

---

## ✅ 优势

1. **用户体验更好** - 无需手动运行脚本和修改代码
2. **不易出错** - 自动计算避免人为错误
3. **灵活性高** - 更换视频后自动重新计算
4. **性能提升** - 移除组件内部的 useEffect 和 useState
5. **代码更简洁** - 逻辑集中在 calculateMetadata

---

## 🧪 测试验证

### 测试步骤

1. **创建项目**：使用 skill 模板创建新项目
2. **放置视频**：复制不同长度的视频到 `public/assets/`
3. **启动项目**：`npm run dev`
4. **查看控制台**：验证时长输出是否正确
5. **验证时间线**：检查 Remotion Studio 的时间线显示
6. **更换视频**：替换视频文件并刷新浏览器
7. **验证自动更新**：确认时长自动重新计算

### 预期结果

- ✅ 控制台显示正确的时长信息
- ✅ 时间线显示正确的总帧数
- ✅ 所有场景时长正确
- ✅ 更换视频后自动更新

---

## 📚 相关文档

- [Remotion calculateMetadata 官方文档](https://remotion.dev/docs/composition#calculating-metadata-with-calculatemetadata)
- [Remotion 动态元数据示例](https://remotion.dev/docs/dynamic-metadata)

---

**Co-Authored-By**: Claude Sonnet 4.5
