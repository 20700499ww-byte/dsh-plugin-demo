/**
 * dsh-plugin-demo —— 一个最小可用的 DeepSeek Harness (DSH) bundle 示例。
 *
 * 这是一个 Host 侧插件：只需要一个 apply(ctx, config) 导出函数，
 * 不依赖任何第三方包，也不需要构建步骤。
 *
 * 生命周期约定：
 * - 所有注册/监听都放在 apply 内，通过 ctx.effect / ctx.on 完成；
 * - 返回的 cleanup 会在插件卸载时被调用；
 * - 工厂函数本身不产生副作用（不在模块顶层做 IO）。
 */

export const name = 'dsh-plugin-demo'

export function apply(ctx, config = {}) {
  const greeting = config.greeting ?? 'Hello from dsh-plugin-demo'
  const line = `[dsh-plugin-demo] ${greeting}`

  // 有 ctx.logger 时走框架日志，否则退回 console。
  const log = ctx?.logger?.info ? (msg) => ctx.logger.info(msg) : (msg) => console.log(msg)
  log(line)

  // ctx.effect 注册一个带清理函数的资源，卸载时自动回收。
  if (typeof ctx?.effect === 'function') {
    ctx.effect(() => {
      log('[dsh-plugin-demo] disposed')
      return () => {}
    })
  }
}
