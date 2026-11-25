import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { pageMetadata } from './src/data/pageMetadata'

export default defineConfig({
  plugins: [react(), tailwindcss(), {
    name: 'service-page-metadata',
    enforce: 'post',
    generateBundle(_, bundle) {
      const entry = bundle['index.html']
      if (!entry || entry.type !== 'asset') return
      const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
      for (const [route, metadata] of Object.entries(pageMetadata)) {
        if (route === '/') continue
        const source = String(entry.source)
          .replace(/<title>.*?<\/title>/, `<title>${escape(metadata.title)}</title>`)
          .replace(/(<meta (?:name|property)="(?:og:title|twitter:title)" content=")[^"]*/g, `$1${escape(metadata.title)}`)
          .replace(/(<meta (?:name|property)="(?:description|og:description|twitter:description)" content=")[^"]*/g, `$1${escape(metadata.description)}`)
        this.emitFile({ type: 'asset', fileName: `${route.slice(1)}/index.html`, source })
      }
    },
  }],
})
