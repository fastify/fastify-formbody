import { FastifyPluginCallback } from 'fastify'

type FastifyFormbody = FastifyPluginCallback<fastifyFormbody.FastifyFormbodyOptions>

declare namespace fastifyFormbody {
  export interface FastifyFormbodyOptions {
    bodyLimit?: number
    parser?: (str: string) => Record<string, unknown>
  }

  /**
   * @deprecated Use FastifyFormbodyOptions instead
   */
  export type FormBodyPluginOptions = FastifyFormbodyOptions

  export const fastifyFormbody: FastifyFormbody
  export { fastifyFormbody as default }
}

declare function fastifyFormbody (...params: Parameters<FastifyFormbody>): ReturnType<FastifyFormbody>
export = fastifyFormbody
