#!/usr/bin/env python3
"""Get video duration for Remotion configuration - Supports both host and tutorial videos"""

import argparse
import json
import subprocess
from pathlib import Path
from typing import Optional


def get_duration(video: str, fps: int = 30) -> dict:
    """Get video duration using ffprobe"""
    cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", video]
    result = subprocess.run(cmd, capture_output=True, text=True, check=True)
    seconds = float(json.loads(result.stdout)["format"]["duration"])
    return {"seconds": round(seconds, 2), "frames": int(seconds * fps), "fps": fps}


def print_config(host: Optional[dict] = None, tutorial: Optional[dict] = None, fps: int = 30):
    """Print Remotion configuration"""
    print("\n" + "=" * 60)
    print("Remotion Configuration")
    print("=" * 60)

    brand = 5 * fps
    subscribe = 5 * fps

    if host:
        opening = host["frames"]
        host_sec = host["seconds"]
        print(f"\n// In TutorialVideo.tsx")
        print(f"const OPENING_DURATION = {opening}; // {host_sec}s @ {fps}fps (from host-video.mp4)")
    else:
        opening = 5 * fps
        print(f"\n// In TutorialVideo.tsx")
        print(f"const OPENING_DURATION = {opening}; // 5s @ {fps}fps (default)")

    print(f"const BRAND_DURATION = {brand}; // 5s @ {fps}fps")

    if tutorial:
        tut_duration = tutorial["frames"]
        tut_sec = tutorial["seconds"]
        print(f"const TUTORIAL_DURATION = {tut_duration}; // {tut_sec}s @ {fps}fps (from screen-recording.mp4)")
    else:
        tut_duration = 60 * fps
        print(f"const TUTORIAL_DURATION = {tut_duration}; // 60s @ {fps}fps (default)")

    print(f"const SUBSCRIBE_DURATION = {subscribe}; // 5s @ {fps}fps")

    total = opening + brand + tut_duration + subscribe
    print(f"\n// In Root.tsx")
    print(f"durationInFrames={total}, // {total/fps:.0f}s @ {fps}fps")
    print(f"\n// Scene breakdown:")
    print(f"// Opening: {opening/fps:.1f}s (from host-video.mp4)")
    print(f"// Brand: {brand/fps:.1f}s (fixed)")
    print(f"// Tutorial: {tut_duration/fps:.1f}s (from screen-recording.mp4)")
    print(f"// Subscribe: {subscribe/fps:.1f}s (fixed)")
    print(f"// TOTAL: {total/fps:.1f}s")


def main():
    parser = argparse.ArgumentParser(description="Get video duration for Remotion configuration")
    parser.add_argument("videos", nargs="+", help="Video file(s) - host-video.mp4 and/or screen-recording.mp4")
    parser.add_argument("--fps", type=int, default=30, help="Frame rate (default: 30)")
    parser.add_argument("--remotion-config", "-r", action="store_true", help="Print Remotion config")
    args = parser.parse_args()

    host = None
    tutorial = None

    for v in args.videos:
        info = get_duration(v, args.fps)
        name = Path(v).name.lower()
        if "host" in name:
            host = info
        else:
            tutorial = info

    if args.remotion_config:
        print_config(host, tutorial, args.fps)
    else:
        if host:
            print(f"Host Video: {host['seconds']}s ({host['frames']} frames @ {args.fps}fps)")
        if tutorial:
            print(f"Screen Recording: {tutorial['seconds']}s ({tutorial['frames']} frames @ {args.fps}fps)")


if __name__ == "__main__":
    main()
