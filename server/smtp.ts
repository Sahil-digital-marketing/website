import { connect } from 'cloudflare:sockets'

type Mail = { to: string, subject: string, text: string, html: string }
type Config = { host: string, port: number, user: string, password: string, from: string }

class SmtpConnection {
  private reader: ReadableStreamDefaultReader<Uint8Array>
  private writer: WritableStreamDefaultWriter<Uint8Array>
  private pending = ''
  private decoder = new TextDecoder()

  constructor(private socket: Socket) {
    this.reader = socket.readable.getReader() as ReadableStreamDefaultReader<Uint8Array>
    this.writer = socket.writable.getWriter() as WritableStreamDefaultWriter<Uint8Array>
  }

  async opened() {
    await this.timed(this.socket.opened)
  }

  private async timed<T>(operation: Promise<T>): Promise<T> {
    let timer: ReturnType<typeof setTimeout> | undefined
    try {
      return await Promise.race([
        operation,
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error('SMTP connection timed out')), 10000)
        }),
      ])
    } finally {
      if (timer) clearTimeout(timer)
    }
  }

  private async line() {
    while (true) {
      const end = this.pending.indexOf('\r\n')
      if (end >= 0) {
        const line = this.pending.slice(0, end)
        this.pending = this.pending.slice(end + 2)
        return line
      }
      const result = await this.timed(this.reader.read())
      if (result.done) throw new Error('SMTP connection closed unexpectedly')
      this.pending += this.decoder.decode(result.value, { stream: true })
      if (this.pending.length > 65536) throw new Error('SMTP response is too large')
    }
  }

  async expect(stage: string, accepted: number[]) {
    let code = 0
    while (true) {
      const line = await this.line()
      const match = /^(\d{3})([ -])/.exec(line)
      if (!match) throw new Error(`Invalid SMTP response during ${stage}`)
      code = Number(match[1])
      if (match[2] === ' ') break
    }
    if (!accepted.includes(code)) throw new Error(`SMTP ${stage} rejected (${code})`)
  }

  async command(command: string, stage: string, accepted: number[]) {
    await this.timed(this.writer.write(new TextEncoder().encode(`${command}\r\n`)))
    await this.expect(stage, accepted)
  }

  async startTls(host: string) {
    this.reader.releaseLock()
    this.writer.releaseLock()
    this.socket = this.socket.startTls({ expectedServerHostname: host })
    this.pending = ''
    this.decoder = new TextDecoder()
    this.reader = this.socket.readable.getReader() as ReadableStreamDefaultReader<Uint8Array>
    this.writer = this.socket.writable.getWriter() as WritableStreamDefaultWriter<Uint8Array>
    await this.opened()
  }

  async close() {
    await this.socket.close()
  }
}

function encoded(value: string) {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  for (let offset = 0; offset < bytes.length; offset += 8192) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192))
  }
  return btoa(binary)
}

function subjectHeader(value: string) {
  const parts: string[] = []
  let segment = ''
  for (const char of value) {
    if (new TextEncoder().encode(segment + char).length > 36 && segment) {
      parts.push(`=?UTF-8?B?${encoded(segment)}?=`)
      segment = char
    } else {
      segment += char
    }
  }
  if (segment) parts.push(`=?UTF-8?B?${encoded(segment)}?=`)
  return parts.join('\r\n ')
}

function body(config: Config, mail: Mail) {
  const boundary = `sahil-${crypto.randomUUID()}`
  const lines = [
    `From: ${config.from}`,
    `To: <${mail.to}>`,
    `Subject: ${subjectHeader(mail.subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@sahil-digital-marketing.workers.dev>`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    encoded(mail.text).match(/.{1,76}/g)?.join('\r\n') || '',
    `--${boundary}`,
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    encoded(mail.html).match(/.{1,76}/g)?.join('\r\n') || '',
    `--${boundary}--`,
    '',
  ]
  return lines.join('\r\n')
}

export async function sendSmtp(config: Config, mail: Mail) {
  if (!/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(mail.to)) throw new Error('Invalid mail recipient')
  if (!/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(config.user) || /[\r\n]/.test(config.from)) throw new Error('Invalid SMTP sender')
  const socket = connect({ hostname: config.host, port: config.port }, {
    secureTransport: config.port === 465 ? 'on' : 'starttls',
    allowHalfOpen: false,
  })
  const smtp = new SmtpConnection(socket)
  try {
    await smtp.opened()
    await smtp.expect('greeting', [220])
    await smtp.command('EHLO sahil-digital-marketing.workers.dev', 'EHLO', [250])
    if (config.port === 587) {
      await smtp.command('STARTTLS', 'STARTTLS', [220])
      await smtp.startTls(config.host)
      await smtp.command('EHLO sahil-digital-marketing.workers.dev', 'secure EHLO', [250])
    }
    await smtp.command(`AUTH PLAIN ${btoa(`\0${config.user}\0${config.password}`)}`, 'AUTH', [235])
    await smtp.command(`MAIL FROM:<${config.user}>`, 'sender', [250])
    await smtp.command(`RCPT TO:<${mail.to}>`, 'recipient', [250, 251])
    await smtp.command('DATA', 'DATA', [354])
    await smtp.command(`${body(config, mail)}\r\n.`, 'delivery', [250])
    try { await smtp.command('QUIT', 'QUIT', [221]) } catch { /* Gmail accepted the message. */ }
  } finally {
    await smtp.close().catch(() => {})
  }
}
