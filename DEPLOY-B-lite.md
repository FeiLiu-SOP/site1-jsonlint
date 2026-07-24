# 站 #1 · B lite — Cloudflare Pages（先不买域名）

> 路径：`e:\web3\site1-jsonlint`  
> 词：`json lint` · 与 `crawl-tool` **分开**，单独 GitHub repo

## 文件结构

```
site1-jsonlint/
  index.html      ← 工具主页
  app.js          ← Validate / Format（浏览器 JSON.parse）
  style.css
  about.html
  privacy.html
  contact.html
  DEPLOY-B-lite.md
```

## 本地预览

```powershell
cd e:\web3\site1-jsonlint
python -m http.server 8080
```

打开 http://127.0.0.1:8080 ，粘贴 `{"a":1}` → 点 **Validate**。

## 部署 Cloudflare Pages

1. GitHub 新建 repo `site1-jsonlint`，推送本文件夹
2. Cloudflare → **Workers & Pages** → **Create** → **Pages** → Connect Git
3. **Framework: None** · Build command 留空 · Output directory: `/`
4. Deploy → 得到 `https://<项目名>.pages.dev`

## B lite 完成标准

- [ ] pages.dev 可访问
- [ ] Validate / Format 可用
- [ ] About / Privacy / Contact 可打开
- [ ] （晚几天）买 .com + GSC + GA4

## 与 crawl-tool 关系

| 文件夹 | 用途 |
|--------|------|
| `e:\web3\crawl-tool` | DRIP、雷达、工作台 |
| `e:\web3\site1-jsonlint` | 站 #1 静态站 → Pages |
