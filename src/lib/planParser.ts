// src/lib/planParser.ts
// 自然语言 → 训练计划解析器
// 设计：行扫描 + 正则 + 中文动作名模糊匹配
// 详见 ADR-001 / ADR-002

export type ParsedAction = {
  exerciseId: string;
  nameZh: string;
  duration: number;
  restAfter: number;
  confidence: 'high' | 'low';
};

export type ParseResult = {
  planName: string;
  sets: number;
  defaultDuration: number;
  restBetweenSets: number;
  actions: ParsedAction[];
  warnings: string[];
  unknownTokens: string[];
};

/** 动作字典：name → { id, nameZh } */
export type ActionDictionary = Record<string, { id: string; nameZh: string }>;

const DEFAULT_DURATION = 40;
const DEFAULT_REST = 15;
const DEFAULT_REST_BETWEEN_SETS = 60;
const SECONDS_PER_REP = 3; // 力量动作 "1 个" 估算为 3 秒

function toInt(s: string | undefined): number {
  if (!s) return NaN;
  const n = parseInt(s, 10);
  return Number.isFinite(n) ? n : NaN;
}

type LineExtract = {
  name: string;
  duration?: number;
  restAfter?: number;
  sets?: number;
  reps?: number;
};

function extractFromLine(line: string): LineExtract | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const secMatch = trimmed.match(/(\d+)\s*秒/);
  const minMatch = trimmed.match(/(\d+)\s*分钟/);
  const repMatch = trimmed.match(/(\d+)\s*个/);
  const setMatch = trimmed.match(/(\d+)\s*组(?!间)/);
  const restMatch = trimmed.match(/休息\s*(\d+)\s*秒/);

  const name = trimmed
    .replace(/\d+\s*(秒|分钟|个|组)/g, '')
    .replace(/每组|休息|组间/g, '')
    .replace(/\s+/g, '')
    .trim();

  if (!name) return null;

  let duration: number | undefined;
  if (secMatch) duration = toInt(secMatch[1]);
  else if (minMatch) duration = toInt(minMatch[1]) * 60;

  return {
    name,
    duration,
    restAfter: restMatch ? toInt(restMatch[1]) : undefined,
    sets: setMatch ? toInt(setMatch[1]) : undefined,
    reps: repMatch ? toInt(repMatch[1]) : undefined,
  };
}

/** 从字典中匹配动作名（最长前缀优先） */
function matchExercise(
  name: string,
  dict: ActionDictionary,
  aliases: Record<string, string> = {},
): { id: string; nameZh: string; originalName: string } | null {
  if (!name) return null;

  // 1. 优先：内置别名 → 标准名
  for (const [alias, std] of Object.entries(aliases)) {
    if (name === alias || name.startsWith(alias) || name.includes(alias)) {
      if (dict[std]) {
        return { ...dict[std], originalName: std };
      }
    }
  }

  // 2. 字典精确匹配
  if (dict[name]) {
    return { ...dict[name], originalName: name };
  }

  // 3. 包含匹配
  for (const key of Object.keys(dict)) {
    if (key.includes(name) || name.includes(key)) {
      return { ...dict[key], originalName: key };
    }
  }
  return null;
}

function resolveDuration(
  explicit: number | undefined,
  sets: number | undefined,
  reps: number | undefined,
  defaultDuration: number,
): number {
  if (explicit) return explicit;
  if (reps) return reps * SECONDS_PER_REP; // 每组 reps 个，每 SECONDS_PER_REP 秒
  if (sets) return defaultDuration;
  return defaultDuration;
}

/**
 * 主入口：把自然语言文本解析成 ParseResult
 * @param text 用户输入
 * @param dict 动作字典
 * @param aliases 别名映射（中文别名 → 标准动作名）
 */
export function parsePlanFromText(
  text: string,
  dict: ActionDictionary,
  aliases: Record<string, string> = {},
): ParseResult {
  const result: ParseResult = {
    planName: '导入的计划',
    sets: 1,
    defaultDuration: DEFAULT_DURATION,
    restBetweenSets: DEFAULT_REST_BETWEEN_SETS,
    actions: [],
    warnings: [],
    unknownTokens: [],
  };

  const lines = text.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const setsMatch = trimmed.match(/^组数\s*(\d+)/);
    if (setsMatch) {
      result.sets = toInt(setsMatch[1]) || result.sets;
      continue;
    }

    const rbsMatch = trimmed.match(/组间休息\s*(\d+)\s*秒/);
    if (rbsMatch) {
      result.restBetweenSets = toInt(rbsMatch[1]) || result.restBetweenSets;
      continue;
    }

    const nameMatch = trimmed.match(/^(?:计划名|名称)\s*(.+)$/);
    if (nameMatch) {
      result.planName = nameMatch[1].trim();
      continue;
    }

    const extract = extractFromLine(trimmed);
    if (!extract) continue;

    // 行内 "N 组" 覆盖 Plan.sets
    if (extract.sets && extract.sets > result.sets) {
      result.sets = extract.sets;
    }

    const exercise = matchExercise(extract.name, dict, aliases);
    if (!exercise) {
      result.unknownTokens.push(extract.name);
      result.warnings.push(`未识别动作：${extract.name}`);
      continue;
    }

    const duration = resolveDuration(
      extract.duration,
      extract.sets,
      extract.reps,
      result.defaultDuration,
    );

    const restAfter = extract.restAfter ?? DEFAULT_REST;

    result.actions.push({
      exerciseId: exercise.id,
      nameZh: exercise.nameZh,
      duration,
      restAfter,
      confidence: 'high',
    });
  }

  return result;
}
