import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { motion } from "framer-motion";

// B站经典配色
const BILI_PINK = "#FB7299";
const BILI_BLUE = "#00A1D6";

// 使用 interpolate 创建伪随机值
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export const BilibiliSubscribe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 弹性动画参数
  const springConfig = {
    damping: 15,
    stiffness: 100,
    mass: 1,
  };

  // 三连按钮动画
  const coinScale = spring({
    frame: frame - 10,
    fps,
    config: springConfig,
  });

  const likeScale = spring({
    frame: frame - 20,
    fps,
    config: springConfig,
  });

  const favScale = spring({
    frame: frame - 30,
    fps,
    config: springConfig,
  });

  const followScale = spring({
    frame: frame - 40,
    fps,
    config: springConfig,
  });

  // 文字淡入
  const textOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 整体容器缩放
  const containerScale = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 80, mass: 1 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1a1a1a",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* 背景装饰 */}
      <motion.div
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${BILI_PINK}20, ${BILI_BLUE}20)`,
          filter: "blur(40px)",
        }}
      />

      <div
        style={{
          transform: `scale(${Math.min(containerScale, 1)})`,
          textAlign: "center",
        }}
      >
        {/* B站风格三连按钮 */}
        <div
          style={{
            display: "flex",
            gap: 24,
            marginBottom: 48,
            justifyContent: "center",
          }}
        >
          {/* 投币 */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: Math.min(coinScale, 1), rotate: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            style={{
              width: 100,
              height: 100,
              borderRadius: "20px",
              background: `linear-gradient(135deg, ${BILI_PINK}, #FFB86C)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(251, 114, 153, 0.4)",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 36 }}>🪙</span>
            <span style={{ fontSize: 16, color: "#fff", fontWeight: 600, marginTop: 4 }}>
              投币
            </span>
          </motion.div>

          {/* 点赞 */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: Math.min(likeScale, 1), rotate: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            style={{
              width: 100,
              height: 100,
              borderRadius: "20px",
              background: `linear-gradient(135deg, ${BILI_BLUE}, #6B9DFF)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(0, 161, 214, 0.4)",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 36 }}>👍</span>
            <span style={{ fontSize: 16, color: "#fff", fontWeight: 600, marginTop: 4 }}>
              点赞
            </span>
          </motion.div>

          {/* 收藏 */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: Math.min(favScale, 1), rotate: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            style={{
              width: 100,
              height: 100,
              borderRadius: "20px",
              background: "linear-gradient(135deg, #FFB86C, #FF6B9D)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(255, 184, 108, 0.4)",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 36 }}>⭐</span>
            <span style={{ fontSize: 16, color: "#fff", fontWeight: 600, marginTop: 4 }}>
              收藏
            </span>
          </motion.div>

          {/* 关注 */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: Math.min(followScale, 1), rotate: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            style={{
              width: 100,
              height: 100,
              borderRadius: "20px",
              background: "linear-gradient(135deg, #4CAF50, #8BC34A)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(76, 175, 80, 0.4)",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 36 }}>➕</span>
            <span style={{ fontSize: 16, color: "#fff", fontWeight: 600, marginTop: 4 }}>
              关注
            </span>
          </motion.div>
        </div>

        {/* 关注提示文字 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: textOpacity, y: 0 }}
          style={{
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: 48,
              fontWeight: 700,
              margin: 0,
              marginBottom: 16,
              background: `linear-gradient(90deg, ${BILI_PINK}, ${BILI_BLUE})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            一键三连，如果对你有帮助！
          </h2>
          <p
            style={{
              fontSize: 24,
              color: "rgba(255,255,255,0.8)",
              margin: 0,
            }}
          >
            关注我，获取更多精彩教程
          </p>
        </motion.div>

        {/* 小电视Logo装饰 */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.8, type: "spring" }}
          style={{
            marginTop: 32,
            fontSize: 48,
          }}
        >
          📺
        </motion.div>
      </div>

      {/* 漂浮粒子效果 */}
      {[...Array(20)].map((_, i) => {
        const seed = i * 100;
        return (
          <motion.div
            key={i}
            initial={{
              x: pseudoRandom(seed) * 1920,
              y: 1080 + pseudoRandom(seed + 1) * 200,
              opacity: 0,
            }}
            animate={{
              y: -100,
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + pseudoRandom(seed + 2) * 2,
              delay: i * 0.1,
              repeat: Infinity,
            }}
            style={{
              position: "absolute",
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: i % 2 === 0 ? BILI_PINK : BILI_BLUE,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
