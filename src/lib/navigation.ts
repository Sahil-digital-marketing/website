export function homeSectionHref(hash: string) {
  return window.location.pathname === '/' ? hash : `/${hash}`
}

export function isCurrentNavPath(href: string) {
  if (!href.startsWith('/')) return false
  const path = window.location.pathname.replace(/\/+$/, '') || '/'
  return path === href || (href === '/services' && path.startsWith('/services/'))
}
