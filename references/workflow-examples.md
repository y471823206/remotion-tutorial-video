# Workflow Examples

Real-world examples of complete tutorial video generation workflows.

## Example 1: Python Programming Tutorial

**Scenario**: Create a tutorial on Python variables for beginners.

### Input Assets
```
Title: "Python基础教程"
Subtitle: "零基础入门到实战"

Files:
- host-video.mp4 (8s) - "欢迎来到Python教程系列！今天我们学习变量基础"
- screen-recording.mp4 (60s) - VS Code demo showing variable creation
- logo.jpg - "阿久编程" brand logo
- music.mp3 - Lofi study beats
```

### Commands Executed

```bash
# 1. Setup project
npx create-video@latest python-tutorial
cd python-tutorial
npm install

# 2. Prepare assets
mkdir -p public/assets
cp /path/to/python-assets/* public/assets/

# 3. Get actual video durations (CRITICAL!)
python scripts/get-video-duration.py \
  public/assets/host-video.mp4 \
  public/assets/screen-recording.mp4 \
  --remotion-config
# Output example:
# OPENING_DURATION = 240; // 8.0s @ 30fps (from host-video.mp4)
# TUTORIAL_DURATION = 1800; // 60.0s @ 30fps (from screen-recording.mp4)
# Total video duration: 78 seconds

# 4. Update TutorialVideo.tsx with actual durations
# const OPENING_DURATION = 240;
# const TUTORIAL_DURATION = 1800;

# 5. Generate captions
python scripts/generate-captions.py public/assets/screen-recording.mp4
# Output: public/assets/captions.json

# 6. Configure composition in src/Root.tsx
# Set defaultProps:
# - title: "Python基础教程"
# - subtitle: "零基础入门到实战"
# - durationInFrames: 1800 + 450 = 2250 (total frames)

# 7. Preview
npm run dev
# Open http://localhost:3002
# Verify timeline shows correct duration (75s)

# 8. Render
npx remotion render TutorialVideo out/python-variables.mp4
```

### Output
- **File**: `out/python-variables.mp4`
- **Duration**: 75 seconds (5s + 5s + 60s + 5s)
- **Quality**: 1080p, 30fps, H.264
- **Size**: ~45 MB

---

## Example 2: Design Tool Tutorial (Figma)

**Scenario**: Create a tutorial on using Figma auto-layout feature.

### Input Assets
```
Title: "Figma自动布局教程"
Subtitle: "5分钟掌握响应式设计"

Files:
- host-video.mp4 (6s) - "今天教你Figma最强大的功能：自动布局"
- screen-recording.mp4 (90s) - Figma demo with explanation
- logo.png - "设计大师" channel logo (transparent PNG)
- music.mp3 - Upbeat tech background music
```

### Commands Executed

```bash
# 1. Setup
mkdir figma-tutorial && cd figma-tutorial
npx create-video@latest .
npm install framer-motion

# 2. Asset preparation
mkdir -p public/assets
cp ~/Downloads/figma-auto-layout.mp4 public/assets/screen-recording.mp4
cp ~/Downloads/figma-host.mp4 public/assets/host-video.mp4
cp ~/Documents/design-master-logo.png public/assets/logo.png

# 3. Get actual video duration (CRITICAL!)
python scripts/get-video-duration.py public/assets/screen-recording.mp4 --remotion-config
# Output example:
# TUTORIAL_DURATION = 2700; // 90s @ 30fps
# Total video duration: 105 seconds

# 4. Update TutorialVideo.tsx with actual duration
# const TUTORIAL_DURATION = 2700; // Not 90 * 30, use the exact value from script!

# 5. Subtitle generation with custom model
python scripts/generate-captions.py \
  --model base \
  --language zh \
  public/assets/screen-recording.mp4

# 6. Preview and adjust
npm run dev
# Verify timeline shows 105 seconds total
# Verify subtitle timing matches speech

# 7. Render with custom quality
npx remotion render TutorialVideo out/figma-auto-layout.mp4 \
  --jpeg-quality=90 \
  --pixel-format=yuv420p
```

### Output
- **File**: `out/figma-auto-layout.mp4`
- **Duration**: 105 seconds (5s opening + 5s brand + 90s tutorial + 5s subscribe)
- **Quality**: High quality JPEG frames
- **Features**: Accurate Chinese subtitles, smooth transitions

---

## Example 3: Multi-Language Tutorial

**Scenario**: Create English and Spanish versions of the same tutorial.

### Input Assets (English)
```
Title: "JavaScript ES6 Features"
Subtitle: "Modern JavaScript Development"

Files:
- host-en.mp4 - English intro
- screen-en.mp4 - English screen recording
- logo.jpg
- music.mp3
```

### Input Assets (Spanish)
```
Title: "Características de JavaScript ES6"
Subtitle: "Desarrollo Moderno en JavaScript"

Files:
- host-es.mp4 - Spanish intro
- screen-es.mp4 - Spanish screen recording (same content, Spanish narration)
- logo.jpg (same)
- music.mp3 (same)
```

### Workflow

```bash
# Create English version
mkdir tutorial-en && cd tutorial-en
npx create-video@latest .
# Copy English assets
npm run dev
npx remotion render TutorialVideo out/tutorial-en.mp4

# Create Spanish version
cd ..
mkdir tutorial-es && cd tutorial-es
npx create-video@latest .
# Copy Spanish assets
# In Root.tsx: change title and subtitle to Spanish
npm run dev
npx remotion render TutorialVideo out/tutorial-es.mp4
```

---

## Example 4: Batch Video Generation

**Scenario**: Generate 10 tutorial videos from pre-recorded assets.

### Assets Structure
```
tutorial-batch/
├── video-01/
│   ├── host.mp4
│   ├── screen.mp4
│   └── captions.json
├── video-02/
│   ├── host.mp4
│   ├── screen.mp4
│   └── captions.json
├── ...
└── video-10/
    ├── host.mp4
    ├── screen.mp4
    └── captions.json
```

### Batch Render Script

```bash
#!/bin/bash
# render-batch.sh

for i in {01..10}; do
  echo "Rendering video $i..."

  # Copy assets
  cp -r tutorial-batch/video-$i/* public/assets/

  # Update composition props (via script or manual)
  node update-props.js video-$i

  # Render
  npx remotion render TutorialVideo out/video-$i.mp4

  echo "Completed video $i"
done
```

### Commands

```bash
# Generate all captions first
for i in {01..10}; do
  python scripts/generate-captions.py tutorial-batch/video-$i/screen.mp4
done

# Run batch render
chmod +x render-batch.sh
./render-batch.sh
```

---

## Example 5: Iterative Refinement Workflow

**Scenario**: Improve video quality based on preview feedback.

### Iteration 1: Initial Render
```bash
npm run dev
# Preview shows subtitle timing is 0.5s delayed
```

### Iteration 2: Adjust Subtitles
```bash
# Edit public/assets/captions.json
# Add offset to all timestamps:
# sed -i 's/"start": \([0-9]*\)/"start": \1+0.5/g' captions.json

npm run dev
# Verify timing is now correct
```

### Iteration 3: Adjust PIP Position
```bash
# Edit src/components/ScreenRecording.tsx
# Change PIP from bottom-right to top-right
# position: 'absolute', right: 40, top: 40

npm run dev
# Preview new positioning
```

### Iteration 4: Final Render
```bash
npx remotion render TutorialVideo out/final-version.mp4 --concurrency=8
```

---

## Example 6: Custom Scene Integration

**Scenario**: Add a quiz scene between tutorial and subscribe scenes.

### New Scene Component

```tsx
// src/components/QuizScene.tsx
export const QuizScene: React.FC<{ question: string; options: string[] }> = ({ question, options }) => {
  return (
    <div style={styles.container}>
      <h1>Quiz Time!</h1>
      <p>{question}</p>
      {options.map((option, i) => (
        <div key={i} style={styles.option}>{option}</div>
      ))}
    </div>
  );
};
```

### Updated TutorialVideo.tsx

```tsx
import { QuizScene } from './QuizScene';

// Add new sequence
<Seq from={tutorialEnd} duration={quizDuration}>
  <QuizScene
    question="What is the output of console.log(2 + '2')?"
    options={["22", "4", "NaN", "Error"]}
  />
</Seq>
```

---

## Troubleshooting Workflows

### Problem: Subtitles Not Displaying

**Diagnosis:**
```bash
# Check if captions.json exists
ls -la public/assets/captions.json

# Verify JSON format
cat public/assets/captions.json | jq .
```

**Solution:**
```bash
# Regenerate captions
python scripts/generate-captions.py public/assets/screen-recording.mp4 --output public/assets/captions.json

# Check component is reading file
# In ScreenRecording.tsx, verify: useCaptionData("/assets/captions.json")
```

### Problem: Audio Out of Sync

**Diagnosis:**
```bash
# Check video frame rate
ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of default=noprint_wrappers=1:nokey=1 public/assets/screen-recording.mp4

# Expected: 30/1
```

**Solution:**
```bash
# Re-encode to 30fps
ffmpeg -i public/assets/screen-recording.mp4 -r 30 -c:v libx264 -c:a aac public/assets/screen-recording-fixed.mp4
mv public/assets/screen-recording-fixed.mp4 public/assets/screen-recording.mp4
```

### Problem: Low Video Quality

**Diagnosis:**
```bash
# Check bitrate
ffprobe -v error -select_streams v:0 -show_entries stream=bit_rate -of default=noprint_wrappers=1:nokey=1 public/assets/screen-recording.mp4
```

**Solution:**
```bash
# Re-encode with higher quality
ffmpeg -i public/assets/screen-recording.mp4 -c:v libx264 -preset slow -crf 18 -c:a aac public/assets/screen-recording-hq.mp4
```

---

## Quick Reference Command Summary

```bash
# Project setup
npx create-video@latest project-name
cd project-name && npm install

# Asset preparation
mkdir -p public/assets
cp /source/files/* public/assets/

# Subtitle generation
python scripts/generate-captions.py public/assets/screen-recording.mp4

# Preview
npm run dev  # Open localhost:3002

# Render
npx remotion render TutorialVideo out/video.mp4

# Render with options
npx remotion render TutorialVideo out/video.mp4 \
  --concurrency=8 \
  --jpeg-quality=90 \
  --pixel-format=yuv420p

# Check video codec
ffprobe -i file.mp4

# Re-encode to H.264
ffmpeg -i input.mp4 -c:v libx264 -preset medium -crf 23 -c:a aac output.mp4
```

---

## Best Practices

1. **Always preview before rendering** - Catch issues early in the browser
2. **Generate captions first** - Subtitles guide timing and pacing
3. **Use consistent asset naming** - Avoid confusion with clear file names
4. **Keep backups** - Original assets should be preserved
5. **Test with short videos first** - Validate workflow before long renders
6. **Monitor render progress** - Use `--progress` flag for long renders
7. **Optimize for target platform** - YouTube vs TikTok requires different specs
8. **Document custom settings** - Keep track of non-default configurations

---

**Related References**:
- [Asset Preparation Guide](./asset-preparation.md)
- [Component Guide](./component-guide.md)
- [Advanced Configuration](./advanced-config.md)
