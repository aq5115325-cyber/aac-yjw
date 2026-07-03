import { clsx } from 'clsx';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  className?: string;
  /** 当前阶段的初始总秒数（用于子进度计算） */
  phaseInitialSeconds?: number;
  /** 当前阶段的剩余秒数 */
  phaseRemainingSeconds?: number;
}

export default function ProgressBar({
  current,
  total,
  label,
  className,
  phaseInitialSeconds,
  phaseRemainingSeconds,
}: ProgressBarProps) {
  // 总进度 = 整段已完成 + 当前阶段已完成部分
  let pct = 0;
  if (total > 0) {
    const base = (current / total) * 100;
    // 防御：phase 刚切换时，phaseRemainingSeconds 可能仍持有上一阶段的旧值
    // 此时不应画子进度，仅显示 base
    if (
      phaseInitialSeconds &&
      phaseInitialSeconds > 0 &&
      phaseRemainingSeconds !== undefined &&
      phaseRemainingSeconds <= phaseInitialSeconds
    ) {
      const done = Math.max(0, phaseInitialSeconds - phaseRemainingSeconds);
      const phaseFraction = Math.min(done / phaseInitialSeconds, 1);
      const perUnit = 100 / total;
      pct = base + phaseFraction * perUnit;
    } else {
      pct = base;
    }
    pct = Math.min(pct, 100);
  }

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>{label}</span>
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300 ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
