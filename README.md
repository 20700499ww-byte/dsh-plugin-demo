# dsh-plugin-demo

一个最小可用的 **DeepSeek Harness (DSH) bundle** 示例 / 模板。用一个 `apply()` 函数演示：一个 bundle 由哪些文件组成、怎样被 profile 加载、怎样发布到 npm / GitHub / 插件市场索引。

> 定位说明：本项目是第三方插件，`built on DeepSeek Harness`，非官方项目，不代表任何官方背书。

## 它做了什么

加载时打印一行日志，卸载时清理；仅此而已。存在的意义是**结构完整、可直接复制**——把 `index.js` 换成你的插件逻辑，其余文件保持不动。

## 目录结构

```
dsh-plugin-demo/
├── package.json        # 声明 dsh.bundle（本包向 profile 贡献一个配置层）
├── cordis.patch.yml    # 配置层：插入一条插件行
├── index.js            # Host 侧插件代码，导出 apply(ctx, config)
├── locale/
│   ├── en.json         # 插件管理器显示的标题/描述（英文必需）
│   └── zh.json         # 中文标题/描述
├── icon.svg            # 插件图标（SVG/PNG/JPEG/WebP，≤256 KiB）
├── market/
│   ├── index.json      # 插件市场索引（format 1），可托管到 GitHub Pages
│   ├── icons/demo.svg  # 索引引用的图标
│   └── validate.mjs    # 用官方校验器自检索引
├── .gitignore
├── LICENSE
└── README.md
```

## 关键概念：bundle 与 profile

| 概念 | 是什么 | 谁写 |
|---|---|---|
| **bundle** | 一个 npm 包，`package.json` 里声明 `dsh.bundle`，贡献一个配置层（patch） | 你（插件作者） |
| **profile** | 一个目录，声明 `dsh.profile.bundles`，按顺序组合多个 bundle | 用户 |

bundle 是**你发布的东西**，profile 是**用户启动时用的东西**，两者不重叠。

## 本地安装 / 试用

```bash
# 指向本目录安装（把 checkout 链接进 profile）
dsh plugin --profile demo add ./dsh-plugin-demo

# 不启动，先确认合成配置里有本插件这一层
dsh --profile demo --dump-config

# 启动
dsh --profile demo

# 卸载
dsh plugin --profile demo remove dsh-plugin-demo
```

## 自检

```bash
node --check index.js        # 语法检查
node market/validate.mjs     # 用 DSH 官方校验器校验 market/index.json、package.json、locale
```

## 发布方式（可多选）

### 1. 发布到 npm（推荐：用户安装时不需要任何构建授权）

```bash
npm login
npm publish --access public
```

用户安装：`dsh plugin --profile demo add dsh-plugin-demo`

### 2. 直接从 GitHub 安装

```bash
dsh plugin --profile demo add github:<你的用户名>/dsh-plugin-demo
```

git 安装拿到的是**源码而非构建产物**。本模板是纯 ESM JavaScript、无构建步骤，可以直接用。若改成 TypeScript，需要在 `package.json` 提供 `prepare` 脚本自包含地构建出 `lib/`，用户还需用 `allowBuilds` 显式授权执行该脚本——更稳妥的仍是发布 npm 包或 tarball（`pnpm pack`）。

### 3. 发布插件市场索引

`market/index.json` 是 **format 1** 索引。把它和 `market/icons/` 一起托管到任意静态站点（GitHub Pages 即可），然后在 DSH 的 **Plugins → Custom plugin indexes → Add index source** 填入索引 URL。用户即可在 **Discover** 标签搜索、看版本、一键安装。

## 兼容性

- `engines.dsh`: `>=0.2.0-rc.5 <0.3.0`
- `engines.node`: `>=20`
- 安装与启动时 DSH 校验 `engines.dsh`；没有该字段则退化为检查 `@deepseek-ai/dsh*` 的 peer 范围。

## License

MIT
