import { getExercisesById, getCategoryLabel, getExerciseNameZh } from '../data/exercises';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';
import type { PlanExercise } from '../types';

interface SortableExerciseItemProps {
  exercise: PlanExercise;
  index: number;
  onRemove: () => void;
  onChange: (updated: PlanExercise) => void;
}

export default function SortableExerciseItem({
  exercise,
  index,
  onRemove,
  onChange,
}: SortableExerciseItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `${exercise.exerciseId}-${index}`,
  });

  const style = { transform: CSS.Transform.toString(transform), transition };
  const ex = getExercisesById().get(exercise.exerciseId);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 bg-gray-900 rounded-xl p-3 border border-gray-800 ${
        isDragging ? 'opacity-70 ring-2 ring-indigo-500 border-indigo-500 shadow-lg shadow-indigo-500/20 scale-[1.02]' : ''
      }`}
    >
      {/* 拖拽手柄 — 六点阵图标 */}
      <button {...attributes} {...listeners} className="touch-none text-gray-400 hover:text-indigo-400 transition-colors cursor-grab active:cursor-grabbing p-1 -ml-1" aria-label="拖动排序">
        <GripVertical size={20} />
      </button>

      {/* 序号圆标 */}
      <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-indigo-400">
        {index + 1}
      </div>

      {/* 动作信息 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{ex ? getExerciseNameZh(ex) : exercise.exerciseId}</p>
        {ex && <p className="text-xs text-gray-500">{getCategoryLabel(ex.category)}</p>}
      </div>

      {/* 时长编辑 */}
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={exercise.duration}
          onChange={(e) => onChange({ ...exercise, duration: Math.max(5, Number(e.target.value)) })}
          className="w-14 bg-gray-800 text-white text-xs text-center rounded-lg py-1 outline-none"
          min={5}
          max={300}
        />
        <span className="text-xs text-gray-500">秒</span>
      </div>

      {/* 删除 */}
      <button
        onClick={onRemove}
        className="p-1 text-gray-600 hover:text-red-400 transition-colors"
        aria-label="移除动作"
      >
        <X size={16} />
      </button>
    </div>
  );
}
