import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

const storedThemeKey = 'sahil-theme'

function preferredTheme(): Theme {
  const stored = window.localStorage.getItem(storedThemeKey)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(preferredTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem(storedThemeKey, theme)
  }, [theme])

  return (
    <main className="grid min-h-dvh place-items-center bg-page px-6 py-16 text-ink transition-colors">
      <section className="w-full max-w-2xl rounded-3xl border border-line bg-surface p-8 shadow-[0_24px_80px_rgba(2,12,71,0.18)] sm:p-12">
        <p className="font-orbitron text-xs font-semibold tracking-[0.2em] text-brand">SAHIL / DIGITAL MARKETING</p>
        <h1 className="mt-5 font-sora text-4xl font-semibold tracking-tight text-ink sm:text-6xl">Cobalt Horizon</h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg">
          React, Vite, Tailwind CSS v4.3, and a paired light/dark design foundation are ready for the new site.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            className="min-h-11 rounded-full bg-brand px-5 font-semibold text-white transition hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            type="button"
          >
            Switch to {theme === 'dark' ? 'light' : 'dark'} mode
          </button>
          <span className="font-orbitron text-xs tracking-[0.14em] text-muted">{theme.toUpperCase()} THEME</span>
        </div>
      </section>
    </main>
  )
}
