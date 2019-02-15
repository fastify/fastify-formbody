import * as http from 'http'
import * as fastify from 'fastify'

declare namespace formBodyPlugin {
  interface FormBodyPluginOptions {
    bodyLimit?: number,
    multipart?: {
      onlyBuffer?: boolean,
      limits?: any
    }
  }
}

declare let formBodyPlugin: fastify.Plugin<
  http.Server,
  http.IncomingMessage,
  http.ServerResponse,
  formBodyPlugin.FormBodyPluginOptions
>

export = formBodyPlugin