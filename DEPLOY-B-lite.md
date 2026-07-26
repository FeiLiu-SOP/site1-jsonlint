# 站 #1 · B lite — Cloudflare Pages（先不买域名）

> 路径：`e:\web3\site1-jsonlint`  
> 词：`json lint` · 与 `crawl-tool` **分开**，单独 GitHub repo

## 线上地址

| 项 | URL |
|----|-----|
| **Pages** | https://site1-jsonlint.pages.dev |
| **GitHub** | https://github.com/FeiLiu-SOP/site1-jsonlint |

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

1. GitHub repo `FeiLiu-SOP/site1-jsonlint`（已推送）
2. Cloudflare → **Workers & Pages** → Connect Git
3. **Framework: None** · Build command 留空 · Output directory: `/`
4. Deploy → `https://site1-jsonlint.pages.dev`

## B lite 完成标准（7/24 上线 · 7/26 复核）

- [x] pages.dev 可访问
- [x] Validate / Format 可用
- [x] About / Privacy / Contact 可打开
- [ ] GSC 提交（与站 #2 一起做 · 见下）
- [ ] GA4（晚几天）
- [ ] contact.html 填真实邮箱（可选）

## GSC 提交（你本机做 · 各 10 min）

```
1. https://search.google.com/search-console → 添加资源
2. URL 前缀：https://site1-jsonlint.pages.dev
3. 验证：HTML 标签 或 HTML 文件上传
4. 请求索引：首页 URL
5. 站 #2：https://site2-csvtojson.pages.dev（见 site2 DEPLOY-B-lite.md）
```

## 与 crawl-tool / 站 #2 关系

| 文件夹 / 站 | 用途 |
|-------------|------|
| `e:\web3\crawl-tool` | DRIP、Upwork SOP、**站点清单.md** |
| `e:\web3\site1-jsonlint` | 站 #1 json lint |
| `e:\web3\site2-csvtojson` | 站 #2 csv to json |
