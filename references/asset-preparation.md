# Asset Preparation Guide

Complete guide for preparing assets for Remotion tutorial video generation.

## Video Asset Requirements

### Host Video (`host-video.mp4`)

**Purpose**: Introduction video where you (the host) appear on camera to introduce the tutorial topic.

**Technical Specifications:**
- **Format**: MP4 container with H.264 video codec
- **Audio**: AAC or MP3 codec, 48kHz sample rate
- **Resolution**:
  - Vertical: 1080x1920 (recommended for mobile-first content)
  - Horizontal: 1920x1080 (standard landscape)
- **Duration**: 5-10 seconds (keep it concise!)
- **Bitrate**: 5-10 Mbps (1080p) or 3-5 Mbps (720p)
- **Frame Rate**: 30fps (matches output)

**Content Guidelines:**
- Start with a friendly greeting
- Clearly state the tutorial title
- Mention what viewers will learn
- Maintain eye contact with camera
- Use good front lighting (ring light or window light)
- Speak clearly and enthusiastically

**Recording Tips:**
- Use a tripod or stable surface
- Record in a quiet environment
- Position camera at eye level
- Leave some headroom (don't fill the frame)
- Wear solid colors (avoid busy patterns)

**Export Settings (OBS/FFmpeg):**
```bash
ffmpeg -i input.mov -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k host-video.mp4
```

### Screen Recording (`screen-recording.mp4`)

**Purpose**: The actual tutorial content showing your screen while you explain the concepts.

**Technical Specifications:**
- **Format**: MP4 container with H.264 video codec
- **Audio**: AAC or MP3 codec, 48kHz sample rate
- **Resolution**: 1920x1080 (Full HD)
- **Duration**: 30-300 seconds (adjust based on content)
- **Bitrate**: 8-15 Mbps for screen content
- **Frame Rate**: 30fps

**Content Guidelines:**
- Show only relevant application windows
- Use cursor highlighting or zoom for important details
- Narrate clearly and at a moderate pace
- Include keyboard shortcuts when applicable
- Pause on important concepts before moving on
- Avoid sudden movements or rapid window switching

**Recording Tools:**
- **OBS Studio** (Free, cross-platform)
- **Loom** (Free tier available)
- **Camtasia** (Paid, professional features)
- **Windows 10/11 Game Bar** (Win+G)

**OBS Settings for Screen Recording:**
```
Video: 1920x1080, 30fps, MP4
Audio: 48kHz, Stereo
Encoder: x264
Rate Control: CBR
Bitrate: 8000 Kbps
```

**FFmpeg Export:**
```bash
ffmpeg -i input.mkv -c:v libx264 -preset medium -crf 20 -c:a aac -b:a 128k screen-recording.mp4
```

## Image Asset Requirements

### Brand Logo (`jiujiu-logo.jpg`)

**Purpose**: Your brand or channel logo displayed in the brand scene.

**Technical Specifications:**
- **Format**: PNG (with transparency) or JPG
- **Resolution**: Minimum 1000x1000 pixels
- **Aspect Ratio**: 1:1 (square) or matches your logo proportions
- **File Size**: Under 500KB
- **Color Mode**: RGB

**Design Guidelines:**
- Use a high-contrast version of your logo
- Ensure logo is readable at small sizes
- Include tagline if space permits
- Keep background transparent (PNG) or white/solid color (JPG)

**Export from Photoshop/Illustrator:**
```
File > Export > Export As > PNG
Resolution: 1000x1000 px
Quality: High
```

## Audio Asset Requirements

### Background Music (`music.mp3`)

**Purpose**: Ambient background music to enhance engagement without distracting from narration.

**Technical Specifications:**
- **Format**: MP3
- **Sample Rate**: 44.1kHz or 48kHz
- **Bitrate**: 128-320 kbps (VBR recommended)
- **Duration**: At least as long as total video duration
- **Channels**: Stereo or Mono

**Content Guidelines:**
- Choose instrumental or ambient music
- Avoid songs with lyrics (distracts from narration)
- Use music with consistent energy level
- Consider royalty-free music libraries:
  - YouTube Audio Library
  - Epidemic Sound
  - Artlist
  - BenSound (free for attribution)

**Volume Mixing:**
- Background music should be 15-20dB lower than narration
- Most tools auto-mix; otherwise adjust manually in post

## Verification Checklist

Before proceeding, verify all assets:

### Host Video ✅
- [ ] File plays in VLC/QuickTime
- [ ] Video is H.264 codec (check with `ffprobe`)
- [ ] Audio is clear and undistorted
- [ ] Resolution matches specification
- [ ] Duration is 5-10 seconds

### Screen Recording ✅
- [ ] File plays in VLC/QuickTime
- [ ] Video is H.264 codec
- [ ] Voice narration is synchronized
- [ ] All screen content is visible
- [ ] Cursor movements are smooth
- [ ] No dropped frames or stuttering

### Brand Logo ✅
- [ ] File opens in image viewer
- [ ] Resolution is sufficient (1000px+)
- [ ] Logo is centered and clear
- [ ] Background is transparent or clean

### Background Music ✅
- [ ] File plays in audio player
- [ ] Duration covers total video length
- [ ] No sudden volume changes
- [ ] File size is reasonable (<10MB)

## Encoding Verification

Use FFmpeg to verify codecs:

```bash
# Check video codec
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 input.mp4

# Expected output: h264

# Check audio codec
ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 input.mp4

# Expected output: aac or mp3

# Full file info
ffprobe -i input.mp4
```

## Re-encoding with FFmpeg

If assets don't meet requirements, re-encode:

```bash
# Re-encode video to H.264
ffmpeg -i input.mp4 -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k output.mp4

# Convert audio to MP3
ffmpeg -i input.wav -c:a libmp3lame -b:a 192k output.mp3

# Resize image
ffmpeg -i input.png -vf scale=1000:1000 output.png
```

## Organizing Assets

Create this directory structure in your Remotion project:

```
my-tutorial-video/
└── public/
    └── assets/
        ├── host-video.mp4
        ├── screen-recording.mp4
        ├── jiujiu-logo.jpg (or .png)
        ├── music.mp3
        └── captions.json (auto-generated)
```

## Common Mistakes to Avoid

❌ **Using MOV or AVI containers** - Not compatible with Remotion
❌ **Encoding with HEVC/H.265** - Browser compatibility issues
❌ **Recording at 60fps then outputting 30fps** - Causes frame stuttering
❌ **Forgetting to normalize audio** - Inconsistent volume levels
❌ **Using low-resolution images** - Pixelated logo in video
❌ **Recording with background noise** - Distractions in final video

## Asset Sources

### Free Stock Music
- [YouTube Audio Library](https://www.youtube.com/audiolibrary)
- [BenSound](https://www.bensound.com/)
- [Incompetech](https://incompetech.com/music/royalty-free/)

### Icon & Logo Resources
- [Canva](https://www.canva.com/) - Logo maker
- [Figma](https://www.figma.com/) - Professional design tool
- [Adobe Express](https://www.adobe.com/express/) - Free logo creator

### Recording Tools
- [OBS Studio](https://obsproject.com/) - Free, open-source
- [Loom](https://www.loom.com/) - Free tier available
- [ShareX](https://getsharex.com/) - Free screen capture

---

**Next Step**: After preparing all assets, proceed to subtitle generation using `scripts/generate-captions.py`
