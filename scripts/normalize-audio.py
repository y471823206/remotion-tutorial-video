#!/usr/bin/env python3
"""
Normalize audio levels in video files.

This script ensures consistent audio volume across all video assets
by normalizing to -16 LUFS (EBU R128 standard).

Requirements:
    pip install pydub
    FFmpeg must be installed and in PATH

Usage:
    python normalize-audio.py <input-video> [--output output.mp4] [--target-lufs -16]
"""

import argparse
import sys
import subprocess
from pathlib import Path

try:
    from pydub import AudioSegment
    from pydub.effects import normalize
except ImportError:
    print("Error: pydub not installed.")
    print("Install with: pip install pydub")
    sys.exit(1)


def check_ffmpeg():
    """Verify FFmpeg is installed and accessible."""
    try:
        subprocess.run(
            ["ffmpeg", "-version"],
            capture_output=True,
            check=True
        )
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


def extract_audio(video_path: str, audio_output: str = "temp_audio.wav") -> str:
    """
    Extract audio from video file using FFmpeg.

    Args:
        video_path: Path to input video
        audio_output: Path for extracted audio

    Returns:
        Path to extracted audio file
    """
    print(f"🎵 Extracting audio from video...")

    cmd = [
        "ffmpeg",
        "-i", video_path,
        "-vn",  # No video
        "-acodec", "pcm_s16le",  # Uncompressed audio
        "-ar", "48000",  # 48kHz sample rate
        "-ac", "2",  # Stereo
        "-y",  # Overwrite
        audio_output
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        raise RuntimeError(f"FFmpeg extraction failed: {result.stderr}")

    print(f"✅ Audio extracted to: {audio_output}")
    return audio_output


def normalize_audio_file(
    input_audio: str,
    output_audio: str,
    target_dBFS: float = -20.0
) -> str:
    """
    Normalize audio to target level.

    Args:
        input_audio: Path to input audio file
        output_audio: Path for normalized audio
        target_dBFS: Target volume in dBFS (default: -20.0)

    Returns:
        Path to normalized audio file
    """
    print(f"🔊 Normalizing audio to {target_dBFS} dBFS...")

    # Load audio
    audio = AudioSegment.from_file(input_audio)

    # Calculate current volume
    current_dBFS = audio.dBFS
    print(f"   Current volume: {current_dBFS:.2f} dBFS")

    # Check if normalization needed
    if current_dBFS < target_dBFS - 1:
        print(f"   ⚠️  Audio is too quiet, normalizing...")
        normalized = normalize(audio, headroom=0.1)
    elif current_dBFS > target_dBFS + 1:
        print(f"   ⚠️  Audio is too loud, normalizing...")
        # Reduce volume
        change_in_dBFS = target_dBFS - current_dBFS
        normalized = audio.apply_gain(change_in_dBFS)
    else:
        print(f"   ✅ Audio is already at target level")
        normalized = audio

    # Export normalized audio
    normalized.export(output_audio, format="wav")
    print(f"💾 Normalized audio saved to: {output_audio}")

    return output_audio


def combine_audio_video(
    video_input: str,
    audio_input: str,
    video_output: str
):
    """
    Combine normalized audio with original video.

    Args:
        video_input: Path to original video
        audio_input: Path to normalized audio
        video_output: Path for output video
    """
    print(f"🎬 Combining audio and video...")

    cmd = [
        "ffmpeg",
        "-i", video_input,  # Input video
        "-i", audio_input,  # Normalized audio
        "-c:v", "copy",  # Copy video stream (no re-encoding)
        "-c:a", "aac",  # Encode audio as AAC
        "-b:a", "192k",  # Audio bitrate
        "-map", "0:v:0",  # Use video from first input
        "-map", "1:a:0",  # Use audio from second input
        "-shortest",  # Match shortest stream
        "-y",  # Overwrite
        video_output
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        raise RuntimeError(f"FFmpeg combination failed: {result.stderr}")

    print(f"✅ Combined video saved to: {video_output}")


def cleanup_temp_file(file_path: str):
    """Remove temporary file if it exists."""
    try:
        Path(file_path).unlink()
        print(f"🧹 Cleaned up temporary file: {file_path}")
    except Exception as e:
        print(f"⚠️  Could not remove temporary file: {e}")


def main():
    parser = argparse.ArgumentParser(
        description="Normalize audio levels in video files",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Normalize video audio
  python normalize-audio.py video.mp4

  # Specify custom output
  python normalize-audio.py video.mp4 --output video-normalized.mp4

  # Set custom target level
  python normalize-audio.py video.mp4 --target-dBFS -16

  # Keep intermediate files
  python normalize-audio.py video.mp4 --keep-temp

Target Levels:
  -20.0 dBFS - Standard for web video (default)
  -16.0 dBFS - EBU R128 broadcast standard
  -14.0 dBFS - YouTube recommended
        """
    )

    parser.add_argument(
        "video",
        help="Path to input video file"
    )

    parser.add_argument(
        "--output",
        "-o",
        help="Path for output video (default: <input>-normalized.mp4)"
    )

    parser.add_argument(
        "--target-dBFS",
        "-t",
        type=float,
        default=-20.0,
        help="Target audio level in dBFS (default: -20.0)"
    )

    parser.add_argument(
        "--keep-temp",
        action="store_true",
        help="Keep temporary audio files (for debugging)"
    )

    args = parser.parse_args()

    # Check FFmpeg installation
    if not check_ffmpeg():
        print("❌ Error: FFmpeg not found.")
        print("Install FFmpeg: https://ffmpeg.org/download.html")
        sys.exit(1)

    # Validate input file
    input_path = Path(args.video)
    if not input_path.exists():
        print(f"❌ Error: Video file not found: {args.video}")
        sys.exit(1)

    # Generate output path
    if args.output:
        output_path = args.output
    else:
        stem = input_path.stem
        output_path = str(input_path.parent / f"{stem}-normalized.mp4")

    # Temporary audio files
    temp_audio_extract = "temp_audio_extract.wav"
    temp_audio_normalized = "temp_audio_normalized.wav"

    try:
        # Step 1: Extract audio
        extract_audio(args.video, temp_audio_extract)

        # Step 2: Normalize audio
        normalize_audio_file(
            temp_audio_extract,
            temp_audio_normalized,
            args.target_dBFS
        )

        # Step 3: Combine with video
        combine_audio_video(
            args.video,
            temp_audio_normalized,
            output_path
        )

        print(f"\n🎉 Successfully normalized video: {output_path}")

    except Exception as e:
        print(f"\n❌ Error: {e}")
        sys.exit(1)

    finally:
        # Cleanup temporary files
        if not args.keep_temp:
            cleanup_temp_file(temp_audio_extract)
            cleanup_temp_file(temp_audio_normalized)


if __name__ == "__main__":
    main()
