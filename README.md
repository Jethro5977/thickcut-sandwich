# FaFa 厚切三明治

线上菜单：https://thickcut-sandwich.pages.dev

网站通过 Cloudflare Pages 静态托管发布，不再使用 GitHub 用户主页作为访问入口。GitHub Actions 用于验证构建。

## 开发与部署

- Node.js 22，使用 `npm ci` 安装锁定依赖。
- `npm run dev` 本地开发；`npm run build` 生成 `dist/client/index.html` 和静态资源。
- `.openai/hosting.json` 的 `static.directory` 指向 `dist/client`。
- Cloudflare Pages 生产地址为 `https://thickcut-sandwich.pages.dev`；`http://thickcut-sandwich.pages.dev/` 会自动跳转到该 HTTPS 正式地址。发布前先构建 `dist/client`，再通过 Wrangler 上传该目录。
- 更新域名时同时重新生成 `public/images/order-qr.png`。

## 到店自取与点餐二维码

- 可选自取时段为每天 09:00–21:00，每 30 分钟一档。
- 首页和“我们”页面的二维码均指向线上菜单；顾客扫码后即可浏览菜单、选择菜品并生成预约清单。
- `public/images/order-qr-poster.png` 为可供打印和分享的品牌二维码海报，扫码目标同样为正式线上菜单地址。
- `public/images/fafa-logo.jpg` 为品牌 Logo，已用于网站页首和首页主视觉。

## 预约边界

菜单、筛选、详情、购物车、金额和热量汇总均在浏览器运行。预约清单不上传服务器，也没有支付或商家接单后台；顾客必须截图发给微信商家并取得回复。刷新会重置本机清单。

## 原 404 原因

GitHub Pages 配置为从 main 分支根目录发布，而应用首页实际在构建输出 `dist/client`。源码根目录没有 `index.html`，导致原地址返回 404。现已改用独立 Cloudflare Pages 网址，并移除错误的 Pages 发布流程。
