// Abre a ficha de um projeto de qualquer lugar da página (menu, links, hash da URL).
const EVENT = 'abrir-projeto'
const PREFIX = '#projeto/'

export function openProject(slug: string) {
  window.dispatchEvent(new CustomEvent<string>(EVENT, { detail: slug }))
}

export function onOpenProject(fn: (slug: string) => void) {
  const handler = (e: Event) => fn((e as CustomEvent<string>).detail)
  window.addEventListener(EVENT, handler)
  return () => window.removeEventListener(EVENT, handler)
}

export function slugFromHash() {
  return window.location.hash.startsWith(PREFIX) ? decodeURIComponent(window.location.hash.slice(PREFIX.length)) : null
}

export function setProjectHash(slug: string | null) {
  const url = slug ? `${PREFIX}${slug}` : window.location.pathname + window.location.search
  if (slug ? window.location.hash !== url : window.location.hash.startsWith(PREFIX)) {
    history.replaceState(null, '', url)
  }
}
