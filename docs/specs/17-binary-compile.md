# 17 — 编译独立二进制

## 模块职责
将 zszcode 编译为独立可执行二进制文件，不依赖已安装的 Claude Code。

## 编译命令
```bash
bun build --compile src/entrypoints/cli.tsx --outfile zszcode
```

## 关键修改

### cli.tsx (line 40)
原代码使用 `MACRO.VERSION`，需要通过 shim 提供值。

### 二进制名称
- 编译产物：`zszcode`
- 不使用 `claude` 名称
- 不污染官方 Claude Code

## 前端打包
```bash
cd web && bun run build  # 输出到 web/dist/
```

二进制需要能访问 `web/dist/` 目录（静态文件托管）。

## 打包策略
| 选项 | 说明 |
|------|------|
| A. 二进制 + 外部 web/dist/ | 二进制较小，前端单独更新 |
| B. 嵌入 web/dist/ 到二进制 | 单文件分发，但较大 |

**推荐 A**，前端开发迭代更方便。

## 测试要求
1. `bun build --compile` 成功生成二进制
2. `./zszcode --version` 输出 `0.1.0`
3. `./zszcode` 启动 CLI + Web 服务器
4. 不依赖已安装的 `claude` 命令
5. `which claude` 仍指向官方
