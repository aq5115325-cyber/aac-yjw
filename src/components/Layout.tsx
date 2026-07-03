import { useLocation } from 'react-router-dom';
import { Dumbbell, Home, History, Settings } from 'lucide-react';
import { clsx } from 'clsx';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '首页', icon: Home },
    { path: '/plans', label: '计划', icon: Dumbbell },
    { path: '/history', label: '历史', icon: History },
    { path: '/settings', label: '设置', icon: Settings },
  ];

  // 高亮逻辑：/plan/* 路径归属于「计划」tab
  const activePath = (() => {
    if (location.pathname === '/') return '/';
    if (location.pathname.startsWith('/plan') || location.pathname === '/plans') return '/plans';
    if (location.pathname === '/history') return '/history';
    if (location.pathname === '/settings') return '/settings';
    return location.pathname;
  })();

  return (
    <div className="flex flex-col min-h-screen max-w-lg mx-auto bg-gray-950">
      {/* 主内容 */}
      <main className="flex-1 pb-20 px-4 pt-4 overflow-y-auto">
        {children}
      </main>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
        <div className="max-w-lg mx-auto flex justify-around py-2">
          {navItems.map((item) => {
            const isActive = activePath === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => (window.location.href = item.path)}
                className={clsx(
                  'flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-colors',
                  isActive ? 'text-indigo-400' : 'text-gray-500',
                )}
              >
                <Icon size={22} />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
