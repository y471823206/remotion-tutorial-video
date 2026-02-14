import { AbsoluteFill, Video, useCurrentFrame, interpolate, staticFile, Img } from "remotion";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { loadCaptions } from "../../lib/transcript";
import type { TranscriptionResult } from "../../lib/types";

interface ScreenRecordingProps {
  screenRecordingUrl: string;
  avatarImage: string; // 画中画头像图片
}

export const ScreenRecording: React.FC<ScreenRecordingProps> = ({
  screenRecordingUrl,
  avatarImage,
}) => {
  const frame = useCurrentFrame();

  // 字幕状态（支持浏览器预览和渲染）
  const [captions, setCaptions] = useState<TranscriptionResult[]>([]);

  // 加载字幕数据（从 JSON 文件加载，支持浏览器预览）
  useEffect(() => {
    const loadCaptionsData = async () => {
      // 加载预生成的字幕文件
      console.log("🎬 ScreenRecording: 开始加载字幕...");
      const result = await loadCaptions("assets/captions.json");
      console.log(`🎬 ScreenRecording: 字幕数据 =`, result);
      setCaptions(result);
    };

    loadCaptionsData();
  }, []); // 只在组件挂载时加载一次

  // 画中画头像动画
  const avatarScale = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const avatarOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  // 边框呼吸效果（2秒周期）
  const pulseScale = interpolate(
    frame % 60,  // 2秒周期（60帧@30fps）
    [0, 30, 60],
    [1, 1.02, 1],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

  // ✨ 绿色在线指示器（与边框呼吸同步）
  const indicatorScale = interpolate(
    frame % 60,  // 同步2秒周期
    [0, 30, 60],
    [0.8, 1, 0.8],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );
  const indicatorOpacity = interpolate(
    frame % 60,
    [0, 30, 60],
    [0.5, 0.8, 0.5],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

  // 获取当前帧应该显示的字幕
  const getCurrentCaption = () => {
    const currentTime = frame / 30; // 转换为秒
    const currentCaption = captions.find(
      (cap) => currentTime >= cap.start && currentTime <= (cap.end || cap.start + 5)
    );
    return currentCaption?.text || "";
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#0f0f0f" }}>
      {/* 录屏视频主画面 */}
      <Video
        src={staticFile(screenRecordingUrl)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* 顶部标题栏装饰 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent)",
          display: "flex",
          alignItems: "center",
          paddingLeft: 24,
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 200 }}
          transition={{ duration: 0.5 }}
          style={{
            height: 4,
            background: "linear-gradient(90deg, #FF6B9D, #C44CD9, #6B9DFF)",
            borderRadius: 2,
          }}
        />
      </div>

      {/* 右下角圆形头像画中画 */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          right: 32,
          opacity: avatarOpacity,
          transform: `scale(${avatarScale})`,
        }}
      >
        {/* 呼吸边框效果 */}
        <div
          style={{
            position: "absolute",
            inset: -6,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FF6B9D, #C44CD9, #6B9DFF)",
            filter: "blur(8px)",
            opacity: 0.6 * pulseScale,
          }}
        />

        {/* 头像图片容器 */}
        <div
          style={{
            position: "relative",
            width: 160,
            height: 160,
            borderRadius: "50%",
            overflow: "hidden",
            border: "4px solid #fff",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
          <motion.div
            animate={{
              rotate: [0, 1, -1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <Img
              src={staticFile(avatarImage)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </motion.div>
        </div>

        {/* 绿色在线指示器 - 右下角小绿点（在边框线上） */}
        <div
          style={{
            position: "absolute",
            bottom: 18,
            right: 18,
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: "#22c55e", // 绿色
            opacity: indicatorOpacity,
            border: "2px solid #fff",
            boxShadow: "0 2px 8px rgba(34, 197, 94, 0.5)",
            zIndex: 2,
          }}
        />
      </div>

      {/* 自动字幕显示 - 支持浏览器预览和渲染 */}
      {captions.length > 0 ? (
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            fontSize: 24,
            fontFamily: "PingFang SC, Microsoft YaHei, sans-serif",
            fontWeight: "bold",
            textAlign: "center",
            maxWidth: "80%",
            textShadow: `
              -1px -1px 0 #000,
              1px -1px 0 #000,
              -1px 1px 0 #000,
              1px 1px 0 #000,
              -1px 0 0 #000,
              1px 0 0 #000,
              0 -1px 0 #000,
              0 1px 0 #000,
              0 0 2px #000,
              0 0 3px #000
            `,
            padding: "8px 16px",
            backgroundColor: "transparent",
          }}
        >
          {getCurrentCaption()}
        </div>
      ) : (
        /* 调试：显示字幕未加载提示 */
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 20,
            backgroundColor: "rgba(255, 0, 0, 0.5)",
            color: "white",
            padding: "8px 16px",
            borderRadius: 4,
            fontSize: 14,
            fontFamily: "monospace",
          }}
        >
          ⚠️ 字幕未加载 (captions.length: {captions.length})
        </div>
      )}
    </AbsoluteFill>
  );
};
