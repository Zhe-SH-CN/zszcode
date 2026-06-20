# Step 0：环境准备

## 0.0 配置国内镜像源（可选）

如果网络访问官方源缓慢或不稳定，先配置镜像加速：

### npm 镜像

```bash
# 淘宝/阿里 npm 镜像（推荐）
npm config set registry https://registry.npmmirror.com

# 验证
npm config get registry
```

---

## 0.1 安装 Bun

zszcode 使用 Bun 作为运行时和构建工具：

```bash
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc
bun --version   # 确认 >= 1.3.14
```

## 0.2 确认 Claude Code 源码副本存在

```bash
# 确认源码副本已复制到 zszcode/src/
ls /home/zsz/Mimo/zszcode/src/entrypoints/cli.tsx
ls /home/zsz/Mimo/zszcode/src/query.ts
ls /home/zsz/Mimo/zszcode/src/services/api/client.ts

# 确认 NOT 修改官方 Claude Code
which claude   # 应指向官方安装路径
```

## 0.3 初始化项目配置

```bash
cd /home/zsz/Mimo/zszcode

# 创建 zszcode 配置目录
mkdir -p ~/.zszcode

# 创建默认配置文件（如果不存在）
cat > ~/.zszcode/settings.json << 'EOF'
{
  "model": "mimo-v2.5-pro",
  "baseUrl": "https://token-plan-cn.xiaomimimo.com/anthropic",
  "apiKey": "tp-c2vyjcx7y4xxzfs6s8sz8htsw7ou3ts2afdulks4mcc0iecy",
  "webPort": 3000,
  "autoOpenBrowser": false,
  "permissionMode": "confirm"
}
EOF
```

## 0.4 安装项目依赖

```bash
cd /home/zsz/Mimo/zszcode

# 安装 npm 依赖（package.json 在 step-1 中创建）
# 如果 package.json 尚存在：
bun install

# 验证
bun --version
node --version
```

## 0.5 初始化 Git 仓库

```bash
cd /home/zsz/Mimo/zszcode
git init
git remote add origin git@github.com:Zhe-SH-CN/zszcode.git
git add .
git commit -m "init: zszcode 项目初始化"
git push -u origin main
```

## 0.6 复制 CLAUDE.md 到项目根目录

```bash
cp ./long-horizon-prompts/CLAUDE.md ./CLAUDE.md
git add CLAUDE.md && git commit -m "init: 项目记忆文件"
```

完成后进入 Step 1。
