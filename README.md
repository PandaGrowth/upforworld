## Panda Growth · X平台增长社群 官方网站

基于 Next.js 16 App Router + TypeScript + Tailwind CSS 构建的营销站点，展示 Panda Growth 社群的推文精选、写作方法论、增长案例、照片墙与加入指引。同时，项目集成 Supabase + Drizzle 的用户中心，可让创作者投稿内容、发起/参与加热任务并累计积分。

### 本地开发

```bash
npm install
npm run dev
```

访问 `http://localhost:3000` 查看页面。项目启用了严格的 TypeScript、ESLint（含 Prettier）、Tailwind JIT 与 Radix UI 组件。

### 质量指令

- `npm run lint` – 静态检查，禁止警告
- `npm run build` – 生产构建（会进行 TypeScript/OG 生成/MDX 编译）
- `npm run db:push` – 使用 Drizzle 将最新 schema 推送到 Supabase 数据库

### 目录结构速览

- `app/(marketing)/` – 首页、推文、写作、增长、照片墙、加入等营销页
- `app/(auth)/` – 登录 / 注册流程
- `app/(dashboard)/dashboard` – 用户中心（文章 / 推文 / 加热请求投稿页面、积分仪表盘）
- `app/boost` – 加热专区，供成员互助加热并获得积分
- `app/api/` – OG 图片与搜索接口（Edge 友好）
- `components/` – Navbar/Footer/CTA/KPI/TweetCard/CaseCard/PhotoMasonry/Testimonial 等通用组件
- `components/dashboard/` – 投稿与加热相关的表单组件
- `data/` – JSON 数据源（推文、文章、案例、照片、KPI、Testimonials、FAQ）
- `content/` – 写作文章与增长案例的 MDX 正文（含 TL;DR、SOP、Checklist）
- `db/schema.ts` – Drizzle schema，定义文章/推文/加热相关的表结构
- `lib/content.ts` – 营销页的数据访问层（可在未来替换为远程 API）
- `lib/db.ts` – Supabase Service-Role 客户端 + Drizzle ORM 封装
- `lib/mdx.ts` – MDX 编译管线（remarkGfm + rehypeSlug + 自定义组件）

### 内容更新指南

- **推文/指标等列表**：直接编辑 `data/*.json`，字段定义见 `types/content.ts`
- **写作文章**：更新 `data/articles.json` 元信息 + `content/writing/{slug}.mdx`
- **增长案例**：更新 `data/cases.json` + `content/growth/{slug}.mdx`
- **照片墙**：更新 `data/photos.json` 与 `public/images/photos/*`

营销数据仍使用本地文件，Supabase 仅负责用户投稿与加热相关的动态内容。

### 用户中心 & Supabase 配置步骤

1. 在 Supabase 中创建项目，复制 `.env.example` 所需的变量：
   ```env
   SUPABASE_URL=...
   SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   SUPABASE_DB_URL=postgresql://...
   ```
2. 安装依赖后执行 `npm run db:push`，将 `db/schema.ts` 推送到 Supabase 数据库。
3. Supabase Auth 负责邮箱 + 密码登录。`profiles` 表自动维护昵称、头像与积分。
4. 登录用户可在 `/dashboard`：
   - 发表文章（保存至 `articles`）
   - 提交精选推文链接（保存至 `highlight_tweets`）
   - 发布加热请求（保存至 `boost_requests`）
   - 查看个人积分、历史投稿与加热状态
5. 所有 server action 位于 `app/(dashboard)/dashboard/actions.ts`，通过 Supabase 会话校验 + Drizzle 操作数据库。

### 加热积分机制

- 任意成员可在 `/boost` 浏览加热请求并点击“我已加热”。
- 每个请求对同一用户只计 1 次积分（由 `boost_supports` 表去重），成功加热后自动更新 `profiles.points`。
- 积分显示在导航栏与用户中心顶部，可作为贡献度统计依据。

### 交互与特性

- Radix UI：Dialog、HoverCard、Tabs、ScrollArea、Tooltip、Avatar 等
- 全站搜索：`/api/search` + `SearchDialog`（支持 ⌘K 快捷键、标签展示）
- 照片墙：流式 Masonry + Radix Dialog Lightbox（键盘 ←/→、下载）
- 深色模式：`next-themes` class strategy + ThemeToggle
- Analytics stub：`lib/analytics.ts`（当前使用 `console.log`，CTA / Filter 已埋点）
- SEO：`app/sitemap.ts`、`app/robots.txt/route.ts`、动态 OG `/api/og`

### 无头定制入口

- `components/mdx/mdx-components.tsx` – `<Callout/>`、`<Step/>`、`<Checklist/>`、`<Metric/>`
- `components/prose.tsx` + `app/globals.css` – 控制 MDX 的排版与自定义块样式
- `lib/content.ts` – 可在未来切换到远程 API 或 CMS
- `app/(dashboard)/dashboard/actions.ts` – 扩展投稿/积分逻辑的最佳入口

### 注意事项

- `next build` 时，Next.js 会提示父目录存在多个 lockfile（可忽略或自行清理 `/Users/wanghe/package-lock.json` 等文件）。
- OG 接口运行在 Edge Runtime；如需拓展，请保持返回 `ImageResponse`。
- 当前 Analytics 仅为占位，接入真实埋点时请替换 `lib/analytics.ts`。
- Server action 使用 Supabase Service Role Key，请妥善管理 `.env`，勿在客户端泄露。

### 部署建议

项目默认支持 Vercel 或任何兼容 Next.js 16 的环境。部署前请：

1. 在托管环境配置与本地一致的 Supabase 环境变量。
2. 确保 Supabase 数据库已执行 `npm run db:push` 以创建所需表结构。
3. 若使用 Vercel，建议在 Project Settings → Environment Variables 中配置所有密钥，并启用 Edge Runtime 的接口。
