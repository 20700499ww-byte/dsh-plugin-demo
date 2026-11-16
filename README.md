# dsh-plugin-demo

A minimal, working DeepSeek Harness (DSH) bundle template. Use it as a starting point: swap the logic in `index.js` for your own plugin, leave the rest of the files alone.

> Third-party project built on DeepSeek Harness. Not an official one.

## What it does

Logs one line on load and cleans up on unload. That's all. The value is in the structure: every file a working bundle needs is here.

## Layout

```
dsh-plugin-demo/
├── package.json        # declares dsh.bundle — this package contributes one config layer
├── cordis.patch.yml    # the config layer: inserts one plugin row
├── index.js            # host-side plugin code, exports apply(ctx, config)
├── locale/
│   ├── en.json         # title and description shown in the plugin manager (English required)
│   └── zh.json         # Chinese title and description
├── icon.svg            # plugin icon (SVG/PNG/JPEG/WebP, ≤256 KiB)
├── market/
│   ├── index.json      # plugin market index (format 1), can be hosted on GitHub Pages
│   ├── icons/demo.svg  # icon referenced by the index
│   └── validate.mjs    # self-check the index with the official validator
├── .gitignore
├── LICENSE
└── README.md
```

## bundle vs. profile

| concept | what it is | who writes it |
|---|---|---|
| bundle | an npm package that declares `dsh.bundle` in `package.json` and contributes a config layer | you, the plugin author |
| profile | a directory that declares `dsh.profile.bundles` and combines bundles in order | the user |

A bundle is what you publish. A profile is what the user boots with. They don't overlap.

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

## Self-check

```bash
node --check index.js        # syntax check
node market/validate.mjs     # check market/index.json, package.json and locale with the official validator
```

## Publishing

Three routes, and you can take all of them.

**Publish to npm** — users install without granting any build permission:

```bash
npm login
npm publish --access public
```

Install with: `dsh plugin --profile demo add dsh-plugin-demo`

**Install straight from GitHub**:

```bash
dsh plugin --profile demo add github:<your-username>/dsh-plugin-demo
```

A git install gives you source, not a build artefact. This template is pure ESM JavaScript with no build step, so it runs as-is. If you switch to TypeScript, you'll need a `prepare` script in `package.json` that builds `lib/` on its own, and users still have to grant execution via `allowBuilds` — so publishing an npm package or a tarball (`pnpm pack`) is less hassle.

**Publish a market index**:

`market/index.json` is a format 1 index. Host it together with `market/icons/` on any static site (GitHub Pages works), then point DSH at it under Plugins → Custom plugin indexes → Add index source. Users can then search, check versions and install in one click from Discover.

## Compatibility

- `engines.dsh`: `>=0.2.0-rc.5 <0.3.0`
- `engines.node`: `>=20`
- DSH checks `engines.dsh` on install and on boot. Without that field it falls back to the peer range of `@deepseek-ai/dsh*`.

## License

MIT
