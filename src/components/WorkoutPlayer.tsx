import { useCallback, useEffect, useMemo, useRef } from 'react';
import { getExercisesById, getInstructionZh, getExerciseNameZh } from '../data/exercises';
import { useTimer } from '../hooks/useTimer';
import { useSpeech } from '../hooks/useSpeech';
import { useWorkoutSession } from '../hooks/useWorkoutSession';
import { PREPARE_SECONDS } from '../config/constants';
import { addWorkoutLog, getSettings } from '../lib/storage';
import { formatTime } from '../lib/utils';
import { ArrowLeft, Play, Pause, SkipForward, CheckCircle2 } from 'lucide-react';
import type { PlanExercise } from '../types';
import ProgressBar from './ProgressBar';
import ExerciseImage from './ExerciseImage';

const PHASE_DISPLAY: Record<string, { label: string; color: string }> = {
  preparing: { label: '准备', color: 'text-yellow-400' },
  exercising: { label: '训练中', color: 'text-green-400' },
  resting: { label: '休息', color: 'text-cyan-400' },
  'set-rest': { label: '组间休息', color: 'text-purple-400' },
};

interface WorkoutPlayerProps {
  planId: string;
  planName: string;
  exercises: PlanExercise[];
  sets: number;
  defaultRest: number;
  defaultDuration: number;
  restBetweenSets: number;
  onBack: () => void;
  onComplete: () => void;
}

export default function WorkoutPlayer({
  planId,
  planName,
  exercises,
  sets,
  defaultRest,
  defaultDuration,
  restBetweenSets,
  onBack,
  onComplete,
}: WorkoutPlayerProps) {
  const { speak } = useSpeech();
  const settings = getSettings();
  const completionLogged = useRef(false);
  const startTimeRef = useRef(0);

  const session = useWorkoutSession({
    totalExercises: exercises.length,
    sets,
    defaultDuration,
    defaultRest,
    restBetweenSets,
    exercises,
  });

  const { currentSet, currentExerciseIndex, phase, seconds, paused, completedCount, totalCount } = session;

  // 记录开始时间（首次进入训练阶段时）
  useEffect(() => {
    if (phase === 'exercising' && startTimeRef.current === 0) {
      startTimeRef.current = Date.now();
    }
  }, [phase]);

  const currentPlanExercise = exercises[currentExerciseIndex];
  const exerciseData = currentPlanExercise ? getExercisesById().get(currentPlanExercise.exerciseId) : undefined;

  const display = PHASE_DISPLAY[phase] || { label: '', color: 'text-white' };

  // 当前阶段的总秒数（用于进度条子进度计算）
  const phaseInitialSeconds = useMemo(() => {
    if (phase === 'preparing') return PREPARE_SECONDS;
    if (phase === 'exercising') return currentPlanExercise?.duration ?? 40;
    if (phase === 'resting') return currentPlanExercise?.restAfter ?? 15;
    if (phase === 'set-rest') return restBetweenSets;
    return 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, currentSet, currentExerciseIndex]);

  const timerRunning = !paused && phase !== 'completed';
  const timerResetKey = `${currentSet}-${currentExerciseIndex}-${phase}-${phaseInitialSeconds}`;
  const { skipToEnd: forceSkip } = useTimer(
    seconds,
    timerRunning,
    (remaining) => session.updateSeconds(Math.max(0, remaining)),
    session.onTimerComplete,
    timerResetKey,
  );

  // phase 切换时同步 seconds 到新阶段的初始值（避免使用上一阶段的旧值）
  const prevPhaseKeyRef = useRef(`${currentSet}-${currentExerciseIndex}-${phase}`);
  useEffect(() => {
    const currentKey = `${currentSet}-${currentExerciseIndex}-${phase}`;
    if (prevPhaseKeyRef.current !== currentKey && phase !== 'completed') {
      prevPhaseKeyRef.current = currentKey;
      session.updateSeconds(phaseInitialSeconds);
    }
  }, [currentSet, currentExerciseIndex, phase, phaseInitialSeconds, session]);

  const handleSkip = useCallback(() => {
    forceSkip();
  }, [forceSkip]);

  // ——— 语音播报：监听阶段变化 ———
  const prevPhaseRef = useRef(phase);
  useEffect(() => {
    const prev = prevPhaseRef.current;
    prevPhaseRef.current = phase;

    if (prev === 'preparing' && phase === 'exercising') {
      if (exerciseData && settings.ttsEnabled) speak(getExerciseNameZh(exerciseData));
    } else if (prev === 'exercising' && phase === 'resting') {
      if (settings.ttsEnabled) speak('休息一下');
    } else if (prev === 'exercising' && phase === 'set-rest') {
      if (settings.ttsEnabled) speak('组间休息');
    } else if (phase === 'completed' && !completionLogged.current) {
      if (settings.ttsEnabled) speak('训练完成，你真棒');
    }
  }, [phase, exerciseData, speak, settings.ttsEnabled]);

  // ——— 训练完成：记录日志 ———
  useEffect(() => {
    if (phase === 'completed' && !completionLogged.current) {
      completionLogged.current = true;
      addWorkoutLog({
        planId,
        planName,
        date: new Date().toISOString(),
        duration: startTimeRef.current > 0 ? Math.round((Date.now() - startTimeRef.current) / 1000) : 0,
        exercisesCompleted: exercises.length,
        totalExercises: exercises.length,
      });
    }
  }, [phase, planId, planName, exercises.length]);

  const isUrgent = seconds <= 5 && phase === 'exercising';

  // ——— 完成页面 ———
  if (phase === 'completed') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <CheckCircle2 size={80} className="text-green-400" />
        <h2 className="text-2xl font-bold text-white">训练完成</h2>
        <p className="text-gray-400">
          你做完了 {exercises.length} 个动作，共 {sets} 组
        </p>
        <button
          onClick={onComplete}
          className="px-8 py-3 bg-indigo-500 rounded-xl text-white font-medium hover:bg-indigo-600 transition-colors"
        >
          返回首页
        </button>
      </div>
    );
  }

  // ——— 跟练界面 ———
  return (
    <div className="flex flex-col min-h-[85vh]">
      {/* 顶部信息栏 */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
          <ArrowLeft size={22} className="text-gray-400" />
        </button>
        <span className="text-sm text-gray-500">
          {currentSet + 1}/{sets} 组 · {currentExerciseIndex + 1}/{exercises.length}
        </span>
        <button onClick={handleSkip} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
          <SkipForward size={22} className="text-gray-400" />
        </button>
      </div>

      {/* 主区域 */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        {/* 动作 GIF */}
        <div className="w-56 h-56 rounded-2xl bg-gray-900 overflow-hidden flex items-center justify-center">
          {exerciseData ? (
            <ExerciseImage
              exerciseId={currentPlanExercise.exerciseId}
              exerciseName={getExerciseNameZh(exerciseData)}
              target={exerciseData.target}
              className="w-full h-full"
              objectFit="contain"
            />
          ) : (
            <p className="text-gray-600">加载中...</p>
          )}
        </div>

        {/* 阶段标签 */}
        <span className={`text-sm font-medium ${display.color}`}>{display.label}</span>

        {/* 倒计时数字 */}
        <p
          className={`text-6xl font-bold tabular-nums tracking-tight ${
            isUrgent ? 'text-red-400 animate-pulse' : 'text-white'
          }`}
        >
          {formatTime(seconds)}
        </p>

        {/* 控制按钮组 */}
        <div className="flex items-center gap-4">
          <button
            onClick={session.togglePause}
            className="w-16 h-16 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors active:scale-90"
          >
            {paused ? <Play size={28} className="text-white" /> : <Pause size={28} className="text-white" />}
          </button>
          <button
            onClick={handleSkip}
            className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors active:scale-90"
          >
            <SkipForward size={20} className="text-gray-400" />
          </button>
        </div>

        {/* 动作指导 */}
        {phase === 'exercising' && exerciseData && (
          <p className="text-sm text-gray-500 text-center max-w-xs leading-relaxed px-4">
            {getInstructionZh(exerciseData)}
          </p>
        )}
      </div>

      {/* 底部进度条 */}
      <div className="pb-4">
        <ProgressBar
          current={completedCount}
          total={totalCount}
          label={planName}
          phaseInitialSeconds={phaseInitialSeconds}
          phaseRemainingSeconds={seconds}
        />
      </div>
    </div>
  );
}
