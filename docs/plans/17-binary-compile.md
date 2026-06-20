# 17 — 编译独立二进制 TDD 任务计划

**模块职责**：将 zszcode 编译为独立可执行二进制文件，不依赖已安装的 Claude Code。

**关键命令**：
```bash
bun build --compile src/entrypoints/cli.tsx --outfile zszcode
cd web && bun run build  # 输出到 web/dist/
```

---

## 任务 203：bun build --compile 成功生成独立二进制

**所属模块**：17-binary-compile
**依赖**：任务 7
**预估耗时**：15 分钟

### 功能点要求
运行 `bun build --compile src/entrypoints/cli.tsx --outfile zszcode`，成功生成独立可执行二进制文件 `zszcode`。编译过程无错误退出（exit code 0）。生成的文件有可执行权限（`-rwxr-xr-x`）。文件大小合理（< 200MB）。二进制文件可在不安装 Node.js/Bun 的环境下运行（Bun compile 嵌入运行时）。

### 测试用例（必须先写，确认 RED）
1. test_compile_exits_zero — 验证编译命令退出码为 0
2. test_compile_output_exists — 验证 `zszcode` 二进制文件存在
3. test_compile_output_executable — 验证文件有可执行权限
4. test_compile_output_size — 验证文件大小 < 200MB
5. test_compile_no_node_required — 验证二进制不依赖系统 Node.js

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 运行编译命令 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/17-task-203.test.ts
```

---

## 任务 204：./zszcode --version 输出 0.1.0

**所属模块**：17-binary-compile
**依赖**：任务 203
**预估耗时**：8 分钟

### 功能点要求
运行编译后的二进制 `./zszcode --version`，输出 `zszcode 0.1.0`。输出格式与 `bun run src/entrypoints/cli.tsx --version` 一致。退出码为 0。stderr 为空。版本号来自 MACRO.VERSION，编译时被内联到二进制中。

### 测试用例（必须先写，确认 RED）
1. test_binary_version_exits_zero — 验证退出码为 0
2. test_binary_version_output_exact — 验证输出精确为 `zszcode 0.1.0\n`
3. test_binary_version_stderr_empty — 验证 stderr 为空
4. test_binary_version_contains_zszcode — 验证输出包含 `zszcode`
5. test_binary_version_contains_version — 验证输出包含 `0.1.0`

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 运行二进制验证 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/17-task-204.test.ts
```

---

## 任务 205：./zszcode 启动 CLI + Web 服务器

**所属模块**：17-binary-compile
**依赖**：任务 203
**预估耗时**：15 分钟

### 功能点要求
运行 `./zszcode`，同时启动 CLI 交互模式和嵌入式 Web 服务器。CLI 底部显示 `Web UI: http://localhost:3000?token=xxx`。Web 服务器监听端口（默认 3000），接受 HTTP 和 WebSocket 连接。进程在用户输入 `/exit` 或 Ctrl+C 时优雅退出。启动过程无报错，stderr 无异常输出。

### 测试用例（必须先写，确认 RED）
1. test_binary_starts_cli — 验证二进制启动进入 CLI 模式
2. test_binary_starts_web_server — 验证 Web 服务器监听端口
3. test_binary_shows_web_url — 验证 CLI 底部显示 Web URL
4. test_binary_web_url_has_token — 验证 URL 包含 token 参数
5. test_binary_graceful_exit — 验证 Ctrl+C 优雅退出

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 验证二进制启动行为 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/17-task-205.test.ts
```

---

## 任务 206：不依赖已安装的 claude 命令

**所属模块**：17-binary-compile
**依赖**：任务 203
**预估耗时**：10 分钟

### 功能点要求
编译后的 `zszcode` 二进制完全独立运行，不依赖系统中已安装的 `claude` 命令或 Claude Code 包。所有源码和依赖已内联到二进制中。在 PATH 中无 `claude` 的环境下，`./zszcode` 仍可正常启动和运行。二进制不读取 `~/.claude/` 目录下的 Claude Code 配置。

### 测试用例（必须先写，确认 RED）
1. test_binary_no_claude_dependency — 验证二进制不调用外部 claude 命令
2. test_binary_self_contained — 验证二进制内联所有依赖
3. test_binary_works_without_claude_in_path — 验证 PATH 无 claude 时正常运行
4. test_binary_no_claude_config_read — 验证不读取 ~/.claude/ 配置
5. test_binary_uses_own_config — 验证使用 ~/.zszcode/ 配置目录

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 验证独立性 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/17-task-206.test.ts
```

---

## 任务 207：which claude 仍指向官方

**所属模块**：17-binary-compile
**依赖**：任务 203
**预估耗时**：8 分钟

### 功能点要求
zszcode 编译安装后，系统中的 `claude` 命令仍指向官方 Claude Code（如果已安装）。zszcode 使用独立的二进制名称 `zszcode`，不注册为 `claude`。不会覆盖、替换或干扰官方 Claude Code 的安装。两个命令可以共存。

### 测试用例（必须先写，确认 RED）
1. test_claude_command_unchanged — 验证 `which claude` 仍指向官方
2. test_zszcode_independent_name — 验证二进制名称为 `zszcode`
3. test_no_claude_override — 验证不覆盖官方 claude 命令
4. test_both_coexist — 验证 zszcode 和 claude 可同时存在
5. test_zszcode_not_in_claude_path — 验证 zszcode 不在 claude 安装目录中

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 验证命令共存 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/17-task-207.test.ts
```

---

## 任务 208：前端 build:web 生成 web/dist/

**所属模块**：17-binary-compile
**依赖**：任务 145
**预估耗时**：12 分钟

### 功能点要求
在 `web/` 目录运行 `bun run build`（或 `npx vite build`），生成 `web/dist/` 目录。`dist/` 包含 `index.html`、CSS 文件、JS 文件（含 hash 后缀用于缓存）。`index.html` 引用正确的 CSS/JS 路径。构建输出大小合理（< 5MB）。构建过程无错误（exit code 0）。

### 测试用例（必须先写，确认 RED）
1. test_web_build_exits_zero — 验证构建命令退出码为 0
2. test_web_dist_exists — 验证 `web/dist/` 目录存在
3. test_web_dist_has_index_html — 验证 `web/dist/index.html` 存在
4. test_web_dist_has_assets — 验证 `web/dist/assets/` 包含 JS/CSS 文件
5. test_web_dist_index_references_assets — 验证 index.html 引用正确的资源路径

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 运行前端构建 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/17-task-208.test.ts
```
