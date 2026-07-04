import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { presetPlans, getPlanCategoryLabel, getDifficultyLabel, getDifficultyColor } from '../data/plans';
import { getAllExercises, getExercisesById, getCategoryLabel, getExerciseNameZh, searchExercises } from '../data/exercises';
import { getUserPlans, saveUserPlan, deleteUserPlan } from '../lib/storage';
import { generateId } from '../lib/utils';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ArrowLeft, Play, Plus, Trash2, Search, Save, Copy, Clock, Dumbbell, Wand2 } from 'lucide-react';
import type { PlanExercise, UserPlan } from '../types';
import type { ParseResult } from '../lib/planParser';
import SortableExerciseItem from '../components/SortableExerciseItem';
import ExerciseImage from '../components/ExerciseImage';

const IMPORT_SEED_KEY = 'fitfollow:import-seed';

/** 动作列表选择器（带搜索、可滚动） */
function ExercisePicker({ onSelect }: { onSelect: (exerciseId: string) => void }) {
  const [query, setQuery] = useState('');
  const exercises = query ? searchExercises(query).slice(0, 50) : getAllExercises().slice(0, 50);

  return (
    <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center">
          <Plus size={16} className="text-indigo-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">添加动作</p>
          <p className="text-xs text-gray-500">点击列表中的动作即可加入计划</p>
        </div>
      </div>
      <div className="relative mb-3">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="搜索动作，例如：深蹲、卧推、卷腹..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-gray-950 text-white rounded-xl py-3 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-gray-600"
        />
      </div>
      <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
        {exercises.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">未找到相关动作</p>
            <p className="text-xs mt-1">试试英文名称或身体部位</p>
          </div>
        ) : (
          exercises.map((ex) => (
            <button
              key={ex.id}
              onClick={() => onSelect(ex.id)}
              className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-gray-800 transition-colors text-left group"
            >
              <ExerciseImage
                exerciseId={ex.id}
                exerciseName={getExerciseNameZh(ex)}
                className="w-14 h-14 rounded-lg shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{getExerciseNameZh(ex)}</p>
                <p className="text-xs text-gray-500">
                  {getCategoryLabel(ex.category)} · {ex.target}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/30 transition-colors">
                <Plus size={16} className="text-indigo-400" />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export default function PlanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isNew = location.pathname === '/plan/new';
  const isEdit = location.pathname.startsWith('/plan/edit/');
  const isPreset = !isNew && !isEdit;

  const [planName, setPlanName] = useState('');
  const [exercises, setExercises] = useState<PlanExercise[]>([]);
  const [sets, setSets] = useState(1);
  const [defaultRest, setDefaultRest] = useState(15);
  const [defaultDuration, setDefaultDuration] = useState(40);
  const [restBetweenSets, setRestBetweenSets] = useState(60);

  // 加载数据
  useEffect(() => {
    if (isNew) {
      setPlanName('我的自定义计划');
      setExercises([]);
      setSets(1);
      setDefaultRest(15);
      setDefaultDuration(40);
      setRestBetweenSets(60);

      // 检查是否有 ImportPlanPage 写入的 seed
      const seedRaw = sessionStorage.getItem(IMPORT_SEED_KEY);
      if (seedRaw) {
        try {
          const seed = JSON.parse(seedRaw) as ParseResult;
          setPlanName(seed.planName);
          setSets(seed.sets);
          setDefaultDuration(seed.defaultDuration);
          setRestBetweenSets(seed.restBetweenSets);
          setExercises(
            seed.actions.map((a, i) => ({
              exerciseId: a.exerciseId,
              order: i,
              duration: a.duration,
              restAfter: a.restAfter,
            })),
          );
        } catch {
          // ignore parse error
        } finally {
          sessionStorage.removeItem(IMPORT_SEED_KEY);
        }
      }
      return;
    }
    if (isEdit) {
      const plan = getUserPlans().find((p) => p.id === id);
      if (plan) {
        setPlanName(plan.name);
        setExercises(plan.exercises);
        setSets(plan.sets);
        setDefaultRest(plan.defaultRest);
        setDefaultDuration(plan.defaultDuration);
        setRestBetweenSets(plan.restBetweenSets ?? 60);
      }
      return;
    }
    const plan = presetPlans.find((p) => p.id === id);
    if (plan) {
      setPlanName(plan.nameZh);
      setExercises(plan.exercises);
      setSets(plan.sets);
      setDefaultRest(plan.defaultRest);
      setDefaultDuration(plan.defaultDuration);
    }
  }, [id, isNew, isEdit]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = exercises.findIndex((_, i) => `${exercises[i].exerciseId}-${i}` === active.id);
    const newIdx = exercises.findIndex((_, i) => `${exercises[i].exerciseId}-${i}` === over.id);
    if (oldIdx === -1 || newIdx === -1) return;
    const updated = [...exercises];
    const [moved] = updated.splice(oldIdx, 1);
    updated.splice(newIdx, 0, moved);
    setExercises(updated.map((ex, i) => ({ ...ex, order: i })));
  };

  const addExercise = (exerciseId: string) => {
    setExercises([
      ...exercises,
      { exerciseId, order: exercises.length, duration: defaultDuration, restAfter: defaultRest },
    ]);
  };

  const removeExercise = (index: number) => setExercises(exercises.filter((_, i) => i !== index));
  const updateExercise = (index: number, updated: PlanExercise) => {
    const clone = [...exercises];
    clone[index] = updated;
    setExercises(clone);
  };

  const handleSave = () => {
    if (exercises.length === 0) return;
    const plan: UserPlan = {
      id: isEdit ? id! : generateId(),
      name: planName,
      createdAt: new Date().toISOString(),
      exercises,
      defaultRest,
      defaultDuration,
      restBetweenSets,
      sets,
    };
    saveUserPlan(plan);
    navigate('/');
  };

  const handleDelete = () => {
    if (isEdit) deleteUserPlan(id!);
    navigate('/');
  };

  /** 复制预设计划为自定义计划 */
  const duplicateAsCustom = () => {
    const plan = presetPlans.find((p) => p.id === id);
    if (!plan) return;
    const newPlan: UserPlan = {
      id: generateId(),
      name: `${plan.nameZh}（自定义）`,
      createdAt: new Date().toISOString(),
      exercises: plan.exercises.map((ex, i) => ({ ...ex, order: i })),
      defaultRest: plan.defaultRest,
      defaultDuration: plan.defaultDuration,
      restBetweenSets: plan.restBetweenSets ?? 60,
      sets: plan.sets,
    };
    saveUserPlan(newPlan);
    navigate(`/plan/edit/${newPlan.id}`);
  };

  const sortableIds = exercises.map((_, i) => `${exercises[i].exerciseId}-${i}`);

  return (
    <div className="space-y-5 pb-28">
      {/* 顶部 */}
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-white/5">
          <ArrowLeft size={22} className="text-gray-400" />
        </button>
        {isPreset ? (
          <h1 className="text-lg font-bold text-white">{planName}</h1>
        ) : (
          <input
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className="flex-1 bg-transparent text-lg font-bold text-white outline-none"
            placeholder="计划名称"
          />
        )}
      </div>

      {/* 文字导入入口 */}
      {!isPreset && (
        <button
          onClick={() => navigate('/plan/import')}
          className="w-full py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-sm text-gray-300 hover:bg-gray-800 flex items-center justify-center gap-2"
        >
          <Wand2 size={14} />
          试试用文字导入计划
        </button>
      )}

      {/* 预设计划展示 */}
      {isPreset && (
        <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
          {(() => {
            const plan = presetPlans.find((p) => p.id === id);
            return plan ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-500">{plan.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(plan.difficulty)}`}>
                    {getDifficultyLabel(plan.difficulty)}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
                    {getPlanCategoryLabel(plan.category)}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">
                    {plan.exercises.length} 动作 · {plan.sets} 组
                  </span>
                </div>
                <button
                  onClick={duplicateAsCustom}
                  className="w-full py-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400 text-sm font-medium hover:bg-indigo-500/20 transition-colors flex items-center justify-center gap-2"
                >
                  <Copy size={16} />
                  复制为自定义计划（可编辑添加动作）
                </button>
              </div>
            ) : (
              <p className="text-gray-500">计划不存在</p>
            );
          })()}
        </div>
      )}

      {/* 自定义/新建计划：核心创建流程 */}
      {!isPreset && (
        <>
          {/* 1. 添加动作 */}
          <ExercisePicker onSelect={addExercise} />

          {/* 2. 已选动作 */}
          <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <Dumbbell size={16} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">已选动作</p>
                <p className="text-xs text-gray-500">已添加 {exercises.length} 个</p>
              </div>
            </div>

            {exercises.length === 0 ? (
              <div className="text-center py-8 text-gray-500 rounded-xl border border-dashed border-gray-800 bg-gray-950/50">
                <p className="text-sm">还没有选择动作</p>
                <p className="text-xs mt-1">从上方「添加动作」列表中点击添加</p>
              </div>
            ) : (
              <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
                  <div className="space-y-2">
                    {exercises.map((ex, i) => (
                      <SortableExerciseItem
                        key={`${ex.exerciseId}-${i}`}
                        exercise={ex}
                        index={i}
                        onRemove={() => removeExercise(i)}
                        onChange={(updated) => updateExercise(i, updated)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>

          {/* 3. 训练时间设置 */}
          <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <Clock size={16} className="text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">训练设置</p>
                <p className="text-xs text-gray-500">调整组数、时长与休息时间</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {([
                { label: '组数', value: sets, set: setSets, opts: [1, 2, 3, 4, 5] },
                { label: '组间休息', value: restBetweenSets, set: setRestBetweenSets, opts: [30, 45, 60, 90, 120], suffix: 's' },
                { label: '默认时长', value: defaultDuration, set: setDefaultDuration, opts: [15, 20, 30, 40, 45, 60, 90, 120], suffix: 's' },
                { label: '动作间休息', value: defaultRest, set: setDefaultRest, opts: [5, 10, 15, 20, 30, 45, 60], suffix: 's' },
              ] as const).map((c) => (
                <div key={c.label} className="bg-gray-950 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-500">{c.label}</p>
                  <select
                    value={c.value}
                    onChange={(e) => c.set(Number(e.target.value))}
                    className="appearance-none bg-gray-800 text-white font-medium text-center w-full rounded-lg py-1 outline-none cursor-pointer"
                  >
                    {c.opts.map((n) => (
                      <option key={n} value={n} className="bg-gray-800 text-white">
                        {n}{'suffix' in c ? c.suffix : ''}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 预设计划：只读动作列表 */}
      {isPreset && exercises.length > 0 && (
        <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
          <p className="text-sm font-medium text-white mb-3">包含动作</p>
          <div className="space-y-2">
            {exercises.map((ex, i) => {
              const exerciseData = getExercisesById().get(ex.exerciseId);
              return (
                <div
                  key={`${ex.exerciseId}-${i}`}
                  className="flex items-center gap-3 bg-gray-950 rounded-xl p-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {exerciseData ? getExerciseNameZh(exerciseData) : ex.exerciseId}
                    </p>
                    {exerciseData && (
                      <p className="text-xs text-gray-500">{getCategoryLabel(exerciseData.category)}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{ex.duration}秒</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 底部按钮 */}
      {isPreset ? (
        <button
          onClick={() =>
            navigate(`/workout/${id}`, {
              state: (() => {
                const plan = presetPlans.find((p) => p.id === id);
                return plan
                  ? {
                      planId: plan.id,
                      planName: plan.nameZh,
                      exercises: plan.exercises,
                      sets: plan.sets,
                      defaultRest: plan.defaultRest,
                      defaultDuration: plan.defaultDuration,
                      restBetweenSets: plan.restBetweenSets,
                    }
                  : {};
              })(),
            })
          }
          className="fixed bottom-20 left-4 right-4 max-w-[calc(32rem-2rem)] mx-auto py-3.5 bg-indigo-500 rounded-xl text-white font-medium text-base hover:bg-indigo-600 transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Play size={20} fill="white" />
          开始训练
        </button>
      ) : (
        <div className="flex gap-2 fixed bottom-20 left-4 right-4 max-w-[calc(32rem-2rem)] mx-auto">
          <button
            onClick={handleSave}
            disabled={exercises.length === 0}
            className="flex-1 py-3.5 bg-indigo-500 rounded-xl text-white font-medium text-base hover:bg-indigo-600 transition-colors active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            保存计划
          </button>
          {isEdit && (
            <button onClick={handleDelete} className="px-4 py-3.5 bg-red-500/20 rounded-xl text-red-400 font-medium hover:bg-red-500/30 transition-colors">
              <Trash2 size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
