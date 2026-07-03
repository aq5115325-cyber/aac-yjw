// 直接从环境变量读取 API key，避免依赖 src/config.ts（.gitignore 中）
const WORKOUTX_API_KEY =
  (import.meta.env.VITE_WORKOUTX_KEY as string | undefined) || 'your-api-key-here';

const WORKOUTX_BASE = 'https://api.workoutxapp.com';

const PLACEHOLDER_KEY = 'your-api-key-here';

/** 判断 API key 是否有效 */
export function hasExerciseMediaKey(): boolean {
  return Boolean(WORKOUTX_API_KEY && WORKOUTX_API_KEY !== PLACEHOLDER_KEY);
}

/**
 * 获取动作 GIF URL
 * 使用 WorkoutX API，数据集 ID 与 API ID 完全一致
 * 当未配置有效 key 时返回 null，避免发起无意义的网络请求
 */
export function getExerciseGifUrl(exerciseId: string): string | null {
  if (!hasExerciseMediaKey()) return null;
  return `${WORKOUTX_BASE}/v1/gifs/${exerciseId}.gif?api-key=${WORKOUTX_API_KEY}`;
}

/**
 * 懒加载 GIF 的 onError 回调（兼容旧用法）：
 * 图片加载失败时隐藏图片并显示相邻的 fallback 元素
 * @deprecated 建议改用 <ExerciseImage /> 组件，不需要手动处理 error
 */
export function handleGifError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  img.style.display = 'none';
  const fallback = img.nextElementSibling;
  if (fallback) {
    (fallback as HTMLElement).style.display = 'flex';
  }
}
