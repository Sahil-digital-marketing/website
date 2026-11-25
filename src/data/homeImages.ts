export type HomeImage = {
  src: string
  srcSet: string
  width: number
  height: number
  alt: string
}

function photo(name: string, alt: string): HomeImage {
  const base = `/images/home/${name}`
  return {
    src: `${base}-960.webp`,
    srcSet: `${base}-480.webp 480w, ${base}-960.webp 960w, ${base}-1536.webp 1536w`,
    width: 1536,
    height: 1024,
    alt,
  }
}

// Illustrative editorial scenes, not client work or photographs of SAHIL staff.
export const homeImages = {
  social: photo('social-content-planning', 'A smartphone on a handheld gimbal filming a pedestrian beside a textured blue wall'),
  seo: photo('seo-search-research', 'Annotated search research pages and a pencilled topic map beside a laptop'),
  ads: photo('ads-creative-review', 'A cobalt advertising poster on a weathered city wall with a passerby at the edge'),
  content: photo('content-editorial-workspace', 'A hand drafting and revising lines in a worn writing notebook'),
  analytics: photo('analytics-campaign-review', 'A person reviewing projected blue charts beside a whiteboard in a dim workroom'),
  web: photo('website-responsive-design', 'Developer typing on a keyboard below a monitor showing syntax-colored code'),
  discovery: photo('project-discovery-session', 'Workshop participants arranging sticky notes on a whiteboard'),
}
