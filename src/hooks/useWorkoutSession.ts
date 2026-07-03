import { PREPARE_SECONDS } from '../config/constants';
import { useState, useCallback, useRef } from 'react';
import type { PlanExercise } from '../types';

/**
 * 训练会话状态 — 4 个阶段的进度状态机
 *
 * 阶段转换图:
 *
 *   preparing
 *       ↓  (倒计时结束)
 *   exercising
 *       ↓  (倒计时结束)
 *     ┌─→ resting ──→ (还有动作) → preparing
 *     │    ↓  (最后一个动作)
 *     │  set-rest ──→ (还有组) → preparing
 *     │    ↓  (最后一组)
 *     └──→ completed
 */

export type SessionPhase = 'preparing' | 'exercising' | 'resting' | 'set-rest' | 'completed';

interface SessionConfig {
  totalExercises: number;
  sets: number;
  defaultDuration: number;
  defaultRest: number;
  restBetweenSets: number;
  /** 每个动作的独立时长/休息，advancePhase 从中按 idx 读取 */
  exercises: PlanExercise[];
}

interface SessionState {
  currentSet: number;
  currentExerciseIndex: number;
  phase: SessionPhase;
  seconds: number;
  paused: boolean;
}

/**
 * useWorkoutSession — 纯逻辑的状态机
 *
 * 职责: 管理训练会话的 phase 转换和倒计时数据
 * 不包含: DOM 操作、渲染、语音播报具体逻辑
 */
export function useWorkoutSession(config: SessionConfig) {
  const [state, setState] = useState<SessionState>({
    currentSet: 0,
    currentExerciseIndex: 0,
    phase: 'preparing',
    seconds: PREPARE_SECONDS,
    paused: false,
  });

  const configRef = useRef(config);
  configRef.current = config;

  /** 获取当前动作的持续秒数（优先使用动作本身的 duration） */
  const getExerciseDuration = useCallback((idx: number): number => {
    const ex = configRef.current.exercises[idx];
    return ex?.duration ?? configRef.current.defaultDuration;
  }, []);

  /** 获取当前动作后的休息秒数（优先使用动作本身的 restAfter） */
  const getExerciseRest = useCallback((idx: number): number => {
    const ex = configRef.current.exercises[idx];
    return ex?.restAfter ?? configRef.current.defaultRest;
  }, []);

  /** 阶段转换核心函数 */
  const advancePhase = useCallback((currentPhase: SessionPhase, set: number, idx: number) => {
    const { totalExercises, sets, restBetweenSets } = configRef.current;

    switch (currentPhase) {
      case 'preparing':
        return {
          phase: 'exercising' as SessionPhase,
          seconds: getExerciseDuration(idx),
          nextSet: set,
          nextIdx: idx,
        };

      case 'exercising': {
        const hasNextExercise = idx < totalExercises - 1;
        const hasNextSet = set < sets - 1;

        if (hasNextExercise) {
          return {
            phase: 'resting' as SessionPhase,
            seconds: getExerciseRest(idx),
            nextSet: set,
            nextIdx: idx,
          };
        }
        if (hasNextSet) {
          return { phase: 'set-rest' as SessionPhase, seconds: restBetweenSets, nextSet: set, nextIdx: idx };
        }
        return { phase: 'completed' as SessionPhase, seconds: 0, nextSet: set, nextIdx: idx };
      }

      case 'resting': {
        const nextIdx = idx + 1;
        if (nextIdx < totalExercises) {
          return { phase: 'preparing' as SessionPhase, seconds: PREPARE_SECONDS, nextSet: set, nextIdx };
        }
        if (set < sets - 1) {
          return { phase: 'preparing' as SessionPhase, seconds: PREPARE_SECONDS, nextSet: set + 1, nextIdx: 0 };
        }
        return { phase: 'completed' as SessionPhase, seconds: 0, nextSet: set, nextIdx: idx };
      }

      case 'set-rest': {
        const nextSet = set + 1;
        if (nextSet < sets) {
          return { phase: 'preparing' as SessionPhase, seconds: PREPARE_SECONDS, nextSet, nextIdx: 0 };
        }
        return { phase: 'completed' as SessionPhase, seconds: 0, nextSet: set, nextIdx: idx };
      }

      default:
        return { phase: 'completed' as SessionPhase, seconds: 0, nextSet: set, nextIdx: idx };
    }
  }, [getExerciseDuration, getExerciseRest]);

  /** 倒计时完成 → 触发阶段转换 */
  const onTimerComplete = useCallback(() => {
    setState((prev) => {
      const next = advancePhase(prev.phase, prev.currentSet, prev.currentExerciseIndex);
      return {
        ...prev,
        phase: next.phase,
        seconds: next.seconds,
        currentSet: next.nextSet,
        currentExerciseIndex: next.nextIdx,
      };
    });
  }, [advancePhase]);

  /** 跳过当前阶段 */
  const skipToEnd = useCallback(() => { onTimerComplete(); }, [onTimerComplete]);

  /** 暂停/继续 */
  const togglePause = useCallback(() => {
    setState((prev) => ({ ...prev, paused: !prev.paused }));
  }, []);

  /** 外部更新秒数（从 useTimer 同步） */
  const updateSeconds = useCallback((s: number) => {
    setState((prev) => ({ ...prev, seconds: s }));
  }, []);

  const { totalExercises, sets } = config;
  const completedCount = state.currentSet * totalExercises + state.currentExerciseIndex;
  const totalCount = sets * totalExercises;

  return {
    ...state,
    completedCount,
    totalCount,
    updateSeconds,
    onTimerComplete,
    skipToEnd,
    togglePause,
  };
}
