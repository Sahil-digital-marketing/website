import { deliver } from './mail'
import type { Bindings, MailMessage } from './bindings'

export default {
  async queue(batch: MessageBatch<MailMessage>, env: Bindings) {
    for (const message of batch.messages) {
      try {
        await deliver(message.body, env)
        message.ack()
      } catch (error) {
        const failure = error as Error & { code?: string, command?: string, responseCode?: number }
        console.error('Mail delivery failed', {
          name: failure.name,
          code: failure.code,
          command: failure.command,
          responseCode: failure.responseCode,
          message: failure.message?.slice(0, 200),
        })
        message.retry()
      }
    }
  },
} satisfies ExportedHandler<Bindings, MailMessage>
