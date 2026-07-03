/**
 * WorkoutX API Key（部署时通过环境变量传入）
 *
 * 使用方式：
 * 1. 复制本文件为 src/config.ts
 * 2. 把 WORKOUTX_API_KEY 改成你自己的 key
 * 3. 或在 Vercel Dashboard → Settings → Environment Variables 设置
 *    VITE_WORKOUTX_KEY
 *
 * ⚠️ 安全说明：
 * 此 Key 会被内联到前端 JS bundle（dist/assets/exerciseMedia-*.js），
 * 任何浏览器 DevTools 使用者都能看到。这是静态 SPA 的固有特性。
 *
 * 建议措施：
 * 1. 在 WorkoutX 后台设置较低的请求额度限制
 * 2. 不要将此 Key 用于需要严格保密的生产环境
 * 3. 如需生产部署，建议添加后端代理层隐藏 Key
 *
 * 如要获取自己的 Key，请访问：https://workoutxapp.com
 */
export const WORKOUTX_API_KEY: string =
  (import.meta.env.VITE_WORKOUTX_KEY as string | undefined) || 'your-api-key-here';

