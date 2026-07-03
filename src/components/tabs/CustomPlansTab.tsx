import { useNavigate } from 'react-router-dom';
import { getUserPlans } from '../../lib/storage';
import { Plus, User, Wand2 } from 'lucide-react';
import type { UserPlan } from '../../types';

export default function CustomPlansTab() {
  const navigate = useNavigate();
  const userPlans = getUserPlans();

  const handleStart = (plan: UserPlan) => {
    navigate(`/workout/custom-${plan.id}`, {
      state: {
        planId: `custom-${plan.id}`,
        planName: plan.name,
        exercises: plan.exercises,
        sets: plan.sets,
        defaultRest: plan.defaultRest,
        defaultDuration: plan.defaultDuration,
        restBetweenSets: 60,
      },
    });
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => navigate('/plan/new')}
        className="w-full bg-indigo-500/10 border-2 border-dashed border-indigo-500/30 rounded-2xl p-6 text-center hover:bg-indigo-500/20 transition-colors"
      >
        <Plus size={28} className="mx-auto mb-2 text-indigo-400" />
        <p className="text-indigo-400 font-medium">创建新计划</p>
        <p className="text-xs text-gray-500 mt-1">挑选动作，自定义你的训练</p>
      </button>

      <button
        onClick={() => navigate('/plan/import')}
        className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center gap-3 hover:bg-gray-800 transition-colors text-left"
      >
        <Wand2 size={20} className="text-indigo-400 shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-white font-medium">从文字快速导入</p>
          <p className="text-xs text-gray-500 mt-0.5">写一段话自动生成训练计划</p>
        </div>
      </button>

      {userPlans.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <User size={28} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">还没有自定义计划，创建一个吧</p>
        </div>
      )}

      {userPlans.map((plan) => (
        <div key={plan.id} className="bg-gray-900 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-white">{plan.name}</h3>
            <span className="text-xs text-gray-500">{plan.exercises.length} 动作</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleStart(plan)}
              className="flex-1 py-2 bg-indigo-500 rounded-xl text-white text-sm font-medium hover:bg-indigo-600 transition-colors"
            >
              开始
            </button>
            <button
              onClick={() => navigate(`/plan/edit/${plan.id}`)}
              className="px-4 py-2 bg-gray-800 rounded-xl text-gray-300 text-sm hover:bg-gray-700 transition-colors"
            >
              编辑
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
