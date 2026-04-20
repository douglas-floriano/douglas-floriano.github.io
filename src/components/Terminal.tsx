import { motion } from 'framer-motion'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { SectionHeader } from './Section'

type Line = { kind: 'cmd' | 'out' | 'sys' | 'err'; text: string }

const banner: Line[] = [
  { kind: 'sys', text: '╔══════════════════════════════════════════════════════════╗' },
  { kind: 'sys', text: '║   douglas-floriano — senior fullstack terminal v1.0      ║' },
  { kind: 'sys', text: '╚══════════════════════════════════════════════════════════╝' },
  { kind: 'sys', text: '' },
  { kind: 'sys', text: "Digite `help` e aperte Enter para ver os comandos disponíveis." },
  { kind: 'sys', text: '' },
]

const commands: Record<string, () => Line[]> = {
  help: () => [
    { kind: 'out', text: 'Comandos disponíveis:' },
    { kind: 'out', text: '  whoami        quem é o Douglas' },
    { kind: 'out', text: '  stack         tecnologias principais' },
    { kind: 'out', text: '  projects      projetos em destaque' },
    { kind: 'out', text: '  infra         infraestrutura AWS' },
    { kind: 'out', text: '  contact       canais de contato' },
    { kind: 'out', text: '  sudo hire     quando você toma a decisão certa' },
    { kind: 'out', text: '  clear / cls   limpar o terminal' },
    { kind: 'out', text: '  date          data e hora atual' },
    { kind: 'out', text: '  echo <txt>    repetir um texto' },
    { kind: 'out', text: '' },
  ],
  whoami: () => [
    { kind: 'out', text: 'Douglas Floriano Costa' },
    { kind: 'out', text: 'Desenvolvedor Senior FullStack · IBSystem' },
    { kind: 'out', text: 'Itirapuã — SP · Brasil' },
    { kind: 'out', text: '' },
    { kind: 'out', text: 'Projeto e entrego SaaS completos, do banco ao pixel.' },
    { kind: 'out', text: '' },
  ],
  stack: () => [
    { kind: 'out', text: 'backend   → PHP 8.2, Laravel 10, Node.js, TypeScript, Express' },
    { kind: 'out', text: 'frontend  → React 18, Vite, Tailwind, PrimeReact, Three.js' },
    { kind: 'out', text: 'dados     → MariaDB, MySQL, MongoDB, Redis' },
    { kind: 'out', text: 'cloud     → AWS (ECS, RDS, S3, CloudFront), Docker, GitHub Actions' },
    { kind: 'out', text: '' },
  ],
  projects: () => [
    { kind: 'out', text: '1. Lotemobile / WalletLote' },
    { kind: 'out', text: '   SaaS multi-tenant · Laravel + 2 SPAs React · AWS ECS' },
    { kind: 'out', text: '' },
    { kind: 'out', text: '2. CRM WhatsApp' },
    { kind: 'out', text: '   Microserviço Node/TS · whatsapp-web.js + MongoDB · Docker' },
    { kind: 'out', text: '' },
    { kind: 'out', text: '3. SistemaBar' },
    { kind: 'out', text: '   Gestão de bares · multi-tenant · React + Laravel' },
    { kind: 'out', text: '' },
  ],
  infra: () => [
    { kind: 'out', text: 'Região          us-east-1' },
    { kind: 'out', text: 'Compute         ECS (WalletLote cluster, prod + dev)' },
    { kind: 'out', text: 'Containers/task php-fpm · nginx · horizon · scheduler' },
    { kind: 'out', text: 'Banco           RDS MariaDB/MySQL' },
    { kind: 'out', text: 'Frontend        S3 + CloudFront (3 distribuições)' },
    { kind: 'out', text: 'CI/CD           GitHub Actions → ECR → ECS' },
    { kind: 'out', text: '' },
  ],
  contact: () => [
    { kind: 'out', text: 'email       douglas198.floriano@hotmail.com' },
    { kind: 'out', text: 'whatsapp    (16) 99181-6628' },
    { kind: 'out', text: 'linkedin    linkedin.com/in/douglas-costa-b581ab1a1' },
    { kind: 'out', text: 'github      github.com/douglas-floriano' },
    { kind: 'out', text: '' },
  ],
  date: () => [{ kind: 'out', text: new Date().toString() }, { kind: 'out', text: '' }],
  'sudo hire': () => [
    { kind: 'sys', text: '[sudo] autenticando decisão estratégica...' },
    { kind: 'out', text: '✓ decisão aprovada' },
    { kind: 'out', text: '✓ abrindo canal de contato' },
    { kind: 'out', text: '' },
    { kind: 'out', text: 'Me chama no WhatsApp: (16) 99181-6628' },
    { kind: 'out', text: '' },
  ],
}

function runCommand(raw: string): Line[] {
  const input = raw.trim()
  if (!input) return []
  if (input === 'clear' || input === 'cls') return [{ kind: 'sys', text: '__clear__' }]
  if (input.startsWith('echo ')) return [{ kind: 'out', text: input.slice(5) }, { kind: 'out', text: '' }]
  const fn = commands[input.toLowerCase()]
  if (fn) return fn()
  return [
    { kind: 'err', text: `zsh: comando não encontrado: ${input}` },
    { kind: 'out', text: "Digite 'help' para ver o que está disponível." },
    { kind: 'out', text: '' },
  ]
}

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>(banner)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState<number>(-1)
  const [booted, setBooted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [lines])

  useEffect(() => {
    if (booted) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setBooted(true)
            setLines((prev) => [
              ...prev,
              { kind: 'sys', text: '> conectando...' },
              { kind: 'sys', text: '> sessão iniciada em ' + new Date().toLocaleString('pt-BR') },
              { kind: 'sys', text: '' },
            ])
            io.disconnect()
          }
        })
      },
      { threshold: 0.4 },
    )
    const el = scrollRef.current
    if (el) io.observe(el)
    return () => io.disconnect()
  }, [booted])

  const submit = (raw: string) => {
    const result = runCommand(raw)
    if (result.length === 1 && result[0].text === '__clear__') {
      setLines([])
    } else {
      setLines((prev) => [...prev, { kind: 'cmd', text: raw }, ...result])
    }
    setHistory((h) => (raw.trim() ? [raw, ...h].slice(0, 50) : h))
    setHistIdx(-1)
    setInput('')
  }

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submit(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(history.length - 1, histIdx + 1)
      if (next >= 0 && history[next]) {
        setHistIdx(next)
        setInput(history[next])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = histIdx - 1
      if (next >= 0) {
        setHistIdx(next)
        setInput(history[next])
      } else {
        setHistIdx(-1)
        setInput('')
      }
    } else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      setLines([])
    }
  }

  const quickCmd = (cmd: string) => {
    submit(cmd)
    inputRef.current?.focus()
  }

  return (
    <section id="terminal" className="relative py-28 px-6">
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="Shell"
          title={<>Fala com a máquina <span className="gradient-text">do jeito dela</span>.</>}
          description="Um terminal de verdade, no navegador. Digita `help` e vê o que rola. Suporta histórico com ↑↓ e Ctrl+L pra limpar."
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="glow-border rounded-2xl overflow-hidden bg-[#0b0e14] shadow-2xl shadow-black/60"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="flex items-center gap-2 px-4 py-3 bg-[#12151d] border-b border-white/5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            <span className="ml-3 font-mono text-xs text-gray-500">~ douglas@portfolio — zsh</span>
          </div>

          <div
            ref={scrollRef}
            className="p-5 h-[420px] overflow-y-auto font-mono text-[13px] leading-relaxed"
            style={{ scrollbarWidth: 'thin' }}
          >
            {lines.map((l, i) => (
              <div
                key={i}
                className={
                  l.kind === 'cmd'
                    ? 'text-white'
                    : l.kind === 'err'
                    ? 'text-red-400'
                    : l.kind === 'sys'
                    ? 'text-brand-cyan'
                    : 'text-gray-300'
                }
              >
                {l.kind === 'cmd' ? (
                  <>
                    <span className="text-brand-violet">➜</span>{' '}
                    <span className="text-brand-cyan">~</span>{' '}
                    <span className="text-white">{l.text}</span>
                  </>
                ) : (
                  <span className="whitespace-pre">{l.text}</span>
                )}
              </div>
            ))}
            <div className="flex items-center gap-2">
              <span className="text-brand-violet">➜</span>
              <span className="text-brand-cyan">~</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKey}
                autoComplete="off"
                spellCheck={false}
                className="flex-1 bg-transparent outline-none text-white font-mono caret-brand-pink placeholder:text-gray-600"
                placeholder="digite um comando..."
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 px-4 py-3 bg-[#0d1017] border-t border-white/5">
            {['help', 'whoami', 'stack', 'projects', 'infra', 'contact', 'sudo hire', 'clear'].map((c) => (
              <button
                key={c}
                onClick={() => quickCmd(c)}
                className="rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] px-2.5 py-1 text-xs text-gray-300 font-mono transition"
              >
                {c}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
