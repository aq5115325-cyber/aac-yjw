import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchExercises, getAllExercises, getCategoryLabel, getExerciseNameZh } from '../../data/exercises';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { PAGE_SIZE } from '../../config/constants';
import ExerciseImage from '../../components/ExerciseImage';
import type { PlanExercise } from '../../types';

export default function FreeWorkoutTab() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [bodyPart, setBodyPart] = useState('');
  const [page, setPage] = useState(1);

  const allExercises = useMemo(() => getAllExercises(), []);

  const bodyParts = useMemo(() => {
    const categories = new Set(allExercises.map((e) => e.category));
    return [
      { key: '', label: '全部' },
      ...Array.from(categories)
        .sort()
        .map((c) => ({ key: c, label: getCategoryLabel(c) })),
    ];
  }, [allExercises]);

  // 150ms 防抖
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 150);
    return () => clearTimeout(timer);
  }, [query]);

  // 过滤逻辑：搜索 + 身体部位
  const filtered = useMemo(() => {
    let list = allExercises;
    if (bodyPart) list = list.filter((e) => e.category === bodyPart);
    if (debouncedQuery) {
      list = searchExercises(debouncedQuery).filter((e) => !bodyPart || e.category === bodyPart);
    }
    return list;
  }, [debouncedQuery, bodyPart, allExercises]);

  // 分页
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const goNext = () => setPage((p) => Math.min(p + 1, totalPages));
  const goPrev = () => setPage((p) => Math.max(p - 1, 1));

  // 搜索或换部位时重置到第 1 页
  useEffect(() => { setPage(1); }, [debouncedQuery, bodyPart]);

  const handleStart = (exerciseId: string) => {
    const exercise: PlanExercise[] = [
      { exerciseId, order: 0, duration: 40, restAfter: 10 },
    ];
    navigate('/workout/free', {
      state: {
        planId: 'free',
        planName: '自由跟练',
        exercises: exercise,
        sets: 1,
        defaultRest: 10,
        defaultDuration: 40,
        restBetweenSets: 30,
      },
    });
  };

  return (
    <div className="space-y-3">
      {/* 搜索框 */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="搜索动作（支持中文）..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-gray-900 text-white rounded-xl py-3 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-gray-600"
        />
      </div>

      {/* 身体部位过滤 — 水平滚动标签 */}
      <div className="overflow-x-auto scrollbar-none -mx-4 px-4">
        <div className="flex gap-2 pb-1">
          {bodyParts.map((bp) => {
            const isActive = bodyPart === bp.key;
            return (
              <button
                key={bp.key || '__all__'}
                onClick={() => setBodyPart(bp.key)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors shrink-0 ${
                  isActive
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                }`}
              >
                {bp.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 标题 + 计数 */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500 font-medium tracking-wider">
          {bodyPart ? getCategoryLabel(bodyPart) : debouncedQuery ? '搜索结果' : '全部动作'}
        </p>
        <span className="text-xs text-gray-600">{filtered.length} 个动作</span>
      </div>

      {/* 动作网格 */}
      {pageItems.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-8">未找到匹配的动作</p>
      )}

      <div className="grid grid-cols-2 gap-3">
        {pageItems.map((ex) => (
          <button
            key={ex.id}
            onClick={() => handleStart(ex.id)}
            className="bg-gray-900 hover:bg-gray-800 rounded-xl overflow-hidden transition-colors active:scale-[0.97] text-left"
          >
            <div className="aspect-square">
              <ExerciseImage
                exerciseId={ex.id}
                exerciseName={getExerciseNameZh(ex)}
                target={ex.target}
                className="w-full h-full"
              />
            </div>
            <div className="p-2.5">
              <p className="text-sm font-medium text-white truncate">{getExerciseNameZh(ex)}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {getCategoryLabel(ex.category)}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* 分页导航 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-3">
          <button
            onClick={goPrev}
            disabled={safePage <= 1}
            className="p-2 rounded-xl bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm text-gray-400 tabular-nums">
            {safePage} / {totalPages}
          </span>
          <button
            onClick={goNext}
            disabled={safePage >= totalPages}
            className="p-2 rounded-xl bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
