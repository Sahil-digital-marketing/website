export type EaglePart = {
  vertices: Float32Array
  color: readonly [number, number, number]
  wing: -1 | 0 | 1
}

type Point = readonly [number, number, number]
type OutlinePoint = readonly [number, number]

function triangle(output: number[], a: Point, b: Point, c: Point) {
  const ab = b.map((value, index) => value - a[index])
  const ac = c.map((value, index) => value - a[index])
  const normal = [
    ab[1] * ac[2] - ab[2] * ac[1],
    ab[2] * ac[0] - ab[0] * ac[2],
    ab[0] * ac[1] - ab[1] * ac[0],
  ]
  const length = Math.hypot(...normal) || 1
  for (const point of [a, b, c]) output.push(...point, ...normal.map((value) => value / length))
}

// Convex feather outlines have a raised face and bevelled edges, catching light as the wings move.
function feather(outline: OutlinePoint[], depth: number, offset: number) {
  const output: number[] = []
  const center = outline.reduce((sum, point) => [sum[0] + point[0] / outline.length, sum[1] + point[1] / outline.length], [0, 0])
  const inner: Point[] = outline.map(([x, y]) => [center[0] + (x - center[0]) * 0.88, center[1] + (y - center[1]) * 0.88, depth + offset])
  const outer: Point[] = outline.map(([x, y]) => [x, y, offset])
  const front: Point = [center[0], center[1], depth + offset + 0.035]
  const back: Point = [center[0], center[1], offset - 0.04]

  for (let index = 0; index < outline.length; index++) {
    const next = (index + 1) % outline.length
    triangle(output, front, inner[index], inner[next])
    triangle(output, inner[index], outer[index], outer[next])
    triangle(output, inner[index], outer[next], inner[next])
    triangle(output, back, outer[next], outer[index])
  }
  return new Float32Array(output)
}

function plume(start: OutlinePoint, end: OutlinePoint, width: number, depth: number, offset: number) {
  const dx = end[0] - start[0]
  const dy = end[1] - start[1]
  const length = Math.hypot(dx, dy)
  const perpendicular = [-dy / length, dx / length]
  const outline: OutlinePoint[] = [[0, 0.2], [0.3, 0.5], [0.72, 0.35], [1, 0], [0.72, -0.35], [0.3, -0.5]]
    .map(([distance, breadth]) => [
      start[0] + dx * distance + perpendicular[0] * breadth * width,
      start[1] + dy * distance + perpendicular[1] * breadth * width,
    ])
  return feather(outline, depth, offset)
}

function ellipsoid(center: Point, radius: Point) {
  const vertices: number[] = []
  const rings = 14
  const segments = 20
  const point = (latitude: number, longitude: number): Point => [
    center[0] + radius[0] * Math.sin(latitude) * Math.cos(longitude),
    center[1] + radius[1] * Math.cos(latitude),
    center[2] + radius[2] * Math.sin(latitude) * Math.sin(longitude),
  ]
  for (let row = 0; row < rings; row++) {
    for (let column = 0; column < segments; column++) {
      const top = row * Math.PI / rings
      const bottom = (row + 1) * Math.PI / rings
      const left = column * Math.PI * 2 / segments
      const right = (column + 1) * Math.PI * 2 / segments
      triangle(vertices, point(top, left), point(bottom, left), point(bottom, right))
      triangle(vertices, point(top, left), point(bottom, right), point(top, right))
    }
  }
  return new Float32Array(vertices)
}

export function createEagleGeometry(): EaglePart[] {
  const parts: EaglePart[] = []
  const blue = [0.12, 0.35, 0.67] as const
  const silverBlue = [0.43, 0.64, 0.87] as const
  const paleBlue = [0.74, 0.84, 0.96] as const

  for (const side of [-1, 1] as const) {
    const mirror = (outline: OutlinePoint[]) => outline.map(([x, y]): OutlinePoint => [x * side, y])
    parts.push({
      vertices: feather(mirror([[0.15, 0.1], [0.52, 0.76], [1.88, 1.07], [2.35, 0.85], [1.28, 0], [0.42, -0.22]]), 0.12, -0.04),
      color: blue,
      wing: side,
    })
    const tips: OutlinePoint[] = [[2.9, 1.95], [3.02, 1.56], [2.96, 1.15], [2.78, 0.74], [2.52, 0.38], [2.21, 0.04]]
    tips.forEach((tip, index) => parts.push({
      vertices: plume([side * (0.63 + index * 0.12), 0.51 - index * 0.04], [side * tip[0], tip[1]], 0.5 - index * 0.015, 0.09, index * 0.016),
      color: index % 2 ? silverBlue : blue,
      wing: side,
    }))
    for (let index = 0; index < 5; index++) {
      parts.push({
        vertices: plume([side * 0.25, 0.38], [side * (1.8 - index * 0.24), 0.36 - index * 0.15], 0.3, 0.075, 0.19 + index * 0.025),
        color: silverBlue,
        wing: side,
      })
    }
    for (let index = 0; index < 2; index++) {
      parts.push({
        vertices: plume([side * 0.05, -0.5], [side * (0.22 + index * 0.16), -1.6 + index * 0.08], 0.25, 0.06, -0.03),
        color: silverBlue,
        wing: 0,
      })
    }
  }
  parts.push({ vertices: ellipsoid([0, -0.12, 0.2], [0.32, 0.78, 0.32]), color: blue, wing: 0 })
  parts.push({ vertices: ellipsoid([0.035, 0.69, 0.3], [0.25, 0.33, 0.27]), color: paleBlue, wing: 0 })
  parts.push({ vertices: feather([[0.13, 0.87], [0.52, 0.7], [0.43, 0.47], [0.34, 0.63], [0.13, 0.63]], 0.08, 0.43), color: silverBlue, wing: 0 })
  parts.push({ vertices: ellipsoid([0.16, 0.81, 0.532], [0.035, 0.025, 0.018]), color: [0.003, 0.02, 0.08], wing: 0 })
  return parts
}
