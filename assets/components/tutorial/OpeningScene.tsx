import { AbsoluteFill, Video, useCurrentFrame, interpolate, staticFile } from "remotion";
import { motion } from "framer-motion";

interface OpeningSceneProps {
  hostVideoUrl: string;
  title: string;
  subtitle: string;
}

export const OpeningScene: React.FC<OpeningSceneProps> = ({
  hostVideoUrl,
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(frame, [0, 30], [0.9, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* 真人出镜视频 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        <Video
          src={staticFile(hostVideoUrl)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* 渐变叠加层 - 增强文字可读性 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 40%, transparent 70%)",
        }}
      />

      {/* 标题文字动画 */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 120,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            textAlign: "center",
            color: "#fff",
            textShadow: "0 2px 20px rgba(0,0,0,0.5)",
          }}
        >
          <h1
            style={{
              fontSize: 96,
              fontWeight: 700,
              margin: 0,
              marginBottom: 16,
              letterSpacing: 8,
            }}
          >
            {title}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              textAlign: "center",
              color: "#fff",
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              fontSize: 36,
            }}
          >
            {subtitle}
          </motion.p>
        </motion.div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
