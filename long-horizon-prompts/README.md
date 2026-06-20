# ZSZCode 长程任务执行框架

基于 Claude Code 源码构建独立二进制 `zszcode`：内嵌 Web 服务器、Agent 工作流可观测性、自定义模型配置。

**实验目标**：用严格 TDD 驱动单 agent 串行完成 100+ task，构建完整可用的 zszcode 产品。

| 文件 | 用途 |
|---|---|
| `step-0-setup.md` | 环境准备：Bun 安装、依赖拉取、源码复制、配置文件初始化 |
| `step-1-brainstorm.md` | 分析 Claude Code 源码架构，确认修改方案，生成模块 spec |
| `step-2-write-plan.md` | 将 spec 拆成 100+ 个功能点级 task，每个含 ≥5 测试用例 + RED/GREEN 流程 |
| `step-3-goal-execute.md` | 单线程串行执行 task，严格 TDD，进度管理，git commit |
| `CLAUDE.md` | 项目记忆模板：启动协议、执行流程、progress.json、check_progress.py、约束 |

## 关键约束（贯穿所有 step）

- **单线程串行**：禁止并行 agent 写代码（污染长程度量数据）
- **测试充分**：每个 task ≥ 5 测试用例（TypeScript/Bun test），先 RED 后 GREEN
- **禁止假实现**：stub / echo / placeholder 不算 done
- **真实功能验证**：涉及 Web 服务器的 task 必须 curl 验证、涉及 CLI 的 task 必须实际运行
- **不污染官方 Claude Code**：所有修改在 zszcode/src/ 副本中进行
