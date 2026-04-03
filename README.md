# leonardozi.fun

个人作品与音乐展示站点，基于 Vite + React + TypeScript + TailwindCSS 构建，页面以「左侧侧栏 + 作品网格 / 音乐列表 + 作品详情独立路由」为主结构，适配移动端。

**设计特色**
1. 双端结构
   - 桌面端：左侧固定侧栏 + 右侧主内容区（作品网格或音乐页）。
   - 移动端：顶部栏 + 全屏侧栏覆盖层，主内容区单列。
2. 轻量动效
   - 页面整体淡入（`intro-fade-in`）。
   - 站点标题一次性的彩色扫光动画（`site-title-sweep`）。
   - 路由切换与作品详情页的过渡动效（`framer-motion` 等）。
3. 视觉语言
   - 大量留白、低饱和灰色辅助文字。
   - 统一圆角变量（`--radius-superellipse`）保证一致性。
4. 交互细节
   - 作品卡片使用 `IntersectionObserver` 懒加载并提供骨架屏。
   - 全站隐藏滚动条但保留滚动能力；主滚动由 Lenis 平滑处理。

**源码结构（节选）**

- `src/App.tsx` — 路由：`/` 作品页、`/music` 音乐页、`/work/:workId` 作品详情（不经由弹窗）。
- `src/layouts/SiteLayout.tsx` — 侧栏与主布局。
- `src/features/works/` — 作品网格页与相关 hooks。
- `src/features/music/` — 音乐页与专辑卡片。
- `src/pages/WorkDetailPage.tsx` — 作品详情全文与媒体。
- `src/works/` — 作品数据模块（`index.ts` 聚合、`work-*.ts` 单条配置、`types.ts` 类型）。

**Vite 常用终端命令**

1. `npm install` — 安装依赖（首次运行必需）。
2. `npm run dev` — 启动本地开发服务器（热更新）。
3. `npm run build` — 生产构建（输出到 `dist/`）。
4. `npm run preview` — 预览生产构建效果。
5. `npm run typecheck` — 仅进行 TypeScript 类型检查。
6. `npm run lint` — 运行 ESLint 进行代码规范检查。
