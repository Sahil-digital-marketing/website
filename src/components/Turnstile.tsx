import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: Record<string, unknown>) => string
      remove: (id: string) => void
      reset: (id: string) => void
    }
  }
}

export function Turnstile({ onToken, onAvailability, resetKey }: { onToken: (token: string) => void, onAvailability: (available: boolean) => void, resetKey: number }) {
  const element = useRef<HTMLDivElement>(null)
  const widget = useRef<string | null>(null)
  const [siteKey, setSiteKey] = useState('')

  useEffect(() => {
    fetch('/api/public-config').then(response => response.json() as Promise<{ enquiryEnabled?: boolean, turnstileSiteKey?: string }>).then(data => {
      const available = data.enquiryEnabled === true && Boolean(data.turnstileSiteKey)
      setSiteKey(available ? data.turnstileSiteKey! : '')
      onAvailability(available)
    }).catch(() => { setSiteKey(''); onAvailability(false) })
  }, [onAvailability])

  useEffect(() => {
    if (!siteKey || !element.current) return
    let cancelled = false
    function render() {
      if (cancelled || !element.current || !window.turnstile || widget.current) return
      widget.current = window.turnstile.render(element.current, {
        sitekey: siteKey,
        action: 'enquiry',
        callback: onToken,
        'expired-callback': () => onToken(''),
        'error-callback': () => onToken(''),
      })
    }
    if (window.turnstile) render()
    else {
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.onload = render
      document.head.appendChild(script)
    }
    return () => {
      cancelled = true
      if (widget.current && window.turnstile) window.turnstile.remove(widget.current)
      widget.current = null
    }
  }, [siteKey, onToken])

  useEffect(() => {
    if (resetKey && widget.current) window.turnstile?.reset(widget.current)
  }, [resetKey])

  return <div className="turnstile-area"><div ref={element} />{!siteKey && <p>Enquiries are temporarily unavailable. Please try again shortly.</p>}</div>
}
