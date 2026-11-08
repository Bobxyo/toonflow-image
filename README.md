# Toonflow 自建镜像

- 源码：https://github.com/HBAI-Ltd/Toonflow-app (v2.0.10, MIT)
- 镜像由 GitHub Actions 构建推送：`ghcr.io/bobxyo/toonflow-app:2.0.10`（linux/amd64）
- 运行端口：宿主机 **18630** → 容器 3000

## 跑起来

```sh
# 1. 镜像设为公开（只需一次）
#    GitHub → Packages → toonflow-app → Package settings → Change visibility → Public
# 2. 数据目录权限（容器内 bun 用户 uid=1000）
sudo chown -R 1000:1000 ./data
# 3. 启动
docker compose up -d
```

访问 http://<主机IP>:18630

## 注意

- 单租户模式**无登录鉴权**，不要直接暴露公网；要远程用，走反代加 basic auth 或 Cloudflare Access。
- 数据全在 `./data`（settings.json、插件、workspaces/），备份停容器后直接拷目录。
- 升级：改 workflow 里的 `ref:` 和 compose 里的 tag → 重新 dispatch → `docker compose pull && up -d`。
