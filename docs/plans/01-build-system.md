# 01 — 构建系统 TDD 任务计划

**模块职责**：为 zszcode 源码创建完整的构建配置，使其能被 Bun 编译运行。处理 `bun:bundle` 的 feature flags 和 MACRO 常量。

**新增文件**：
- `package.json`
- `tsconfig.json`
- `src/shims/bun-bundle.ts`
- `src/shims/bun-test.ts`

---

## 任务 1：创建 package.json 声明所有依赖和脚本

**所属模块**：01-build-system
**依赖**：无
**预估耗时**：10 分钟

### 功能点要求
在 `/home/zsz/Mimo/zszcode/` 根目录创建 `package.json`，包含项目名称 `zszcode`、版本 `0.1.0`、`type: "module"`、`bin` 入口指向 `./dist/cli.js`，以及 `build`/`build:binary`/`dev`/`build:web`/`test`/`typecheck` 六个 scripts。依赖包括 `@anthropic-ai/sdk`、`@modelcontextprotocol/sdk`、`react`、`react-reconciler`、`commander`、`chalk`、`zod`、`ws`、`express`、`chokidar`。devDependencies 包括 `@types/react`、`@types/ws`、`@types/express`、`typescript`。

### 测试用例（必须先写，确认 RED）
1. test_package_json_exists — 验证 `/home/zsz/Mimo/zszcode/package.json` 文件存在
2. test_package_json_name — 验证 `name` 字段为 `"zszcode"`
3. test_package_json_version — 验证 `version` 字段为 `"0.1.0"`
4. test_package_json_type_module — 验证 `type` 字段为 `"module"`
5. test_package_json_scripts — 验证 scripts 包含 `build`、`dev`、`test`、`typecheck`

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 创建 `package.json` → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/01-task-01.test.ts
```

---

## 任务 2：创建 tsconfig.json 含 paths 映射 bun:bundle 和 bun:test

**所属模块**：01-build-system
**依赖**：无
**预估耗时**：8 分钟

### 功能点要求
创建 `tsconfig.json`，配置 `target: "ESNext"`、`module: "ESNext"`、`moduleResolution: "bundler"`、`jsx: "react-jsx"`、`strict: true`。`paths` 映射 `bun:bundle` 到 `src/shims/bun-bundle.ts`，`bun:test` 到 `src/shims/bun-test.ts`。`include` 覆盖 `src/**/*.ts` 和 `src/**/*.tsx`，`exclude` 排除 `node_modules`、`dist`、`web`。

### 测试用例（必须先写，确认 RED）
1. test_tsconfig_exists — 验证 `tsconfig.json` 文件存在
2. test_tsconfig_strict — 验证 `compilerOptions.strict` 为 `true`
3. test_tsconfig_jsx — 验证 `compilerOptions.jsx` 为 `"react-jsx"`
4. test_tsconfig_paths_bun_bundle — 验证 `paths["bun:bundle"]` 包含 `"src/shims/bun-bundle.ts"`
5. test_tsconfig_paths_bun_test — 验证 `paths["bun:test"]` 包含 `"src/shims/bun-test.ts"`

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 创建 `tsconfig.json` → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/01-task-02.test.ts
```

---

## 任务 3：创建 src/shims/bun-bundle.ts 的 feature() 函数（始终返回 false）

**所属模块**：01-build-system
**依赖**：无
**预估耗时**：8 分钟

### 功能点要求
创建 `src/shims/bun-bundle.ts`，导出 `feature(name: string): boolean` 函数，对任意输入始终返回 `false`。这是 141 个源文件中 `import { feature } from 'bun:bundle'` 的 shim，使所有 feature flag 在外部构建中等价于关闭。

### 测试用例（必须先写，确认 RED）
1. test_feature_returns_false — 验证 `feature('any_flag')` 返回 `false`
2. test_feature_empty_string — 验证 `feature('')` 返回 `false`
3. test_feature_known_flag — 验证 `feature('ENABLE_VOICE')` 返回 `false`
4. test_feature_numeric_string — 验证 `feature('123')` 返回 `false`
5. test_feature_return_type_boolean — 验证返回值的 `typeof` 为 `'boolean'`

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 `feature()` 函数 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/01-task-03.test.ts
```

---

## 任务 4：创建 src/shims/bun-bundle.ts 的 MACRO 常量对象（7 个字段）

**所属模块**：01-build-system
**依赖**：无
**预估耗时**：10 分钟

### 功能点要求
在 `src/shims/bun-bundle.ts` 中导出 `MACRO` 常量对象，包含 7 个字段：`VERSION`（`'0.1.0'`）、`PACKAGE_URL`（`'https://github.com/Zhe-SH-CN/zszcode'`）、`NATIVE_PACKAGE_URL`（`''`）、`FEEDBACK_CHANNEL`（`'github'`）、`BUILD_TIME`（ISO 8601 格式字符串）、`VERSION_CHANGELOG`（`''`）、`ISSUES_EXPLAINER`（`'Report issues at https://github.com/Zhe-SH-CN/zszcode/issues'`）。`BUILD_TIME` 在模块加载时生成。

### 测试用例（必须先写，确认 RED）
1. test_macro_version — 验证 `MACRO.VERSION` 为 `'0.1.0'`
2. test_macro_package_url — 验证 `MACRO.PACKAGE_URL` 为正确的 GitHub URL
3. test_macro_build_time_iso — 验证 `MACRO.BUILD_TIME` 匹配 ISO 8601 格式
4. test_macro_issues_explainer — 验证 `MACRO.ISSUES_EXPLAINER` 包含 GitHub issues URL
5. test_macro_all_fields_exist — 验证 MACRO 对象恰好有 7 个字段

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 实现 `MACRO` 常量 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/01-task-04.test.ts
```

---

## 任务 5：创建 src/shims/bun-test.ts 空 stub 导出

**所属模块**：01-build-system
**依赖**：无
**预估耗时**：5 分钟

### 功能点要求
创建 `src/shims/bun-test.ts`，仅包含 `export {}`。这是 `bun:test` 的空 stub，因为 `src/` 中没有测试代码导入 `bun:test`。测试文件直接使用 `bun:test`，不需要 shim。

### 测试用例（必须先写，确认 RED）
1. test_bun_test_shim_exists — 验证 `src/shims/bun-test.ts` 文件存在
2. test_bun_test_shim_is_empty_module — 验证文件导出为空对象
3. test_bun_test_shim_no_syntax_error — 验证文件可被 TypeScript 正确解析
4. test_bun_test_shim_importable — 验证可以 `import` 该文件不报错
5. test_bun_test_shim_file_size_small — 验证文件大小小于 100 字节

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 创建 `src/shims/bun-test.ts` → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/01-task-05.test.ts
```

---

## 任务 6：bun install 成功安装所有依赖无报错

**所属模块**：01-build-system
**依赖**：任务 1
**预估耗时**：15 分钟

### 功能点要求
在 `package.json` 创建后，运行 `bun install` 安装所有 dependencies 和 devDependencies。安装过程无错误退出，`node_modules/` 目录被创建，`bun.lock` 文件被生成。所有声明的依赖在 `node_modules/` 中可找到。

### 测试用例（必须先写，确认 RED）
1. test_node_modules_exists — 验证 `node_modules/` 目录存在
2. test_bun_lock_exists — 验证 `bun.lock` 文件存在
3. test_react_installed — 验证 `node_modules/react` 目录存在
4. test_commander_installed — 验证 `node_modules/commander` 目录存在
5. test_typescript_installed — 验证 `node_modules/typescript` 目录存在

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 运行 `bun install` → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/01-task-06.test.ts
```

---

## 任务 7：bun build 解析所有 src/ 导入无 ModuleNotFound 错误

**所属模块**：01-build-system
**依赖**：任务 2, 3, 4, 5, 6
**预估耗时**：15 分钟

### 功能点要求
运行 `bun build src/entrypoints/cli.tsx --outdir dist --target bun`，构建过程不产生 `ModuleNotFound` 错误。`bun:bundle` 和 `bun:test` 的 paths 映射正确工作，所有 141 个导入 `bun:bundle` 的文件被正确解析。构建输出 `dist/` 目录包含打包后的文件。

### 测试用例（必须先写，确认 RED）
1. test_build_exits_zero — 验证 `bun build` 命令退出码为 0
2. test_build_no_module_not_found — 验证构建输出不包含 `ModuleNotFound` 错误
3. test_build_dist_created — 验证 `dist/` 目录被创建
4. test_build_output_has_cli — 验证 `dist/` 中包含 `cli.js` 文件
5. test_build_stderr_clean — 验证 stderr 不包含严重错误（warning 可接受）

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确保所有 shim 和依赖就位后运行构建 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/01-task-07.test.ts
```

---

## 任务 8：feature() 对任意字符串输入返回 false

**所属模块**：01-build-system
**依赖**：任务 3
**预估耗时**：8 分钟

### 功能点要求
`feature()` 函数的行为验证：对源码中实际使用的 91 个不同 flag 名称全部返回 `false`。函数不抛出异常，不依赖任何外部状态，是纯函数。

### 测试用例（必须先写，确认 RED）
1. test_feature_all_91_flags — 遍历 91 个已知 flag 名称，每个都返回 `false`
2. test_feature_unicode_string — 验证 `feature('中文flag')` 返回 `false`
3. test_feature_very_long_string — 验证 `feature('a'.repeat(10000))` 返回 `false`
4. test_feature_no_side_effects — 连续调用 1000 次结果一致
5. test_feature_pure_function — 相同输入始终返回相同输出

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**（依赖任务 3 的实现）
2. 确认实现满足要求 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/01-task-08.test.ts
```

---

## 任务 9：MACRO.VERSION 返回 '0.1.0'

**所属模块**：01-build-system
**依赖**：任务 4
**预估耗时**：5 分钟

### 功能点要求
`MACRO.VERSION` 精确返回字符串 `'0.1.0'`，与 `package.json` 中的 `version` 字段一致。该常量被源码中 97 处引用。

### 测试用例（必须先写，确认 RED）
1. test_macro_version_exact — 验证 `MACRO.VERSION === '0.1.0'`
2. test_macro_version_type — 验证 `typeof MACRO.VERSION === 'string'`
3. test_macro_version_matches_package — 读取 `package.json` 验证版本号一致
4. test_macro_version_no_prerelease — 验证版本号不包含 `-` 或 `+`
5. test_macro_version_semver — 验证版本号匹配 semver 格式 `X.Y.Z`

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认 MACRO.VERSION 值正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/01-task-09.test.ts
```

---

## 任务 10：MACRO.PACKAGE_URL 返回正确的 GitHub URL

**所属模块**：01-build-system
**依赖**：任务 4
**预估耗时**：5 分钟

### 功能点要求
`MACRO.PACKAGE_URL` 返回 `'https://github.com/Zhe-SH-CN/zszcode'`，指向项目的 GitHub 仓库。

### 测试用例（必须先写，确认 RED）
1. test_macro_package_url_exact — 验证精确匹配预期 URL
2. test_macro_package_url_https — 验证以 `https://` 开头
3. test_macro_package_url_github — 验证包含 `github.com`
4. test_macro_package_url_repo — 验证包含仓库路径 `Zhe-SH-CN/zszcode`
5. test_macro_package_url_no_trailing_slash — 验证不以 `/` 结尾

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认 MACRO.PACKAGE_URL 值正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/01-task-10.test.ts
```

---

## 任务 11：MACRO.BUILD_TIME 返回 ISO 8601 格式字符串

**所属模块**：01-build-system
**依赖**：任务 4
**预估耗时**：8 分钟

### 功能点要求
`MACRO.BUILD_TIME` 在模块加载时通过 `new Date().toISOString()` 生成，返回 ISO 8601 格式的时间字符串（如 `2026-06-20T12:00:00.000Z`）。

### 测试用例（必须先写，确认 RED）
1. test_macro_build_time_type — 验证 `typeof MACRO.BUILD_TIME === 'string'`
2. test_macro_build_time_iso_format — 验证匹配 ISO 8601 正则 `/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/`
3. test_macro_build_time_parseable — 验证 `new Date(MACRO.BUILD_TIME)` 不是 `Invalid Date`
4. test_macro_build_time_not_epoch — 验证不是 `'1970-01-01T00:00:00.000Z'`
5. test_macro_build_time_reasonable_range — 验证在 2024-2030 年之间

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认 MACRO.BUILD_TIME 值正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/01-task-11.test.ts
```

---

## 任务 12：MACRO.ISSUES_EXPLAINER 返回正确的 issue 报告 URL

**所属模块**：01-build-system
**依赖**：任务 4
**预估耗时**：5 分钟

### 功能点要求
`MACRO.ISSUES_EXPLAINER` 返回 `'Report issues at https://github.com/Zhe-SH-CN/zszcode/issues'`，引导用户到正确的 issue 页面。

### 测试用例（必须先写，确认 RED）
1. test_macro_issues_exact — 验证精确匹配预期字符串
2. test_macro_issues_contains_url — 验证包含 `/issues` 路径
3. test_macro_issues_contains_github — 验证包含 `github.com`
4. test_macro_issues_human_readable — 验证以 `'Report issues at'` 开头
5. test_macro_issues_type — 验证 `typeof` 为 `'string'`

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认 MACRO.ISSUES_EXPLAINER 值正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/01-task-12.test.ts
```

---

## 任务 13：tsconfig paths 正确解析 bun:bundle 到 shim 文件

**所属模块**：01-build-system
**依赖**：任务 2
**预估耗时**：8 分钟

### 功能点要求
TypeScript 的 `paths` 映射使 `import { feature } from 'bun:bundle'` 被解析到 `src/shims/bun-bundle.ts`。验证方式：使用 TypeScript API 或构建工具确认解析路径正确。

### 测试用例（必须先写，确认 RED）
1. test_tsconfig_bun_bundle_path_resolves — 验证 `bun:bundle` 路径映射指向存在的文件
2. test_tsconfig_bun_bundle_file_exports_feature — 验证目标文件导出 `feature` 函数
3. test_tsconfig_bun_bundle_file_exports_macro — 验证目标文件导出 `MACRO` 常量
4. test_tsconfig_bun_bundle_path_in_tsconfig — 读取 tsconfig 验证 paths 配置正确
5. test_tsconfig_bun_bundle_relative_path_valid — 验证路径是相对于 baseUrl 的有效相对路径

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认 tsconfig paths 配置正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/01-task-13.test.ts
```

---

## 任务 14：tsconfig paths 正确解析 bun:test 到 shim 文件

**所属模块**：01-build-system
**依赖**：任务 2
**预估耗时**：8 分钟

### 功能点要求
TypeScript 的 `paths` 映射使 `import {} from 'bun:test'` 被解析到 `src/shims/bun-test.ts`。验证方式：确认 tsconfig 配置正确且目标文件存在。

### 测试用例（必须先写，确认 RED）
1. test_tsconfig_bun_test_path_resolves — 验证 `bun:test` 路径映射指向存在的文件
2. test_tsconfig_bun_test_file_exists — 验证 `src/shims/bun-test.ts` 文件存在
3. test_tsconfig_bun_test_path_in_tsconfig — 读取 tsconfig 验证 paths 配置正确
4. test_tsconfig_bun_test_relative_path_valid — 验证路径是相对于 baseUrl 的有效相对路径
5. test_tsconfig_bun_test_file_is_typescript — 验证文件扩展名为 `.ts`

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确认 tsconfig paths 配置正确 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/01-task-14.test.ts
```

---

## 任务 15：bunx tsc --noEmit 类型检查通过（或仅有少量已知错误）

**所属模块**：01-build-system
**依赖**：任务 7
**预估耗时**：15 分钟

### 功能点要求
运行 `bunx tsc --noEmit` 类型检查，期望零错误或仅有极少量已知的、不影响功能的类型错误。检查涵盖全部 `src/**/*.ts` 和 `src/**/*.tsx` 文件。如果有已知错误，需记录在测试中作为允许的白名单。

### 测试用例（必须先写，确认 RED）
1. test_tsc_exits_clean — 验证 `bunx tsc --noEmit` 退出码为 0（或在已知错误白名单内）
2. test_tsc_no_fatal_errors — 验证输出不包含 `TS1005`、`TS2304` 等致命错误
3. test_tsc_shim_files_pass — 验证 shim 文件本身无类型错误
4. test_tsc_config_files_pass — 验证 `tsconfig.json` 语法正确
5. test_tsc_output_capturable — 验证命令输出可被捕获和分析

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 修复类型错误或记录白名单 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/01-task-15.test.ts
```

---

## 任务 16：bun run src/entrypoints/cli.tsx --version 输出 zszcode 0.1.0

**所属模块**：01-build-system
**依赖**：任务 7, 9
**预估耗时**：10 分钟

### 功能点要求
运行 `bun run src/entrypoints/cli.tsx --version`，输出 `zszcode 0.1.0`。这验证了：MACRO.VERSION 被正确注入、CLI 入口可执行、Commander.js 的 `--version` 选项工作正常。输出格式必须精确匹配 `zszcode 0.1.0`（包含程序名称和版本号）。

### 测试用例（必须先写，确认 RED）
1. test_cli_version_exits_zero — 验证命令退出码为 0
2. test_cli_version_output_contains_zszcode — 验证输出包含 `zszcode`
3. test_cli_version_output_contains_version — 验证输出包含 `0.1.0`
4. test_cli_version_output_exact — 验证输出精确为 `zszcode 0.1.0\n`
5. test_cli_version_stderr_empty — 验证 stderr 为空

### TDD 流程
1. 写上述全部测试 → `bun test <file>` 确认 **RED**
2. 确保构建和 shim 就位 → 确认 **GREEN**
3. `bunx tsc --noEmit` 通过

### 验证方法
```bash
cd /home/zsz/Mimo/zszcode && bun test tests/01-task-16.test.ts
```
