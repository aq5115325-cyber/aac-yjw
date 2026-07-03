/** 单条训练动作 */
export interface Exercise {
  id: string;
  name: string;
  category: string;
  body_part: string;
  equipment: string;
  instructions: {
    en: string;
    es: string;
    it: string;
    tr: string;
    ru: string;
    zh: string;
  };
  muscle_group: string;
  secondary_muscles: string[];
  target: string;
  media_id: string | null;
  image: string | null;
  gif_url: string | null;
  created_at: string;
}

/** 预设训练计划中的动作条目 */
export interface PlanExercise {
  exerciseId: string;   // 对应 Exercise.id
  order: number;
  duration: number;     // 动作持续秒数
  restAfter: number;    // 做完后的休息秒数
}

/** 训练计划 */
export interface WorkoutPlan {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  category: 'full-body' | 'upper' | 'lower' | 'chest' | 'back' | 'shoulders' | 'arms' | 'core' | 'cardio' | 'stretch' | 'hiit';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  exercises: PlanExercise[];
  /** 默认全局休息秒数（当 PlanExercise.restAfter 未设置时使用） */
  defaultRest: number;
  /** 默认动作持续秒数（当 PlanExercise.duration 未设置时使用） */
  defaultDuration: number;
  /** 组间休息（多组时使用，秒） */
  restBetweenSets: number;
  /** 组数 */
  sets: number;
}

/** 用户自定义计划（存在 localStorage） */
export interface UserPlan {
  id: string;
  name: string;
  createdAt: string;
  exercises: PlanExercise[];
  defaultRest: number;
  defaultDuration: number;
  restBetweenSets: number;
  sets: number;
}
