# PUBG 战绩统计

PUBG 战绩统计是一个基于官方 PUBG API 的全栈玩家数据分析应用。它支持玩家搜索、公会信息、赛季数据、排位数据、生涯表现、比赛历史、比赛详情、Telemetry 遥测战报、武器熟练度、生存熟练度、全球排行榜、收藏夹、最近搜索，以及中英文双语界面。

## 功能特性

- 按平台和玩家名称搜索 PUBG 玩家
- 查看玩家公会标签，并可进入公会详情页
- 按游戏模式查看当前赛季和历史赛季数据
- 查看排位段位、RP、最高段位和排位表现
- 查看生涯数据，并通过雷达图展示综合表现
- 加载近期比赛记录，并深入查看完整比赛详情
- 查看队伍排名、阵容信息和可排序的参赛者表格
- 按需解析官方 Telemetry 事件流，生成击杀时间线、伤害排行和玩家高亮事件
- 查看武器熟练度和生存熟练度数据
- 按地区、赛季和模式浏览全球排行榜
- 使用 localStorage 保存收藏玩家和最近搜索
- 支持中文和英文界面切换
- 后端 API 代理支持缓存、限流、参数校验和遥测 URL 白名单

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 前端 | React 18、Vite、Tailwind CSS |
| 数据请求 | TanStack React Query、Axios |
| 图表 | Recharts |
| 路由 | React Router v6 |
| 后端 | Node.js、Express |
| 缓存 | node-cache |
| 数据来源 | 官方 PUBG API |
| 测试 | Node.js 内置测试运行器 |

## 项目结构

```text
pubg-stats/
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── middleware/
│   │   │   ├── cache.js
│   │   │   └── validate.js
│   │   ├── routes/
│   │   │   ├── clans.js
│   │   │   ├── leaderboards.js
│   │   │   ├── matches.js
│   │   │   ├── players.js
│   │   │   ├── seasons.js
│   │   │   └── status.js
│   │   └── services/
│   │       └── pubgApi.js
│   └── test/
│       └── validate.test.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── i18n/
│   │   ├── pages/
│   │   └── utils/
│   └── vite.config.js
├── start.bat
└── README.md
```

## 运行要求

- Node.js 18 或更高版本
- npm
- 从 [developer.pubg.com](https://developer.pubg.com) 申请的 PUBG API Key

## 环境变量

根据 `backend/.env.example` 创建 `backend/.env`：

```env
PUBG_API_KEY=your_pubg_api_key_here
PORT=3001
NODE_ENV=development
CACHE_TTL=300
```

可选配置：

```env
FRONTEND_URL=http://localhost:5173
```

## 快速开始

安装后端依赖：

```bash
cd backend
npm install
```

安装前端依赖：

```bash
cd frontend
npm install
```

启动后端服务：

```bash
cd backend
npm run dev
```

在另一个终端启动前端：

```bash
cd frontend
npm run dev
```

打开浏览器访问：

```text
http://localhost:5173
```

在 Windows 上也可以直接运行：

```bat
start.bat
```

## 常用脚本

后端：

```bash
npm run dev      # 使用 nodemon 启动 Express
npm start        # 使用 node 启动 Express
npm test         # 运行后端参数校验测试
```

前端：

```bash
npm run dev      # 启动 Vite 开发服务器
npm run build    # 构建生产版本
npm test         # 运行前端工具函数测试
npm run preview  # 预览生产构建结果
```

## API 概览

前端通过 `/api` 调用本地后端。后端会代理官方 PUBG API 请求，从而避免将 API Key 暴露给浏览器端。

| 本地接口 | 用途 |
| --- | --- |
| `GET /api/status` | 查看 PUBG API 状态 |
| `GET /api/:platform/players?name=` | 按名称搜索玩家 |
| `GET /api/:platform/players/:playerId` | 按 ID 获取玩家信息 |
| `GET /api/:platform/seasons` | 获取赛季列表 |
| `GET /api/:platform/players/:playerId/seasons/:seasonId` | 获取赛季数据 |
| `GET /api/:platform/players/:playerId/seasons/:seasonId/ranked` | 获取排位数据 |
| `GET /api/:platform/players/:playerId/lifetime` | 获取生涯数据 |
| `GET /api/:platform/clans/:clanId` | 获取公会详情 |
| `GET /api/:platform/matches/:matchId` | 获取比赛详情 |
| `GET /api/telemetry?url=` | 获取白名单内的遥测 JSON |
| `GET /api/:platform/players/:playerId/weapon_mastery` | 获取武器熟练度 |
| `GET /api/:platform/players/:playerId/survival_mastery` | 获取生存熟练度 |
| `GET /api/:platformRegion/leaderboards/:seasonId/:gameMode` | 获取排行榜 |

## 安全说明

- `PUBG_API_KEY` 只在后端使用，不应出现在前端代码中。
- 遥测代理请求仅允许访问官方 PUBG 遥测 CDN 域名。
- 后端会在代理请求到 PUBG 之前校验路由参数。
- `.gitignore` 已忽略 `.env`、依赖目录、构建产物、日志和崩溃转储文件。

## 性能说明

- React Query 会在客户端缓存请求结果。
- 后端使用内存缓存减少对 PUBG API 的重复调用。
- 生涯数据和赛季趋势等图表较重的视图采用懒加载，以减小首屏包体积。

## 测试

运行后端测试：

```bash
cd backend
npm test
```

运行前端测试并构建：

```bash
cd frontend
npm test
npm run build
```

## PUBG API 说明

- PUBG 比赛数据只会保留有限时间。
- 玩家比赛历史受官方 API 返回范围限制。
- PUBG API 存在速率限制。应用在收到 429 响应时会展示专门的限流提示。

## 许可证与声明

本项目是非官方 PUBG 战绩统计工具。PUBG 是 KRAFTON, Inc. 的注册商标。数据来自官方 PUBG API。
