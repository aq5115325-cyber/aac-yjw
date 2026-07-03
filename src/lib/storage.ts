import { MAX_HISTORY_ITEMS } from '../config/constants';
import type { UserPlan } from '../types';

const STORAGE_KEY = 'fitness-user-plans';
const HISTORY_KEY = 'fitness-workout-history';
const SETTINGS_KEY = 'fitness-settings';

// ── 用户自定义计划 ──

export function getUserPlans(): UserPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUserPlan(plan: UserPlan): void {
  const plans = getUserPlans().filter((p) => p.id !== plan.id);
  plans.push(plan);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

export function deleteUserPlan(id: string): void {
  const plans = getUserPlans().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
}

// ── 训练历史 ──

export interface WorkoutLog {
  planId: string;
  planName: string;
  date: string;
  duration: number;
  exercisesCompleted: number;
  totalExercises: number;
}

export function getWorkoutHistory(): WorkoutLog[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addWorkoutLog(log: WorkoutLog): void {
  const history = getWorkoutHistory();
  history.unshift(log);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY_ITEMS)));
}

export function clearWorkoutHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

// ── 设置 ──

export interface AppSettings {
  ttsEnabled: boolean;
}

const DEFAULT_SETTINGS: AppSettings = { ttsEnabled: true };

export function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// ── 数据导入导出 ──

export function exportAllData(): string {
  return JSON.stringify({
    version: 1,
    exportedAt: new Date().toISOString(),
    plans: getUserPlans(),
    history: getWorkoutHistory(),
    settings: getSettings(),
  }, null, 2);
}

export interface ImportResult {
  success: boolean;
  plansCount: number;
  historyCount: number;
  error?: string;
}

export function importAllData(json: string): ImportResult {
  try {
    const data = JSON.parse(json);
    if (!data.version) return { success: false, plansCount: 0, historyCount: 0, error: '无效的数据格式' };
    if (data.plans) localStorage.setItem(STORAGE_KEY, JSON.stringify(data.plans));
    if (data.history) localStorage.setItem(HISTORY_KEY, JSON.stringify(data.history));
    if (data.settings) localStorage.setItem(SETTINGS_KEY, JSON.stringify(data.settings));
    return {
      success: true,
      plansCount: data.plans?.length || 0,
      historyCount: data.history?.length || 0,
    };
  } catch {
    return { success: false, plansCount: 0, historyCount: 0, error: '文件解析失败' };
  }
}

export function deleteAllData(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(HISTORY_KEY);
  localStorage.removeItem(SETTINGS_KEY);
}
