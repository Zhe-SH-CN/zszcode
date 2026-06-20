# 05 — API 适配器 TDD 任务计划

**模块职责**：修改 Anthropic 客户端创建，使用 zszcode 配置的 baseURL/apiKey/默认模型。

**修改文件**：
- `src/services/api/client.ts`（line 301-315 附近）
- `src/main.tsx`（line 280 附近）

---

## 任务 65：修改 client.ts 的 getAnthropicClient() 注入 zszcode apiKey

**所属模块**：05-api-adapter
**依赖**：无
**预估耗时**：10 分钟

### 功能点要求
修改 `src/services/api/client.ts` 中的 `getAnthropicClient()` 函数，在创建 Anthropic 客户端时注入 zszcode 配置的 `apiKey`。优先级：`zszConfig.apiKey` > 原有 `apiKey` 参数 > `getAnthropicApiKey()`。通过 `import { loadConfig } from '../../zszcode/config.js'` 获取配置。

### 测试用例（必须先写，确认 RED）
1. test_client_uses_zszcode_api_key — 验证 Anthropic 构造时使用 zszcode 配置的 apiKey
2. test_client_api_key_priority — 验证 zszcode apiKey 优先于环境变量
3. test_client_api_key_fallback — zszcode apiKey 为空时回退到原有逻辑
4. test_client_loads_config_once — `loadConfig()` 只被调用一次
5. test_client_imports_config — 验证文件包含正确的 import 语句

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 修改 `getAnthropicClient()` → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/05-task-65.test.ts
```

---

## 任务 66：修改 client.ts 的 getAnthropicClient() 注入 zszcode baseURL

**所属模块**：05-api-adapter
**依赖**：任务 65
**预估耗时**：10 分钟

### 功能点要求
在 `getAnthropicClient()` 中，当 zszcode 配置的 `baseUrl` 非空时，将 `baseURL` 设置为 `zszConfig.baseUrl`。使用条件展开 `...(zszConfig.baseUrl ? { baseURL: zszConfig.baseUrl } : {})` 避免覆盖默认值。

### 测试用例（必须先写，确认 RED）
1. test_client_uses_zszcode_base_url — 验证 Anthropic 构造时使用 zszcode 配置的 baseURL
2. test_client_base_url_not_empty — 配置的 baseUrl 非空时生效
3. test_client_base_url_empty_skipped — baseUrl 为空字符串时不覆盖默认值
4. test_client_base_url_format — 配置的 URL 以 `https://` 开头
5. test_client_base_url_no_trailing_slash — URL 不以 `/` 结尾

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 修改 `getAnthropicClient()` 添加 baseURL 逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/05-task-66.test.ts
```

---

## 任务 67：CLI --model flag 覆盖配置默认模型

**所属模块**：05-api-adapter
**依赖**：任务 66
**预估耗时**：8 分钟

### 功能点要求
当用户通过 CLI 的 `--model` flag 指定模型时，该值优先于 zszcode 配置中的 `model` 字段。修改 `src/main.tsx` 中的模型选择逻辑，保持原有 `getInitialMainLoopModel()` 的优先级。

### 测试用例（必须先写，确认 RED）
1. test_cli_model_flag_overrides — `--model claude-3` 覆盖配置的 `mimo-v2.5-pro`
2. test_cli_model_flag_type_string — CLI model 参数是字符串
3. test_cli_model_flag_applied — 最终使用的模型是 CLI 指定的值
4. test_cli_model_flag_with_config — 有配置时 CLI flag 仍优先
5. test_cli_model_flag_none_uses_config — 无 `--model` 时使用配置值

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 修改 `main.tsx` 模型选择逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/05-task-67.test.ts
```

---

## 任务 68：无 CLI --model 时使用配置中的 model 字段

**所属模块**：05-api-adapter
**依赖**：任务 66
**预估耗时**：8 分钟

### 功能点要求
当用户未指定 `--model` flag 时，使用 zszcode 配置中的 `model` 字段作为默认模型。修改 `src/main.tsx` 中的 `parseUserSpecifiedModel()` 调用链，插入 `zszConfig.model` 作为中间优先级。

### 测试用例（必须先写，确认 RED）
1. test_config_model_used — 无 CLI flag 时使用配置的 `mimo-v2.5-pro`
2. test_config_model_type — 配置的 model 是字符串
3. test_config_model_parsed — 通过 `parseUserSpecifiedModel` 标准化
4. test_config_model_default — DEFAULTS 中的 model 为 `mimo-v2.5-pro`
5. test_config_model_custom — 自定义 model 被正确使用

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 修改 `main.tsx` 默认模型逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/05-task-68.test.ts
```

---

## 任务 69：无配置时回退到 getDefaultMainLoopModel()

**所属模块**：05-api-adapter
**依赖**：任务 68
**预估耗时**：8 分钟

### 功能点要求
当 zszcode 配置中的 `model` 为空字符串或 `undefined` 时，回退到原有的 `getDefaultMainLoopModel()` 函数。保持原有的兜底逻辑不被破坏。

### 测试用例（必须先写，确认 RED）
1. test_fallback_default_model — 配置 model 为空时使用 `getDefaultMainLoopModel()`
2. test_fallback_empty_string — model 为 `''` 时回退
3. test_fallback_preserves_original — 原有回退逻辑不被破坏
4. test_fallback_chain_complete — 完整优先级链：CLI flag > config > default
5. test_fallback_no_config_file — 无配置文件时使用原有默认值

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认回退逻辑正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/05-task-69.test.ts
```

---

## 任务 70：无效 baseURL 产生明确错误消息

**所属模块**：05-api-adapter
**依赖**：任务 66
**预估耗时**：8 分钟

### 功能点要求
当 zszcode 配置的 `baseUrl` 是无效 URL（如 `'not-a-url'`）时，在 Anthropic 客户端创建或首次请求时产生明确的错误消息，帮助用户定位配置问题。

### 测试用例（必须先写，确认 RED）
1. test_invalid_base_url_throws — 无效 URL 时抛出异常
2. test_invalid_base_url_error_message — 错误消息包含 URL 相关信息
3. test_invalid_base_url_no_crash — 不产生未捕获异常
4. test_valid_base_url_works — 有效 URL 不受影响
5. test_empty_base_url_no_error — 空字符串不触发错误（使用默认值）

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 添加 URL 验证逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/05-task-70.test.ts
```

---

## 任务 71：apiKey 优先级：zszcode 配置 > 环境变量 > 默认

**所属模块**：05-api-adapter
**依赖**：任务 65
**预估耗时**：8 分钟

### 功能点要求
API Key 的优先级链为：zszcode 配置中的 `apiKey` > 环境变量 `ANTHROPIC_API_KEY` > `getAnthropicApiKey()` 默认值。验证完整优先级链在不同场景下的行为。

### 测试用例（必须先写，确认 RED）
1. test_api_key_zszcode_first — zszcode apiKey 非空时优先使用
2. test_api_key_env_fallback — zszcode apiKey 为空时使用环境变量
3. test_api_key_default_fallback — 环境变量也为空时使用默认值
4. test_api_key_priority_order — 完整优先级链验证
5. test_api_key_not_empty — 最终使用的 apiKey 不为空字符串

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认优先级逻辑正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/05-task-71.test.ts
```

---

## 任务 72：baseURL 为空字符串时不覆盖默认值

**所属模块**：05-api-adapter
**依赖**：任务 66
**预估耗时**：5 分钟

### 功能点要求
当 zszcode 配置的 `baseUrl` 为空字符串 `''` 时，不将 `baseURL` 设置到 Anthropic 客户端配置中，让 SDK 使用其默认值。使用 falsy 检查 `zszConfig.baseUrl` 避免空字符串覆盖。

### 测试用例（必须先写，确认 RED）
1. test_empty_base_url_no_override — 空字符串不设置 baseURL
2. test_undefined_base_url_no_override — `undefined` 不设置 baseURL
3. test_null_base_url_no_override — `null` 不设置 baseURL
4. test_valid_base_url_overrides — 非空字符串正确设置 baseURL
5. test_falsy_check_type — 使用 falsy 检查而非严格相等

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认条件展开逻辑正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/05-task-72.test.ts
```

---

## 任务 73：loadConfig() 只调用一次（缓存/幂等）

**所属模块**：05-api-adapter
**依赖**：任务 65
**预估耗时**：8 分钟

### 功能点要求
在 `getAnthropicClient()` 中，`loadConfig()` 只被调用一次，结果被缓存。多次调用 `getAnthropicClient()` 不会重复读取配置文件。可以使用模块级变量缓存或在函数入口处调用一次。

### 测试用例（必须先写，确认 RED）
1. test_load_config_called_once — 验证 `loadConfig()` 只被调用一次
2. test_config_cached — 第二次调用使用缓存值
3. test_config_not_re_read — 配置文件修改后不立即生效（缓存行为）
4. test_config_import_location — `loadConfig` 从正确路径导入
5. test_config_call_before_client — 配置在客户端创建前加载

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现配置缓存逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/05-task-73.test.ts
```

---

## 任务 74：model 字符串通过 parseUserSpecifiedModel 标准化

**所属模块**：05-api-adapter
**依赖**：任务 67
**预估耗时**：8 分钟

### 功能点要求
从 zszcode 配置读取的 `model` 字符串在使用前通过 `parseUserSpecifiedModel()` 函数标准化处理。确保模型名称格式正确（去除空格、处理别名等）。

### 测试用例（必须先写，确认 RED）
1. test_model_parsed — `mimo-v2.5-pro` 通过解析后格式正确
2. test_model_with_spaces — 前后有空格的模型名被 trim
3. test_model_case_preserved — 模型名大小写被保留
4. test_model_parse_function_called — `parseUserSpecifiedModel` 被调用
5. test_model_empty_after_parse — 空字符串解析后仍为空（触发回退）

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认解析逻辑正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/05-task-74.test.ts
```
