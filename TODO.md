# PUBG Stats — 项目进度与待办

> 更新于：2026-04-15

---

## 已完成功能

### 基础架构
- [x] Vite + React + Tailwind CSS 项目搭建
- [x] Express 后端代理（避免 CORS，缓存 API 响应）
- [x] React Query 数据缓存（match 30min staleTime，season trend 10min）
- [x] React Router 页面路由
- [x] Vite dev proxy `/api` → `http://localhost:3001`

### 页面与功能
- [x] **首页**：英雄区 + 功能介绍 + 统计数字展示
- [x] **玩家搜索**：按名称 + 平台搜索，近期搜索历史（localStorage）
- [x] **玩家主页**（`/player/:platform/:name`）
  - [x] PlayerHeader：账号名、封禁状态展示、收藏按钮
  - [x] SeasonStats：赛季普通模式统计（tab 切换）
  - [x] RankedStats：排名赛段位 + 统计
  - [x] LifetimeStats：生涯统计 + 雷达图（recharts）
  - [x] MatchHistory：最近对局列表（React Query 并发加载）
  - [x] WeaponMastery：武器精通数据
  - [x] SurvivalMastery：生存大师数据
  - [x] SeasonTrend：赛季趋势折线/柱状图（最近 6 赛季）
- [x] **对局详情页**（`/match/:platform/:matchId`）：全队伍分组、所有玩家排序表
- [x] **排行榜页**（`/leaderboard`）：区域 / 模式 / 赛季筛选
- [x] **收藏功能**：localStorage 存储，首页快速入口
- [x] **404 页面**

### 国际化（i18n）
- [x] `src/i18n/translations.js`：中英双语字典（~80 个 key，含动态函数）
- [x] `src/contexts/LanguageContext.jsx`：React Context + `useLanguage()` hook
- [x] localStorage 持久化语言偏好（key: `gj_lang`，默认中文）
- [x] Navbar 添加 EN/中 切换按钮（桌面端 + 移动端）
- [x] 已国际化组件：Home、SearchBar、Player、PlayerHeader、MatchHistory、StatsGrid、SeasonStats、Leaderboard、Footer

---

## 待办 / 已知问题

### 高优先级

- [ ] **i18n 未覆盖的组件**（仍有硬编码中文字符串）
  - `RankedStats.jsx`：模式标签（"四排排名赛"等）、段位标签（"当前段位"/"赛季最高"）、统计卡片标签、空状态文案
  - `LifetimeStats.jsx`：雷达图轴标签（"场均击杀"等）、图表标题"综合能力雷达图"、空状态文案
  - `MatchDetail.jsx`：表头列（"名次/击杀/伤害"等）、SORT_FIELDS 标签、"（你）"高亮标记、"自定义"徽章
  - `SurvivalMastery.jsx`：各统计行标签（未确认，需检查）
  - `WeaponMastery.jsx`：各统计行标签（未确认，需检查）
  - `SeasonTrend.jsx`：METRICS 标签（"场均击杀"等，其中 KDA 可保持英文）

- [ ] **对局历史击杀/伤害显示为 0 的问题**
  - 后端已确认数据正常（测试玩家有 17 击杀 / 2015 伤害）
  - 前端 participant 查找逻辑已修复（优先 playerId，回退 name）
  - **需要用户在浏览器实际测试**，清除 React Query 缓存（30min staleTime）后验证

### 中优先级

- [ ] **打包体积警告**：Vite 提示 chunk > 500KB（recharts 引起），考虑懒加载图表组件
  ```
  dist/assets/index-xxx.js  542.85 kB
  ```
  解决方案：对 LifetimeStats / SeasonTrend 使用 `React.lazy` + `Suspense`

- [ ] **排行榜数据**：`data?.data?.included` 路径不一致（`Leaderboard.jsx:114` 使用 `data?.data?.included || players` 双重回退，逻辑冗余，需确认 API 返回结构后清理）

- [ ] **平台路由**：玩家链接在排行榜中硬编码为 `steam`（`Leaderboard.jsx:138`），xbox 玩家链接会出错

### 低优先级 / 优化建议

- [ ] **SEO / Meta 标签**：各页面缺少动态 `<title>` 和 description（可用 react-helmet-async）
- [ ] **错误边界**：缺少全局 React Error Boundary，某个组件崩溃会影响整页
- [ ] **移动端 Match Detail**：MatchDetail 表格在窄屏上需要横向滚动，体验一般
- [ ] **API 速率限制提示**：PUBG API 有严格限制，频繁请求会 429，目前只显示通用错误，可增加专门提示
- [ ] **SeasonTrend 赛季标签**：图表 X 轴显示完整 season ID（如 `division.bro.official.pc-2018-30`），应格式化为 `Season 30`

---

## 项目结构速览

```
pubg-stats/
├── backend/
│   └── src/
│       ├── routes/       # players, seasons, leaderboards, status
│       ├── services/     # pubgApi.js（PUBG API 封装）
│       └── middleware/   # cache.js（内存缓存）
└── frontend/
    └── src/
        ├── pages/        # Home, Player, Match, Leaderboard, NotFound
        ├── components/
        │   ├── common/   # StatCard, Badge, LoadingSpinner, ErrorMessage
        │   ├── layout/   # Navbar, Footer
        │   ├── player/   # PlayerHeader, SeasonStats, RankedStats, LifetimeStats,
        │   │             # MatchHistory, StatsGrid, SeasonTrend, SurvivalMastery
        │   ├── match/    # MatchDetail
        │   ├── weapon/   # WeaponMastery
        │   └── search/   # SearchBar
        ├── contexts/     # LanguageContext.jsx
        ├── i18n/         # translations.js（zh + en）
        ├── hooks/        # useLocalStorage.js（favorites, recent searches）
        └── utils/        # api.js, constants.js, formatters.js
```
