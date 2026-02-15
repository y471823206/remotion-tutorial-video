import { Composition } from "remotion";
import { TutorialVideo } from "./TutorialVideo";
import { tutorialVideoSchema } from "./TutorialVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        component={TutorialVideo}
        // 使用 calculateMetadata 动态计算时长，而不是硬编码
        calculateMetadata={async ({ props }) => {
          // 动态获取视频时长
          const getVideoDuration = (src: string): Promise<number> => {
            return new Promise((resolve, reject) => {
              const video = document.createElement("video");
              video.preload = "metadata";

              // 处理相对路径
              const videoSrc = src.startsWith("http") ? src : `${window.location.origin}/${src}`;

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

          try {
            // 并行加载两个视频的时长
            const [hostDuration, screenRecordingDuration] = await Promise.all([
              getVideoDuration(props.hostVideoUrl).catch(() => 5), // 默认5秒
              getVideoDuration(props.screenRecordingUrl).catch(() => 60), // 默认60秒
            ]);

            const fps = 30;
            const introDuration = Math.ceil(hostDuration * fps);
            const brandDuration = 5 * fps; // 固定5秒
            const tutorialDuration = Math.ceil(screenRecordingDuration * fps);
            const subscribeDuration = 5 * fps; // 固定5秒

            const totalDuration = introDuration + brandDuration + tutorialDuration + subscribeDuration;

            console.log(`🎬 自动计算视频时长:`);
            console.log(`  开场: ${(hostDuration).toFixed(1)}s (${introDuration} 帧)`);
            console.log(`  品牌: 5.0s (${brandDuration} 帧)`);
            console.log(`  教程: ${(screenRecordingDuration).toFixed(1)}s (${tutorialDuration} 帧)`);
            console.log(`  订阅: 5.0s (${subscribeDuration} 帧)`);
            console.log(`  总计: ${(totalDuration / fps).toFixed(1)}s (${totalDuration} 帧)`);

            return {
              durationInFrames: totalDuration,
              props: {
                ...props,
                // 将计算好的时长传递给组件
                introDuration,
                brandDuration,
                tutorialDuration,
                subscribeDuration,
              },
            };
          } catch (error) {
            console.error("计算视频时长失败，使用默认值:", error);
            // 使用默认值：75秒
            return {
              durationInFrames: 75 * 30,
              props,
            };
          }
        }}
        fps={30}
        height={1080}
        width={1920}
        id="TutorialVideo"
        schema={tutorialVideoSchema}
        defaultProps={{
          hostVideoUrl: "assets/host-video.mp4",
          screenRecordingUrl: "assets/screen-recording.mp4",
          avatarImage: "assets/avatar.jpg",
          title: "过年回家，给爸妈展示领养的小龙虾",
          subtitle: "Openclaw 新手教程",
          logoImageUrl: "assets/logo.jpg",
          musicUrl: "assets/music.mp3",
          brandNameCn: "久久AI记",
          brandNameEn: "JiuJiu AI Notes",
        }}
      />
    </>
  );
};
