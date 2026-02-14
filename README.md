# Remotion Tutorial Video Skill

Generate professional tutorial videos with talking avatars using Remotion.

## What This Skill Does

Transforms raw video assets into polished tutorial videos featuring:
- **Opening Scene** (5s) - Host introduction with animated title
- **Brand Scene** (5s) - Logo animation with brand text
- **Tutorial Scene** (60s) - Screen recording with PIP avatar and auto-generated subtitles
- **Subscribe Scene** (5s) - Call-to-action for viewers

## Required Inputs

Users need to provide:

1. **Title** - Tutorial title (e.g., "Python基础教程")
2. **Subtitle** - Additional context (e.g., "零基础入门到实战")
3. **Host Video** - Introduction video (H.264 MP4, 5-10s)
4. **Screen Recording** - Tutorial screen capture (H.264 MP4)
5. **Brand Logo** - Logo image (PNG/JPG)
6. **Background Music** - Ambient audio (MP3, optional)

## Quick Start

```bash
# 1. Install the skill
# (Download remotion-tutorial-video.zip and extract to ~/.claude/skills/)

# 2. Create Remotion project
npx create-video@latest my-tutorial
cd my-tutorial

# 3. Prepare assets
mkdir -p public/assets
cp /path/to/your/assets/* public/assets/

# 4. Generate subtitles
python ~/.claude/skills/remotion-tutorial-video/scripts/generate-captions.py \
  public/assets/screen-recording.mp4 \
  --output public/assets/captions.json

# 5. Preview video
npm run dev
# Open http://localhost:3002

# 6. Render final video
npx remotion render TutorialVideo out/tutorial.mp4
```

## Features

- ✅ Automatic subtitle generation using faster-whisper
- ✅ Picture-in-picture avatar overlay
- ✅ Cinematic scene transitions
- ✅ Audio normalization support
- ✅ Customizable scene durations
- ✅ Multi-language support (Chinese, English, Spanish, etc.)

## Workflow

1. **Prepare Assets** - Record host video and screen tutorial
2. **Generate Subtitles** - Auto-generate captions from screen audio
3. **Configure Project** - Set title, subtitle, and asset paths
4. **Preview** - Verify in browser before rendering
5. **Render** - Export final video file

## Documentation

- **SKILL.md** - Complete workflow and usage instructions
- **references/asset-preparation.md** - Detailed asset requirements
- **references/workflow-examples.md** - Real-world usage examples
- **scripts/generate-captions.py** - Subtitle generation tool
- **scripts/normalize-audio.py** - Audio normalization tool

## Technical Requirements

- Node.js 18+ and npm
- Python 3.8+ (for subtitle generation)
- FFmpeg (for audio/video processing)
- 5GB+ free disk space for rendering

## Dependencies

Install Python dependencies:
```bash
pip install faster-whisper pydub
```

## Example Output

Input:
```
Title: "Python基础教程"
Subtitle: "零基础入门到实战"
Host Video: 8s introduction
Screen Recording: 60s tutorial
Logo: Brand logo image
Music: Background audio
```

Output:
- 75-second professional tutorial video
- 1080p, 30fps, H.264 encoded
- Synchronized subtitles
- Smooth scene transitions
- ~45MB file size

## Troubleshooting

**Subtitles not displaying?**
- Regenerate captions with the script
- Verify captions.json format is correct

**Audio out of sync?**
- Check video frame rate is 30fps
- Re-encode to fix sync issues

**Low video quality?**
- Ensure source videos are H.264 encoded
- Increase CRF quality setting

For more help, see SKILL.md.

## License

MIT License - Free to use and modify.

## Credits

Built with:
- [Remotion](https://www.remotion.dev/) - React video framework
- [faster-whisper](https://github.com/SYSTRAN/faster-whisper) - Speech recognition
- [FFmpeg](https://ffmpeg.org/) - Media processing
