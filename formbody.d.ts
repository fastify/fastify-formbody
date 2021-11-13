import { FastifyPlugin } from 'fastify'

export interface FormBodyPluginOptions {
  bodyLimit?: number
  parser?: (str: string) => Record<string, unknown>
}

declare const formBodyPlugin: FastifyPlugin<FormBodyPluginOptions>

export default formBodyPlugin
