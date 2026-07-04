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
  // 每组 N 个：如 "3 组 每组 12 个" → reps=12
  const perSetRepMatch = trimmed.match(/每组\s*(\d+)\s*个/);

  // 去掉数字和元信息获取动作名（保留规范化空格，不全部移除）
  const name = trimmed
    .replace(/\d+\s*(秒|分钟|个|组)/g, '')
    .replace(/每组\s*\d+\s*个?/g, '')
    .replace(/休息|组间/g, '')
    .replace(/\s{2,}/g, ' ')  // 合并多余空格
    .trim();

  if (!name) return null;

  let duration: number | undefined;
  if (secMatch) duration = toInt(secMatch[1]);
  else if (minMatch) duration = toInt(minMatch[1]) * 60;

  const reps = repMatch ? toInt(repMatch[1]) : (perSetRepMatch ? toInt(perSetRepMatch[1]) : undefined);

  return {
    name,
    duration,
    restAfter: restMatch ? toInt(restMatch[1]) : undefined,
    sets: setMatch ? toInt(setMatch[1]) : undefined,
    reps,
  };
}

/**
 * 从字典中匹配动作名
 *
 * 匹配策略（按优先级降序）：
 * 1. 别名精确/前缀/包含匹配 — 按别名长度降序（长别名优先，避免"深蹲"误吞"深蹲跳"）
 * 2. dict 精确匹配
 * 3. dict 包含匹配 — 按长度比例评分（子串越长、越接近原名，分数越高）
 */
function matchExercise(
  name: string,
  dict: ActionDictionary,
  aliases: Record<string, string> = {},
): { id: string; nameZh: string; originalName: string } | null {
  if (!name) return null;

  // 1. 别名匹配：按别名长度降序，最长优先
  //    "深蹲跳"（3字）排在 "深蹲"（2字）前面，优先匹配 jump squat 而非 squat
  const sortedAliases = Object.entries(aliases).sort(
    (a, b) => b[0].length - a[0].length,
  );
  for (const [alias, std] of sortedAliases) {
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

  // 3. 字典包含匹配（带评分，选最佳而非第一个）
  const candidates: { key: string; score: number }[] = [];
  for (const key of Object.keys(dict)) {
    if (key === name) continue;
    // 子串越接近原串长度，得分越高
    // 例：name="弯举" key="锤式弯举" → score=2/4=0.5；key="弯举" → score=2/2=1
    if (key.includes(name)) {
      candidates.push({ key, score: name.length / key.length });
    } else if (name.includes(key) && key.length > 1) {
      candidates.push({ key, score: key.length / name.length });
    }
  }
  if (candidates.length > 0) {
    candidates.sort((a, b) => b.score - a.score);
    const best = candidates[0];
    return { ...dict[best.key], originalName: best.key };
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
