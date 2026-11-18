export type EagleScene = {
  setPaused: (paused: boolean) => void
  dispose: () => void
}

type SceneOptions = {
  markUrl: string
  reducedMotion: boolean
  onFailure: () => void
}

const vertexShader = `#version 300 es
in vec3 aStart;
in vec3 aTarget;
in vec3 aColor;
in float aSeed;
uniform float uTime;
uniform float uIntro;
uniform float uScatter;
uniform vec2 uPointer;
uniform float uTilt;
uniform vec2 uOffset;
uniform float uScale;
uniform float uAspect;
uniform float uPointSize;
out vec3 vColor;
out float vAlpha;

vec3 rotateY(vec3 p, float a) {
  float c = cos(a), s = sin(a);
  return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z);
}

void main() {
  float delay = aSeed * 0.35;
  float t = clamp((uIntro - delay) / (1.0 - delay * 0.6), 0.0, 1.0);
  float settle = 1.0 - pow(1.0 - t, 4.0);
  vec3 p = mix(aStart, aTarget, settle);

  // Breathing shimmer once settled
  p += vec3(sin(uTime * 0.9 + aSeed * 40.0), cos(uTime * 0.7 + aSeed * 31.0), sin(uTime * 0.5 + aSeed * 17.0)) * 0.006 * settle;

  // Feathers lift and drift as the hero scrolls away
  vec3 drift = vec3(sin(aSeed * 91.0) * 0.9, 0.6 + aSeed * 1.4, cos(aSeed * 57.0) * 0.8);
  p += drift * uScatter * (0.4 + aSeed);

  p = rotateY(p, sin(uTime * 0.25) * 0.18 + uTilt * 0.22);

  vec2 screen = p.xy * uScale + uOffset;
  screen.x /= uAspect;

  // Particles part around the pointer
  vec2 away = screen - uPointer;
  float reach = 0.16;
  float d = length(away * vec2(uAspect, 1.0));
  screen += normalize(away + 1e-5) * smoothstep(reach, 0.0, d) * 0.07 * settle;

  float depth = 1.0 / (1.6 - p.z);
  gl_Position = vec4(screen * depth * 1.6, 0.0, 1.0);
  gl_PointSize = uPointSize * depth * (0.7 + aSeed * 0.6);
  vColor = aColor;
  vAlpha = (0.35 + 0.65 * settle) * (1.0 - uScatter * 0.85);
}`

const fragmentShader = `#version 300 es
precision mediump float;
in vec3 vColor;
in float vAlpha;
out vec4 outColor;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r = dot(c, c);
  if (r > 0.25) discard;
  float glow = smoothstep(0.25, 0.0, r);
  outColor = vec4(vColor * (0.75 + glow * 0.9), glow * vAlpha);
}`

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('Unable to allocate shader')
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? 'Shader failed')
  return shader
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.decoding = 'async'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Mark failed to load'))
    image.src = url
  })
}

/* Samples the logo mark's opaque pixels into particle targets that keep the
   mark's own chrome and blue colours. */
function sampleMark(image: HTMLImageElement, count: number) {
  const width = 260
  const height = Math.round(width * (image.naturalHeight / image.naturalWidth))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('2D canvas unavailable')
  context.drawImage(image, 0, 0, width, height)
  const pixels = context.getImageData(0, 0, width, height).data

  const candidates: number[] = []
  for (let i = 0; i < width * height; i++) if (pixels[i * 4 + 3] > 150) candidates.push(i)

  const start = new Float32Array(count * 3)
  const target = new Float32Array(count * 3)
  const color = new Float32Array(count * 3)
  const seed = new Float32Array(count)
  const span = Math.max(width, height)

  for (let i = 0; i < count; i++) {
    const pixel = candidates[Math.floor(Math.random() * candidates.length)]
    const x = pixel % width
    const y = Math.floor(pixel / width)
    target[i * 3] = (x - width / 2 + Math.random() - 0.5) / span * 2
    target[i * 3 + 1] = -(y - height / 2 + Math.random() - 0.5) / span * 2
    target[i * 3 + 2] = (Math.random() - 0.5) * 0.12

    const angle = Math.random() * Math.PI * 2
    const radius = 1.4 + Math.random() * 1.6
    start[i * 3] = Math.cos(angle) * radius
    start[i * 3 + 1] = Math.sin(angle) * radius * 0.7
    start[i * 3 + 2] = (Math.random() - 0.5) * 1.2

    const lift = 1.4
    color[i * 3] = Math.min(1, pixels[pixel * 4] / 255 * lift)
    color[i * 3 + 1] = Math.min(1, pixels[pixel * 4 + 1] / 255 * lift)
    color[i * 3 + 2] = Math.min(1, pixels[pixel * 4 + 2] / 255 * lift)
    seed[i] = Math.random()
  }
  return { start, target, color, seed }
}

export async function createParticleEagleScene(canvas: HTMLCanvasElement, options: SceneOptions): Promise<EagleScene> {
  const gl = canvas.getContext('webgl2', { alpha: true, antialias: false, premultipliedAlpha: false, powerPreference: 'high-performance' })
  if (!gl) throw new Error('WebGL2 unavailable')

  const image = await loadImage(options.markUrl)
  const isSmall = window.matchMedia('(max-width: 760px)').matches
  const count = isSmall ? 7000 : 15000
  const data = sampleMark(image, count)

  const program = gl.createProgram()
  if (!program) throw new Error('Unable to allocate program')
  const vertex = compile(gl, gl.VERTEX_SHADER, vertexShader)
  const fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentShader)
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Program failed to link')
  gl.useProgram(program)

  const vao = gl.createVertexArray()
  gl.bindVertexArray(vao)
  const buffers = ([['aStart', data.start, 3], ['aTarget', data.target, 3], ['aColor', data.color, 3], ['aSeed', data.seed, 1]] as const).map(([name, values, size]) => {
    const buffer = gl.createBuffer()
    const location = gl.getAttribLocation(program, name)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, values, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(location)
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0)
    return buffer
  })

  const uniform = (name: string) => gl.getUniformLocation(program, name)
  const u = {
    time: uniform('uTime'), tilt: uniform('uTilt'), intro: uniform('uIntro'), scatter: uniform('uScatter'), pointer: uniform('uPointer'),
    offset: uniform('uOffset'), scale: uniform('uScale'), aspect: uniform('uAspect'), pointSize: uniform('uPointSize'),
  }

  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
  gl.clearColor(0, 0, 0, 0)

  const pointer = { x: 10, y: 10, tx: 10, ty: 10, tilt: 0 }
  let frame = 0
  let paused = options.reducedMotion
  let visible = true
  let disposed = false
  let startTime = performance.now()
  let dpr = 1

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.75)
    const { clientWidth, clientHeight } = canvas
    canvas.width = Math.max(1, Math.round(clientWidth * dpr))
    canvas.height = Math.max(1, Math.round(clientHeight * dpr))
    gl!.viewport(0, 0, canvas.width, canvas.height)
  }

  function draw(now: number) {
    const width = canvas.clientWidth
    const height = canvas.clientHeight
    const aspect = width / Math.max(1, height)
    const wide = aspect > 1.05
    const elapsed = (now - startTime) / 1000
    const intro = options.reducedMotion ? 1 : Math.min(1, elapsed / 2.6)
    const scatter = options.reducedMotion ? 0 : Math.min(1, Math.max(0, window.scrollY / (height * 0.9)))

    pointer.x += (pointer.tx - pointer.x) * 0.12
    pointer.y += (pointer.ty - pointer.y) * 0.12
    pointer.tilt += ((Math.abs(pointer.tx) <= 1 ? pointer.tx : 0) - pointer.tilt) * 0.05

    gl!.clear(gl!.COLOR_BUFFER_BIT)
    gl!.uniform1f(u.time, options.reducedMotion ? 0 : elapsed)
    gl!.uniform1f(u.intro, intro)
    gl!.uniform1f(u.scatter, scatter)
    gl!.uniform2f(u.pointer, pointer.x, pointer.y)
    gl!.uniform1f(u.tilt, pointer.tilt)
    gl!.uniform2f(u.offset, wide ? 0.33 * aspect : 0, wide ? 0.12 : 0.36)
    gl!.uniform1f(u.scale, wide ? 0.66 : 0.56 * Math.max(aspect, 0.6))
    gl!.uniform1f(u.aspect, aspect)
    gl!.uniform1f(u.pointSize, (wide ? 3.4 : 2.8) * dpr)
    gl!.drawArrays(gl!.POINTS, 0, count)
  }

  function loop(now: number) {
    frame = 0
    if (disposed || paused || !visible || document.hidden) return
    draw(now)
    frame = requestAnimationFrame(loop)
  }

  function schedule() {
    if (!frame && !paused && visible && !document.hidden && !disposed) frame = requestAnimationFrame(loop)
  }

  function onPointerMove(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect()
    pointer.tx = ((event.clientX - rect.left) / rect.width) * 2 - 1
    pointer.ty = -(((event.clientY - rect.top) / rect.height) * 2 - 1)
  }

  function onPointerLeave() {
    pointer.tx = 10
    pointer.ty = 10
  }

  function onContextLost(event: Event) {
    event.preventDefault()
    options.onFailure()
  }

  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    schedule()
  })
  const resizeObserver = new ResizeObserver(() => {
    resize()
    draw(performance.now())
  })

  resize()
  observer.observe(canvas)
  resizeObserver.observe(canvas)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', onPointerLeave)
  document.addEventListener('visibilitychange', schedule)
  canvas.addEventListener('webglcontextlost', onContextLost)
  draw(performance.now())
  schedule()

  return {
    setPaused(next) {
      if (options.reducedMotion) return
      paused = next
      if (!next) startTime = performance.now() - 2600
      schedule()
    },
    dispose() {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('visibilitychange', schedule)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      buffers.forEach((buffer) => gl.deleteBuffer(buffer))
      gl.deleteVertexArray(vao)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
    },
  }
}
