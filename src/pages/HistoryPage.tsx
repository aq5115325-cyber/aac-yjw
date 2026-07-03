import { useState, useEffect } from 'react';
import { getWorkoutHistory, clearWorkoutHistory } from '../lib/storage';
import type { WorkoutLog } from '../lib/storage';
import { Clock, Trash2, Dumbbell } from 'lucide-react';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}秒`;
  return `${m}分${s}秒`;
}

export default function HistoryPage() {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);

  useEffect(() => {
    setLogs(getWorkoutHistory());
  }, []);

  const handleClear = () => {
    if (confirm('确定清空所有训练历史？此操作不可恢复。')) {
      clearWorkoutHistory();
      setLogs([]);
    }
  };

  return (
    <div className="space-y-4 pt-2">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">训练历史</h2>
        {logs.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20"
          >
            <Trash2 size={14} />
            清空
          </button>
        )}
      </div>

      {/* 空状态 */}
      {logs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500 gap-3">
          <Dumbbell size={40} className="opacity-20" />
          <p className="text-sm">还没有训练记录</p>
          <p className="text-xs">完成一次跟练后，记录会出现在这里</p>
        </div>
      )}

      {/* 历史列表 */}
      <div className="space-y-2">
        {logs.map((log, i) => (
          <div
            key={`${log.date}-${i}`}
            className="bg-gray-900 rounded-2xl p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-white text-sm">{log.planName}</h3>
              <span className="text-xs text-gray-600 tabular-nums">{formatDate(log.date)}</span>
            </div>
            <div className="flex gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Dumbbell size={12} />
                {log.exercisesCompleted}/{log.totalExercises} 动作
              </span>
              {log.duration > 0 && (
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {formatDuration(log.duration)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
