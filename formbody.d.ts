import { FastifyPlugin } from 'fastify'

export interface FormBodyPluginOptions {
  bodyLimit?: number
}

declare const formBodyPlugin: FastifyPlugin<FormBodyPluginOptions>

export default formBodyPlugin
