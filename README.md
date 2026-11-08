# Toonflow 自建镜像

上游：https://github.com/HBAI-Ltd/Toonflow-app (v2.0.10, MIT)。本仓库只放 CI 和 compose，不存源码。

## 镜像

- `ghcr.io/bobxyo/toonflow-app:2.0.10-r1` ← 用这个
- `:2.0.10-base` 上游 Dockerfile 原样构建；`:2.0.10-r1` = base + 权限补丁层
- 补丁原因：上游镜像里 `/app/build/tools/pluginDeveloper.tool.js` 是 `600 root`，容器以 `bun` 用户启动读取失败直接崩溃（EACCES），启动日志 `[服务启动成功]` 前就退出
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
