import { createEagleGeometry } from './eagle-geometry'

export type EagleScene = {
  setPaused: (paused: boolean) => void
  dispose: () => void
}

const vertexShader = `#version 300 es
in vec3 aPosition;
in vec3 aNormal;
uniform mat4 uProjection;
uniform mat4 uModel;
out vec3 vNormal;
out vec3 vPosition;
void main() {
  vec4 position = uModel * vec4(aPosition, 1.0);
  vPosition = position.xyz;
  vNormal = mat3(uModel) * aNormal;
  gl_Position = uProjection * position;
}`

const fragmentShader = `#version 300 es
precision highp float;
in vec3 vNormal;
in vec3 vPosition;
uniform vec3 uColor;
out vec4 outColor;
void main() {
  vec3 normal = normalize(vNormal) * (gl_FrontFacing ? 1.0 : -1.0);
  vec3 light = normalize(vec3(-2.0, 4.0, 5.0));
  vec3 viewDirection = normalize(vec3(0.0, 0.0, 9.0) - vPosition);
  float diffuse = max(dot(normal, light), 0.0);
  float rim = pow(1.0 - max(dot(normal, viewDirection), 0.0), 3.0);
  float specular = pow(max(dot(normal, normalize(light + viewDirection)), 0.0), 48.0);
  vec3 color = uColor * (0.36 + diffuse * 0.85) + vec3(0.65, 0.8, 1.0) * (specular * 0.7 + rim * 0.24);
  outColor = vec4(color, 1.0);
}`

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('Unable to allocate eagle shader')
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    throw new Error('Unable to compile eagle shader')
  }
  return shader
}

export function createEagleScene(canvas: HTMLCanvasElement, onFailure: () => void): EagleScene {
  const gl = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' })
  if (!gl) throw new Error('WebGL2 unavailable')
  const program = gl.createProgram()
  if (!program) throw new Error('Unable to allocate eagle program')
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexShader)
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader)
  gl.attachShader(program, vertex)
  gl.attachShader(program, fragment)
  gl.linkProgram(program)
  gl.deleteShader(vertex)
  gl.deleteShader(fragment)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program)
    throw new Error('Unable to link eagle program')
  }

  const position = gl.getAttribLocation(program, 'aPosition')
  const normal = gl.getAttribLocation(program, 'aNormal')
  const projectionLocation = gl.getUniformLocation(program, 'uProjection')
  const modelLocation = gl.getUniformLocation(program, 'uModel')
  const colorLocation = gl.getUniformLocation(program, 'uColor')
  const parts = createEagleGeometry().map((part) => {
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, part.vertices, gl.STATIC_DRAW)
    return { ...part, buffer, count: part.vertices.length / 6 }
  })

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
  const pointerPreference = window.matchMedia('(hover: hover) and (pointer: fine)')
  const pointer = { x: 0, y: 0 }
  let paused = false
  let visible = true
  let disposed = false
  let frame = 0
  let elapsed = motionPreference.matches ? 3 : 0
  let lastTime = 0

  gl.enable(gl.DEPTH_TEST)
  gl.clearColor(0, 0, 0, 0)

  function draw() {
    gl!.viewport(0, 0, canvas.width, canvas.height)
    gl!.clear(gl!.COLOR_BUFFER_BIT | gl!.DEPTH_BUFFER_BIT)
    gl!.useProgram(program)
    const aspect = canvas.width / canvas.height
    const focalLength = 1 / Math.tan(32 * Math.PI / 360)
    const near = 0.1
    const far = 30
    const projection = new DOMMatrix([
      focalLength / aspect, 0, 0, 0,
      0, focalLength, 0, 0,
      0, 0, (far + near) / (near - far), -1,
      0, 0, 2 * far * near / (near - far), 0,
    ])
    const motion = !motionPreference.matches
    const entrance = motion ? Math.max(0, 1 - elapsed / 2.4) : 0
    const bob = motion ? Math.sin(elapsed * 0.8) * 0.045 : 0
    const distance = Math.max(9.5, 3.3 / (Math.tan(32 * Math.PI / 360) * aspect))
    const model = new DOMMatrix()
      .translate(0, -0.05 + bob - entrance * 0.35, -distance - entrance * 1.4)
      .rotate(-9 + pointer.y * 5, -13 + pointer.x * 9, -8 + (motion ? Math.sin(elapsed * 0.45) * 2 : 0))
    gl!.uniformMatrix4fv(projectionLocation, false, projection.toFloat32Array())

    const wingAngle = motion ? Math.sin(elapsed * 1.2) * 4 : 0
    const models = {
      '-1': model.rotate(0, -wingAngle, 0).toFloat32Array(),
      '0': model.toFloat32Array(),
      '1': model.rotate(0, wingAngle, 0).toFloat32Array(),
    }
    for (const part of parts) {
      gl!.uniformMatrix4fv(modelLocation, false, models[part.wing])
      gl!.uniform3fv(colorLocation, part.color)
      gl!.bindBuffer(gl!.ARRAY_BUFFER, part.buffer)
      gl!.enableVertexAttribArray(position)
      gl!.enableVertexAttribArray(normal)
      gl!.vertexAttribPointer(position, 3, gl!.FLOAT, false, 24, 0)
      gl!.vertexAttribPointer(normal, 3, gl!.FLOAT, false, 24, 12)
      gl!.drawArrays(gl!.TRIANGLES, 0, part.count)
    }
  }

  function animate(time: number) {
    frame = 0
    if (disposed) return
    if (lastTime) elapsed += Math.min((time - lastTime) / 1000, 0.05)
    lastTime = time
    draw()
    if (!paused && visible && !document.hidden && !motionPreference.matches) frame = requestAnimationFrame(animate)
  }

  function syncAnimation() {
    cancelAnimationFrame(frame)
    frame = 0
    lastTime = 0
    if (disposed || !visible || document.hidden) return
    draw()
    if (!paused && !motionPreference.matches) frame = requestAnimationFrame(animate)
  }

  function resize() {
    const bounds = canvas.getBoundingClientRect()
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
    canvas.width = Math.max(1, Math.round(bounds.width * ratio))
    canvas.height = Math.max(1, Math.round(bounds.height * ratio))
    syncAnimation()
  }

  function move(event: PointerEvent) {
    if (!pointerPreference.matches || paused || motionPreference.matches) return
    const bounds = canvas.getBoundingClientRect()
    pointer.x += ((event.clientX - bounds.left) / bounds.width * 2 - 1 - pointer.x) * 0.18
    pointer.y += ((event.clientY - bounds.top) / bounds.height * 2 - 1 - pointer.y) * 0.18
  }

  function resetPointer() {
    pointer.x = 0
    pointer.y = 0
  }

  function contextLost(event: Event) {
    event.preventDefault()
    cancelAnimationFrame(frame)
    onFailure()
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    syncAnimation()
  })
  intersectionObserver.observe(canvas)
  canvas.addEventListener('pointermove', move)
  canvas.addEventListener('pointerleave', resetPointer)
  canvas.addEventListener('webglcontextlost', contextLost)
  document.addEventListener('visibilitychange', syncAnimation)
  motionPreference.addEventListener('change', syncAnimation)
  resize()

  return {
    setPaused(value) {
      paused = value
      syncAnimation()
    },
    dispose() {
      if (disposed) return
      disposed = true
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerleave', resetPointer)
      canvas.removeEventListener('webglcontextlost', contextLost)
      document.removeEventListener('visibilitychange', syncAnimation)
      motionPreference.removeEventListener('change', syncAnimation)
      parts.forEach((part) => gl.deleteBuffer(part.buffer))
      gl.deleteProgram(program)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    },
  }
}
