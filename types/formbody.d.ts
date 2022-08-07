import { FastifyPluginCallback } from 'fastify'

export interface FormBodyPluginOptions {
  bodyLimit?: number
  parser?: (str: string) => Record<string, unknown>
}

declare const formBodyPlugin: FastifyPluginCallback<FormBodyPluginOptions>;

export default formBodyPlugin
