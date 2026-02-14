// Remotion 配置文件
// 注意：此版本不包含 Tailwind 支持，避免依赖问题

import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// 如果需要 Tailwind 支持，需要先安装 @remotion/tailwind-v4
// 然后取消下面的注释：
//
// import { enableTailwind } from '@remotion/tailwind-v4';
// Config.overrideWebpackConfig(enableTailwind);
