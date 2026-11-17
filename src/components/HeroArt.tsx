import { useEffect, useRef, useState } from 'react'
import type { EagleScene } from '../features/landing/eagle/create-eagle-scene'
import { EagleStill } from './EagleStill'

export function HeroArt() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<EagleScene | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    let cancelled = false
    let scene: EagleScene | undefined

    async function loadScene() {
      try {
        const { createEagleScene } = await import('../features/landing/eagle/create-eagle-scene')
        if (cancelled || !canvasRef.current) return
        scene = createEagleScene(canvasRef.current, () => {
          setIsReady(false)
          scene?.dispose()
          sceneRef.current = null
        })
        sceneRef.current = scene
        setIsReady(true)
      } catch {
        if (!cancelled) setIsReady(false)
      }
    }
    void loadScene()
    return () => {
      cancelled = true
      scene?.dispose()
      sceneRef.current = null
    }
  }, [])

  function toggleMotion() {
    const paused = !isPaused
    sceneRef.current?.setPaused(paused)
    setIsPaused(paused)
  }

  return (
    <div className="hero-art">
      <div className="eagle-halo" aria-hidden="true" />
      <span className="eagle-orbit" aria-hidden="true" />
      <div className="eagle-stage" role="img" aria-label="A sculptural blue eagle spreading its wings">
        {!isReady && <EagleStill />}
        <canvas ref={canvasRef} className={isReady ? 'eagle-canvas is-ready' : 'eagle-canvas'} aria-hidden="true" />
      </div>
      <span className="art-word" aria-hidden="true">RISE</span>
      {isReady && (
        <button className="motion-toggle" type="button" aria-pressed={isPaused} onClick={toggleMotion}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
            {isPaused ? <path d="m3 1 8 5-8 5Z" /> : <path d="M2 1h3v10H2zm5 0h3v10H7z" />}
          </svg>
          {isPaused ? 'Play motion' : 'Pause motion'}
        </button>
      )}
    </div>
  )
}
