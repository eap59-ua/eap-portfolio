// The build prerenders "/" and each case study, and marks #root with the route it
// rendered (data-ssr). The client hydrates only when that matches the URL; anything
// else (a host fallback serving that file for another path) renders from scratch.
const norm = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p)

export function isPrerendered(): boolean {
  if (typeof document === 'undefined') return false
  const root = document.getElementById('root')
  const route = root?.dataset.ssr
  return !!route && !!root?.hasChildNodes() && norm(route) === norm(location.pathname)
}
