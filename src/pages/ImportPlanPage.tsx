// src/pages/ImportPlanPage.tsx
// 自然语言导入训练计划
// 详见 ADR-001 / ADR-002

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wand2, FileText } from 'lucide-react';
import {
  parsePlanFromText,
  type ActionDictionary,
  type ParseResult,
} from '../lib/planParser';
import { EXERCISE_ALIASES } from '../lib/exerciseAliases';
import { getAllExercises, getExerciseNameZh, isExercisesLoaded } from '../data/exercises';

const SEED_KEY = 'fitfollow:import-seed';

const SAMPLE_HIIT = `组数 4 组间休息 60 秒
波比跳 30 秒 休息 15 秒
深蹲跳 30 秒 休息 15 秒
登山者 30 秒 休息 15 秒
计划名 HIIT 入门`;

const SAMPLE_STRENGTH = `组数 3
深蹲 3 组 每组 12 个
卧推 3 组 每组 10 个
划船 3 组 每组 12 个
计划名 胸部推日`;

export default function ImportPlanPage() {
  const navigate = useNavigate();
  const [text, setText] = useState('');

  /** 实时把"动作库"转成 parser 需要的字典格式 */
  const dict: ActionDictionary = useMemo(() => {
    if (!isExercisesLoaded()) return {};
    const out: ActionDictionary = {};
    for (const ex of getAllExercises()) {
      const zh = getExerciseNameZh(ex);
      out[zh] = { id: ex.id, nameZh: zh };
    }
    return out;
  }, []);

  /** 实时预览（用当前 dict + 别名） */
  const preview: ParseResult = useMemo(
    () => parsePlanFromText(text, dict, EXERCISE_ALIASES),
    [text, dict],
  );

  const handleParse = () => {
    if (preview.actions.length === 0) return;
    // 写入 sessionStorage，PlanDetailPage 读取后立即 removeItem
    sessionStorage.setItem(SEED_KEY, JSON.stringify(preview));
    navigate('/plan/new');
  };

  const applySample = (s: string) => setText(s);

  return (
    <div className="space-y-4 pb-24">
      {/* 顶部 */}
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-white/5">
          <ArrowLeft size={22} className="text-gray-400" />
        </button>
        <h1 className="text-lg font-bold text-white">文字导入计划</h1>
      </div>

      <p className="text-sm text-gray-400">
        写一段话描述你的训练，系统会自动识别为可编辑的计划。
      </p>

      {/* 示例 */}
      <div className="flex gap-2">
        <button
          onClick={() => applySample(SAMPLE_HIIT)}
          className="flex-1 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs text-gray-300 hover:bg-gray-800 flex items-center justify-center gap-1.5"
        >
          <FileText size={14} /> 示例：HIIT 入门
        </button>
        <button
          onClick={() => applySample(SAMPLE_STRENGTH)}
          className="flex-1 py-2 bg-gray-900 border border-gray-800 rounded-xl text-xs text-gray-300 hover:bg-gray-800 flex items-center justify-center gap-1.5"
        >
          <FileText size={14} /> 示例：胸部推日
        </button>
      </div>

      {/* 输入框 */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={'例如：\n深蹲 30 秒\n卧推 30 秒\n组数 3'}
        rows={8}
        className="w-full bg-gray-900 text-white rounded-2xl p-4 text-sm font-mono outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder:text-gray-600 resize-y"
      />

      {/* 实时预览 */}
      {text.trim() && (
        <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
          <p className="text-xs text-gray-500 mb-2">实时预览</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
            <div>动作数：<span className="text-white">{preview.actions.length}</span></div>
            <div>组数：<span className="text-white">{preview.sets}</span></div>
            <div>默认时长：<span className="text-white">{preview.defaultDuration}s</span></div>
            <div>组间休息：<span className="text-white">{preview.restBetweenSets}s</span></div>
          </div>
          {preview.actions.length > 0 && (
            <ul className="space-y-1 text-sm">
              {preview.actions.map((a, i) => (
                <li key={i} className="text-white flex justify-between">
                  <span>{i + 1}. {a.nameZh}</span>
                  <span className="text-gray-500 text-xs">
                    {a.duration}s · 休息 {a.restAfter}s
                  </span>
                </li>
              ))}
            </ul>
          )}
          {preview.warnings.length > 0 && (
            <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-xs text-yellow-400">
              {preview.warnings.map((w, i) => <div key={i}>⚠ {w}</div>)}
            </div>
          )}
        </div>
      )}

      {/* 底部按钮 */}
      <button
        onClick={handleParse}
        disabled={preview.actions.length === 0}
        className="fixed bottom-20 left-4 right-4 max-w-[calc(32rem-2rem)] mx-auto py-3.5 bg-indigo-500 rounded-xl text-white font-medium text-base hover:bg-indigo-600 transition-colors active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Wand2 size={18} />
        解析并继续编辑
      </button>
    </div>
  );
}
