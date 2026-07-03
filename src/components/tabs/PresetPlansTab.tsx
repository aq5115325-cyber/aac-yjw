import { useNavigate } from 'react-router-dom';
import { presetPlans, getPlanCategoryLabel, getDifficultyLabel, getDifficultyColor } from '../../data/plans';
import { Play, Clock } from 'lucide-react';

const categoryIcons: Record<string, string> = {
  'full-body': '🔄',
  chest: '🏋️',
  back: '🔙',
  shoulders: '💪',
  arms: '💪',
  core: '🧘',
  hiit: '🔥',
  stretch: '🧘‍♂️',
  lower: '🦵',
};

export default function PresetPlansTab() {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">推荐计划</p>
      {presetPlans.map((plan) => (
        <div
          key={plan.id}
          className="bg-gray-900 rounded-2xl overflow-hidden hover:bg-gray-800 transition-colors"
        >
          <button
            onClick={() => navigate(`/plan/${plan.id}`)}
            className="w-full text-left p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{categoryIcons[plan.category] || '🏃'}</span>
                  <h3 className="font-semibold text-white">{plan.nameZh}</h3>
                </div>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{plan.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(plan.difficulty)}`}
                  >
                    {getDifficultyLabel(plan.difficulty)}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
                    {getPlanCategoryLabel(plan.category)}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400 flex items-center gap-1">
                    <Clock size={10} />
                    {plan.estimatedMinutes} 分钟
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
                    {plan.exercises.length} 动作
                  </span>
                </div>
              </div>
            </div>
          </button>
          <div className="px-4 pb-4">
            <button
              onClick={() => navigate(`/workout/${plan.id}`)}
              className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white font-medium text-sm transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Play size={16} fill="white" />
              开始训练
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
