export function homeSectionHref(hash: string) {
  return `/${hash}`
}

export function isCurrentNavPath(href: string, pathname = '') {
  if (!href.startsWith('/') || !pathname) return false
  const path = pathname.replace(/\/+$/, '') || '/'
  return path === href || (href === '/services' && path.startsWith('/services/'))
}
