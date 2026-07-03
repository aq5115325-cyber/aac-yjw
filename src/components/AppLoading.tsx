import { Dumbbell } from 'lucide-react';

/** 应用加载骨架屏 */
export default function AppLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 gap-6">
      {/* Logo 动画 */}
      <div className="relative">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse">
          <Dumbbell size={36} className="text-white" />
        </div>
        {/* 旋转光环 */}
        <div className="absolute -inset-2 rounded-2xl border-2 border-transparent border-t-indigo-500 animate-spin" />
      </div>

      {/* 品牌名 */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-white">健身跟练</h1>
        <p className="text-sm text-gray-500 mt-1">FitFollow</p>
      </div>

      {/* 加载提示 */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

/** 页面卡片加载占位 */
export function CardSkeleton() {
  return (
    <div className="bg-gray-900 rounded-2xl p-4 space-y-3 animate-pulse">
      <div className="h-5 bg-gray-800 rounded w-3/4" />
      <div className="h-3 bg-gray-800 rounded w-1/2" />
      <div className="flex gap-2 mt-2">
        <div className="h-5 bg-gray-800 rounded-full w-16" />
        <div className="h-5 bg-gray-800 rounded-full w-20" />
      </div>
    </div>
  );
}
