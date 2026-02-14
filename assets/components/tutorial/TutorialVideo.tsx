import { Sequence, staticFile, useVideoConfig } from "remotion";
import { z } from "zod";
import { useEffect, useState } from "react";
import { OpeningScene } from "./tutorial/OpeningScene";
import { ScreenRecording } from "./tutorial/ScreenRecording";
import { VisualHammer } from "./tutorial/VisualHammer";
import { BilibiliSubscribe } from "./tutorial/BilibiliSubscribe";

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
  title: z.string().default("过年回家，给爸妈展示领养的小龙虾"),
  // 副标题
  subtitle: z.string().default("Openclaw 新手教程"),
  // 品牌中文名称（可选）
  brandNameCn: z.string().optional(),
  // 品牌英文名称（可选）
  brandNameEn: z.string().optional(),
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
}) => {
  const { fps } = useVideoConfig();
  const [durations, setDurations] = useState({
    intro: 5 * fps,      // 默认值，会被实际值替换
    brand: 5 * fps,
    screenRecording: 60 * fps,
    subscribe: 5 * fps,
  });

  useEffect(() => {
    // 动态获取视频时长
    const getVideoDuration = (src: string): Promise<number> => {
      return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        video.preload = "metadata";
        const videoSrc = src.startsWith("http") ? src : staticFile(src);
        
        video.onloadedmetadata = () => {
          const duration = video.duration;
          if (isNaN(duration) || duration === 0) {
            reject(new Error(`无法获取视频时长: ${src}`));
          } else {
            resolve(duration);
          }
        };
        
        video.onerror = () => {
          reject(new Error(`加载视频失败: ${src}`));
        };
        
        video.src = videoSrc;
      });
    };

    const loadDurations = async () => {
      try {
        const [hostDuration, screenRecordingDuration] = await Promise.all([
          getVideoDuration(hostVideoUrl).catch(() => 5), // 默认 5 秒
          getVideoDuration(screenRecordingUrl).catch(() => 60), // 默认 60 秒
        ]);

        setDurations({
          intro: Math.ceil(hostDuration * fps),
          brand: 5 * fps,
          screenRecording: Math.ceil(screenRecordingDuration * fps),
          subscribe: 5 * fps,
        });
      } catch (error) {
        console.error("加载视频时长失败，使用默认值:", error);
      }
    };

    loadDurations();
  }, [hostVideoUrl, screenRecordingUrl, fps]);

  const { intro: introDuration, brand: visualHammerDuration, screenRecording: screenRecordingDuration, subscribe: subscribeDuration } = durations;

  return (
    <>
      {/* 1. 真人出镜开场 - 从0秒开始，持续5秒 */}
      <Sequence name="intro" durationInFrames={introDuration}>
        <OpeningScene
          hostVideoUrl={hostVideoUrl}
          title={title}
          subtitle={subtitle}
        />
      </Sequence>

      {/* 2. 品牌动画 - 从5秒开始，持续5秒 */}
      <Sequence
        name="visual-hammer"
        from={introDuration}
        durationInFrames={visualHammerDuration}
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
        from={introDuration + visualHammerDuration}
        durationInFrames={screenRecordingDuration}
      >
        <ScreenRecording
          screenRecordingUrl={screenRecordingUrl}
          avatarImage={avatarImage}
        />
      </Sequence>

      {/* 4. B站风格关注动画 - 从70秒开始，持续5秒 */}
      <Sequence
        name="subscribe"
        from={introDuration + visualHammerDuration + screenRecordingDuration}
        durationInFrames={subscribeDuration}
      >
        <BilibiliSubscribe />
      </Sequence>
    </>
  );
};
