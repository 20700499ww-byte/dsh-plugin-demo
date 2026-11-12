// 校验已下载到本地的线上索引（用官方校验器）
import { readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

const INDEX_URL = 'https://20700499ww-byte.github.io/dsh-plugin-demo/market/index.json'
const VALIDATOR =
  'C:/Users/20700/AppData/Local/Programs/DeepSeek Harness/resources/app/dsh/node_modules/@deepseek-ai/dsh-plugin-market-index/lib/index.js'

const { parseMarketIndex } = await import(pathToFileURL(VALIDATOR).href)

const file = process.argv[2]
const doc = JSON.parse(readFileSync(file, 'utf8'))
const idx = parseMarketIndex(doc, INDEX_URL)

console.log('官方校验器: OK')
console.log('  title   =', JSON.stringify(idx.title))
console.log('  plugin  =', idx.plugins[0].name)
console.log('  icon    =', idx.plugins[0].icon)
console.log('  version =', idx.plugins[0].versions.map((v) => v.version).join(', '))
console.log('  source  =', JSON.stringify(idx.plugins[0].versions[0].source))
console.log('  engines =', JSON.stringify(idx.plugins[0].versions[0].engines))
