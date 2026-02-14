#!/usr/bin/env python3
"""
Generate captions from video audio using faster-whisper.

This script extracts audio from a video file and generates
accurate timestamps for subtitle segments.

Requirements:
    pip install faster-whisper

Usage:
    python generate-captions.py <video-file> [--output captions.json] [--model base] [--language en]
"""

import argparse
import json
import sys
from pathlib import Path

try:
    from faster_whisper import WhisperModel
except ImportError:
    print("Error: faster-whisper not installed.")
    print("Install with: pip install faster-whisper")
    sys.exit(1)

try:
    import opencc
    OPENCC_AVAILABLE = True
except ImportError:
    OPENCC_AVAILABLE = False
    print("Warning: opencc not installed. Traditional Chinese will not be converted to Simplified.")
    print("Install with: pip install opencc-python-reimplemented")


def convert_traditional_to_simplified(text: str) -> str:
    """Convert Traditional Chinese to Simplified Chinese using OpenCC."""
    if not OPENCC_AVAILABLE:
        return text
    try:
        converter = opencc.OpenCC('t2s')  # Traditional to Simplified
        return converter.convert(text)
    except Exception as e:
        print(f"Warning: OpenCC conversion failed: {e}")
        return text


def generate_captions(
    video_path: str,
    output_path: str = "captions.json",
    model_size: str = "base",
    language: str = "auto",
    compute_type: str = "int8",
    convert_to_simplified: bool = True
) -> dict:
    """
    Generate captions from video file.

    Args:
        video_path: Path to video file
        output_path: Path to output JSON file
        model_size: Whisper model size (tiny, base, small, medium, large)
        language: Language code (en, es, zh, fr, etc.) or 'auto' for auto-detect
        compute_type: Computation type (float16, int8, int8_float16)
        convert_to_simplified: Convert Traditional Chinese to Simplified (default: True)

    Returns:
        Dictionary with caption segments
    """
    print(f"🎬 Loading model: {model_size}")

    # Initialize Whisper model
    model = WhisperModel(
        model_size,
        device="cpu",
        compute_type=compute_type
    )

    print(f"🎵 Processing audio from: {video_path}")

    # Transcribe audio
    segments, info = model.transcribe(
        video_path,
        language=None if language == "auto" else language,
        beam_size=5,
        vad_filter=True,
        word_timestamps=True
    )

    # Convert to Remotion caption format
    captions = []
    segment_count = 0

    for segment in segments:
        segment_count += 1
        text = segment.text.strip()

        # Convert Traditional Chinese to Simplified Chinese if enabled
        if convert_to_simplified and language and language.startswith('zh'):
            text = convert_traditional_to_simplified(text)

        caption = {
            "id": segment_count,
            "start": round(segment.start, 3),
            "end": round(segment.end, 3),
            "text": text,
            "confidence": min(1.0, segment.no_speech_prob if hasattr(segment, 'no_speech_prob') else 1.0)
        }
        captions.append(caption)
        print(f"  [{segment_count}] {caption['start']:.2f}s - {caption['end']:.2f}s: {caption['text']}")

    # Detect language if auto
    detected_lang = info.language if language == "auto" else language
    print(f"\n📝 Detected language: {detected_lang} (probability: {info.language_probability:.2f})")
    print(f"✅ Generated {len(captions)} caption segments")

    # Prepare output data
    output_data = {
        "language": detected_lang,
        "segments": captions
    }

    # Write to JSON file
    output_file = Path(output_path)
    output_file.parent.mkdir(parents=True, exist_ok=True)

    with output_file.open('w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)

    print(f"💾 Saved captions to: {output_path}")

    return output_data


def main():
    parser = argparse.ArgumentParser(
        description="Generate captions from video using faster-whisper",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Basic usage
  python generate-captions.py video.mp4

  # Specify output file
  python generate-captions.py video.mp4 --output public/assets/captions.json

  # Use larger model for better accuracy
  python generate-captions.py video.mp4 --model medium

  # Specify language (faster and more accurate)
  python generate-captions.py video.mp4 --language zh

  # Auto-detect language
  python generate-captions.py video.mp4 --language auto

Model sizes (accuracy vs speed):
  tiny    - Fastest, lowest accuracy
  base    - Fast, good accuracy (recommended)
  small   - Moderate speed, better accuracy
  medium  - Slower, high accuracy
  large   - Slowest, best accuracy

Language codes:
  en - English, es - Spanish, zh - Chinese, fr - French, de - German
  ja - Japanese, ko - Korean, ru - Russian, pt - Portuguese
        """
    )

    parser.add_argument(
        "video",
        help="Path to video file for caption generation"
    )

    parser.add_argument(
        "--output",
        "-o",
        default="captions.json",
        help="Output JSON file path (default: captions.json)"
    )

    parser.add_argument(
        "--model",
        "-m",
        choices=["tiny", "base", "small", "medium", "large"],
        default="base",
        help="Whisper model size (default: base)"
    )

    parser.add_argument(
        "--language",
        "-l",
        default="zh",
        help="Language code (en, es, zh, zh-CN, etc.) or 'auto' to detect (default: zh-CN for Simplified Chinese)"
    )

    parser.add_argument(
        "--compute-type",
        choices=["float16", "int8", "int8_float16"],
        default="int8",
        help="Computation type for faster processing (default: int8)"
    )

    parser.add_argument(
        "--no-convert",
        action="store_true",
        help="Disable Traditional Chinese to Simplified Chinese conversion"
    )

    args = parser.parse_args()

    # Validate video file exists
    if not Path(args.video).exists():
        print(f"❌ Error: Video file not found: {args.video}")
        sys.exit(1)

    try:
        generate_captions(
            video_path=args.video,
            output_path=args.output,
            model_size=args.model,
            language=args.language,
            compute_type=args.compute_type,
            convert_to_simplified=not args.no_convert
        )
    except Exception as e:
        print(f"\n❌ Error generating captions: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
