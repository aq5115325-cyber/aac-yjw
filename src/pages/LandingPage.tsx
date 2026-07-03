import { useNavigate } from 'react-router-dom';
import { Dumbbell, Calendar, Zap, ArrowRight, Trophy, Wand2 } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Wand2,
      title: '文字导入',
      desc: '用一段话描述训练，自动生成计划',
      action: () => navigate('/plan/import'),
    },
    {
      icon: Zap,
      title: '自由跟练',
      desc: '搜索 1300+ 动作，随时开始单次训练',
      action: () => navigate('/plans', { state: { tab: 'free' } }),
    },
    {
      icon: Dumbbell,
      title: '预设计划',
      desc: '按部位/难度/目标挑选推荐方案',
      action: () => navigate('/plans', { state: { tab: 'plans' } }),
    },
    {
      icon: Calendar,
      title: '自定义计划',
      desc: '挑选动作，设置时长，打造专属训练',
      action: () => navigate('/plans', { state: { tab: 'custom' } }),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="pt-4 pb-2">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
          <Dumbbell size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white leading-tight">健身跟练</h1>
        <p className="text-gray-400 mt-2 text-sm leading-relaxed">
          1324 个标准动作，12 套预设计划，<br />
          自由组合你的专属训练。
        </p>
      </div>

      {/* 今日训练入口 */}
      <button
        onClick={() => navigate('/plans')}
        className="w-full group bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-5 text-left hover:from-indigo-600 hover:to-purple-700 transition-all active:scale-[0.98]"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-lg">开始今日训练</p>
            <p className="text-indigo-200 text-xs mt-1">进入计划选择，开始你的锻炼</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
            <ArrowRight size={20} className="text-white" />
          </div>
        </div>
      </button>

      {/* 功能入口 */}
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-3">选择训练方式</p>
        <div className="space-y-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.title}
                onClick={f.action}
                className="w-full flex items-center gap-4 bg-gray-900 rounded-2xl p-4 border border-gray-800 hover:bg-gray-800 transition-colors text-left"
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <Icon size={22} className="text-indigo-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{f.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{f.desc}</p>
                </div>
                <ArrowRight size={18} className="text-gray-600" />
              </button>
            );
          })}
        </div>
      </div>

      {/* 数据概览 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
          <Trophy size={20} className="text-yellow-400 mb-2" />
          <p className="text-2xl font-bold text-white">1324</p>
          <p className="text-xs text-gray-500">标准动作</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
          <Calendar size={20} className="text-indigo-400 mb-2" />
          <p className="text-2xl font-bold text-white">12</p>
          <p className="text-xs text-gray-500">预设计划</p>
        </div>
      </div>
    </div>
  );
}
