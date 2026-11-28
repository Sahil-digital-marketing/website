export type HomeImage = {
  src: string
  srcSet: string
  width: number
  height: number
  alt: string
}

function photo(name: string, alt: string, directory = 'home'): HomeImage {
  const base = `/images/${directory}/${name}`
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
  hero: photo('studio-hero', 'A creative team reviewing visual concepts together in a blue-lit studio'),
  social: photo('social-content-planning', 'A smartphone on a handheld gimbal filming a pedestrian beside a textured blue wall'),
  seo: photo('seo-search-research', 'Annotated search research pages and a pencilled topic map beside a laptop'),
  ads: photo('ads-creative-review', 'A cobalt advertising poster on a weathered city wall with a passerby at the edge'),
  content: photo('content-editorial-workspace', 'A hand drafting and revising lines in a worn writing notebook'),
  analytics: photo('analytics-campaign-review', 'A person reviewing projected blue charts beside a whiteboard in a dim workroom'),
  web: photo('website-responsive-design', 'Developer typing on a keyboard below a monitor showing syntax-colored code'),
  discovery: photo('project-discovery-session', 'Workshop participants arranging sticky notes on a whiteboard'),
}

// Illustrative generated scenes. These do not depict clients or SAHIL staff.
export const pageImages = {
  servicesHero: photo('services-overview', 'A small business team reviewing product photography and a website in a blue-lit studio', 'pages'),
  servicesWeb: photo('services-web', 'A designer checking a responsive website on a phone beside desktop layouts and paper wireframes', 'pages'),
  servicesGrowth: photo('services-growth', 'A studio team photographing a handmade product for digital content', 'pages'),
  aboutHero: photo('about-hero', 'Hands arranging color studies, photographic selects and sketches around a studio table', 'pages'),
  aboutStory: photo('about-story', 'A business owner and a strategist discussing ideas across a studio table', 'pages'),
  webDetail: photo('web-detail', 'Two web designers reviewing a responsive website on a tablet and desktop', 'pages'),
  growthDetail: photo('growth-detail', 'Two content planners reviewing photographic selects and notes at a studio table', 'pages'),
}
