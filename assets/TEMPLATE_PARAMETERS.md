# 默认模板参数配置

本文档记录了 Remotion 教程视频的默认动画参数和样式配置。

## 1. 开场场景 (OpeningScene)

### 标题样式
```tsx
fontSize: 96,
fontWeight: 700,
letterSpacing: 8,  // 字间距
marginBottom: 16,
textShadow: "0 2px 20px rgba(0,0,0,0.5)"
```

### 副标题样式
```tsx
fontSize: 36,
fontWeight: 600,
letterSpacing: "normal",
textShadow: "0 2px 20px rgba(0,0,0,0.5)"
```

### 动画参数
```tsx
// 整体淡入+缩放
opacity: [0, 1]  // 第0-30帧
scale: [0.9, 1]   // 第0-30帧

// 标题动画
delay: 0.3s
duration: 0.8s
initial: { opacity: 0, y: 50 }
animate: { opacity: 1, y: 0 }

// 副标题动画
delay: 0.5s
duration: 0.8s
initial: { opacity: 0, y: 50 }
animate: { opacity: 0.9, y: 0 }
```

---

## 2. 屏幕录制场景 (ScreenRecording)

### 画中画头像配置
```tsx
width: 160,
height: 160,
borderRadius: "50%",
border: "4px solid #fff",
bottom: 32,
right: 32
```

### 头像动画参数
```tsx
// 缩放动画（前30帧）
avatarScale = interpolate(frame, [0, 30], [0, 1])
avatarOpacity = interpolate(frame, [0, 30], [0, 1])

// 轻微摆动效果
rotate: [0, 1, -1, 0]
duration: 4s
repeat: Infinity
ease: "linear"
```

### 呼吸边框效果
```tsx
// 2秒周期（60帧@30fps）
pulseScale = interpolate(
  frame % 60,
  [0, 30, 60],
  [1, 1.02, 1]
)

// 边框配置
width: 160,
height: 160,
borderRadius: "50%",
border: "4px solid #fff"
inset: -6  // 相对头像外扩6px
background: "linear-gradient(135deg, #FF6B9D, #C44CD9, #6B9DFF)"
blur: "8px"
opacity: 0.6 * pulseScale
```

### 绿色在线指示器
```tsx
// 位置
bottom: 18,
right: 18,

// 尺寸
width: 14,
height: 14,
borderRadius: "50%"

// 颜色
backgroundColor: "#22c55e",  // 绿色
border: "2px solid #fff"

// 呼吸动画（2秒周期，与边框同步）
indicatorScale = interpolate(frame % 60, [0, 30, 60], [0.8, 1, 0.8])
indicatorOpacity = interpolate(frame % 60, [0, 30, 60], [0.5, 0.8, 0.5])
```

### 字幕样式
```tsx
fontSize: 24,
fontWeight: "bold",
fontFamily: "PingFang SC, Microsoft YaHei, sans-serif",
color: "white",
textAlign: "center",
maxWidth: "80%",

// 文字阴影（增强可读性）
textShadow: `
  -1px -1px 0 #000,
  1px -1px 0 #000,
  -1px 1px 0 #000,
  1px 1px 0 #000,
  -1px 0 0 #000,
  1px 0 0 #000,
  0 -1px 0 #000,
  0 1px 0 #000,
  0 0 2px #000,
  0 0 3px #000
`

// 位置
bottom: 80,
left: "50%",
transform: "translateX(-50%)"
```

### 顶部装饰条
```tsx
height: 60,
background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent)"

// 进度条动画
height: 4,
width: [0, 200]  // 0到200像素
background: "linear-gradient(90deg, #FF6B9D, #C44CD9, #6B9DFF)"
borderRadius: 2
```

---

## 3. 品牌场景 (VisualHammer)

### Spring 动画配置
```tsx
// Logo 缩放
logoScale = spring({
  frame: frame - 2,  // 从第2帧开始
  config: { damping: 12, stiffness: 100, mass: 0.5 }
})

// 装饰圆圈缩放
circleScale = spring({
  frame: frame - 20,  // 从第20帧开始
  config: { damping: 20, stiffness: 60 }
})

// 中文名称淡入+上移
cnOpacity = interpolate(frame, [5, 30], [0, 1])
cnY = interpolate(frame, [5, 30], [50, 0])

// 英文名称淡入+上移
enOpacity = interpolate(frame, [30, 50], [0, 1])
enY = interpolate(frame, [30, 50], [50, 0])
```

### Logo 样式
```tsx
width: 140,
height: 140,
borderRadius: "8px",
boxShadow: "0 8px 24px rgba(255, 107, 157, 0.3)",
objectFit: "contain"
```

### 品牌名称样式
```tsx
// 中文名称
fontSize: 72,
fontWeight: 800,
letterSpacing: "4px",
background: "linear-gradient(90deg, #FF6B9D, #C44CD9)",
WebkitBackgroundClip: "text",
WebkitTextFillColor: "transparent",
textShadow: "0 2px 20px rgba(0, 0, 0, 0.5)"

// 英文名称
fontSize: 32,
fontWeight: 600,
letterSpacing: "8px",
textTransform: "uppercase",
color: "rgba(255, 255, 255, 0.9)"
```

### 装饰圆圈
```tsx
// 3个圆圈，延迟0.15秒间隔
width: 350,
height: 350,
borderRadius: "50%",
border: "2px solid rgba(255, 107, 157, 0.15)",
boxShadow: "0 0 60px rgba(255, 107, 157, 0.15)"

delay: i * 0.15,  // i = 0, 1, 2
duration: 1.5,
scale: circleScale * (1 + i * 0.15)  // 每个圆圈略大
opacity: 0.1 - i * 0.03  // 递减透明度
```

### 背景音乐配置
```tsx
// 音乐文件路径（可选）
musicUrl: string  // 例如："assets/music.mp3"

// 播放时长控制
{musicUrl && frame < 145 && <Audio src={staticFile(musicUrl)} />}

// 默认行为：
// - 只在品牌场景前150帧（5秒）内播放
// - 从public/目录加载音乐文件
// - 支持MP3格式
// - 可选参数（不提供音乐时品牌场景静音）
```

### 装饰线
```tsx
height: 4,
width: [0, 180],  // 0到180像素
delay: 0.8s,
duration: 0.6s,
background: "linear-gradient(90deg, #FF6B9D, #6B9DFF)",
borderRadius: 2
```

---

## 4. 订阅场景 (BilibiliSubscribe)

### Spring 动画配置
```tsx
// 通用配置
springConfig = { damping: 15, stiffness: 100, mass: 1 }

// 三连按钮（顺序弹出）
coinScale  = spring({ frame: frame - 10 })  // 第10帧
likeScale  = spring({ frame: frame - 20 })  // 第20帧
favScale   = spring({ frame: frame - 30 })  // 第30帧
followScale = spring({ frame: frame - 40 })  // 第40帧

// 整体容器缩放
containerScale = spring({
  config: { damping: 20, stiffness: 80, mass: 1 }
})
```

### 三连按钮样式
```tsx
// 按钮尺寸
width: 100,
height: 100,
borderRadius: "20px"

// 图标+文字布局
flexDirection: "column",
alignItems: "center",
justifyContent: "center",
gap: 4

// 图标大小
icon: fontSize: 36
text: fontSize: 16, fontWeight: 600, color: "#fff"

// 投币按钮
background: "linear-gradient(135deg, #FB7299, #FFB86C)"
boxShadow: "0 8px 32px rgba(251, 114, 153, 0.4)"

// 点赞按钮
background: "linear-gradient(135deg, #00A1D6, #6B9DFF)"
boxShadow: "0 8px 32px rgba(0, 161, 214, 0.4)"

// 收藏按钮
background: "linear-gradient(135deg, #FFB86C, #FF6B9D)"
boxShadow: "0 8px 32px rgba(255, 184, 108, 0.4)"

// 关注按钮
background: "linear-gradient(135deg, #4CAF50, #8BC34A)"
boxShadow: "0 8px 32px rgba(76, 175, 80, 0.4)"
```

### 三连按钮动画
```tsx
initial: { scale: 0, rotate: -180 }
animate: { scale: Math.min(scale, 1), rotate: 0 }
transition: { type: "spring", damping: 15, stiffness: 100 }

// 图标内容
投币: "🪙"
点赞: "👍"
收藏: "⭐"
关注: "➕"
```

### 关注提示文字
```tsx
// 主标题
fontSize: 48,
fontWeight: 700,
background: "linear-gradient(90deg, #FB7299, #00A1D6)",
WebkitBackgroundClip: "text",
WebkitTextFillColor: "transparent",
textShadow: "0 2px 20px rgba(0, 0, 0, 0.5)"
content: "一键三连，如果对你有帮助！"

// 副标题
fontSize: 24,
color: "rgba(255,255,255,0.8)"
content: "关注我，获取更多精彩教程"

// 文字淡入动画
textOpacity = interpolate(frame, [60, 90], [0, 1])
initial: { opacity: 0, y: 20 }
animate: { opacity: textOpacity, y: 0 }
```

### 背景装饰圆
```tsx
width: 600,
height: 600,
borderRadius: "50%",
background: "linear-gradient(135deg, #FB729920, #00A1D620)"
blur: "40px"

// 旋转动画
initial: { scale: 0, rotate: 0 }
animate: { scale: 1, rotate: 360 }
transition: { duration: 2, ease: "easeInOut" }
```

### 小电视 Logo
```tsx
fontSize: 48,
content: "📺"

initial: { scale: 0, rotate: -45 }
animate: { scale: 1, rotate: 0 }
transition: { delay: 0.8, type: "spring" }
```

### 漂浮粒子效果
```tsx
// 20个粒子
count: 20
size: 6px, borderRadius: "50%"

// 伪随机位置
x = pseudoRandom(seed) * 1920
y = 1080 + pseudoRandom(seed + 1) * 200

// 动画
animate: {
  y: -100,  // 上浮到顶部
  opacity: [0, 1, 0]  // 淡入淡出
}

// 时间配置
duration: 3 + pseudoRandom(seed + 2) * 2  // 3-5秒
delay: i * 0.1  // 每个粒子延迟0.1秒
repeat: Infinity  // 无限循环

// 颜色
i % 2 === 0 ? "#FB7299" : "#00A1D6"
```

---

## 通用配置

### 帧率
```tsx
FPS = 30  // 所有动画基于30fps
```

### 视频分辨率
```tsx
width: 1920,
height: 1080
```

### 场景时长（动态计算）
```tsx
OPENING_DURATION = hostVideoDuration  // 主持人视频时长
BRAND_DURATION = 5 * 30  // 5秒品牌动画
TUTORIAL_DURATION = screenRecordingDuration  // 屏幕录制时长
SUBSCRIBE_DURATION = 5 * 30  // 5秒订阅动画
```

### 配色方案
```tsx
// 主色
PINK: "#FF6B9D"
PURPLE: "#C44CD9"
BLUE: "#6B9DFF"

// B站配色
BILI_PINK: "#FB7299"
BILI_BLUE: "#00A1D6"

// 绿色（在线指示器）
GREEN: "#22c55e"
```

---

## 使用说明

### 自定义文字内容
文字内容（标题、副标题、品牌名称等）应通过 props 传递，不要写死在组件中：

```tsx
// ✅ 正确
<OpeningScene
  title={props.title}        // 从配置读取
  subtitle={props.subtitle}
/>

// ❌ 错误
<OpeningScene
  title="Excel数据透视表教程"  // 不要硬编码
/>
```

### 保留的动画参数
以下参数应作为默认模板保留，不建议用户修改：

1. **Spring 配置**：damping, stiffness, mass
2. **Interpolate 范围**：帧范围和值范围
3. **时间延迟**：delay 和 duration
4. **颜色方案**：渐变色和品牌色
5. **尺寸参数**：宽度、高度、间距
6. **特效参数**：模糊、阴影、透明度

### 可自定义参数
以下参数可以由用户自定义：

1. **文字内容**：标题、副标题、品牌名称
2. **素材路径**：视频、图片、音频路径
3. **颜色**（可选）：用户可自定义品牌色
4. **时长**（自动）：根据视频时长自动计算

---

## 更新日期
2026-02-14
