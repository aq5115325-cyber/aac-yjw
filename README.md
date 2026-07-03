# 💪 健身跟练 | FitFollow

> 基于 1,324 个健身动作数据集的移动端跟练网站  
> 手机优先 · 语音播报 · 倒计时 · 进度追踪 · 自定义计划

---

## 📂 目录结构

```
project-014-fitness-website/
├── index.html                  # 入口 HTML（移动端优化 + PWA）
├── vite.config.ts              # Vite 配置 + Tailwind CSS v4 + PWA
├── tsconfig.app.json           # TypeScript 配置（strict）
├── package.json
├── README.md                   # 本文件
├── public/
│   └── pwa-icon.svg            # PWA 图标
└── src/
    ├── main.tsx                # 应用入口（含 ErrorBoundary）
    ├── App.tsx                 # 路由配置（lazy loading）
    ├── index.css               # Tailwind 导入 + 全局样式
    ├── config/
    │   ├── constants.ts        # 配置常量
    │   └── config.ts           # API 密钥（已 gitignore）
    ├── types/
    │   └── index.ts            # 类型定义
    ├── data/
    │   ├── exercises-full.json # 完整 1,324 条动作数据集（9.26MB）
    │   ├── exercises.ts        # 数据集工具函数 + 中文名映射
    │   └── plans.ts            # 12 套预设计划
    ├── hooks/
    │   ├── useTimer.ts         # 倒计时 hook（Date.now 绝对时间）
    │   ├── useWorkoutSession.ts# 训练状态机（4 阶段转换）
    │   └── useSpeech.ts        # Web Speech API 语音播报
    ├── lib/
    │   ├── utils.ts            # 工具函数
    │   ├── storage.ts          # localStorage 存储 + 导入导出
    │   └── exerciseMedia.ts    # GIF URL 生成 + 降级处理
    ├── components/
    │   ├── ErrorBoundary.tsx   # 全局错误边界
    │   ├── Layout.tsx          # 底部导航
    │   ├── ProgressBar.tsx     # 进度条
    │   ├── WorkoutPlayer.tsx   # 跟练播放器
    │   ├── SortableExerciseItem.tsx  # 拖拽排序项
    │   ├── AppLoading.tsx      # 加载骨架屏
    │   └── tabs/
    │       ├── FreeWorkoutTab.tsx    # 自由跟练（搜索+分页+部位过滤）
    │       ├── PresetPlansTab.tsx    # 预设计划列表
    │       └── CustomPlansTab.tsx    # 自定义计划
    └── pages/
        ├── HomePage.tsx        # 首页
        ├── PlanDetailPage.tsx  # 计划详情/编辑
        ├── WorkoutPage.tsx     # 跟练页面
        ├── HistoryPage.tsx     # 训练历史
        ├── SettingsPage.tsx    # 设置
        └── NotFoundPage.tsx    # 404
```

---

## 🎯 功能

| 功能 | 状态 | 说明 |
|------|------|------|
| **自由跟练** | ✅ | 搜索动作，点击即开始跟练 |
| **12 套预设计划** | ✅ | 全身入门、胸肌、背部、腿部、肩部、手臂、核心、HIIT、晨间拉伸等 |
| **自定义计划** | ✅ | 从 1,324 个动作中挑选，拖拽排序，设置时长/组数 |
| **跟练播放器** | ✅ | 倒计时、动作指导、准备/训练/休息/组间休息四阶段 |
| **语音播报** | ✅ | Web Speech API TTS，中文播报动作名和指令 |
| **进度条** | ✅ | 底部训练进度缓慢推进 |
| **PWA 优化** | 🚧 | 手机端优先，深色主题 |
| **本地保存** | ✅ | 自定义计划和训练历史存 localStorage |

---

## 🛠 技术栈

| 工具 | 用途 |
|------|------|
| React 19 | UI 框架 |
| Vite 8 | 构建工具 |
| Tailwind CSS v4 | 样式 |
| DnD Kit | 拖拽排序 |
| React Router | 路由（lazy loading） |
| Lucide React | 图标 |
| Web Speech API | 原生语音播报（免费） |
| vite-plugin-pwa | PWA 离线支持 |
| Workbox | Service Worker 缓存 |

---

## 🚀 快速启动

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview
```

---

## 📊 数据统计

| 指标 | 数值 |
|------|------|
| 总动作数 | 1,324 |
| 语言 | 6（中/英/西/意/土/俄） |
| 预设计划 | 12 套 |
| 身体部位分类 | 10 类 |
| 器械类型 | 10+ 种 |
| 自重动作 | 325 个 |

---

## 🔗 数据来源

- 基础数据：[ExerciseDB v1](https://oss.exercisedb.dev) via [Kaggle](https://www.kaggle.com/datasets/omarxadel/fitness-exercises-dataset)
- 媒体（图片/GIF）：**不在本仓库中**，因版权争议未收录

---

## 🧠 设计决策

| 决策 | 选择 |
|------|------|
| 训练流程 | 自由练 + 计划练 + 用户自定义 |
| 计划来源 | 预置计划 + 用户自定义拖拽 |
| 素材来源 | 手动配图 + Web Speech API 语音 |
| 节奏规则 | 预设节奏 + 用户可微调 |
| 数据存储 | localStorage |
| 设备优先 | 手机端 |
| 部署 | Vercel |

---

## 📝 License

本项目的代码部分采用 MIT License。  
数据部分来源于 ExerciseDB v1，请遵守原始数据的使用条款。

---

*最后更新：2026-07*
