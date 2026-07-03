import type { WorkoutPlan } from '../types';

/**
 * 12 套预设训练计划
 * 每套使用数据集中的实际动作 ID
 */
export const presetPlans: WorkoutPlan[] = [
  {
    id: 'full-body-beginner',
    name: 'Full Body Beginner',
    nameZh: '全身入门',
    description: '适合新手的全身训练，仅需自重，轻松入门',
    category: 'full-body',
    difficulty: 'beginner',
    estimatedMinutes: 15,
    defaultRest: 15,
    defaultDuration: 40,
    restBetweenSets: 60,
    sets: 1,
    exercises: [
      { exerciseId: '0001', order: 0, duration: 40, restAfter: 15 },   // 3/4 sit-up
      { exerciseId: '1512', order: 1, duration: 40, restAfter: 15 },   // all fours squad stretch
      { exerciseId: '3294', order: 2, duration: 30, restAfter: 20 },   // archer push up
      { exerciseId: '0130', order: 3, duration: 40, restAfter: 15 },   // bench hip extension
      { exerciseId: '0006', order: 4, duration: 40, restAfter: 15 },   // alternate heel touchers
      { exerciseId: '0129', order: 5, duration: 30, restAfter: 15 },   // bench dip
    ],
  },
  {
    id: 'chest-day',
    name: 'Chest Day',
    nameZh: '胸肌训练',
    description: '哑铃与自重结合，全面刺激胸肌',
    category: 'chest',
    difficulty: 'intermediate',
    estimatedMinutes: 20,
    defaultRest: 20,
    defaultDuration: 45,
    restBetweenSets: 60,
    sets: 1,
    exercises: [
      { exerciseId: '0289', order: 0, duration: 45, restAfter: 20 },   // dumbbell bench press
      { exerciseId: '3294', order: 1, duration: 40, restAfter: 15 },   // archer push up
      { exerciseId: '1273', order: 2, duration: 30, restAfter: 20 },   // clap push up
      { exerciseId: '0251', order: 3, duration: 40, restAfter: 15 },   // chest dip
      { exerciseId: '1259', order: 4, duration: 30, restAfter: 10 },   // behind head chest stretch
    ],
  },
  {
    id: 'back-strength',
    name: 'Back Strength',
    nameZh: '背部力量',
    description: '打造 V 字型背部，改善体态',
    category: 'back',
    difficulty: 'intermediate',
    estimatedMinutes: 20,
    defaultRest: 20,
    defaultDuration: 40,
    restBetweenSets: 60,
    sets: 1,
    exercises: [
      { exerciseId: '3293', order: 0, duration: 30, restAfter: 20 },   // archer pull up
      { exerciseId: '3168', order: 1, duration: 40, restAfter: 15 },   // bodyweight squatting row
      { exerciseId: '3019', order: 2, duration: 30, restAfter: 20 },   // bench pull-ups
      { exerciseId: '1405', order: 3, duration: 30, restAfter: 10 },   // back pec stretch
    ],
  },
  {
    id: 'leg-day',
    name: 'Leg Day',
    nameZh: '腿部训练',
    description: '全方位下肢训练，强化臀腿力量',
    category: 'lower',
    difficulty: 'intermediate',
    estimatedMinutes: 22,
    defaultRest: 20,
    defaultDuration: 45,
    restBetweenSets: 60,
    sets: 1,
    exercises: [
      { exerciseId: '1760', order: 0, duration: 45, restAfter: 20 },   // dumbbell goblet squat
      { exerciseId: '0300', order: 1, duration: 45, restAfter: 20 },   // dumbbell deadlift
      { exerciseId: '0336', order: 2, duration: 40, restAfter: 20 },   // dumbbell lunge
      { exerciseId: '0130', order: 3, duration: 40, restAfter: 15 },   // bench hip extension
      { exerciseId: '1473', order: 4, duration: 30, restAfter: 15 },   // backward jump
      { exerciseId: '1512', order: 5, duration: 30, restAfter: 10 },   // all fours squad stretch
    ],
  },
  {
    id: 'shoulder-sculpt',
    name: 'Shoulder Sculpt',
    nameZh: '肩部塑形',
    description: '雕刻肩部线条，打造宽肩视觉效果',
    category: 'shoulders',
    difficulty: 'intermediate',
    estimatedMinutes: 18,
    defaultRest: 15,
    defaultDuration: 40,
    restBetweenSets: 60,
    sets: 1,
    exercises: [
      { exerciseId: '2137', order: 0, duration: 40, restAfter: 15 },   // dumbbell arnold press
      { exerciseId: '0977', order: 1, duration: 40, restAfter: 15 },   // band front lateral raise
      { exerciseId: '0993', order: 2, duration: 40, restAfter: 15 },   // band reverse fly
      { exerciseId: '0997', order: 3, duration: 40, restAfter: 15 },   // band shoulder press
      { exerciseId: '3294', order: 4, duration: 30, restAfter: 10 },   // archer push up
    ],
  },
  {
    id: 'arm-sculptor',
    name: 'Arm Sculptor',
    nameZh: '手臂雕刻',
    description: '二头三头全面轰炸，打造有力手臂',
    category: 'arms',
    difficulty: 'intermediate',
    estimatedMinutes: 18,
    defaultRest: 15,
    defaultDuration: 40,
    restBetweenSets: 60,
    sets: 1,
    exercises: [
      { exerciseId: '0285', order: 0, duration: 40, restAfter: 15 },   // dumbbell alternate biceps curl
      { exerciseId: '0139', order: 1, duration: 30, restAfter: 15 },   // biceps narrow pull-ups
      { exerciseId: '0129', order: 2, duration: 40, restAfter: 15 },   // bench dip
      { exerciseId: '0976', order: 3, duration: 40, restAfter: 15 },   // band concentration curl
      { exerciseId: '1771', order: 4, duration: 40, restAfter: 10 },   // bodyweight kneeling triceps extension
    ],
  },
  {
    id: 'core-crusher',
    name: 'Core Crusher',
    nameZh: '核心撕裂',
    description: '全面腰腹核心训练，提升稳定性',
    category: 'core',
    difficulty: 'intermediate',
    estimatedMinutes: 15,
    defaultRest: 15,
    defaultDuration: 40,
    restBetweenSets: 60,
    sets: 1,
    exercises: [
      { exerciseId: '0001', order: 0, duration: 40, restAfter: 15 },   // 3/4 sit-up
      { exerciseId: '0003', order: 1, duration: 40, restAfter: 15 },   // air bike
      { exerciseId: '0002', order: 2, duration: 40, restAfter: 15 },   // 45° side bend
      { exerciseId: '0006', order: 3, duration: 40, restAfter: 15 },   // alternate heel touchers
      { exerciseId: '3544', order: 4, duration: 30, restAfter: 10 },   // bodyweight incline side plank
    ],
  },
  {
    id: 'hiit-blast',
    name: 'HIIT Blast',
    nameZh: 'HIIT 燃脂',
    description: '高强度间歇训练，20 秒冲刺 + 10 秒休息，快速燃脂',
    category: 'hiit',
    difficulty: 'advanced',
    estimatedMinutes: 12,
    defaultRest: 10,
    defaultDuration: 20,
    restBetweenSets: 30,
    sets: 2,
    exercises: [
      { exerciseId: '1160', order: 0, duration: 20, restAfter: 10 },   // burpee
      { exerciseId: '1473', order: 1, duration: 20, restAfter: 10 },   // backward jump
      { exerciseId: '3360', order: 2, duration: 20, restAfter: 10 },   // bear crawl
      { exerciseId: '0003', order: 3, duration: 20, restAfter: 10 },   // air bike
      { exerciseId: '3220', order: 4, duration: 20, restAfter: 10 },   // astride jumps
    ],
  },
  {
    id: 'morning-stretch',
    name: 'Morning Stretch',
    nameZh: '晨间拉伸',
    description: '轻柔拉伸唤醒身体，迎接新的一天',
    category: 'stretch',
    difficulty: 'beginner',
    estimatedMinutes: 12,
    defaultRest: 5,
    defaultDuration: 30,
    restBetweenSets: 10,
    sets: 1,
    exercises: [
      { exerciseId: '1271', order: 0, duration: 30, restAfter: 5 },    // chest and front of shoulder stretch
      { exerciseId: '1405', order: 1, duration: 30, restAfter: 5 },    // back pec stretch
      { exerciseId: '1512', order: 2, duration: 30, restAfter: 5 },    // all fours squad stretch
      { exerciseId: '1710', order: 3, duration: 30, restAfter: 5 },    // assisted lying gluteus stretch
      { exerciseId: '1377', order: 4, duration: 30, restAfter: 5 },    // calf stretch with hands
      { exerciseId: '1259', order: 5, duration: 30, restAfter: 5 },    // behind head chest stretch
    ],
  },
  {
    id: 'evening-relax',
    name: 'Evening Relax',
    nameZh: '睡前放松',
    description: '舒缓拉伸，释放一天的压力，助眠放松',
    category: 'stretch',
    difficulty: 'beginner',
    estimatedMinutes: 15,
    defaultRest: 10,
    defaultDuration: 40,
    restBetweenSets: 15,
    sets: 1,
    exercises: [
      { exerciseId: '1710', order: 0, duration: 40, restAfter: 10 },   // assisted lying gluteus stretch
      { exerciseId: '1713', order: 1, duration: 40, restAfter: 10 },   // assisted prone lying quads stretch
      { exerciseId: '1708', order: 2, duration: 40, restAfter: 10 },   // assisted lying calves stretch
      { exerciseId: '1405', order: 3, duration: 40, restAfter: 10 },   // back pec stretch
      { exerciseId: '1271', order: 4, duration: 40, restAfter: 10 },   // chest and front shoulder stretch
      { exerciseId: '1512', order: 5, duration: 40, restAfter: 10 },   // all fours squad stretch
    ],
  },
  {
    id: 'home-no-equipment',
    name: 'Home No Equipment',
    nameZh: '居家无器械',
    description: '无需任何器械，在家就能完成全身训练',
    category: 'full-body',
    difficulty: 'intermediate',
    estimatedMinutes: 18,
    defaultRest: 15,
    defaultDuration: 40,
    restBetweenSets: 60,
    sets: 1,
    exercises: [
      { exerciseId: '3168', order: 0, duration: 40, restAfter: 15 },   // bodyweight squatting row
      { exerciseId: '0251', order: 1, duration: 40, restAfter: 15 },   // chest dip
      { exerciseId: '0001', order: 2, duration: 40, restAfter: 15 },   // 3/4 sit-up
      { exerciseId: '0130', order: 3, duration: 40, restAfter: 15 },   // bench hip extension
      { exerciseId: '3294', order: 4, duration: 30, restAfter: 15 },   // archer push up
      { exerciseId: '0129', order: 5, duration: 30, restAfter: 10 },   // bench dip
      { exerciseId: '0006', order: 6, duration: 30, restAfter: 10 },   // alternate heel touchers
    ],
  },
  {
    id: 'glutes-sculpt',
    name: 'Glutes Sculpt',
    nameZh: '臀腿塑形',
    description: '针对性臀腿训练，塑造翘臀美腿',
    category: 'lower',
    difficulty: 'intermediate',
    estimatedMinutes: 20,
    defaultRest: 20,
    defaultDuration: 45,
    restBetweenSets: 60,
    sets: 1,
    exercises: [
      { exerciseId: '1760', order: 0, duration: 45, restAfter: 20 },   // dumbbell goblet squat
      { exerciseId: '0300', order: 1, duration: 45, restAfter: 20 },   // dumbbell deadlift
      { exerciseId: '0336', order: 2, duration: 40, restAfter: 15 },   // dumbbell lunge
      { exerciseId: '0130', order: 3, duration: 40, restAfter: 15 },   // bench hip extension
      { exerciseId: '1512', order: 4, duration: 30, restAfter: 10 },   // all fours squad stretch
    ],
  },
];

/** 按 ID 查找预设计划 */
export function getPlanById(id: string): WorkoutPlan | undefined {
  return presetPlans.find((p) => p.id === id);
}

/** 获取分类中文名 */
export function getPlanCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    'full-body': '全身',
    'upper': '上肢',
    'lower': '下肢',
    'chest': '胸部',
    'back': '背部',
    'shoulders': '肩部',
    'arms': '手臂',
    'core': '核心',
    'cardio': '有氧',
    'stretch': '拉伸',
    'hiit': 'HIIT',
  };
  return labels[category] || category;
}

/** 难度中文标签 */
export function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    beginner: '新手',
    intermediate: '进阶',
    advanced: '挑战',
  };
  return labels[difficulty] || difficulty;
}

/** 难度颜色 */
export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    beginner: 'bg-green-500/20 text-green-400',
    intermediate: 'bg-yellow-500/20 text-yellow-400',
    advanced: 'bg-red-500/20 text-red-400',
  };
  return colors[difficulty] || 'bg-gray-500/20 text-gray-400';
}
