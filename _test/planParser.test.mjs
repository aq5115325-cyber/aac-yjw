// _test/planParser.test.mjs
// 最小化测试：用 node --test 跑，0 依赖
// 运行：node --test _test/planParser.test.mjs

import { test } from 'node:test';
import assert from 'node:assert/strict';

// 纯函数版本：不依赖 exercises.ts 异步加载
// 解析器接受预构建的 action 字典作为参数
import { parsePlanFromText } from '../src/lib/planParser.ts';

// 预定义的 mock 字典（模拟 exercises 库）
const dict = {
  深蹲: { id: '0001', nameZh: '深蹲' },
  卧推: { id: '0002', nameZh: '卧推' },
  划船: { id: '0003', nameZh: '划船' },
  'jumping jacks': { id: '0010', nameZh: '开合跳' },
  'arm circles': { id: '0011', nameZh: '肩部绕环' },
  'chest opener': { id: '0012', nameZh: '扩胸' },
  'scapular push up': { id: '0013', nameZh: '俯身肩胛撑' },
  'push-up': { id: '0014', nameZh: '俯卧撑' },
  'knee push-up': { id: '0015', nameZh: '跪姿俯卧撑' },
  plank: { id: '0016', nameZh: '平板支撑' },
};

// 预定义的 mock 别名（模拟 exerciseAliases 库）
const aliases = {
  原地开合步: 'jumping jacks',
  开合跳: 'jumping jacks',
  肩部绕环: 'arm circles',
  扩胸运动: 'chest opener',
  俯身肩胛撑: 'scapular push up',
  俯卧撑: 'push-up',
  跪姿俯卧撑: 'knee push-up',
  平板支撑: 'plank',
};

// ─── Case 1: 基础 — 动作 + 时长 ───
test('case 1: 深蹲 30 秒 → 1 个动作，duration=30', () => {
  const r = parsePlanFromText('深蹲 30 秒', dict);
  assert.equal(r.actions.length, 1, '应当识别 1 个动作');
  assert.equal(r.actions[0].duration, 30, 'duration 应当为 30');
});

// ─── Case 2: 力量动作 — N 组 每组 M 个 ───
test('case 2: 深蹲 3 组 每组 12 个 → duration=36 (3*12)，sets=3', () => {
  const r = parsePlanFromText('深蹲 3 组 每组 12 个', dict);
  assert.equal(r.actions.length, 1);
  assert.equal(r.actions[0].duration, 36, 'duration 应当为 3*12=36');
  assert.equal(r.sets, 3, 'Plan.sets 应当为 3');
});

// ─── Case 3: 显式 restAfter ───
test('case 3: 深蹲 3 组 休息 60 秒 → restAfter=60', () => {
  const r = parsePlanFromText('深蹲 3 组 休息 60 秒', dict);
  assert.equal(r.actions.length, 1);
  assert.equal(r.actions[0].restAfter, 60, 'restAfter 应当为 60');
});

// ─── Case 4: 多行多动作 ───
test('case 4: 多行 → 2 个动作，顺序正确', () => {
  const r = parsePlanFromText('深蹲 30 秒\n卧推 30 秒', dict);
  assert.equal(r.actions.length, 2, '应当识别 2 个动作');
  assert.equal(r.actions[0].exerciseId, '0001');
  assert.equal(r.actions[1].exerciseId, '0002');
});

// ─── Case 5: 全局参数 — 组数 / 组间休息 ───
test('case 5: 组数 4 组间休息 60 秒 → sets=4, restBetweenSets=60', () => {
  const r = parsePlanFromText('组数 4 组间休息 60 秒\n深蹲 30 秒', dict);
  assert.equal(r.sets, 4);
  assert.equal(r.restBetweenSets, 60);
});

// ─── Case 6: 未识别动作 ───
test('case 6: abc xyz 30 秒 → actions=[], unknownTokens 包含 abc xyz', () => {
  const r = parsePlanFromText('abc xyz 30 秒', dict);
  assert.equal(r.actions.length, 0, '应当识别 0 个动作');
  assert.ok(r.unknownTokens.length > 0, 'unknownTokens 应当非空');
});

// ─── Case 7: 别名识别 — 中文别名 → 英文标准名 ───
test('case 7: 原地开合步 1 组 每组 60 秒 → 通过别名识别为 jumping jacks', () => {
  const r = parsePlanFromText('原地开合步 1 组 每组 60 秒', dict, aliases);
  assert.equal(r.actions.length, 1);
  assert.equal(r.actions[0].exerciseId, '0010', '应当映射到 jumping jacks');
});

test('case 8: 平板支撑 30 秒 → 通过别名识别为 plank', () => {
  const r = parsePlanFromText('平板支撑 30 秒', dict, aliases);
  assert.equal(r.actions.length, 1);
  assert.equal(r.actions[0].exerciseId, '0016', '应当映射到 plank');
});

test('case 9: 完整热身输入 → 6 个动作全部识别', () => {
  const text = `计划名 胸部推日热身
组数 1
原地开合步 1 组 每组 60 秒
肩部绕环 1 组 每组 20 圈
扩胸运动 1 组 每组 20 个
俯身肩胛撑 1 组 每组 12 个
跪姿俯卧撑 1 组 每组 8 个
平板支撑 1 组 每组 30 秒`;
  const r = parsePlanFromText(text, dict, aliases);
  assert.equal(r.actions.length, 6, '应当识别 6 个动作');
  assert.equal(r.planName, '胸部推日热身');
});
