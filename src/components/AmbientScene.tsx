'use client'

import { useEffect, useRef } from 'react'

type SceneKind = 'orbit' | 'network'

export function AmbientScene({ kind }: { kind: SceneKind }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    const host = canvas.parentElement
    if (!host) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = false
    let frame = 0
    let width = 0
    let height = 0
    let dpr = 1
    let paused = document.documentElement.classList.contains('motion-paused')
    const points = Array.from({ length: kind === 'network' ? 62 : 110 }, (_, index) => ({
      angle: index * 2.39996,
      height: 1 - 2 * (index + 0.5) / (kind === 'network' ? 62 : 110),
      phase: index * 0.73,
    }))

    function resize() {
      const bounds = host!.getBoundingClientRect()
      width = bounds.width
      height = bounds.height
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas!.width = Math.max(1, Math.round(width * dpr))
      canvas!.height = Math.max(1, Math.round(height * dpr))
      context!.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw(0)
    }

    function draw(time: number) {
      if (!context || !width || !height) return
      context.clearRect(0, 0, width, height)
      const radius = Math.min(width * 0.34, height * 0.38, 265)
      const centerX = kind === 'orbit' ? width * 0.72 : width * 0.25
      const centerY = height * 0.52
      const turn = time * 0.00012
      const projected = points.map((point) => {
        const ring = Math.sqrt(1 - point.height * point.height)
        const angle = point.angle + turn
        const depth = Math.sin(angle) * ring
        return {
          x: centerX + Math.cos(angle) * ring * radius,
          y: centerY + point.height * radius,
          alpha: 0.18 + (depth + 1) * 0.32,
          depth,
        }
      })
      if (kind === 'orbit') {
        context.strokeStyle = 'rgba(0, 217, 255, 0.18)'
        context.lineWidth = 1
        for (let ring = 1; ring <= 3; ring++) {
          context.beginPath()
          context.ellipse(centerX, centerY, radius * (0.48 + ring * 0.25), radius * (0.16 + ring * 0.06), -0.3 + turn * 0.25, 0, Math.PI * 2)
          context.stroke()
        }
      } else {
        context.lineWidth = 0.7
        for (let index = 0; index < projected.length; index++) {
          const a = projected[index]
          for (let next = index + 1; next < projected.length; next++) {
            const b = projected[next]
            const distance = Math.hypot(a.x - b.x, a.y - b.y)
            if (distance > radius * 0.44) continue
            context.strokeStyle = `rgba(0, 180, 255, ${0.11 * (1 - distance / (radius * 0.44))})`
            context.beginPath()
            context.moveTo(a.x, a.y)
            context.lineTo(b.x, b.y)
            context.stroke()
          }
        }
      }
      projected.forEach((point) => {
        context.beginPath()
        context.fillStyle = `rgba(0, 217, 255, ${point.alpha})`
        context.arc(point.x, point.y, point.depth > 0 ? 2.1 : 1.25, 0, Math.PI * 2)
        context.fill()
      })
    }

    function tick(time: number) {
      if (visible && !document.hidden && !paused && !media.matches) draw(time)
      frame = requestAnimationFrame(tick)
    }
    function onMotion(event: Event) {
      paused = (event as CustomEvent<{ paused: boolean }>).detail.paused
      if (paused) draw(0)
    }
    const observer = new IntersectionObserver((entries) => { visible = entries[0]?.isIntersecting ?? false })
    const resizeObserver = new ResizeObserver(resize)
    observer.observe(host)
    resizeObserver.observe(host)
    window.addEventListener('sahil-motion-change', onMotion)
    resize()
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('sahil-motion-change', onMotion)
    }
  }, [kind])

  return <canvas className={`ambient-scene ambient-scene--${kind}`} ref={canvasRef} aria-hidden="true" />
}
