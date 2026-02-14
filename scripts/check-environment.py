#!/usr/bin/env python3
"""
Environment check script for Remotion Tutorial Video skill.

This script verifies all required dependencies are installed and properly configured.
Run this before starting the tutorial video creation workflow.

Usage:
    python check-environment.py [--verbose]
"""

import argparse
import io
import json
import platform
import subprocess
import sys
from pathlib import Path
from typing import List, Tuple

# Try to import OpenCC for caption checking
try:
    import opencc
    OPENCC_AVAILABLE = True
except ImportError:
    OPENCC_AVAILABLE = False

# Fix encoding for Windows
if platform.system() == "Windows":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')


# ANSI color codes for terminal output
class Colors:
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    RED = "\033[91m"
    BLUE = "\033[94m"
    BOLD = "\033[1m"
    END = "\033[0m"


def print_header(text: str):
    """Print section header."""
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{text:^60}{Colors.END}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.END}\n")


def print_success(text: str):
    """Print success message."""
    print(f"{Colors.GREEN}[OK]{Colors.END} {text}")


def print_warning(text: str):
    """Print warning message."""
    print(f"{Colors.YELLOW}[WARNING]{Colors.END} {text}")


def print_error(text: str):
    """Print error message."""
    print(f"{Colors.RED}[ERROR]{Colors.END} {text}")


def print_info(text: str):
    """Print info message."""
    print(f"{Colors.BLUE}ℹ{Colors.END} {text}")


def check_command(command: str, args: List[str] = ["--version"], name: str = None) -> Tuple[bool, str]:
    """
    Check if a command-line tool is installed and accessible.

    Args:
        command: Command to check (e.g., "node", "ffmpeg")
        args: Arguments to pass (default: ["--version"])
        name: Display name (default: command)

    Returns:
        Tuple of (is_installed, version_string)
    """
    display_name = name or command

    try:
        result = subprocess.run(
            [command] + args,
            capture_output=True,
            text=True,
            timeout=10
        )

        if result.returncode == 0:
            version = result.stdout.strip() or result.stderr.strip()
            # Extract first line for cleaner output
            version_line = version.split('\n')[0] if version else "installed"
            return True, version_line
        else:
            return False, None

    except FileNotFoundError:
        return False, None
    except subprocess.TimeoutExpired:
        return False, "timeout"
    except Exception as e:
        return False, str(e)


def check_python_module(module_name: str, import_name: str = None) -> Tuple[bool, str]:
    """
    Check if a Python module is installed.

    Args:
        module_name: Module name for pip install
        import_name: Import name (default: module_name)

    Returns:
        Tuple of (is_installed, version_string)
    """
    import_name = import_name or module_name

    try:
        result = subprocess.run(
            [sys.executable, "-c", f"import {import_name}; print({import_name}.__version__ if hasattr({import_name}, '__version__') else 'installed')"],
            capture_output=True,
            text=True,
            timeout=10
        )

        if result.returncode == 0:
            version = result.stdout.strip()
            return True, version
        else:
            return False, None

    except Exception:
        return False, None


def check_node_version() -> Tuple[bool, str, str]:
    """
    Check Node.js version and return major version number.

    Returns:
        Tuple of (is_installed, version_string, recommendation)
    """
    is_installed, version = check_command("node", ["--version"], "Node.js")

    if not is_installed:
        return False, None, "Install Node.js 18+ from https://nodejs.org/"

    # Extract version number (remove 'v' prefix)
    version_num = version.lstrip('v')
    try:
        major = int(version_num.split('.')[0])
        if major >= 18:
            return True, version, None
        else:
            return False, version, f"Node.js {major} is too old. Please upgrade to 18+"
    except:
        return True, version, "Could not determine version. Ensure it's 18+."


def check_npm_version() -> Tuple[bool, str]:
    """Check if npm is installed."""
    return check_command("npm", ["--version"], "npm")


def check_ffmpeg_version() -> Tuple[bool, str]:
    """Check if FFmpeg is installed."""
    return check_command("ffmpeg", ["-version"], "FFmpeg")


def check_faster_whisper() -> Tuple[bool, str]:
    """Check if faster-whisper is installed."""
    return check_python_module("faster-whisper", "faster_whisper")


def check_pydub() -> Tuple[bool, str]:
    """Check if pydub is installed."""
    return check_python_module("pydub", "pydub")


def check_remotion_project() -> Tuple[bool, str]:
    """
    Check if current directory is a Remotion project.

    Returns:
        Tuple of (is_remotion_project, message)
    """
    cwd = Path.cwd()

    # Check for package.json
    package_json = cwd / "package.json"
    if not package_json.exists():
        return False, "Not in a Node.js project (package.json not found)"

    # Check for Remotion dependencies
    try:
        with open(package_json, 'r', encoding='utf-8') as f:
            data = json.load(f)

        dependencies = data.get('dependencies', {}) | data.get('devDependencies', {})

        has_remotion = any('remotion' in dep for dep in dependencies.keys())

        if has_remotion:
            # Get version
            for dep in dependencies:
                if 'remotion' in dep:
                    return True, f"Found {dep}@{dependencies[dep]}"

            return True, "Remotion installed"
        else:
            return False, "Remotion not found in package.json"

    except Exception as e:
        return False, f"Error reading package.json: {e}"


def check_captions(args: argparse.Namespace) -> None:
    """Check if caption file exists and detect Traditional Chinese."""
    caption_paths = [
        "public/assets/captions.json",
        "public/captions.json",
        "assets/captions.json"
    ]

    caption_file = None
    for path in caption_paths:
        if Path(path).exists():
            caption_file = Path(path)
            break

    if not caption_file:
        print_warning("Caption file not found (this is optional)")
        print_info("Expected locations: " + ", ".join(caption_paths))
        return

    try:
        with caption_file.open('r', encoding='utf-8') as f:
            data = json.load(f)

        # Check for segments with text
        if 'segments' in data and len(data['segments']) > 0:
            # Check first few segments for Traditional Chinese
            traditional_chars = 0
            total_chars = 0
            sample_size = min(5, len(data['segments']))

            for segment in data['segments'][:sample_size]:
                text = segment.get('text', '')
                total_chars += len(text)
                # Simple heuristic: Traditional Chinese characters
                # Common traditional characters that differ from simplified
                traditional_indicators = [
                    '關於', '關於',  '這個', '這樣', '並沒',
                    '後', '來', '證', '們', '這個', '會',
                    '係', '實', '繫', '繫', '記', '讓',
                    '還', '題', '確', '種', '種類', '綫',
                    '準', '繪', '計', '劃', '壓', '變',
                    '樂', '難', '頭', '體', '為', '與',
                    '遠', '遊', '園', '據', '確', '業',
                    '標', '觀', '關', '歡', '塊', '態',
                    '臺', '導', '讀', '認', '實', '質',
                    '擬', '齊', '寫', '學', '優', '嚮',
                    '護', '寶', '攔', '權', '觀', '觸',
                    '聲', '聽', '處', '襲', '讓', '識',
                    '釋', '釋', '釋', '釋', '說', '說明',
                    '誤', '談', '調', '讓', '讓', '讓',
                    '體', '體', '體', '體', '體', '體',
                    '樣', '樣', '樣', '樣', '樣', '樣'
                ]
                for indicator in traditional_indicators:
                    if indicator in text:
                        traditional_chars += 1
                        break

            # If more than 30% of sampled text contains traditional indicators
            if total_chars > 0 and (traditional_chars / sample_size) > 0.3:
                print_warning(f"Caption file may contain Traditional Chinese: {caption_file}")
                print_info(f"Detected {traditional_chars} traditional indicators in {sample_size} samples")
                print()
                if OPENCC_AVAILABLE:
                    print(f"{Colors.BOLD}Recommendation:{Colors.END}")
                    print("Regenerate captions with Simplified Chinese conversion:")
                    print(f"  {Colors.YELLOW}python scripts/generate-captions.py <video> --language zh{Colors.END}")
                    print()
                    print("This will:")
                    print("  1. Auto-detect Chinese")
                    print("  2. Convert Traditional → Simplified using OpenCC")
                    print("  3. Output to captions.json")
                else:
                    print_info("Install OpenCC for Traditional → Simplified conversion:")
                    print(f"  {Colors.YELLOW}pip install opencc-python-reimplemented{Colors.END}")
            else:
                print_success(f"Caption file looks good: {caption_file}")
                if args.verbose:
                    print_info(f"  Found {len(data['segments'])} caption segments")

    except json.JSONDecodeError:
        print_error(f"Caption file is not valid JSON: {caption_file}")
    except Exception as e:
        print_error(f"Error checking caption file: {e}")


def generate_install_guide(failed_checks: List[Tuple[str, str]]):
    """Generate installation guide for missing dependencies."""
    print_header("Installation Guide")

    print(f"{Colors.BOLD}Please install the missing dependencies:{Colors.END}\n")

    install_commands = {
        "Node.js": """
{YELLOW}Node.js (18+){END}
  Download from: https://nodejs.org/
  Or use version manager:
    - Windows: Download installer from nodejs.org
    - macOS: brew install node
    - Linux: nvm install 18
""",
        "npm": """
{YELLOW}npm (Node Package Manager){END}
  Usually installed with Node.js.
  Verify: node --version && npm --version
""",
        "FFmpeg": """
{YELLOW}FFmpeg{END}
  {BLUE}Windows:{END}
    - Download: https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip
    - Extract and add to PATH
    - Or: choco install ffmpeg

  {BLUE}macOS:{END}
    - brew install ffmpeg

  {BLUE}Linux:{END}
    - sudo apt install ffmpeg   # Ubuntu/Debian
    - sudo yum install ffmpeg   # CentOS/RHEL
""",
        "faster-whisper": """
{YELLOW}faster-whisper (Python){END}
  pip install faster-whisper

  {BLUE}For faster inference (optional):{END}
  pip install faster-whisper[cpu]
""",
        "pydub": """
{YELLOW}pydub (Python){END}
  pip install pydub
""",
    }

    for name, _ in failed_checks:
        if name in install_commands:
            print(install_commands[name].format(
                YELLOW=Colors.YELLOW,
                BLUE=Colors.BLUE,
                END=Colors.END
            ))


def main():
    parser = argparse.ArgumentParser(
        description="Check environment for Remotion Tutorial Video skill",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python check-environment.py
  python check-environment.py --verbose

This script checks:
  - Node.js 18+
  - npm
  - FFmpeg
  - faster-whisper (Python)
  - pydub (Python)
  - Remotion project (optional)
        """
    )

    parser.add_argument(
        "--verbose",
        "-v",
        action="store_true",
        help="Show detailed version information"
    )

    parser.add_argument(
        "--skip-remotion-check",
        action="store_true",
        help="Skip checking if current directory is a Remotion project"
    )

    parser.add_argument(
        "--skip-caption-check",
        action="store_true",
        help="Skip checking caption file for Traditional Chinese"
    )

    args = parser.parse_args()

    print_header("Remotion Tutorial Video - Environment Check")

    # Track results
    all_checks_passed = True
    failed_checks = []

    # 1. Check Node.js
    print(f"{Colors.BOLD}Checking Node.js...{Colors.END}")
    is_installed, version, recommendation = check_node_version()

    if is_installed:
        print_success(f"Node.js is installed: {version}")
        if args.verbose:
            print_info(f"Version meets requirement (18+)")
    else:
        print_error(f"Node.js not found or version too old")
        if version:
            print_info(f"Found version: {version}")
        if recommendation:
            print_warning(recommendation)
        all_checks_passed = False
        failed_checks.append(("Node.js", recommendation))

    print()

    # 2. Check npm
    print(f"{Colors.BOLD}Checking npm...{Colors.END}")
    is_installed, version = check_npm_version()

    if is_installed:
        print_success(f"npm is installed: {version}")
    else:
        print_error("npm not found (should be installed with Node.js)")
        all_checks_passed = False
        failed_checks.append(("npm", None))

    print()

    # 3. Check FFmpeg
    print(f"{Colors.BOLD}Checking FFmpeg...{Colors.END}")
    is_installed, version = check_ffmpeg_version()

    if is_installed:
        print_success(f"FFmpeg is installed")
        if args.verbose:
            print_info(f"Version: {version}")
    else:
        print_error("FFmpeg not found")
        all_checks_passed = False
        failed_checks.append(("FFmpeg", None))

    print()

    # 4. Check Python modules
    print(f"{Colors.BOLD}Checking Python dependencies...{Colors.END}")

    is_installed, version = check_faster_whisper()
    if is_installed:
        print_success(f"faster-whisper is installed: {version}")
    else:
        print_error("faster-whisper not found")
        all_checks_passed = False
        failed_checks.append(("faster-whisper", None))

    is_installed, version = check_pydub()
    if is_installed:
        print_success(f"pydub is installed: {version}")
    else:
        print_error("pydub not found")
        all_checks_passed = False
        failed_checks.append(("pydub", None))

    print()

    # 5. Check caption file (if exists)
    if not args.skip_caption_check:
        print_header("Checking caption file...")
        check_captions(args)
    print()

    # 6. Check Remotion project (optional)
    if not args.skip_remotion_check:
        print(f"{Colors.BOLD}Checking Remotion project...{Colors.END}")
        is_remotion, message = check_remotion_project()

        if is_remotion:
            print_success(message)
        else:
            print_warning(message)
            print_info("This is optional. You can initialize a new project later.")

    print()

    # Summary
    print_header("Summary")

    if all_checks_passed:
        print(f"{Colors.GREEN}{Colors.BOLD}✓ All dependencies are installed!{Colors.END}\n")
        print(f"{Colors.BOLD}You're ready to create tutorial videos.{Colors.END}")
        print(f"\n{Colors.BLUE}Next steps:{Colors.END}")
        print("  1. Prepare your video assets")
        print("  2. Generate captions: python scripts/generate-captions.py <video>")
        print("  3. Preview: npm run dev")
        print("  4. Render: npx remotion render TutorialVideo out/video.mp4")
        return 0
    else:
        print(f"{Colors.RED}{Colors.BOLD}✗ Some dependencies are missing{Colors.END}\n")
        print(f"{Colors.BOLD}Please install the missing dependencies:{Colors.END}")
        print()

        for name, reason in failed_checks:
            print(f"  {Colors.RED}•{Colors.END} {name}")

        print()
        generate_install_guide(failed_checks)

        print(f"\n{Colors.YELLOW}After installing dependencies, run this script again to verify.{Colors.END}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
