import type { Exercise } from '../types';

/** 全部训练动作索引 — 按 ID 查找 */
let exercisesById = new Map<string, Exercise>();
/** 全部动作列表（搜索用） */
let allExercises: Exercise[] = [];

let loadPromise: Promise<void> | null = null;
let loaded = false;

/**
 * 异步加载完整动作数据集
 * 首次调用触发 JSON chunk 动态导入，后续调用复用已加载结果
 */
export function loadExercises(): Promise<void> {
  if (loadPromise) return loadPromise;
  if (loaded) return Promise.resolve();

  loadPromise = import('./exercises-full.json')
    .then((module) => {
      const rawData = (module.default ?? module) as Exercise[];
      const byId = new Map<string, Exercise>();
      const list: Exercise[] = [];
      rawData.forEach((raw) => {
        // 过滤掉无效记录（缺 name 或 id），避免后续访问 undefined
        if (!raw || !raw.id || !raw.name) return;
        // 补齐 instructions 缺失字段
        const ex: Exercise = {
          ...raw,
          instructions: raw.instructions || { en: '', es: '', it: '', tr: '', ru: '', zh: '' },
        };
        list.push(ex);
        byId.set(ex.id, ex);
      });
      allExercises = list;
      exercisesById = byId;
      loaded = true;
    })
    .catch((err) => {
      // 加载失败时重置 promise，允许下次重试
      loadPromise = null;
      throw err;
    });

  return loadPromise;
}

/** 数据是否已加载完成 */
export function isExercisesLoaded(): boolean {
  return loaded;
}

/** 获取按 ID 索引的 Map（调用前需确保 loadExercises 已完成） */
export function getExercisesById(): Map<string, Exercise> {
  return exercisesById;
}

/** 获取全部动作列表（调用前需确保 loadExercises 已完成） */
export function getAllExercises(): Exercise[] {
  return allExercises;
}

// ── 中文名翻译 ──

/** 完整名称映射（特殊名称全覆盖） */
const FULL: Record<string, string> = {
  '3/4 sit-up': '卷腹',
  '45° side bend': '侧屈体',
  'air bike': '空中蹬车',
  'all fours squad stretch': '四肢伸展',
  'alternate heel touchers': '交替触脚跟',
  'archer pull up': '弓箭手引体向上',
  'archer push up': '弓箭手俯卧撑',
  'astride jumps': '分腿跳',
  'backward jump': '向后跳',
  'balance board': '平衡板',
  'bear crawl': '熊爬行',
  'burpee': '波比跳',
  'chest dip': '双杠臂屈伸',
  'clap push up': '击掌俯卧撑',
  'deadlift': '硬拉',
  'goblet squat': '高脚杯深蹲',
  'half knee bends': '半蹲',
  'high knee against wall': '靠墙高抬腿',
  'mountain climber': '登山者',
  'pull-up': '引体向上',
  'push-up': '俯卧撑',
};

/** 英文→中文单词词典 */
const DICT: Record<string, string> = {
  'alternate': '交替', 'assisted': '辅助',
  'band': '弹力带', 'barbell': '杠铃', 'battling': '战绳',
  'bend': '屈体', 'bent': '屈', 'body': '自重',
  'boxing': '拳击', 'bridge': '臀桥',
  'cable': '缆绳', 'calf': '小腿', 'circle': '绕环',
  'clean': '高翻', 'close': '窄距', 'concentration': '集中',
  'crunch': '卷腹', 'curl': '弯举',
  'deadlift': '硬拉', 'decline': '下斜',
  'deltoid': '三角肌', 'dip': '臂屈伸', 'down': '下',
  'dumbbell': '哑铃', 'extension': '伸展',
  'flat': '平板', 'fly': '飞鸟', 'front': '前',
  'glute': '臀', 'glutes': '臀部', 'goblet': '高脚杯',
  'hammer': '锤式', 'hanging': '悬垂', 'high': '高',
  'hip': '髋', 'hold': '保持', 'hook': '勾拳',
  'incline': '上斜',
  'jump': '跳', 'jumping': '跳跃',
  'kettlebell': '壶铃', 'kick': '踢', 'knee': '膝',
  'kneeling': '跪姿',
  'lat': '背阔肌', 'lateral': '侧', 'leg': '腿',
  'lever': '杠杆', 'lying': '仰卧', 'lunge': '弓步蹲',
  'narrow': '窄距', 'neutral': '中立',
  'one': '单臂', 'overhead': '过头',
  'plank': '平板支撑', 'preacher': '托臂',
  'press': '推举', 'prone': '俯卧', 'pull': '拉',
  'pullover': '上拉', 'punch': '刺拳', 'push': '推',
  'raise': '平举', 'rear': '后', 'reverse': '反向',
  'rope': '绳', 'row': '划船',
  'seated': '坐姿', 'shoulder': '肩部',
  'side': '侧', 'single': '单臂', 'sit-up': '卷腹',
  'smith': '史密斯', 'squat': '深蹲',
  'standing': '站姿', 'straight': '直', 'stretch': '拉伸',
  'swing': '摆动',
  'tap': '轻触', 'touch': '触',
  'triceps': '肱三头肌', 'twist': '扭转',
  'up': '上',
  'walk': '走', 'weighted': '负重', 'wide': '宽距',
  'with': '', 'and': '', 'the': '', 'to': '', 'a': '',
  'on': '', 'off': '', 'in': '', 'of': '', 'for': '',
  'male': '', 'female': '',
};

/** 复合短语优先匹配 */
const COMPOUNDS: [string, string][] = [
  ['arnold press', '阿诺德推举'],
  ['bench press', '卧推'],
  ['bent over', '俯身'],
  ['calf raise', '提踵'],
  ['chest fly', '飞鸟'],
  ['chin up', '引体向上'],
  ['dead bug', '死虫式'],
  ['deadlift', '硬拉'],
  ['face pull', '面拉'],
  ['front raise', '前平举'],
  ['good morning', '早安式'],
  ['hip thrust', '臀冲'],
  ['lateral raise', '侧平举'],
  ['leg curl', '腿弯举'],
  ['leg extension', '腿伸展'],
  ['leg press', '腿举'],
  ['leg raise', '举腿'],
  ['pull up', '引体向上'],
  ['push up', '俯卧撑'],
  ['reverse fly', '反向飞鸟'],
  ['shoulder press', '肩推'],
  ['shoulder shrug', '耸肩'],
  ['sit up', '卷腹'],
  ['triceps pushdown', '肱三头肌下压'],
];

/** 智能翻译英文动作名为中文 */
function translateNameToZh(name: string | undefined | null): string {
  if (!name) return '';
  const key = name.toLowerCase().trim();
  if (FULL[key]) return FULL[key];
  let n = key.replace(/\s*\((male|female)\)\s*/g, ' ').replace(/\s+/g, ' ').trim();

  for (const [eng, chn] of COMPOUNDS) {
    if (n.includes(eng)) {
      n = n.replace(eng, chn);
    }
  }

  // Word-by-word
  const tokens = n.split(/[\s-]+/);
  const translated = tokens.map(t => DICT[t] ?? t);
  let result = translated.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
  return result || name;
}

/** 获取动作中文名 */
export function getExerciseNameZh(exercise: Exercise | undefined | null): string {
  if (!exercise) return '未知动作';
  return translateNameToZh(exercise.name) || exercise.name || '未知动作';
}

/** 获取中文指导 */
export function getInstructionZh(exercise: Exercise | undefined | null): string {
  if (!exercise || !exercise.instructions) return '';
  return exercise.instructions.zh || exercise.instructions.en || '';
}

/** 分类中文标签 */
export function getCategoryLabel(category: string | undefined | null): string {
  if (!category) return '未分类';
  const labels: Record<string, string> = {
    'back': '背部', 'cardio': '有氧', 'chest': '胸部',
    'lower arms': '前臂', 'lower legs': '小腿', 'neck': '颈部',
    'shoulders': '肩部', 'upper arms': '上臂', 'upper legs': '腿部', 'waist': '腰部',
  };
  return labels[category] || category;
}

/** 器械中文标签 */
export function getEquipmentLabel(equipment: string | undefined | null): string {
  if (!equipment) return '';
  const labels: Record<string, string> = {
    'body weight': '自重', 'dumbbell': '哑铃', 'barbell': '杠铃',
    'cable': '缆绳', 'leverage machine': '杠杆器械', 'band': '弹力带',
    'smith machine': '史密斯机', 'kettlebell': '壶铃', 'weighted': '负重',
    'stability ball': '健身球', 'ez barbell': 'EZ 杠铃', 'foam roll': '泡沫轴',
    'battle ropes': '战绳', 'sled machine': '滑雪机', 'medicine ball': '药球',
    'tire': '轮胎', 'rope': '绳子', 'body weight, dumbbell': '自重/哑铃',
  };
  return labels[equipment] || equipment;
}

/** 搜索动作 */
export function searchExercises(query: string): Exercise[] {
  const q = (query || '').toLowerCase();
  const exercises = getAllExercises();
  return exercises.filter((ex) => {
    if (!ex) return false;
    const nameZh = translateNameToZh(ex.name).toLowerCase();
    return nameZh.includes(q) ||
      (ex.name || '').toLowerCase().includes(q) ||
      (ex.category || '').toLowerCase().includes(q) ||
      (ex.target || '').toLowerCase().includes(q);
  });
}
