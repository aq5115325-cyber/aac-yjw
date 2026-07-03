import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-6">
      <div className="text-6xl">🤔</div>
      <h1 className="text-2xl font-bold text-white">页面未找到</h1>
      <p className="text-sm text-gray-400 max-w-xs">
        你访问的页面不存在，可能已被移除或链接有误
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-2.5 bg-indigo-500 rounded-xl text-white text-sm font-medium hover:bg-indigo-600 transition-colors"
      >
        返回首页
      </button>
    </div>
  );
}
