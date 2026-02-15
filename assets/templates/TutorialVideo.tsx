import { Sequence, staticFile, useVideoConfig } from "remotion";
import { z } from "zod";
import { OpeningScene } from "./OpeningScene";
import { ScreenRecording } from "./ScreenRecording";
import { VisualHammer } from "./VisualHammer";
import { BilibiliSubscribe } from "./BilibiliSubscribe";

export const tutorialVideoSchema = z.object({
  // 真人出镜视频路径（开场用）
  hostVideoUrl: z.string().default("assets/host-video.mp4"),
  // 录屏视频路径
  screenRecordingUrl: z.string().default("assets/screen-recording.mp4"),
  // 画中画：从开场视频截取的头像图（供 InfiniteTalk 对口型）
  avatarImage: z.string().optional(),
  // 画中画：教程语音音频（录屏音轨或独立文件，供 InfiniteTalk 对口型）
  avatarAudio: z.string().optional(),
  // 画中画：Avatar 生成模式 'auto' | 'local' | 'fal'
  avatarMode: z.enum(["auto", "local", "fal"]).optional(),
  // Logo图片路径
  logoImageUrl: z.string().optional(),
  // 音乐文件路径
  musicUrl: z.string().optional(),
  // 主标题
  title: z.string().default("我的教程视频"),
  // 副标题
  subtitle: z.string().default("副标题"),
  // 品牌中文名称（可选）
  brandNameCn: z.string().optional(),
  // 品牌英文名称（可选）
  brandNameEn: z.string().optional(),

  // 以下字段由 calculateMetadata 自动计算，无需手动设置
  introDuration: z.number().optional(),
  brandDuration: z.number().optional(),
  tutorialDuration: z.number().optional(),
  subscribeDuration: z.number().optional(),
});

export type TutorialVideoProps = z.infer<typeof tutorialVideoSchema>;

export const TutorialVideo: React.FC<TutorialVideoProps> = ({
  hostVideoUrl,
  screenRecordingUrl,
  avatarImage,
  avatarAudio,
  avatarMode = "auto",
  logoImageUrl,
  musicUrl,
  title,
  subtitle,
  brandNameCn,
  brandNameEn,
  // 从 calculateMetadata 接收的时长参数
  introDuration,
  brandDuration = 150, // 默认5秒 @ 30fps
  tutorialDuration,
  subscribeDuration = 150, // 默认5秒 @ 30fps
}) => {
  const { fps } = useVideoConfig();

  // 如果没有传递时长（fallback），使用默认值
  const intro = introDuration || 5 * fps;
  const brand = brandDuration || 5 * fps;
  const tutorial = tutorialDuration || 60 * fps;
  const subscribe = subscribeDuration || 5 * fps;

  return (
    <>
      {/* 1. 真人出镜开场 - 从0秒开始 */}
      <Sequence name="intro" from={0} durationInFrames={intro}>
        <OpeningScene
          hostVideoUrl={hostVideoUrl}
          title={title}
          subtitle={subtitle}
        />
      </Sequence>

      {/* 2. 品牌动画 - 从开场结束后开始 */}
      <Sequence
        name="brand"
        from={intro}
        durationInFrames={brand}
      >
        <VisualHammer
          logoImageUrl={logoImageUrl}
          musicUrl={musicUrl}
          brandNameCn={brandNameCn}
          brandNameEn={brandNameEn}
        />
      </Sequence>

      {/* 3. 录屏教程 + 画中画（静态头像） */}
      <Sequence
        name="screen-recording"
        from={intro + brand}
        durationInFrames={tutorial}
      >
        <ScreenRecording
          screenRecordingUrl={screenRecordingUrl}
          avatarImage={avatarImage || ""}
        />
      </Sequence>

      {/* 4. B站风格关注动画 */}
      <Sequence
        name="subscribe"
        from={intro + brand + tutorial}
        durationInFrames={subscribe}
      >
        <BilibiliSubscribe />
      </Sequence>
    </>
  );
};
