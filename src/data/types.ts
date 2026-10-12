export type Shot = { src: string; caption: string; mobile?: boolean }

export type Kind = 'ia' | 'saas' | 'comunidade'

export type Project = {
  slug: string
  name: string
  tagline: string
  kind: Kind
  org: 'IB System' | 'Projeto próprio'
  role: string
  period: string
  status: string
  problem: string
  solution: string
  ai?: string
  highlights: string[]
  stack: string[]
  metrics?: { value: string; label: string }[]
  shots: Shot[]
  logo?: string
  logoLight?: boolean
  url?: string
  featured?: boolean
}

export const KIND_LABEL: Record<Kind, string> = {
  ia: 'IA e agentes',
  saas: 'Produtos SaaS',
  comunidade: 'Comunidade e lazer',
}
