# 04 — Web 服务器 TDD 任务计划

**模块职责**：内嵌 HTTP/WebSocket 服务器，静态托管前端，广播事件，处理权限确认。

**新增文件**：
- `src/zszcode/server.ts`

---

## 任务 47：startWebServer() 返回 WebServerHandle 含 port/token/url/close

**所属模块**：04-web-server
**依赖**：无
**预估耗时**：10 分钟

### 功能点要求
在 `src/zszcode/server.ts` 中定义并导出 `WebServerHandle` 接口和 `startWebServer(config)` 函数。`WebServerHandle` 包含 4 个属性：`port: number`、`token: string`、`url: string`、`close: () => void`。`startWebServer()` 接受 `ZszCodeConfig` 参数，返回 `WebServerHandle` 对象。

### 测试用例（必须先写，确认 RED）
1. test_start_web_server_returns_handle — 验证返回值是对象
2. test_handle_has_port — 验证返回值包含 `port` 属性且为数字
3. test_handle_has_token — 验证返回值包含 `token` 属性且为字符串
4. test_handle_has_url — 验证返回值包含 `url` 属性且为字符串
5. test_handle_has_close — 验证返回值包含 `close` 属性且为函数

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 `startWebServer()` 基本结构 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/04-task-47.test.ts
```

---

## 任务 48：服务器在配置端口启动

**所属模块**：04-web-server
**依赖**：任务 47
**预估耗时**：10 分钟

### 功能点要求
`startWebServer()` 使用 `config.webPort` 作为起始端口启动 HTTP 服务器。服务器使用 `Bun.serve()` 实现。返回的 `WebServerHandle.port` 应等于配置的端口（假设端口可用）。

### 测试用例（必须先写，确认 RED）
1. test_server_starts_on_config_port — 配置端口 3000 时，返回的 `port` 为 3000
2. test_server_listens_on_port — 服务器在指定端口上接受连接
3. test_server_custom_port — 配置端口 4000 时，服务器在 4000 启动
4. test_server_returns_after_start — `startWebServer()` 在服务器就绪后返回
5. test_server_config_required — 传入有效 config 不抛出异常

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 `Bun.serve()` 调用 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/04-task-48.test.ts
```

---

## 任务 49：启动时生成 48 字符随机 token

**所属模块**：04-web-server
**依赖**：任务 47
**预估耗时**：8 分钟

### 功能点要求
服务器启动时使用 `crypto.randomBytes(24).toString('hex')` 生成 48 字符的随机 token。token 每次启动都不同。token 只包含十六进制字符（0-9, a-f）。

### 测试用例（必须先写，确认 RED）
1. test_token_length_48 — 验证 token 长度恰好为 48
2. test_token_hex_only — 验证 token 只包含 `[0-9a-f]` 字符
3. test_token_unique_per_start — 两次启动生成不同 token
4. test_token_type_string — `typeof token === 'string'`
5. test_token_no_special_chars — 验证不包含特殊字符

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 token 生成逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/04-task-49.test.ts
```

---

## 任务 50：无 token 的 HTTP 请求返回 401

**所属模块**：04-web-server
**依赖**：任务 48
**预估耗时**：8 分钟

### 功能点要求
所有 HTTP 请求必须携带有效 token。未携带 token 的请求返回 HTTP 401 状态码，响应体为 `'Unauthorized'`。

### 测试用例（必须先写，确认 RED）
1. test_no_token_returns_401 — 无 token GET `/` 返回 401
2. test_no_token_response_body — 响应体包含 `'Unauthorized'`
3. test_empty_token_returns_401 — `?token=` 空值返回 401
4. test_wrong_token_returns_401 — `?token=wrong` 返回 401
5. test_no_auth_header_returns_401 — 无 Authorization header 返回 401

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现认证中间件 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/04-task-50.test.ts
```

---

## 任务 51：有效 token 的 HTTP 请求返回 200

**所属模块**：04-web-server
**依赖**：任务 48, 49
**预估耗时**：8 分钟

### 功能点要求
携带有效 token 的 HTTP 请求通过认证，返回 HTTP 200 状态码。token 可通过 URL query 参数或 Authorization header 传递。

### 测试用例（必须先写，确认 RED）
1. test_valid_token_returns_200 — `?token=<valid>` GET `/api/events` 返回 200
2. test_valid_token_bearer_returns_200 — `Authorization: Bearer <valid>` 返回 200
3. test_valid_token_response_json — `/api/events` 返回 JSON 数组
4. test_valid_token_access_root — `?token=<valid>` GET `/` 返回 200
5. test_valid_token_no_error_body — 响应体不含错误信息

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 token 验证逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/04-task-51.test.ts
```

---

## 任务 52：URL query 参数 ?token=xxx 认证方式

**所属模块**：04-web-server
**依赖**：任务 50, 51
**预估耗时**：5 分钟

### 功能点要求
支持通过 URL query 参数 `?token=xxx` 传递认证 token。从 `URL.searchParams.get('token')` 提取 token 值进行验证。

### 测试用例（必须先写，确认 RED）
1. test_query_token_auth — `?token=<valid>` 请求成功
2. test_query_token_position_anywhere — token 在 URL 其他参数之后也能识别
3. test_query_token_case_sensitive — token 大小写敏感
4. test_query_token_url_encoded — URL 编码的 token 正确解码
5. test_query_token_missing_param — 无 `token` 参数时返回 401

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认 query 参数解析正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/04-task-52.test.ts
```

---

## 任务 53：Authorization: Bearer xxx 认证方式

**所属模块**：04-web-server
**依赖**：任务 50, 51
**预估耗时**：5 分钟

### 功能点要求
支持通过 `Authorization: Bearer xxx` header 传递认证 token。从 `req.headers.get('Authorization')` 提取 token，去掉 `'Bearer '` 前缀后验证。

### 测试用例（必须先写，确认 RED）
1. test_bearer_auth_success — `Authorization: Bearer <valid>` 请求成功
2. test_bearer_auth_case_sensitive_prefix — `bearer`（小写）也应支持
3. test_bearer_auth_no_space — `Bearer<valid>`（无空格）应失败返回 401
4. test_bearer_auth_empty_value — `Authorization: Bearer ` 应返回 401
5. test_bearer_auth_other_scheme — `Authorization: Basic xxx` 应返回 401

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认 Bearer 解析逻辑正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/04-task-53.test.ts
```

---

## 任务 54：GET / 返回 index.html（含 DOCTYPE）

**所属模块**：04-web-server
**依赖**：任务 51
**预估耗时**：8 分钟

### 功能点要求
有效 token 访问 `GET /` 时，服务器返回 `web/dist/index.html` 文件内容。响应 Content-Type 为 `text/html`。HTML 内容包含 `<!DOCTYPE html>` 声明。

### 测试用例（必须先写，确认 RED）
1. test_root_returns_html — GET `/` 返回 HTML 内容
2. test_root_content_type_html — Content-Type 为 `text/html`
3. test_root_has_doctype — 响应体包含 `<!DOCTYPE html>`
4. test_root_has_root_div — 响应体包含 `<div id="root">`
5. test_root_status_200 — 状态码为 200

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现静态文件路由 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/04-task-54.test.ts
```

---

## 任务 55：GET /* 返回 web/dist/ 下的静态文件

**所属模块**：04-web-server
**依赖**：任务 51
**预估耗时**：10 分钟

### 功能点要求
有效 token 访问任意路径时，服务器尝试从 `web/dist/` 目录读取对应文件并返回。支持常见 MIME 类型（`.js` → `application/javascript`、`.css` → `text/css`、`.svg` → `image/svg+xml`）。文件不存在时返回 404。

### 测试用例（必须先写，确认 RED）
1. test_static_js_file — 访问存在的 `.js` 文件返回 200
2. test_static_css_file — 访问存在的 `.css` 文件返回 200
3. test_static_not_found — 访问不存在的文件返回 404
4. test_static_content_type_js — `.js` 文件的 Content-Type 正确
5. test_static_no_directory_traversal — `../../../etc/passwd` 路径被拒绝

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现静态文件服务逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/04-task-55.test.ts
```

---

## 任务 56：GET /api/events 返回最近 100 条事件 JSON 数组

**所属模块**：04-web-server
**依赖**：任务 51
**预估耗时**：10 分钟

### 功能点要求
`GET /api/events` 返回 `eventBus.getHistory(100)` 的 JSON 序列化结果。响应 Content-Type 为 `application/json`。返回值是 JSON 数组格式。

### 测试用例（必须先写，确认 RED）
1. test_api_events_returns_json — 响应 Content-Type 为 `application/json`
2. test_api_events_returns_array — 响应体解析为数组
3. test_api_events_max_100 — 返回数组长度不超过 100
4. test_api_events_empty_initially — 无事件时返回空数组 `[]`
5. test_api_events_status_200 — 状态码为 200

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 `/api/events` 路由 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/04-task-56.test.ts
```

---

## 任务 57：POST /api/permission/resolve 处理权限确认

**所属模块**：04-web-server
**依赖**：任务 51
**预估耗时**：10 分钟

### 功能点要求
`POST /api/permission/resolve` 接受 JSON body `{ toolUseId: string, decision: 'allow' | 'deny' | 'allow_always' }`。查找 `pendingPermissions` Map 中对应的待处理请求，清除超时 timer，调用 `resolve(decision)`。返回 `{ ok: true }`。

### 测试用例（必须先写，确认 RED）
1. test_permission_resolve_returns_ok — POST 有效 body 返回 `{ ok: true }`
2. test_permission_resolve_status_200 — 状态码为 200
3. test_permission_resolve_unknown_id — 未知 `toolUseId` 不报错，仍返回 ok
4. test_permission_resolve_method_get_rejected — GET 请求返回 405 或 404
5. test_permission_resolve_content_type — 响应 Content-Type 为 JSON

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现权限确认路由 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/04-task-57.test.ts
```

---

## 任务 58：端口被占用时自动递增到下一个可用端口

**所属模块**：04-web-server
**依赖**：任务 48
**预估耗时**：10 分钟

### 功能点要求
当配置的端口被占用时，`startWebServer()` 自动尝试下一个端口（port + 1, port + 2, ...），直到找到可用端口。返回的 `WebServerHandle.port` 反映实际使用的端口。

### 测试用例（必须先写，确认 RED）
1. test_port_auto_increment — 占用端口 3000 后启动，返回 3001
2. test_port_returns_actual — 返回的 port 是实际监听的端口
3. test_port_server_accessible — 在自动递增的端口上能接受连接
4. test_port_two_servers — 两个服务器使用不同端口
5. test_port_gap_skipping — 占用 3000 和 3001 后，返回 3002

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现端口递增重试逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/04-task-58.test.ts
```

---

## 任务 59：最多尝试 100 个端口后失败

**所属模块**：04-web-server
**依赖**：任务 58
**预估耗时**：10 分钟

### 功能点要求
端口递增重试最多尝试 100 个端口（从 `config.webPort` 到 `config.webPort + 99`）。如果 100 个端口都被占用，抛出明确错误（如 `Error: No available port found`）。

### 测试用例（必须先写，确认 RED）
1. test_port_max_100_attempts — 占用 100 个端口后抛出异常
2. test_port_error_message — 异常消息包含 `'port'` 关键字
3. test_port_error_type — 异常为 `Error` 实例
4. test_port_99_attempts_succeeds — 占用 99 个端口时第 100 个成功
5. test_port_range_boundary — 尝试范围是 `[webPort, webPort + 100)`

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现最大重试次数限制 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/04-task-59.test.ts
```

---

## 任务 60：WebSocket 连接成功（ws://host/ws?token=xxx）

**所属模块**：04-web-server
**依赖**：任务 48, 49
**预估耗时**：10 分钟

### 功能点要求
服务器在 `/ws` 路径支持 WebSocket 升级。客户端使用 `ws://host:port/ws?token=xxx` 连接。连接成功后，客户端收到服务器的欢迎消息或确认。

### 测试用例（必须先写，确认 RED）
1. test_ws_connect_success — 带 token 的 WebSocket 连接成功建立
2. test_ws_url_path — 连接路径为 `/ws`
3. test_ws_token_in_query — token 通过 query 参数传递
4. test_ws_open_event — 连接后触发 `open` 事件
5. test_ws_clients_set_updated — 连接后 `wsClients` Set 包含该连接

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 WebSocket 升级逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/04-task-60.test.ts
```

---

## 任务 61：WebSocket 连接无 token 被拒绝

**所属模块**：04-web-server
**依赖**：任务 60
**预估耗时**：8 分钟

### 功能点要求
WebSocket 连接时也必须携带有效 token。无 token 或 token 无效的 WebSocket 连接请求被拒绝（服务器拒绝升级或连接后立即关闭）。

### 测试用例（必须先写，确认 RED）
1. test_ws_no_token_rejected — 无 token 的 WebSocket 连接被拒绝
2. test_ws_wrong_token_rejected — 错误 token 的 WebSocket 连接被拒绝
3. test_ws_empty_token_rejected — 空 token 被拒绝
4. test_ws_rejected_status — 拒绝时返回适当的 HTTP 状态码
5. test_ws_valid_token_still_works — 拒绝无效 token 后有效 token 仍能连接

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 WebSocket token 验证 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/04-task-61.test.ts
```

---

## 任务 62：WebSocket 连接后接收到事件广播

**所属模块**：04-web-server
**依赖**：任务 60
**预估耗时**：10 分钟

### 功能点要求
WebSocket 连接建立后，当 `eventBus` 有新事件 emit 时，服务器通过 WebSocket 将事件 JSON 广播给所有已连接的客户端。事件以 `JSON.stringify(event)` 格式发送。

### 测试用例（必须先写，确认 RED）
1. test_ws_receives_event — 连接后 emit 事件，客户端收到消息
2. test_ws_event_is_json — 收到的消息是有效 JSON
3. test_ws_event_has_type — 解析后的 JSON 包含 `type` 字段
4. test_ws_multiple_clients — 多个客户端同时收到同一事件
5. test_ws_event_after_connect — 事件在连接建立后才能收到

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现事件广播逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/04-task-62.test.ts
```

---

## 任务 63：close() 方法停止服务器释放端口

**所属模块**：04-web-server
**依赖**：任务 47
**预估耗时**：8 分钟

### 功能点要求
`WebServerHandle.close()` 方法调用 `server.stop()` 停止 HTTP 服务器。停止后端口被释放，可以被新服务器使用。已连接的 WebSocket 客户端被断开。

### 测试用例（必须先写，确认 RED）
1. test_close_stops_server — 调用 `close()` 后端口不再接受连接
2. test_close_releases_port — 关闭后可以在同一端口启动新服务器
3. test_close_idempotent — 多次调用 `close()` 不报错
4. test_close_returns_void — `close()` 返回 `undefined`
5. test_close_after_start — 启动后立即关闭不报错

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 `close()` 方法 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/04-task-63.test.ts
```

---

## 任务 64：url 属性格式为 http://localhost:{port}?token={token}

**所属模块**：04-web-server
**依赖**：任务 47, 49
**预估耗时**：5 分钟

### 功能点要求
`WebServerHandle.url` 属性的格式为 `http://localhost:{port}?token={token}`。包含协议（`http`）、主机（`localhost`）、端口和 token query 参数。可直接在浏览器中打开。

### 测试用例（必须先写，确认 RED）
1. test_url_starts_with_http — URL 以 `http://` 开头
2. test_url_contains_localhost — URL 包含 `localhost`
3. test_url_contains_port — URL 包含返回的 port 值
4. test_url_contains_token — URL 包含 `?token=<token>`
5. test_url_is_valid — `new URL(handle.url)` 不抛异常

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 URL 构造逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/04-task-64.test.ts
```
