import { useEffect, useRef, useState } from 'react'
import type { EagleScene } from '../features/landing/eagle/create-particle-eagle-scene'

const markUrl = '/brand/sahil-mark.webp'

export function HeroArt() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<EagleScene | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    let cancelled = false
    let scene: EagleScene | undefined
    const syncMotion = (event: Event) => {
      const paused = (event as CustomEvent<{ paused: boolean }>).detail.paused
      sceneRef.current?.setPaused(paused)
      setIsPaused(paused)
    }
    window.addEventListener('sahil-motion-change', syncMotion)

    async function loadScene() {
      try {
        const { createParticleEagleScene } = await import('../features/landing/eagle/create-particle-eagle-scene')
        if (cancelled || !canvasRef.current) return
        scene = await createParticleEagleScene(canvasRef.current, {
          markUrl,
          reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
          onFailure: () => {
            setIsReady(false)
            scene?.dispose()
            sceneRef.current = null
          },
        })
        if (cancelled) return scene.dispose()
        sceneRef.current = scene
        scene.setPaused(document.documentElement.classList.contains('motion-paused'))
        setIsReady(true)
      } catch {
        if (!cancelled) setIsReady(false)
      }
    }
    void loadScene()
    return () => {
      cancelled = true
      window.removeEventListener('sahil-motion-change', syncMotion)
      scene?.dispose()
      sceneRef.current = null
    }
  }, [])

  return (
    <div className="hero-art">
      <div className="eagle-stage" role="img" aria-label="The SAHIL eagle, formed from thousands of points of chrome and blue light">
        {!isReady && <img className="eagle-still" src={markUrl} width="452" height="511" alt="" />}
        <canvas ref={canvasRef} className={isReady ? 'eagle-canvas is-ready' : 'eagle-canvas'} aria-hidden="true" />
      </div>
      {isReady && <span className="visually-hidden">{isPaused ? 'Eagle motion paused' : 'Eagle motion playing'}</span>}
    </div>
  )
}
