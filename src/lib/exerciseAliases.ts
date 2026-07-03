// src/lib/exerciseAliases.ts
// 中文动作别名 → 标准动作名（用于自然语言导入）
// 用户输入的"原地开合步"等能被映射到 exercises-full.json 里的标准动作

export const EXERCISE_ALIASES: Record<string, string> = {
  // 热身 / 一般
  原地开合步: 'jumping jacks',
  开合跳: 'jumping jacks',
  开合步: 'jumping jacks',
  肩部绕环: 'arm circles',
  肩绕环: 'arm circles',
  颈部绕环: 'neck circles',
  扩胸运动: 'chest opener',
  扩胸: 'chest opener',
  俯身肩胛撑: 'scapular push up',
  肩胛俯卧撑: 'scapular push up',
  肩胛收缩: 'scapular retraction',
  髋关节绕环: 'hip circles',
  髋绕环: 'hip circles',
  高抬腿: 'high knee',
  原地高抬腿: 'high knee',
  弓步拉伸: 'lunge stretch',
  体前屈: 'good morning',
  早安式: 'good morning',

  // 核心 / 腹
  卷腹: '3/4 sit-up',
  半卷腹: '3/4 sit-up',
  空中蹬车: 'air bike',
  蹬车: 'air bike',
  自行车卷腹: 'air bike',
  平板支撑: 'plank',
  平板: 'plank',
  俯卧撑: 'push-up',
  标准俯卧撑: 'push-up',
  跪姿俯卧撑: 'knee push-up',
  跪姿: 'knee push-up',
  上斜俯卧撑: 'incline push-up',
  下斜俯卧撑: 'decline push-up',
  击掌俯卧撑: 'clap push up',
  钻石俯卧撑: 'diamond push up',
  宽距俯卧撑: 'wide push up',
  窄距俯卧撑: 'close push up',

  // 背 / 拉
  引体向上: 'pull up',
  正握引体: 'pull up',
  反握引体: 'chin up',
  划船: 'barbell row',
  杠铃划船: 'barbell row',
  哑铃划船: 'dumbbell row',
  高位下拉: 'lat pulldown',
  面拉: 'face pull',

  // 腿
  深蹲: 'squat',
  自重深蹲: 'squat',
  高脚杯深蹲: 'goblet squat',
  弓步蹲: 'lunge',
  弓步: 'lunge',
  行走弓步: 'walking lunge',
  蹲跳: 'jump squat',
  提踵: 'calf raise',
  站姿提踵: 'standing calf raise',
  单腿提踵: 'single leg calf raise',
  臀桥: 'bridge',
  单腿臀桥: 'single leg bridge',
  臀冲: 'hip thrust',
  硬拉: 'deadlift',
  罗马尼亚硬拉: 'romanian deadlift',
  直腿硬拉: 'stiff leg deadlift',

  // 胸
  卧推: 'barbell bench press',
  杠铃卧推: 'barbell bench press',
  哑铃卧推: 'dumbbell bench press',
  上斜卧推: 'incline bench press',
  下斜卧推: 'decline bench press',
  飞鸟: 'chest fly',
  哑铃飞鸟: 'dumbbell fly',
  蝴蝶机夹胸: 'pec deck',

  // 肩
  推举: 'shoulder press',
  肩上推举: 'shoulder press',
  哑铃推举: 'dumbbell shoulder press',
  阿诺德推举: 'arnold press',
  侧平举: 'lateral raise',
  前平举: 'front raise',
  反向飞鸟: 'reverse fly',
  耸肩: 'shoulder shrug',
  直立划船: 'upright row',

  // 臂
  二头弯举: 'barbell curl',
  弯举: 'barbell curl',
  锤式弯举: 'hammer curl',
  臂屈伸: 'chest dip',
  双杠臂屈伸: 'chest dip',
  三头下压: 'triceps pushdown',
  肱三头肌下压: 'triceps pushdown',
  法式推举: 'french press',
  颈后臂屈伸: 'overhead triceps',

  // 有氧 / 全身
  波比跳: 'burpee',
  登山者: 'mountain climber',
  俯身登山: 'mountain climber',
  跳绳: 'rope jump',
  跳跳绳: 'jumping jacks',
  高抬腿跑: 'run',
  折返跑: 'sprint',
  战绳: 'battle rope',
  滑雪机: 'sled push',
  药球: 'medicine ball slam',
};

/**
 * 解析别名，返回标准名；未命中返回 null
 */
export function resolveAlias(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return null;
  if (EXERCISE_ALIASES[trimmed]) return EXERCISE_ALIASES[trimmed];
  // 包含匹配：用户输入 "原地开合步 10" 也能识别
  for (const [alias, std] of Object.entries(EXERCISE_ALIASES)) {
    if (trimmed.startsWith(alias) || trimmed.includes(alias)) {
      return std;
    }
  }
  return null;
}
