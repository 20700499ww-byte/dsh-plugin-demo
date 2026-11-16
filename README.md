# dsh-plugin-demo

一个最小可用的 DeepSeek Harness（DSH）bundle 模板。拿它当起点，把 `index.js` 换成自己的插件逻辑，其余文件不用动。

A minimal, working DeepSeek Harness (DSH) bundle template. Use it as a starting point: replace the logic in `index.js` with your own plugin, and leave the rest of the files alone.

> 第三方项目，built on DeepSeek Harness，非官方。
>
> A third-party project built on DeepSeek Harness. Not an official one.

## 它做什么

加载时打一行日志，卸载时清干净，别的没有了。值钱的地方在结构：一个能跑起来的 bundle 到底需要哪些文件，这里都摆齐了。

## 目录

```
dsh-plugin-demo/
├── package.json        # 声明 dsh.bundle，本包向 profile 贡献一个配置层
├── cordis.patch.yml    # 配置层：插入一条插件行
├── index.js            # Host 侧插件代码，导出 apply(ctx, config)
├── locale/
│   ├── en.json         # 插件管理器里的标题和描述（英文必需）
│   └── zh.json         # 中文标题和描述
├── icon.svg            # 插件图标（SVG/PNG/JPEG/WebP，≤256 KiB）
├── market/
│   ├── index.json      # 插件市场索引（format 1），可以挂到 GitHub Pages
│   ├── icons/demo.svg  # 索引里引用的图标
│   └── validate.mjs    # 用官方校验器自检索引
├── .gitignore
├── LICENSE
└── README.md
```

## bundle 和 profile 不是一回事

| 概念 | 是什么 | 谁写 |
|---|---|---|
| bundle | 一个 npm 包，`package.json` 里声明 `dsh.bundle`，贡献一个配置层 | 你，插件作者 |
| profile | 一个目录，声明 `dsh.profile.bundles`，按顺序把多个 bundle 拼起来 | 用户 |

bundle 是你发出去的东西，profile 是用户启动时用的东西。两者不重叠。

## 本地跑一下

```bash
# 把当前目录装进 demo 这个 profile
dsh plugin --profile demo add ./dsh-plugin-demo

# 先别启动，看看合成后的配置里有没有本插件这一层
dsh --profile demo --dump-config

# 启动
dsh --profile demo

# 不玩了就卸掉
dsh plugin --profile demo remove dsh-plugin-demo
```

## 自检

```bash
node --check index.js        # 语法检查
node market/validate.mjs     # 用 DSH 官方校验器检查 market/index.json、package.json、locale
```

## 发布

三条路，可以都走。

**发 npm**，用户安装时不用给任何构建授权：

```bash
npm login
npm publish --access public
```

装的时候：`dsh plugin --profile demo add dsh-plugin-demo`

**直接从 GitHub 装**：

```bash
dsh plugin --profile demo add github:<你的用户名>/dsh-plugin-demo
```

git 装拿到的是源码，不是构建产物。这个模板是纯 ESM JavaScript，没有构建步骤，拿来就能用。要是改成 TypeScript，得在 `package.json` 里写个 `prepare` 脚本，把 `lib/` 自己构建出来，用户还得用 `allowBuilds` 授权执行——所以更省事的还是发 npm 包或者 tarball（`pnpm pack`）。

**发市场索引**：

`market/index.json` 是 format 1 的索引。把它和 `market/icons/` 一起放到任意静态站点（GitHub Pages 就行），然后在 DSH 的 Plugins → Custom plugin indexes → Add index source 里填索引 URL。用户就能在 Discover 里搜到、看版本、一键安装。

## 兼容性

- `engines.dsh`: `>=0.2.0-rc.5 <0.3.0`
- `engines.node`: `>=20`
- DSH 在安装和启动时都会校验 `engines.dsh`。没有这个字段的话，就退回去查 `@deepseek-ai/dsh*` 的 peer 范围。

## License

MIT
