# Toonflow 自建镜像

上游：https://github.com/HBAI-Ltd/Toonflow-app (v2.0.10, MIT)。本仓库只放 CI 和 compose，不存源码。

## 镜像

- `ghcr.io/bobxyo/toonflow-app:2.0.10-r3` ← 用这个
- `:2.0.10-base` 上游 Dockerfile 原样构建；`:2.0.10-r3` = base + r2 补丁 + mobileLink 403 补丁
- 补丁 1：上游 `/app/build/tools/pluginDeveloper.tool.js` 是 `600 root`，bun 用户启动读取失败直接崩（EACCES），补齐 `a+rX`
- 补丁 2：局域网 `http://IP:18630` 不是 secure context，`crypto.randomUUID` 未定义 → 前端报 `启动失败 crypto.randomUUID is not a function`，注入 `web-polyfill.js` 到 `build/web/`
- 补丁 3：设置页"设备互联"永远 403。`assertMobileLinkControl` 要求 `req.socket.remoteAddress` 是 127.0.0.1 且 Host 是 localhost，Docker 端口映射后来源是网桥 IP、Host 是局域网 IP，两项恒假。`Dockerfile.patch` 用 sed 去掉这两项校验（Origin 同源 + `x-toonflow-mobile-link: 1` 请求头校验保留）
- 仅 `linux/amd64`

## 跑起来

```sh
sudo mkdir -p data && sudo chown -R 1000:1000 data   # 容器内 uid 1000
docker compose up -d
```

访问 `http://<主机IP>:18630`（宿主机 18630 → 容器 3000）

## 注意

- 单租户模式**无登录鉴权**：不要直接暴露公网，远程走反代 basic auth 或 Cloudflare Access
- 数据全在 `./data`（`settings.json`、`tools/`、`plugins/`、`workspaces/`），备份停容器拷目录即可
- mac arm64 上跑需 `--platform linux/amd64`（模拟，慢）
- 升级：改 `build.yml` 的 `ref:` 和 `Dockerfile.patch` 的 FROM，重新 dispatch，再改 compose tag
