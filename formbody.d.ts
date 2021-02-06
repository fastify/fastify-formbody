import { FastifyPlugin } from 'fastify'

export interface FormBodyPluginOptions {
  bodyLimit?: number
  parser?: (str: string) => string
}

declare const formBodyPlugin: FastifyPlugin<FormBodyPluginOptions>

export default formBodyPlugin
