import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, staticFile, Img, Audio } from "remotion";
import { motion } from "framer-motion";

interface VisualHammerProps {
  logoImageUrl?: string; // logo图片路径
  musicUrl?: string; // 音乐文件路径
  brandNameCn?: string; // 品牌中文名称（可选）
  brandNameEn?: string; // 品牌英文名称（可选）
}

// 品牌记忆点动画 - 5秒展示
export const VisualHammer: React.FC<VisualHammerProps> = ({
  logoImageUrl,
  musicUrl,
  brandNameCn = "久久AI记",  // 默认中文品牌名
  brandNameEn = "JiuJiu AI Notes"  // 默认英文品牌名
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo缩放动画 - 提前开始
  const logoScale = spring({
    frame: frame - 2,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.5 },
  });

  // 中文名称动画 - 提前开始
  const cnOpacity = interpolate(frame, [5, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  const cnY = interpolate(frame, [5, 30], [50, 0], {
    extrapolateRight: "clamp",
  });

  // 英文名称动画 - 提前开始
  const enOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateRight: "clamp",
  });
  const enY = interpolate(frame, [30, 50], [50, 0], {
    extrapolateRight: "clamp",
  });

  // 装饰圆圈动画
  const circleScale = spring({
    frame: frame - 20,
    fps,
    config: { damping: 20, stiffness: 60 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0a0a0a",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 背景音乐 - 只在前150帧（5秒）内播放 */}
      {musicUrl && frame < 145 && <Audio src={staticFile(musicUrl)} />}
      {/* 背景装饰圆圈 */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: circleScale * (1 + i * 0.15),
            opacity: 0.1 - i * 0.03,
          }}
          transition={{
            delay: i * 0.15,
            duration: 1.5,
          }}
          style={{
            position: "absolute",
            width: 350,
            height: 350,
            borderRadius: "50%",
            border: "2px solid rgba(255, 107, 157, 0.15)",
            boxShadow: "0 0 60px rgba(255, 107, 157, 0.15)",
          }}
        />
      ))}

      {/* 主要内容容器 */}
      <div
        style={{
          position: "relative",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        {/* Logo展示 - 支持图片或默认图标 */}
        {logoImageUrl && logoImageUrl.trim() !== "" ? (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: logoScale, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            style={{
              width: 140,
              height: 140,
              margin: "0 auto 24px",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 8px 24px rgba(255, 107, 157, 0.3)",
            }}
          >
            <Img
              src={staticFile(logoImageUrl)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: logoScale, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            style={{
              width: 140,
              height: 140,
              margin: "0 auto 24px",
              borderRadius: "8px",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 64,
              color: "#FF6B9D",
              boxShadow: "0 8px 24px rgba(255, 107, 157, 0.3)",
            }}
          >
            📝
          </motion.div>
        )}

        {/* 中文名称 */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: cnOpacity, y: cnY }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            fontSize: 72,
            fontWeight: 800,
            margin: 0,
            marginBottom: 16,
            background: "linear-gradient(90deg, #FF6B9D, #C44CD9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "4px",
            textShadow: "0 2px 20px rgba(0, 0, 0, 0.5)",
          }}
        >
          {brandNameCn}
        </motion.h1>

        {/* 英文名称 */}
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: enOpacity, y: enY }}
          transition={{ delay: 1.0, duration: 0.8 }}
          style={{
            fontSize: 32,
            fontWeight: 600,
            margin: 0,
            color: "rgba(255, 255, 255, 0.9)",
            letterSpacing: "8px",
            textTransform: "uppercase",
          }}
        >
          {brandNameEn}
        </motion.p>

        {/* 装饰线 */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 180 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          style={{
            height: 4,
            background: "linear-gradient(90deg, #FF6B9D, #6B9DFF)",
            borderRadius: 2,
            margin: "24px auto 0",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
