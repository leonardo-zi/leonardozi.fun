# leonardozi.fun

作品集静态站，参考 [Laura Sinisterra](https://laurasinisterra.com/) 风格。Vite + React + Tailwind + Framer Motion。

## 开发

```bash
npm install
npm run dev
```

## 构建与部署到对象存储

```bash
npm run build
```

产物在 `dist/` 目录。将 **整个 `dist/` 目录内容** 上传到对象存储的桶根目录（或配置的静态网站根路径）即可。

- **阿里云 OSS**：开启静态网站托管，默认索引页 `index.html`。
- **腾讯云 COS**：静态网站 → 索引文档设为 `index.html`。
- **AWS S3 / Cloudflare R2**：启用静态网站，索引文档 `index.html`。若用 SPA 且可能直接打开子路径，需配置错误文档也指向 `index.html`（本项目为单页锚点，一般不需要）。

本地预览构建结果：

```bash
npm run preview
```

## 修改内容

- **作品列表**：编辑 `src/data/projects.js`
- **个人信息与文案**：`src/components/Hero.jsx`、`About.jsx`、`Footer.jsx`
- **邮箱**：`Footer.jsx` 中的 `email` 变量
