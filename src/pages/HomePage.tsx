import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Dumbbell, Plus, Zap } from 'lucide-react';
import FreeWorkoutTab from '../components/tabs/FreeWorkoutTab';
import PresetPlansTab from '../components/tabs/PresetPlansTab';
import CustomPlansTab from '../components/tabs/CustomPlansTab';

type Tab = 'plans' | 'free' | 'custom';

const tabs: { key: Tab; label: string; icon: typeof Zap }[] = [
  { key: 'free', label: '自由跟练', icon: Zap },
  { key: 'plans', label: '预设计划', icon: Dumbbell },
  { key: 'custom', label: '自定义', icon: Plus },
];

export default function HomePage() {
  const location = useLocation();
  const [tab, setTab] = useState<Tab>('plans');

  // 支持从 LandingPage 点击入口时带 state.tab 切换 Tab
  useEffect(() => {
    const stateTab = (location.state as { tab?: Tab } | null)?.tab;
    if (stateTab && tabs.some((t) => t.key === stateTab)) {
      setTab(stateTab);
    }
  }, [location.state]);

  return (
    <div className="space-y-6">
      {/* 欢迎标题 */}
      <div className="pt-2">
        <h1 className="text-2xl font-bold text-white">训练计划</h1>
        <p className="text-gray-500 text-sm mt-1">选择训练方式，开始你的锻炼</p>
      </div>

      {/* 三个入口按钮 */}
      <div className="grid grid-cols-3 gap-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`p-3 rounded-xl text-center transition-colors ${
                isActive
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  : 'bg-gray-900 text-gray-400 border border-transparent'
              }`}
            >
              <Icon size={20} className="mx-auto mb-1" />
              <span className="text-xs">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 内容 */}
      {tab === 'free' && <FreeWorkoutTab />}
      {tab === 'plans' && <PresetPlansTab />}
      {tab === 'custom' && <CustomPlansTab />}
    </div>
  );
}
