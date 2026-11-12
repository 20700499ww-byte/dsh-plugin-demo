// 用 DSH 官方索引校验器校验 market/index.json（只读，不安装任何东西）
// 运行：node market/validate.mjs
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')

// 指向本机 DSH 安装里的校验器；换机器时改这一行即可。
const validator = pathToFileURL(
  'C:/Users/20700/AppData/Local/Programs/DeepSeek Harness/resources/app/dsh/node_modules/@deepseek-ai/dsh-plugin-market-index/lib/index.js'
).href
const { parseMarketIndex } = await import(validator)

const doc = JSON.parse(readFileSync(join(here, 'index.json'), 'utf8'))
const index = parseMarketIndex(doc, 'https://example.github.io/dsh-market/index.json')
console.log('index OK:', JSON.stringify(index.plugins.map((p) => ({
  name: p.name,
  versions: p.versions.map((v) => v.version),
  icon: p.icon,
})), null, 2))

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
console.log('pkg OK:', pkg.name, pkg.version, '| bundle patch =', pkg.dsh.bundle.patch, '| engines.dsh =', pkg.engines.dsh)

for (const loc of ['en', 'zh']) {
  const { meta } = JSON.parse(readFileSync(join(root, 'locale', `${loc}.json`), 'utf8'))
  console.log(`locale ${loc} OK:`, meta.title)
}
