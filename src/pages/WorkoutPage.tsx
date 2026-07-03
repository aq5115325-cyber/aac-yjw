import { useLocation, useNavigate, useParams } from 'react-router-dom';
import WorkoutPlayer from '../components/WorkoutPlayer';
import { presetPlans } from '../data/plans';
import { getUserPlans } from '../lib/storage';
import type { PlanExercise } from '../types';

interface WorkoutState {
  planId: string;
  planName: string;
  exercises: PlanExercise[];
  sets: number;
  defaultRest: number;
  defaultDuration: number;
  restBetweenSets: number;
}

export default function WorkoutPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as WorkoutState | null;

  // 构建 planData 的优先级：(1) 路由 state → (2) 预设 → (3) 本地存储 → (4) 自由跟练兜底
  let planData: WorkoutState | null = state;

  if (!planData && id) {
    if (id === 'free') {
      // 自由跟练刷新后兜底 — 显示默认动作
      planData = {
        planId: 'free',
        planName: '自由跟练',
        exercises: [],
        sets: 1,
        defaultRest: 10,
        defaultDuration: 40,
        restBetweenSets: 30,
      };
    } else if (id.startsWith('custom-')) {
      // 自定义计划刷新后从 localStorage 恢复
      const uid = id.replace('custom-', '');
      const userPlan = getUserPlans().find((p) => p.id === uid);
      if (userPlan) {
        planData = {
          planId: `custom-${userPlan.id}`,
          planName: userPlan.name,
          exercises: userPlan.exercises,
          sets: userPlan.sets,
          defaultRest: userPlan.defaultRest,
          defaultDuration: userPlan.defaultDuration,
          restBetweenSets: userPlan.restBetweenSets ?? 60,
        };
      }
    } else {
      // 预设计划
      const plan = presetPlans.find((p) => p.id === id);
      if (plan) {
        planData = {
          planId: plan.id,
          planName: plan.nameZh,
          exercises: plan.exercises,
          sets: plan.sets,
          defaultRest: plan.defaultRest,
          defaultDuration: plan.defaultDuration,
          restBetweenSets: plan.restBetweenSets,
        };
      }
    }
  }

  if (!planData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 gap-4">
        <p className="text-lg">😅 训练数据未找到</p>
        <p className="text-sm">自定义计划可能已被删除，请返回重试</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-indigo-500 rounded-xl text-white hover:bg-indigo-600 transition-colors"
        >
          返回首页
        </button>
      </div>
    );
  }

  // 自由跟练且无动作时显示友好的空状态
  if (planData.exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 gap-4">
        <p className="text-lg">🏋️ 还没有选择动作</p>
        <p className="text-sm">请返回首页搜索并选择要跟练的动作</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-indigo-500 rounded-xl text-white hover:bg-indigo-600 transition-colors"
        >
          返回首页
        </button>
      </div>
    );
  }

  return (
    <WorkoutPlayer
      planId={planData.planId}
      planName={planData.planName}
      exercises={planData.exercises}
      sets={planData.sets}
      defaultRest={planData.defaultRest}
      defaultDuration={planData.defaultDuration}
      restBetweenSets={planData.restBetweenSets}
      onBack={() => navigate(-1)}
      onComplete={() => navigate('/', { replace: true })}
    />
  );
}
