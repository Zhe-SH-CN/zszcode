# 12 — REPL 状态栏 Web URL 显示 TDD 任务计划

模块：12-repl-statusbar
依赖模块：无（独立模块）

---

## 任务 136：REPL Props 类型添加 webUrl 可选字段

**所属模块**：12-repl-statusbar
**依赖**：无
**预估耗时**：8 分钟

### 功能点要求
在 `src/screens/REPL.tsx` 的 `Props` 类型定义中添加 `webUrl?: string` 可选字段。该字段用于接收 Web 服务器的 URL，在状态栏中显示。

### 测试用例（必须先写，确认 RED）
1. test_repl_props_has_web_url — 验证 Props 类型包含 webUrl 字段
2. test_repl_props_web_url_optional — 验证 webUrl 为可选字段（不传不报错）
3. test_repl_props_web_url_string — 验证 webUrl 类型为 string
4. test_repl_props_web_url_undefined_valid — 验证 webUrl 为 undefined 时组件正常渲染
5. test_repl_props_web_url_with_value — 验证 webUrl 有值时组件正常渲染

### TDD 流程
1. 写上述全部测试 → `bun test repl-props` 确认 **RED**
2. 在 Props 类型中添加 `webUrl?: string` → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test repl-props`，确认 5 个测试全部绿色。

---

## 任务 137：WebUrlBanner 组件渲染 dim "Web UI:" 前缀

**所属模块**：12-repl-statusbar
**依赖**：任务 136
**预估耗时**：8 分钟

### 功能点要求
在 `REPL.tsx` 内部定义 `WebUrlBanner` 函数组件，接收 `{ url: string }` props。使用 Ink 的 `<Text dimColor>` 渲染 "Web UI: " 前缀文本。

### 测试用例（必须先写，确认 RED）
1. test_web_url_banner_renders_prefix — 验证组件渲染 "Web UI:" 文本
2. test_web_url_banner_prefix_dim — 验证前缀使用 dimColor 样式
3. test_web_url_banner_has_space_after_colon — 验证 "Web UI: " 冒号后有空格
4. test_web_url_banner_prefix_text_content — 验证文本内容精确为 "Web UI: "
5. test_web_url_banner_renders_without_error — 验证组件渲染不抛异常

### TDD 流程
1. 写上述全部测试 → `bun test web-url-banner-prefix` 确认 **RED**
2. 实现 WebUrlBanner 组件的前缀部分 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test web-url-banner-prefix`，确认 5 个测试全部绿色。

---

## 任务 138：WebUrlBanner 组件渲染 cyan 颜色 URL

**所属模块**：12-repl-statusbar
**依赖**：任务 137
**预估耗时**：8 分钟

### 功能点要求
`WebUrlBanner` 组件使用 `<Text color="cyan">` 渲染 URL 文本。URL 来自 props.url，紧跟在 "Web UI: " 前缀之后。

### 测试用例（必须先写，确认 RED）
1. test_web_url_banner_renders_url — 验证组件渲染 URL 文本
2. test_web_url_banner_url_cyan — 验证 URL 使用 cyan 颜色
3. test_web_url_banner_url_matches_prop — 验证渲染的 URL 与 props.url 一致
4. test_web_url_banner_url_after_prefix — 验证 URL 在 "Web UI: " 之后
5. test_web_url_banner_with_token_in_url — 验证 URL 含 token 参数时正常渲染

### TDD 流程
1. 写上述全部测试 → `bun test web-url-banner-url` 确认 **RED**
2. 实现 WebUrlBanner 组件的 URL 部分 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test web-url-banner-url`，确认 5 个测试全部绿色。

---

## 任务 139：webUrl 为 undefined 时不显示 banner

**所属模块**：12-repl-statusbar
**依赖**：任务 136
**预估耗时**：8 分钟

### 功能点要求
当 REPL 组件的 `webUrl` prop 为 `undefined` 时，不渲染 `WebUrlBanner` 组件。使用条件渲染 `{webUrl && <WebUrlBanner url={webUrl} />}` 实现。

### 测试用例（必须先写，确认 RED）
1. test_no_banner_when_web_url_undefined — 验证 webUrl 为 undefined 时无 banner
2. test_no_banner_when_web_url_empty — 验证 webUrl 为空字符串时无 banner（或有 banner 取决于设计）
3. test_banner_visible_when_web_url_set — 验证 webUrl 有值时 banner 可见
4. test_banner_toggle_on_web_url_change — 验证 webUrl 从 undefined 变为有值时 banner 出现
5. test_no_banner_text_in_output — 验证无 webUrl 时输出中不含 "Web UI:" 文本

### TDD 流程
1. 写上述全部测试 → `bun test web-url-banner-conditional` 确认 **RED**
2. 在 bottom slot 中添加条件渲染 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test web-url-banner-conditional`，确认 5 个测试全部绿色。

---

## 任务 140：URL 包含 token 查询参数

**所属模块**：12-repl-statusbar
**依赖**：任务 138
**预估耗时**：8 分钟

### 功能点要求
传给 `WebUrlBanner` 的 URL 必须包含 `?token=xxx` 查询参数，确保用户在浏览器打开时能通过认证。URL 格式为 `http://localhost:{port}?token={token}`。

### 测试用例（必须先写，确认 RED）
1. test_url_contains_token_param — 验证 URL 包含 ?token= 查询参数
2. test_url_token_format — 验证 token 参数格式为 ?token={48字符}
3. test_url_starts_with_http — 验证 URL 以 http:// 开头
4. test_url_contains_port — 验证 URL 包含端口号
5. test_url_no_double_question_mark — 验证 URL 不含多个 ?

### TDD 流程
1. 写上述全部测试 → `bun test web-url-token` 确认 **RED**
2. 确保 startWebServer 返回的 url 包含 token → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test web-url-token`，确认 5 个测试全部绿色。

---

## 任务 141：bottom slot 中 banner 在 permissionStickyFooter 之上

**所属模块**：12-repl-statusbar
**依赖**：任务 137
**预估耗时**：8 分钟

### 功能点要求
在 REPL 的 bottom slot 中，`WebUrlBanner` 必须在 `permissionStickyFooter` 之上（即先渲染 banner，再渲染 permission footer）。使用 `<Box flexDirection="column">` 包裹，banner 在前。

### 测试用例（必须先写，确认 RED）
1. test_banner_above_permission_footer — 验证 banner 在 permissionStickyFooter 之前渲染
2. test_bottom_slot_column_layout — 验证 bottom slot 使用 column 布局
3. test_banner_first_child — 验证 banner 是 bottom slot 的第一个子元素
4. test_permission_footer_after_banner — 验证 permissionStickyFooter 在 banner 之后
5. test_both_visible_when_url_set — 验证 webUrl 有值时 banner 和 footer 都可见

### TDD 流程
1. 写上述全部测试 → `bun test banner-position` 确认 **RED**
2. 调整 bottom slot 的 JSX 顺序 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test banner-position`，确认 5 个测试全部绿色。

---

## 任务 142：main.tsx 启动 Web 服务器并获取 url

**所属模块**：12-repl-statusbar
**依赖**：无
**预估耗时**：10 分钟

### 功能点要求
在 `src/main.tsx` 中，CLI 启动时调用 `startWebServer()` 启动 Web 服务器，并获取返回的 `url` 字符串。需要导入 `startWebServer` 和 `loadConfig`。

### 测试用例（必须先写，确认 RED）
1. test_main_starts_web_server — 验证 main.tsx 调用 startWebServer
2. test_main_loads_config — 验证 main.tsx 调用 loadConfig 获取配置
3. test_main_gets_web_url — 验证 main.tsx 获取 startWebServer 返回的 url
4. test_main_passes_config_to_server — 验证 startWebServer 接收正确的配置对象
5. test_main_server_start_before_repl — 验证 Web 服务器在 REPL 启动之前启动

### TDD 流程
1. 写上述全部测试 → `bun test main-web-server` 确认 **RED**
2. 在 main.tsx 中添加 startWebServer 调用 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test main-web-server`，确认 5 个测试全部绿色。

---

## 任务 143：main.tsx 将 webUrl 传递给 launchRepl()

**所属模块**：12-repl-statusbar
**依赖**：任务 142
**预估耗时**：8 分钟

### 功能点要求
`main.tsx` 将 `startWebServer()` 返回的 `url` 作为参数传递给 `launchRepl()` 函数。需要修改 `launchRepl()` 的函数签名以接受 `webUrl` 参数。

### 测试用例（必须先写，确认 RED）
1. test_main_passes_url_to_launch_repl — 验证 webUrl 被传递给 launchRepl
2. test_launch_repl_accepts_web_url — 验证 launchRepl 函数签名包含 webUrl 参数
3. test_launch_repl_web_url_optional — 验证 webUrl 为可选参数
4. test_launch_repl_web_url_type — 验证 webUrl 参数类型为 string | undefined
5. test_main_url_from_server_handle — 验证传递的 url 来自 WebServerHandle.url

### TDD 流程
1. 写上述全部测试 → `bun test main-pass-url` 确认 **RED**
2. 修改 launchRepl 签名并在 main.tsx 中传递 url → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test main-pass-url`，确认 5 个测试全部绿色。

---

## 任务 144：launchRepl 将 webUrl 传给 REPL 组件

**所属模块**：12-repl-statusbar
**依赖**：任务 143
**预估耗时**：8 分钟

### 功能点要求
`launchRepl()` 函数将接收到的 `webUrl` 作为 prop 传递给 `<REPL />` 组件。确保从 main.tsx 到 REPL 组件的完整传递链路通畅。

### 测试用例（必须先写，确认 RED）
1. test_launch_repl_passes_web_url_to_repl — 验证 webUrl 被传给 REPL 组件
2. test_repl_receives_web_url_prop — 验证 REPL 组件接收到 webUrl prop
3. test_full_chain_main_to_repl — 验证从 main.tsx 到 REPL 的完整传递链
4. test_web_url_undefined_chain — 验证 webUrl 为 undefined 时链路正常
5. test_web_url_value_preserved — 验证 URL 值在传递过程中不变

### TDD 流程
1. 写上述全部测试 → `bun test launch-repl-web-url` 确认 **RED**
2. 在 launchRepl 中将 webUrl 传给 REPL props → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
运行 `bun test launch-repl-web-url`，确认 5 个测试全部绿色。端到端验证：启动 CLI 后底部显示 "Web UI: http://localhost:3000?token=xxx"。
