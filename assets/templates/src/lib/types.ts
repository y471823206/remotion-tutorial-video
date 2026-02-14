/**
 * 字幕条目类型
 */
export interface TranscriptionResult {
  text: string;
  start: number;
  end: number;
}

/**
 * 字幕响应类型
 */
export interface CaptionResponse {
  captions: TranscriptionResult[];
}
