import { staticFile } from "remotion";
import type { TranscriptionResult } from "./types";

/**
 * 从 JSON 文件加载字幕数据
 * @param filePath - 字幕文件路径（相对于 public 目录）
 * @returns 字幕数组
 */
export async function loadCaptions(
  filePath: string
): Promise<TranscriptionResult[]> {
  try {
    const response = await fetch(staticFile(filePath));
    if (!response.ok) {
      throw new Error(`Failed to load captions: ${response.statusText}`);
    }
    const data = await response.json();

    // 支持两种格式：
    // 1. 直接数组: [{ text, start, end }, ...]
    // 2. 包装对象: { captions: [{ text, start, end }, ...] }
    if (Array.isArray(data)) {
      return data;
    } else if (data.captions && Array.isArray(data.captions)) {
      return data.captions;
    } else {
      console.warn("Unexpected captions format:", data);
      return [];
    }
  } catch (error) {
    console.error("Error loading captions:", error);
    return [];
  }
}
