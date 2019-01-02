/// <reference types="fastify" />

declare function formBodyPlugin(): void
declare namespace formBodyPlugin {
  interface IFormBodyPluginOptions {}
}
export = formBodyPlugin