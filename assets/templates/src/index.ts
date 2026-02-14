import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

// 注册根组件 - Remotion 4.x 必须使用 registerRoot()
// 注意：不要使用 export { RemotionRoot }
registerRoot(RemotionRoot);
