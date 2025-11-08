# Kanatara · 韩语学习原型站点

本项目是一个基于 **Next.js + TypeScript + Prisma(MySQL)** 的韩语学习平台原型，涵盖「梯度学习、真题练习、词汇学习、视频模块、社区任务、用户中心」六大模块，并提供「AI 学习助手」以验证多模式交互。所有后端能力通过 Next.js API routes 实现，方便后续接入真实数据库与 AI 服务。

## 1. 功能概览
- 全局导航 + 登录状态管理（React Context 维持 JWT + 用户信息，未登录访问模块页会跳转登录页）。
- 注册/登录接口：邮箱注册、bcrypt 加密存储、邀请码校验、JWT 签发。提供 `scripts/generateInvite.ts` 快速生成邀请码。
- 六大模块 + AI 助手：
  - `/ladder` 梯度课程播放、达人列表、问答输入框。
  - `/exam` TOPIK 选择题即时对答案，作文提交触发 `/api/exam/submitEssay` 返回模拟 AI 批改。
  - `/vocab` 单词卡片、标记掌握、复习计划 API、Canvas 手写练习。
  - `/video` 影视片段播放、录音按钮、调用 `/api/video/evaluate` 得到模拟语音评分。
  - `/tasks` 日常任务、完成按钮触发 `/api/tasks/complete` 更新积分，并展示排行榜。
  - `/user` 用户资料、积分、邀请码、学习进度面板和资料编辑表单。
  - `/assistant` AI 学习助手，提供查语法、查词、单词检测、场景对话、模拟对话者、自由问答六种模式。
- API 路由全部可运行，暂以静态/随机数据返回，并在代码中注明未来挂接真实逻辑/AI 的注释。

## 2. 主要技术栈
- **前端**：Next.js 14（Pages Router）+ React 18 + TypeScript + TailwindCSS。
- **状态管理**：自定义 `AuthContext` + `useAuthGuard`，管理登录态与路由守卫。
- **后端/API**：Next.js API Routes，集中在 `pages/api/*`。
- **数据库层**：Prisma（`prisma/schema.prisma` 定义 User/InviteCode/Task/Points 模型，支持 MySQL）。
- **安全**：bcryptjs 处理密码、jsonwebtoken 生成/验证 JWT；`.env.example` 提供 `DATABASE_URL`、`JWT_SECRET` 模板。

## 3. 快速开始
```
# 安装依赖
yarn install # 或 npm install / pnpm install

# 复制环境变量模板
cp .env.example .env.local
# 按需填写 DATABASE_URL / JWT_SECRET

# 生成 Prisma Client（接入真实 MySQL 时必需）
npm run prisma:generate
# 执行数据库迁移（已有 schema，可按需调整）
npm run prisma:migrate

# 运行开发服务器
npm run dev
# 构建 / 生产启动
npm run build && npm start
```

> 演示登录账号：`demo@kanatara.com / kanatara123`；默认邀请码：`KANATARA-2025`。若接入真实数据库，可使用 `npm run invite:generate [自定义CODE]` 生成邀请码写入 InviteCode 表。

## 4. 目录结构
```
├── components/           # NavBar、Layout 等 UI 组件
├── context/              # AuthContext（登录态 + 本地存储）
├── data/                 # 六大模块 & AI 助手所需示例数据与 Prompt
├── hooks/                # useAuthGuard 路由守卫
├── lib/prisma.ts         # Prisma Client，支持无 DB 时安全降级
├── pages/
│   ├── api/              # 所有后端接口（auth、invite、exam、vocab、video、tasks、assistant）
│   ├── assistant.tsx     # AI 学习助手页面
│   ├── ladder.tsx ...    # 六大模块页面 + 登录/注册页
│   └── _app.tsx          # 注入 AuthProvider + Layout
├── prisma/schema.prisma  # User / InviteCode / Task / Points 数据模型
├── scripts/generateInvite.ts # 可执行脚本，写库或打印邀请码
├── styles/globals.css    # Tailwind 基础样式
└── README.md             # 当前文件，记录全部实现细节
```

## 5. 页面与交互说明
- **登录/注册**：调用 `/api/auth/login`、`/api/auth/register`；注册需邮箱+密码+邀请码，登录成功会把 token+用户信息写入 localStorage，供其他页面守卫。
- **梯度学习**：`ladderCourses` 示例数据驱动课程列表；视频播放器可切换课程；问答框暂为静态输入。
- **真题练习**：选择题提交后展示正确答案及解析；作文 `textarea` 调用 `/api/exam/submitEssay`，返回伪造 AI 分数与建议。
- **词汇学习**：单词卡可点击“标记已掌握”触发 `/api/vocab/markLearned`；进入页面即向 `/api/vocab/reviewList` 请求复习计划；内置 Canvas 作为“手写练习”模拟。
- **视频模块**：录音按钮仅做前端状态演示；“发音评估”按钮调用 `/api/video/evaluate`，返回 80~95 随机得分。
- **社区任务**：点击任务按钮调用 `/api/tasks/complete`，返回积分奖励并更新 UI；右侧显示积分面板与静态排行榜数据。
- **用户中心**：展示登录用户信息、邀请码、积分；提供资料编辑表单（当前只在前端显示“已保存”）；下方三块卡片展示学习进度示例数据。
- **AI 学习助手**：左侧切换 6 种模式并输入提问/词表，右侧展示对话记录与安全守则。所有请求调用 `/api/assistant`，后端依据 `mode` 返回结构化示例答案，未来可替换为真实大模型响应。

## 6. AI 学习助手（System Prompt & API）
- **System Prompt**：`data/aiAssistant.ts` 中的 `aiSystemPrompt` 完整复刻了产品需求里的行为准则（通用规则 + 六种模式限制）。部署真实大模型时请将其作为 system 指令。
- **模式配置**：同文件导出 `assistantModes` 与 `AssistantMode`，供前端/后端共享，确保 UI、表单、API 一致。
- **API**：`POST /api/assistant` 统一入口，根据 `mode` 返回示例内容：
  - `grammar` → 功能说明 + 形式结构 + 场景 + 例句；
  - `word_lookup` → 词条、词性、例句与记忆场景；
  - `word_test` → 要求词表并生成编号题目，等待用户作答后反馈；
  - `scene_dialogue` → 2–6 轮韩中对话；
  - `simulated_partner` → 用韩语抛出问题，鼓励继续互动；
  - `free_qa` → 总结学习建议或开放回答；
- **前端页面**：`pages/assistant.tsx` 实现模式按钮、提示语、词表输入（word_test 专用）、对话列表，以及安全守则提示。
- **替换真实模型的方式**：在 `/api/assistant` 中调用实际 LLM 时，将 `aiSystemPrompt` 作为 system prompt，把 `mode`、`message`（以及 `words`）传入，生成的响应直接返回给前端即可。

## 7. API 列表
| Method | Path | 说明 |
|--------|------|------|
| POST | `/api/auth/register` | 校验邀请码 → bcrypt 加密密码 → 创建用户（无 DB 时返回模拟结果） |
| POST | `/api/auth/login` | 验证邮箱/密码，签发 JWT，返回用户信息（支持 demo 账号） |
| POST | `/api/invite/verify` | 校验邀请码是否有效；无 Prisma 时检查示例池 |
| POST | `/api/exam/submitEssay` | 返回模拟 AI 批改反馈与分数 |
| GET | `/api/vocab/reviewList` | 返回示例复习计划数据 |
| POST | `/api/vocab/markLearned` | 标记单词完成（目前仅返回操作结果） |
| POST | `/api/video/evaluate` | 生成 80~95 内随机语音评分 |
| POST | `/api/tasks/complete` | 根据任务编号返回积分奖励 |
| POST | `/api/assistant` | AI 学习助手统一入口，依据 `mode` 返回结构化回答 |

## 8. 数据与 Prisma
- `User`：邮箱、加密密码、InviteCode 关联、Points 一对一、Task 列表。
- `InviteCode`：`code` + `isActive` + 创建时间；注册成功后自动置为失效。
- `Task`：记录平台任务、奖励、完成状态，可关联到 User。
- `Points`：单独表维护积分总数与更新时间。
- `lib/prisma.ts` 在缺失 `DATABASE_URL` 时不会初始化 Prisma，从而允许 API 在“纯前端示例”状态下返回静态数据而不崩溃。

## 9. 邀请码脚本
```bash
# 自动生成随机邀请码（写入数据库或仅打印）
npm run invite:generate            # e.g. KANATARA-5F2C8A

# 自定义邀请码
yarn invite:generate VIP-TEST-001
```
脚本逻辑：若 `.env` 未配置 `DATABASE_URL`，脚本直接打印生成结果；否则通过 Prisma 新增 InviteCode 记录。

## 10. 下一步可拓展方向
1. 将 API 中的静态返回值替换为真实 Prisma 查询与业务逻辑，完善错误处理 & DTO 校验。
2. 接入真实 AI 服务（语音评测、作文批改、AI 助手），把 `TODO` 标记或示例函数替换为 SDK/HTTP 调用。
3. 接入 WebSocket/Edge Runtime，为梯度课程问答、社区任务提醒等提供实时能力。
4. 上线 PWA / 移动端体验，增强录音、手写识别等沉浸式交互。

> 本 README 已记录所有核心改动：模块、API、Prisma schema、脚本、AI 助手系统提示与使用方式，方便后续团队接力开发。
