# 02 — 配置模块 TDD 任务计划

**模块职责**：管理 `~/.zszcode/settings.json` 配置文件，提供默认值，支持合并覆盖。

**新增文件**：
- `src/zszcode/config.ts`

---

## 任务 17：定义 ZszCodeConfig 接口含全部 6 个字段

**所属模块**：02-config
**依赖**：无
**预估耗时**：8 分钟

### 功能点要求
在 `src/zszcode/config.ts` 中定义并导出 `ZszCodeConfig` 接口，包含 6 个字段：`model: string`（默认模型名）、`baseUrl: string`（API base URL）、`apiKey: string`（API key）、`webPort: number`（Web 服务器端口）、`autoOpenBrowser: boolean`（自动打开浏览器）、`permissionMode: 'auto' | 'confirm'`（权限模式）。接口必须被导出供其他模块使用。

### 测试用例（必须先写，确认 RED）
1. test_config_interface_importable — 验证可以从 `config.ts` 导入 `ZszCodeConfig` 类型
2. test_config_interface_has_model — 验证接口包含 `model` 字段
3. test_config_interface_has_base_url — 验证接口包含 `baseUrl` 字段
4. test_config_interface_has_permission_mode — 验证 `permissionMode` 类型约束为 `'auto' | 'confirm'`
5. test_config_interface_field_count — 验证接口恰好有 6 个字段

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 定义 `ZszCodeConfig` 接口 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/02-task-17.test.ts
```

---

## 任务 18：定义 DEFAULTS 常量含正确的默认值

**所属模块**：02-config
**依赖**：任务 17
**预估耗时**：8 分钟

### 功能点要求
在 `src/zszcode/config.ts` 中定义 `DEFAULTS` 常量，类型为 `ZszCodeConfig`。默认值：`model: 'mimo-v2.5-pro'`、`baseUrl: 'https://token-plan-cn.xiaomimimo.com/anthropic'`、`apiKey: 'tp-c2vyjcx7y4xxzfs6s8sz8htsw7ou3ts2afdulks4mcc0iecy'`、`webPort: 3000`、`autoOpenBrowser: false`、`permissionMode: 'confirm'`。

### 测试用例（必须先写，确认 RED）
1. test_defaults_model — 验证 `DEFAULTS.model` 为 `'mimo-v2.5-pro'`
2. test_defaults_base_url — 验证 `DEFAULTS.baseUrl` 包含 `xiaomimimo.com`
3. test_defaults_api_key — 验证 `DEFAULTS.apiKey` 以 `tp-` 开头
4. test_defaults_web_port — 验证 `DEFAULTS.webPort` 为 `3000`
5. test_defaults_permission_mode — 验证 `DEFAULTS.permissionMode` 为 `'confirm'`

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 定义 `DEFAULTS` 常量 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/02-task-18.test.ts
```

---

## 任务 19：loadConfig() 配置文件不存在时创建默认 settings.json

**所属模块**：02-config
**依赖**：任务 18
**预估耗时**：10 分钟

### 功能点要求
`loadConfig()` 函数检查 `~/.zszcode/settings.json` 是否存在。若不存在，自动创建 `~/.zszcode/` 目录（`recursive: true`），然后将 `DEFAULTS` 写入 `settings.json`（格式化 JSON，2 空格缩进），最后返回 `DEFAULTS` 的副本。

### 测试用例（必须先写，确认 RED）
1. test_load_config_creates_file — 删除配置文件后调用 `loadConfig()`，验证文件被创建
2. test_load_config_creates_dir — 删除配置目录后调用 `loadConfig()`，验证目录被创建
3. test_load_config_returns_defaults — 无配置文件时返回全部默认值
4. test_load_config_written_json_valid — 写入的 JSON 可被正确解析
5. test_load_config_written_json_has_all_fields — 写入的 JSON 包含全部 6 个字段

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 `loadConfig()` → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/02-task-19.test.ts
```

---

## 任务 20：loadConfig() 配置文件存在时读取并合并

**所属模块**：02-config
**依赖**：任务 18
**预估耗时**：10 分钟

### 功能点要求
当 `settings.json` 存在时，`loadConfig()` 读取文件内容，解析 JSON，与 `DEFAULTS` 合并（spread operator：`{ ...DEFAULTS, ...file }`）。用户自定义值覆盖默认值。

### 测试用例（必须先写，确认 RED）
1. test_load_config_reads_existing — 写入自定义配置后调用 `loadConfig()`，验证读取正确
2. test_load_config_merges_with_defaults — 自定义部分字段后，其他字段仍为默认值
3. test_load_config_user_overrides_default — 自定义 `model` 覆盖默认 `model`
4. test_load_config_returns_object — 返回值类型为对象
5. test_load_config_no_file_modification — 读取操作不修改已有配置文件

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现文件读取和合并逻辑 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/02-task-20.test.ts
```

---

## 任务 21：loadConfig() 缺失字段用默认值填充

**所属模块**：02-config
**依赖**：任务 20
**预估耗时**：8 分钟

### 功能点要求
当 `settings.json` 中只包含部分字段时，`loadConfig()` 用 `DEFAULTS` 中的值填充缺失字段。例如只写了 `{"model": "custom"}` 时，其他 5 个字段使用默认值。返回值永远包含全部 6 个字段，无 `undefined`。

### 测试用例（必须先写，确认 RED）
1. test_load_config_fills_missing_model — 缺失 `model` 时使用默认值
2. test_load_config_fills_missing_web_port — 缺失 `webPort` 时使用默认值 `3000`
3. test_load_config_fills_missing_permission_mode — 缺失 `permissionMode` 时使用 `'confirm'`
4. test_load_config_no_undefined_fields — 返回值无任何 `undefined` 字段
5. test_load_config_single_field_file — 配置文件只有 1 个字段时，其余 5 个为默认值

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认合并逻辑正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/02-task-21.test.ts
```

---

## 任务 22：loadConfig() 自定义值覆盖默认值

**所属模块**：02-config
**依赖**：任务 20
**预估耗时**：8 分钟

### 功能点要求
当 `settings.json` 中的值与 `DEFAULTS` 不同时，以用户值为准。验证所有 6 个字段都能被独立覆盖。

### 测试用例（必须先写，确认 RED）
1. test_load_config_override_model — 自定义 `model` 正确覆盖
2. test_load_config_override_base_url — 自定义 `baseUrl` 正确覆盖
3. test_load_config_override_api_key — 自定义 `apiKey` 正确覆盖
4. test_load_config_override_web_port — 自定义 `webPort` 正确覆盖
5. test_load_config_override_permission_mode — 自定义 `permissionMode` 正确覆盖

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认 spread operator 合并顺序正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/02-task-22.test.ts
```

---

## 任务 23：loadConfig() 配置目录不存在时自动创建 ~/.zszcode/

**所属模块**：02-config
**依赖**：任务 19
**预估耗时**：8 分钟

### 功能点要求
当 `~/.zszcode/` 目录不存在时，`loadConfig()` 使用 `mkdirSync(CONFIG_DIR, { recursive: true })` 自动创建。创建后再写入默认配置文件。如果目录已存在，不报错。

### 测试用例（必须先写，确认 RED）
1. test_load_config_creates_dir_recursive — 删除目录后调用，验证目录被创建
2. test_load_config_dir_exists_no_error — 目录已存在时调用不报错
3. test_load_config_dir_is_absolute — 创建的目录路径是绝对路径
4. test_load_config_dir_under_home — 目录在用户 home 目录下
5. test_load_config_dir_name_zszcode — 目录名为 `.zszcode`

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认 `mkdirSync` 调用正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/02-task-23.test.ts
```

---

## 任务 24：loadConfig() 无效 JSON 抛出明确错误

**所属模块**：02-config
**依赖**：任务 18
**预估耗时**：8 分钟

### 功能点要求
当 `settings.json` 内容不是有效 JSON 时，`JSON.parse` 抛出 `SyntaxError`。`loadConfig()` 不捕获此错误，让调用者处理。错误消息应包含文件路径信息，便于调试。

### 测试用例（必须先写，确认 RED）
1. test_load_config_invalid_json_throws — 写入 `"not json"` 后调用，验证抛出异常
2. test_load_config_invalid_json_error_type — 异常为 `SyntaxError` 或包含 `JSON` 关键字
3. test_load_config_empty_string_throws — 写入空字符串后调用，验证抛出异常
4. test_load_config_truncated_json_throws — 写入 `'{"model":'` 后调用，验证抛出异常
5. test_load_config_bom_json_throws — 写入带 BOM 的无效内容后调用，验证抛出异常

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认错误传播正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/02-task-24.test.ts
```

---

## 任务 25：CONFIG_DIR 常量为 ~/.zszcode 绝对路径

**所属模块**：02-config
**依赖**：任务 17
**预估耗时**：5 分钟

### 功能点要求
导出 `CONFIG_DIR` 常量，值为 `path.join(os.homedir(), '.zszcode')`，是 `~/.zszcode` 的绝对路径展开。路径使用系统原生分隔符。

### 测试用例（必须先写，确认 RED）
1. test_config_dir_is_absolute — 验证 `CONFIG_DIR` 以 `/` 开头（Unix）
2. test_config_dir_ends_with_zszcode — 验证以 `.zszcode` 结尾
3. test_config_dir_contains_home — 验证包含 home 目录路径
4. test_config_dir_no_tilde — 验证不包含 `~` 字符
5. test_config_dir_type_string — 验证 `typeof CONFIG_DIR === 'string'`

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 导出 `CONFIG_DIR` 常量 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/02-task-25.test.ts
```

---

## 任务 26：CONFIG_FILE 常量为 ~/.zszcode/settings.json 绝对路径

**所属模块**：02-config
**依赖**：任务 25
**预估耗时**：5 分钟

### 功能点要求
导出 `CONFIG_FILE` 常量，值为 `path.join(CONFIG_DIR, 'settings.json')`，是 `~/.zszcode/settings.json` 的绝对路径展开。

### 测试用例（必须先写，确认 RED）
1. test_config_file_is_absolute — 验证以 `/` 开头
2. test_config_file_ends_with_filename — 验证以 `settings.json` 结尾
3. test_config_file_contains_config_dir — 验证以 `CONFIG_DIR` 开头
4. test_config_file_no_tilde — 验证不包含 `~` 字符
5. test_config_file_type_string — 验证 `typeof CONFIG_FILE === 'string'`

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 导出 `CONFIG_FILE` 常量 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/02-task-26.test.ts
```

---

## 任务 27：ZszCodeConfig.permissionMode 类型约束为 'auto' | 'confirm'

**所属模块**：02-config
**依赖**：任务 17
**预估耗时**：8 分钟

### 功能点要求
`permissionMode` 字段的 TypeScript 类型严格约束为联合类型 `'auto' | 'confirm'`。赋值其他字符串值应产生类型错误。测试中验证类型约束在编译时生效（通过类型测试或运行时检查）。

### 测试用例（必须先写，确认 RED）
1. test_permission_mode_auto_valid — 验证 `'auto'` 是合法值
2. test_permission_mode_confirm_valid — 验证 `'confirm'` 是合法值
3. test_permission_mode_default_is_confirm — 验证 `DEFAULTS.permissionMode` 为 `'confirm'`
4. test_permission_mode_string_type — 验证 `typeof DEFAULTS.permissionMode === 'string'`
5. test_permission_mode_value_in_set — 验证值在 `['auto', 'confirm']` 集合中

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认类型定义正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/02-task-27.test.ts
```

---

## 任务 28：loadConfig() 返回对象包含所有必需字段（无 undefined）

**所属模块**：02-config
**依赖**：任务 21
**预估耗时**：8 分钟

### 功能点要求
无论配置文件内容如何，`loadConfig()` 的返回值始终包含全部 6 个字段，每个字段都有定义值（不是 `undefined`）。使用 `Object.keys()` 检查字段数量，逐个检查每个字段不为 `undefined`。

### 测试用例（必须先写，确认 RED）
1. test_load_config_has_model — 返回值的 `model` 不是 `undefined`
2. test_load_config_has_base_url — 返回值的 `baseUrl` 不是 `undefined`
3. test_load_config_has_api_key — 返回值的 `apiKey` 不是 `undefined`
4. test_load_config_has_web_port — 返回值的 `webPort` 不是 `undefined`
5. test_load_config_key_count — 返回值恰好有 6 个键

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认合并逻辑覆盖所有字段 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/02-task-28.test.ts
```

---

## 任务 29：loadConfig() 幂等性：连续调用返回相同结果

**所属模块**：02-config
**依赖**：任务 20
**预估耗时**：8 分钟

### 功能点要求
连续调用 `loadConfig()` 多次，每次返回的结果在结构上完全相同（深比较相等）。配置文件在多次调用间不被修改（除了首次创建的情况）。

### 测试用例（必须先写，确认 RED）
1. test_load_config_idempotent_same_keys — 连续两次调用返回相同的键集合
2. test_load_config_idempotent_same_values — 连续两次调用返回相同的值
3. test_load_config_idempotent_deep_equal — 使用 JSON 序列化比较两次结果相等
4. test_load_config_no_file_mutation — 第二次调用前检查文件未被修改
5. test_load_config_100_calls_stable — 连续调用 100 次结果一致

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认函数无副作用 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/02-task-29.test.ts
```

---

## 任务 30：loadConfig() settings.json 为空对象时返回全部默认值

**所属模块**：02-config
**依赖**：任务 21
**预估耗时**：5 分钟

### 功能点要求
当 `settings.json` 内容为 `{}`（空对象）时，`loadConfig()` 返回与 `DEFAULTS` 完全相同的结果。空对象与默认值合并后，所有字段来自默认值。

### 测试用例（必须先写，确认 RED）
1. test_load_config_empty_json_model — `model` 为默认值 `'mimo-v2.5-pro'`
2. test_load_config_empty_json_base_url — `baseUrl` 为默认值
3. test_load_config_empty_json_api_key — `apiKey` 为默认值
4. test_load_config_empty_json_web_port — `webPort` 为 `3000`
5. test_load_config_empty_json_equals_defaults — 结果与 `DEFAULTS` 深比较相等

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认空对象合并行为正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/02-task-30.test.ts
```

---

## 任务 31：loadConfig() settings.json 含多余字段时不报错

**所属模块**：02-config
**依赖**：任务 20
**预估耗时**：5 分钟

### 功能点要求
当 `settings.json` 包含 `ZszCodeConfig` 接口中未定义的额外字段时（如 `{"model": "x", "extraField": true}`），`loadConfig()` 正常返回，不抛出错误。额外字段被忽略，不影响返回结果。

### 测试用例（必须先写，确认 RED）
1. test_load_config_extra_field_no_error — 包含额外字段时不抛出异常
2. test_load_config_extra_field_ignored — 返回值不包含额外字段
3. test_load_config_extra_field_preserves_valid — 额外字段不影响有效字段的读取
4. test_load_config_many_extra_fields — 包含 10 个额外字段时不报错
5. test_load_config_nested_extra_field — 包含嵌套额外对象时不报错

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认 spread operator 忽略多余字段 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/02-task-31.test.ts
```
