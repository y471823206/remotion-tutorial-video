# Installation Guide

Complete guide for installing all required dependencies for the Remotion Tutorial Video skill.

## Overview

Before creating tutorial videos, ensure the following tools are installed:

| Tool | Purpose | Required Version |
|------|---------|------------------|
| Node.js | JavaScript runtime | 18+ |
| npm | Package manager | Latest (comes with Node.js) |
| FFmpeg | Video/audio processing | 4.0+ |
| Python 3 | Script execution | 3.8+ |
| faster-whisper | Subtitle generation | Latest |
| pydub | Audio normalization | Latest |

## Quick Start Check

Run the environment check script to verify dependencies:

```bash
python scripts/check-environment.py
```

This will automatically detect what's installed and what's missing.

---

## Detailed Installation Instructions

### 1. Node.js (18+)

**Purpose**: Required for Remotion framework and npm packages

**Check if installed:**
```bash
node --version
```

**Install:**

**Windows:**
1. Download installer from [nodejs.org](https://nodejs.org/)
2. Run the installer (includes npm automatically)
3. Restart terminal/command prompt
4. Verify: `node --version` and `npm --version`

**macOS:**
```bash
# Using Homebrew (recommended)
brew install node

# Or download installer from nodejs.org
```

**Linux (Ubuntu/Debian):**
```bash
# Using NodeSource repository (recommended)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
```

**Alternative: Version Managers**
- **nvm** (macOS/Linux): `nvm install 18`
- **nvm-windows** (Windows): Download from [github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)

---

### 2. FFmpeg

**Purpose**: Video/audio encoding, decoding, and processing

**Check if installed:**
```bash
ffmpeg -version
```

**Install:**

**Windows:**

**Option 1: Using Chocolatey (Recommended)**
```powershell
choco install ffmpeg
```

**Option 2: Manual Installation**
1. Download from [gyan.dev/ffmpeg](https://www.gyan.dev/ffmpeg/builds/)
2. Extract "ffmpeg-release-essentials.zip"
3. Add `bin` folder to PATH:
   - Search for "Environment Variables" in Windows
   - Edit "Path" variable
   - Add path to `ffmpeg/bin` (e.g., `C:\ffmpeg\bin`)
4. Restart terminal
5. Verify: `ffmpeg -version`

**macOS:**
```bash
# Using Homebrew (recommended)
brew install ffmpeg

# Verify
ffmpeg -version
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install ffmpeg

# CentOS/RHEL/Fedora
sudo dnf install ffmpeg

# Arch Linux
sudo pacman -S ffmpeg
```

**Verify Installation:**
```bash
ffmpeg -version | grep "ffmpeg version"
# Should output: ffmpeg version X.X.X...
```

---

### 3. Python 3.8+

**Purpose**: Run subtitle generation and audio normalization scripts

**Check if installed:**
```bash
python --version
# OR
python3 --version
```

**Install:**

**Windows:**
1. Download from [python.org](https://www.python.org/downloads/)
2. During installation, **check "Add Python to PATH"**
3. Verify: `python --version`

**macOS:**
```bash
# macOS includes Python 3, but you can install latest via Homebrew
brew install python@3.11

# Verify
python3 --version
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt install python3 python3-pip

# CentOS/RHEL/Fedora
sudo dnf install python3 python3-pip

# Verify
python3 --version
```

---

### 4. Python Dependencies

**Purpose**: faster-whisper (subtitles) and pydub (audio processing)

**Install:**
```bash
# Using pip
pip install faster-whisper pydub

# Or using pip3 (if needed)
pip3 install faster-whisper pydub

# For faster subtitle generation (optional, requires more CPU)
pip install "faster-whisper[cpu]"
```

**Verify:**
```bash
python -c "import faster_whisper; print(faster_whisper.__version__)"
python -c "import pydub; print('pydub installed')"
```

**Virtual Environment (Recommended):**
```bash
# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate

# Activate (macOS/Linux)
source .venv/bin/activate

# Install dependencies
pip install faster-whisper pydub

# Deactivate when done
deactivate
```

---

## Automated Environment Check

After installing dependencies, verify everything is working:

```bash
python scripts/check-environment.py --verbose
```

**Expected Output:**
```
============================================================
           Remotion Tutorial Video - Environment Check
============================================================

Checking Node.js...
✓ Node.js is installed: v18.17.0

Checking npm...
✓ npm is installed: 9.6.7

Checking FFmpeg...
✓ FFmpeg is installed
  Version: ffmpeg version 5.1.2...

Checking Python dependencies...
✓ faster-whisper is installed: 0.10.0
✓ pydub is installed: 0.25.1

Checking Remotion project...
⚠ Not in a Node.js project (package.json not found)

============================================================
                        Summary
============================================================

✓ All dependencies are installed!

You're ready to create tutorial videos.

Next steps:
  1. Prepare your video assets
  2. Generate captions: python scripts/generate-captions.py <video>
  3. Preview: npm run dev
  4. Render: npx remotion render TutorialVideo out/video.mp4
```

---

## Troubleshooting

### Issue: "ffmpeg not found" even after installation

**Solution:**
1. Close and reopen terminal/command prompt
2. Verify PATH environment variable includes FFmpeg
3. Restart computer if needed

**Windows PATH Check:**
```powershell
echo $env:PATH
```

**macOS/Linux PATH Check:**
```bash
echo $PATH | tr ':' '\n' | grep ffmpeg
```

### Issue: "python: command not found"

**Solution:**
- Try `python3` instead of `python`
- Or create alias: `alias python=python3`

### Issue: "pip: command not found"

**Solution:**
```bash
# Windows
python -m ensurepip --default-pip
python -m pip install faster-whisper pydub

# macOS/Linux
python3 -m ensurepip --default-pip
python3 -m pip install faster-whisper pydub
```

### Issue: faster-whisper installation fails

**Solution:**
```bash
# Update pip first
python -m pip install --upgrade pip

# Install with specific version
pip install faster-whisper==0.10.0

# If still fails, install dependencies manually
pip install numpy cython
pip install faster-whisper
```

### Issue: Node.js version too old (< 18)

**Solution:**
```bash
# Update Node.js to latest LTS
# Visit nodejs.org and download latest version

# Or use nvm (version manager)
nvm install --lts
nvm use --lts
```

---

## System Requirements

### Minimum Requirements
- **OS**: Windows 10+, macOS 10.14+, or Linux (Ubuntu 20.04+)
- **RAM**: 4GB (8GB recommended)
- **Disk Space**: 5GB free space for rendering
- **CPU**: Dual-core (Quad-core recommended for faster rendering)

### Recommended for Video Production
- **OS**: Windows 11, macOS 13+, or Linux (Ubuntu 22.04+)
- **RAM**: 16GB+
- **Disk Space**: 20GB+ SSD
- **CPU**: Intel i7/i9, AMD Ryzen 7/9, or Apple M1/M2
- **GPU**: NVIDIA GPU with CUDA support (faster FFmpeg encoding)

---

## Verification Checklist

Before starting tutorial video creation, verify:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] FFmpeg installed and in PATH (`ffmpeg -version`)
- [ ] Python 3.8+ installed (`python --version`)
- [ ] faster-whisper installed (`python -c "import faster_whisper"`)
- [ ] pydub installed (`python -c "import pydub"`)
- [ ] Environment check passes (`python scripts/check-environment.py`)

---

## Next Steps

Once all dependencies are installed:

1. **Initialize Remotion Project**
   ```bash
   npx create-video@latest my-tutorial
   cd my-tutorial
   ```

2. **Install Remotion Dependencies**
   ```bash
   npm install
   ```

3. **Verify Project Setup**
   ```bash
   npm run dev
   # Should open http://localhost:3002
   ```

4. **Follow the Workflow**
   - See [SKILL.md](../SKILL.md) for complete workflow
   - Start with "Step 1: Collect Required Information"

---

## Quick Install Summary

**Windows (PowerShell):**
```powershell
# Install Node.js (download from nodejs.org)
# Install FFmpeg
choco install ffmpeg

# Install Python (download from python.org)
# Install Python dependencies
pip install faster-whisper pydub

# Verify
python scripts/check-environment.py
```

**macOS:**
```bash
# Install all dependencies
brew install node ffmpeg python@3.11
pip3 install faster-whisper pydub

# Verify
python3 scripts/check-environment.py
```

**Linux (Ubuntu/Debian):**
```bash
# Install all dependencies
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs ffmpeg python3 python3-pip
pip3 install faster-whisper pydub

# Verify
python3 scripts/check-environment.py
```

---

**Related Documentation:**
- [Asset Preparation Guide](./asset-preparation.md)
- [Workflow Examples](./workflow-examples.md)
- [SKILL.md](../SKILL.md) - Complete workflow
