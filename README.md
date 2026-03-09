# leonardozi.fun

个人作品与笔记展示站点，基于 Vite + React + TypeScript + TailwindCSS 构建，页面以“左侧侧栏 + 作品网格 + 作品弹窗”为主结构，适配移动端。

**设计特色**
1. 双端结构差异
   - 桌面端：左侧固定侧栏 + 右侧两列作品网格。
   - 移动端：顶部栏 + 全屏侧栏覆盖层，作品区单列。
2. 轻量动效
   - 页面整体淡入（`intro-fade-in`）。
   - 站点标题一次性的彩色扫光动画（`site-title-sweep`）。
   - 作品弹窗打开/关闭过渡（透明度 + 位移/缩放）。
3. 视觉语言
   - 大量留白、低饱和灰色辅助文字。
   - 统一圆角变量（`--radius-superellipse`）保证一致性。
4. 交互细节
   - 作品卡片使用 `IntersectionObserver` 懒加载并提供骨架屏。
   - 弹窗内容滚动时顶部栏渐隐。
   - 全站隐藏滚动条但保留滚动能力。

**文件结构与说明**

```
.
├─ dist/                     # 构建产物（`npm run build` 生成）
├─ node_modules/             # 依赖目录（`npm install` 后生成）
├─ public/                   # 静态资源目录（原样拷贝到产物）
│  └─ works/                 # 作品图片与站点图标
│     ├─ 1.WEBP
│     ├─ 2.webp
│     ├─ 3.webp
│     ├─ 4.webp
│     ├─ 5.webp
│     └─ favicon.png
├─ src/                      # 源码目录
│  ├─ components/
│  │  ├─ WorkCard.tsx         # 作品卡片组件，包含懒加载与骨架屏
│  │  └─ WorkModal.tsx        # 作品详情弹窗，支持动效与滚动渐隐头部
│  ├─ data/
│  │  └─ works.ts             # 作品数据与类型定义，组装图片与多图预览
│  ├─ App.tsx                 # 页面主结构：侧栏、作品网格、弹窗逻辑
│  ├─ index.css               # 全局样式与动效、通用类
│  ├─ main.tsx                # React 入口，挂载 App
│  └─ vite-env.d.ts           # Vite 的 TS 类型声明
├─ eslint.config.js           # ESLint 配置
├─ index.html                 # HTML 模板，挂载 #root
├─ package.json               # 项目元信息与脚本
├─ package-lock.json          # 依赖锁文件
├─ tsconfig.json              # TS 编译配置（应用代码）
├─ tsconfig.node.json         # TS 编译配置（Vite 配置文件）
├─ tsconfig.tsbuildinfo       # TS 编译缓存（可自动生成）
└─ vite.config.ts             # Vite 配置：React、Tailwind、单文件构建
```

**各文件详细说明**

- `src/App.tsx`
  - 负责整体布局和交互：
  - 桌面端左侧侧栏 + 右侧作品网格。
  - 移动端顶部栏与全屏侧栏。
  - 作品点击打开 `WorkModal`，并计算弹窗动画原点。
- `src/components/WorkCard.tsx`
  - 单个作品卡片。
  - 使用 `IntersectionObserver` 进行懒加载。
  - 首张卡片避免懒加载导致不可点。
- `src/components/WorkModal.tsx`
  - 作品详情弹窗。
  - 支持 ESC 关闭、背景点击关闭。
  - 内容滚动时顶部栏渐隐。
- `src/data/works.ts`
  - 定义 `Work` 类型。
  - 维护作品列表与图片轮询逻辑。
- `src/index.css`
  - 全局样式与动画：淡入、标题扫光、骨架屏、弹窗样式等。
- `src/main.tsx`
  - React 入口，创建根节点并渲染 `App`。
- `src/vite-env.d.ts`
  - Vite 提供的 TypeScript 类型引用。
- `public/works/*`
  - 作品缩略图、弹窗图与站点图标。
- `index.html`
  - 页面模板与根节点 `#root`。
- `vite.config.ts`
  - Vite 配置，启用 React、Tailwind 与单文件构建插件。
- `eslint.config.js`
  - ESLint 配置（含 React Hooks 规则）。
- `tsconfig.json` / `tsconfig.node.json`
  - TypeScript 配置。
- `package.json` / `package-lock.json`
  - 依赖与脚本定义。
- `dist/`
  - 构建输出目录。
- `tsconfig.tsbuildinfo`
  - TypeScript 增量编译缓存。

**Vite 常用终端命令**

1. `npm install`
   - 安装依赖（首次运行必需）。
2. `npm run dev`
   - 启动本地开发服务器（热更新）。
3. `npm run build`
   - 生产构建（输出到 `dist/`）。
4. `npm run preview`
   - 预览生产构建效果。
5. `npm run typecheck`
   - 仅进行 TypeScript 类型检查。
6. `npm run lint`
   - 运行 ESLint 进行代码规范检查。
