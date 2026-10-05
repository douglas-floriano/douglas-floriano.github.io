import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { scrollToId } from '../lib/smooth'

/*
  Trajetória como viagem de carro.

  A seção trava na tela e a rolagem vira estrada: o carro anda da esquerda
  pra direita por um terreno ondulado, passando por uma placa por ano. O
  hodômetro no canto conta os anos em vez de quilômetros. A última placa não
  é passado, é "próxima parada": o projeto de quem está lendo.

  O carro fica parado na tela (30% da largura); quem anda é o mundo. Altura e
  inclinação do carro saem da mesma função do terreno, então ele sempre pisa
  no asfalto. Com movimento reduzido, a seção volta a ser a lista vertical.
*/

type Entry = { year: number; when: string; title: string; org: string; body: string }

// Em ordem de estrada: do começo até hoje.
const ENTRIES: Entry[] = [
  {
    year: 2017,
    when: '2017 a 2019',
    title: 'Formação em desenvolvimento de sistemas',
    org: 'Curso técnico',
    body: 'Lógica, banco de dados, redes e orientação a objetos. Onde a curiosidade virou profissão.',
  },
  {
    year: 2018,
    when: '2018 a 2020',
    title: 'Primeiros sistemas em produção',
    org: 'Início de carreira',
    body: 'PHP, jQuery e SQL no dia a dia. Aprendi cedo que o código só conta quando alguém usa na manhã seguinte.',
  },
  {
    year: 2020,
    when: '2020 a 2022',
    title: 'Desenvolvedor fullstack',
    org: 'Projetos sob medida',
    body: 'Plataformas para academias, eventos e comércio. Foi quando saí do "funciona na minha máquina" e passei a cuidar de servidor, banco em nuvem e cliente ligando no sábado.',
  },
  {
    year: 2022,
    when: '2022 até hoje',
    title: 'Desenvolvedor sênior fullstack',
    org: 'IB System',
    body: 'Sustento e evoluo os produtos da empresa: Lotemobile, IB Ticket, HRT Invest, Token, IB3 Capital e IB Core. Banco, API, frontend, apps, infraestrutura na AWS e deploy automatizado. Também cuido das integrações de pagamento e de WhatsApp.',
  },
  {
    year: 2025,
    when: '2025 até hoje',
    title: 'IA aplicada dentro dos produtos',
    org: 'IB System e projetos próprios',
    body: 'Levei agentes para o centro do trabalho: agentes especialistas no LoteIA, um servidor MCP que abre o Lotemobile para assistentes de IA, um sistema que transforma pedidos do WhatsApp em correções revisadas e uma central onde o Claude de cada dev abre pedidos para os outros.',
  },
]

const NOW = new Date().getFullYear()
const STOPS = ENTRIES.length + 1 // + "próxima parada"

/* ---------------- terreno ---------------- */

const ROAD_H = 200 // altura da faixa do mundo
const BASE = 118 // linha média do asfalto dentro da faixa
const SKY_H = 230 // cidade ao fundo

const groundY = (x: number) => BASE + Math.sin(x / 260) * 20 + Math.sin(x / 97 + 1.3) * 6
const groundSlope = (x: number) => Math.cos(x / 260) * (20 / 260) + Math.cos(x / 97 + 1.3) * (6 / 97)

function useViewport() {
  const [vw, setVw] = useState(() => (typeof window === 'undefined' ? 1280 : window.innerWidth))
  useEffect(() => {
    const on = () => setVw(window.innerWidth)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return vw
}

/* ---------------- carro (visto de lado, de frente pra direita) ---------------- */

function Wheel({ x, spin }: { x: number; spin: MotionValue<number> }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <circle r="11" fill="#05070F" />
      <motion.g style={{ rotate: spin }}>
        <circle r="6.5" fill="#2C355E" />
        <path d="M -6 0 H 6 M 0 -6 V 6" stroke="#8187A8" strokeWidth="1.6" strokeLinecap="round" />
      </motion.g>
      <circle r="2" fill="#ECEAF5" />
    </g>
  )
}

function Car({ spin }: { spin: MotionValue<number> }) {
  // origem: ponto de contato no chão, no meio do carro
  return (
    <g transform="translate(0 -11)">
      <path d="M 50 -22 L 220 -64 L 220 18 Z" fill="url(#journey-beam)" />
      <ellipse cx="0" cy="11" rx="50" ry="3.5" fill="rgba(0,0,0,.45)" />
      {/* carroceria */}
      <path
        d="M -50 -12 Q -51 -26 -38 -28 L -26 -29 Q -16 -44 2 -45 L 16 -45 Q 30 -44 38 -30 L 46 -27 Q 54 -25 53 -14 L 52 -9 Q 52 -6 48 -6 L -48 -6 Q -51 -6 -50 -12 Z"
        fill="#7C9CFF"
      />
      <path d="M -50 -14 L 53 -14" stroke="#5A78E0" strokeWidth="1.2" />
      {/* vidros */}
      <path d="M -21 -30 Q -13 -41 0 -41 L 5 -41 L 5 -30 Z" fill="#0A0F1E" opacity=".85" />
      <path d="M 9 -41 L 15 -41 Q 26 -40 32 -30 L 9 -30 Z" fill="#0A0F1E" opacity=".85" />
      <path d="M -17 -32 Q -11 -39 -3 -39" stroke="#ECEAF5" strokeOpacity=".35" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {/* faróis */}
      <rect x="47" y="-25" width="6" height="5" rx="2" fill="#FFC27A" />
      <rect x="-51" y="-25" width="4" height="6" rx="1.5" fill="#FF6B6B" />
      <Wheel x={-30} spin={spin} />
      <Wheel x={31} spin={spin} />
    </g>
  )
}

/* ---------------- placas ---------------- */

function Sign({ x, label, on, last }: { x: number; label: string; on: boolean; last?: boolean }) {
  const y = groundY(x)
  return (
    <g transform={`translate(${x} ${y - 7})`}>
      <line x1="0" y1="0" x2="0" y2="-70" stroke={on ? '#FFC27A' : '#39426B'} strokeWidth="3" />
      <g transform="translate(0 -96)">
        <rect
          x={last ? -52 : -40}
          y="-17"
          width={last ? 104 : 80}
          height="34"
          rx="8"
          fill={on ? '#FFC27A' : '#161D3D'}
          stroke={on ? '#FFC27A' : '#39426B'}
          strokeWidth="1.5"
          style={{ transition: 'fill .4s, stroke .4s' }}
        />
        <text
          y="6"
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontWeight="700"
          fontSize={last ? 14 : 17}
          fill={on ? '#0A0F1E' : '#B9BDD6'}
          style={{ transition: 'fill .4s' }}
        >
          {label}
        </text>
      </g>
    </g>
  )
}

/* ---------------- hodômetro de anos ---------------- */

function Odometer({ year }: { year: number }) {
  const digits = String(year).split('')
  return (
    <div className="flex items-center gap-3" aria-hidden>
      <span className="text-[12px] uppercase tracking-[0.14em] text-muted leading-tight text-right">
        hodômetro<br />em anos
      </span>
      <div className="flex rounded-xl border border-line bg-deep/80 p-1.5 gap-1">
        {digits.map((d, i) => (
          <span key={i} className="relative w-[1.35ch] h-[1.5em] overflow-hidden rounded-md bg-night font-mono text-[clamp(1.4rem,2.4vw,2rem)] leading-[1.5em] text-center text-spark">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={d}
                className="absolute inset-0"
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                exit={{ y: '-100%' }}
                transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
              >
                {d}
              </motion.span>
            </AnimatePresence>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ---------------- a viagem ---------------- */

function Road() {
  const ref = useRef<HTMLElement | null>(null)
  const vw = useViewport()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const narrow = vw < 768
  const carX = vw * (narrow ? 0.34 : 0.3)
  const spacing = Math.max(narrow ? vw * 0.85 : vw * 0.42, 340)
  const D = ((STOPS - 1) * spacing) / 0.94 // distância total que o carro anda
  const worldW = D + vw
  // a última placa fica um pouco à frente: o carro estaciona antes dela
  const signX = (i: number) => carX + D * (0.06 + (0.94 * i) / (STOPS - 1)) + (i === STOPS - 1 ? 90 : 0)

  const [active, setActive] = useState(-1)
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const cw = carX + p * D
    let idx = -1
    for (let i = 0; i < STOPS; i++) if (cw >= signX(i) - spacing * 0.18) idx = i
    setActive(idx)
  })

  const shift = useTransform(scrollYProgress, (p) => -p * D)
  const skyline = useTransform(scrollYProgress, (p) => -p * D * 0.35)
  // o carro apoia no topo do asfalto (meia largura 8); a escala parte do chão
  const carTransform = useTransform(scrollYProgress, (p) => {
    const x = carX + p * D
    const rot = (Math.atan(groundSlope(x)) * 180) / Math.PI
    return `translate(${x} ${groundY(x) - 8}) rotate(${rot})`
  })
  // framer não anima o atributo transform de <g>: escreve direto no DOM
  const carRef = useRef<SVGGElement | null>(null)
  useEffect(() => {
    const set = (v: string) => carRef.current?.setAttribute('transform', v)
    set(carTransform.get())
    return carTransform.on('change', set)
  }, [carTransform])
  const spin = useTransform(scrollYProgress, (p) => ((p * D) / (2 * Math.PI * 11)) * 360)
  const trail = useTransform(scrollYProgress, (p) => carX + p * D)

  // o terreno é desenhado uma vez por largura de tela
  const { road, ground, lamps } = useMemo(() => {
    let r = ''
    for (let x = 0; x <= worldW; x += 12) r += `${x === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${groundY(x).toFixed(1)} `
    const g = `${r} L ${worldW} ${ROAD_H} L 0 ${ROAD_H} Z`
    const l: number[] = []
    for (let x = 140; x < worldW; x += 230) l.push(x)
    return { road: r, ground: g, lamps: l }
  }, [worldW])

  const buildings = useMemo(() => {
    const out: { x: number; w: number; h: number; lit: number[] }[] = []
    let x = 0
    let s = 3
    const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
    while (x < worldW * 0.35 + vw) {
      const w = 34 + rnd() * 60
      const h = 40 + rnd() * (SKY_H - 60)
      const lit = Array.from({ length: Math.floor(rnd() * 5) }, () => rnd())
      out.push({ x, w, h, lit })
      x += w + 8 + rnd() * 30
    }
    return out
  }, [worldW, vw])

  const yearShown = active < 0 ? ENTRIES[0].year : active < ENTRIES.length ? ENTRIES[active].year : NOW
  const entry = active >= 0 && active < ENTRIES.length ? ENTRIES[active] : null
  const arrived = active === STOPS - 1

  return (
    <section
      ref={ref}
      id="trajetoria"
      data-field="cloud"
      className="relative"
      style={{ height: `${100 + STOPS * 62}vh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col">
        <div className="page w-full pt-24 sm:pt-28">
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
            <div className="max-w-3xl">
              <p className="kicker">Trajetória</p>
              <h2 className="mt-3 h-sec text-[clamp(2rem,4.6vw,3.8rem)]">Oito anos colocando sistemas no ar.</h2>
            </div>
            <Odometer year={yearShown} />
          </div>

          {/* o cartão do trecho atual */}
          <div className="relative mt-6 sm:mt-10 min-h-[220px]">
            <AnimatePresence mode="wait" initial={false}>
              {arrived ? (
                <motion.div
                  key="next"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-[640px]"
                >
                  <p className="text-[15px] text-spark tnum">{NOW}, próxima parada</p>
                  <h3 className="mt-1 font-display text-[clamp(1.5rem,2.6vw,2.2rem)] font-semibold leading-tight">O seu projeto.</h3>
                  <p className="mt-3 text-soft max-w-[58ch]">
                    O carro está com o tanque cheio e o banco do carona livre. Se você tem um produto para
                    tirar do papel, ou uma operação que pede IA de verdade, me conta para onde vamos.
                  </p>
                  <button onClick={() => scrollToId('contato')} className="btn btn-main mt-6">
                    Vamos conversar <ArrowRight size={16} />
                  </button>
                </motion.div>
              ) : entry ? (
                <motion.div
                  key={entry.title}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-[640px]"
                >
                  <p className="text-[15px] text-muted tnum">{entry.when}</p>
                  <h3 className="mt-1 font-display text-[clamp(1.4rem,2.4vw,2rem)] font-semibold leading-tight">{entry.title}</h3>
                  <p className="mt-1 text-signal text-[15px]">{entry.org}</p>
                  <p className="mt-3 text-soft text-[15.5px] sm:text-[17px] max-w-[62ch]">{entry.body}</p>
                </motion.div>
              ) : (
                <motion.p
                  key="start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-soft max-w-[46ch]"
                >
                  Role para dar a partida. Cada placa na estrada é um trecho do caminho.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* o mundo: cidade ao fundo, terreno, placas e o carro */}
        <div className="relative mt-auto w-full flex-1 min-h-[260px] max-h-[440px]" aria-hidden>
          <motion.svg
            className="absolute left-0 bottom-[70px]"
            width={worldW * 0.35 + vw}
            height={SKY_H}
            style={{ x: skyline }}
          >
            {buildings.map((b, i) => (
              <g key={i}>
                <rect x={b.x} y={SKY_H - b.h} width={b.w} height={b.h} fill="#111733" opacity=".9" />
                {b.lit.map((r, j) => (
                  <rect
                    key={j}
                    x={b.x + 6 + (r * (b.w - 16))}
                    y={SKY_H - b.h + 10 + j * 14}
                    width="4"
                    height="5"
                    fill={j % 2 ? '#7C9CFF' : '#FFC27A'}
                    opacity=".55"
                  />
                ))}
              </g>
            ))}
          </motion.svg>

          <motion.svg className="absolute left-0 bottom-0" width={worldW} height={ROAD_H} style={{ x: shift }} overflow="visible">
            <defs>
              <linearGradient id="journey-beam" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#FFC27A" stopOpacity=".45" />
                <stop offset="1" stopColor="#FFC27A" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="journey-trail" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#7C9CFF" />
                <stop offset="1" stopColor="#FFC27A" />
              </linearGradient>
              <clipPath id="journey-traveled">
                <motion.rect x="0" y="-200" height={ROAD_H + 200} width={trail} />
              </clipPath>
            </defs>

            <path d={ground} fill="#0D1228" />
            {lamps.map((x) => (
              <g key={x} transform={`translate(${x} ${groundY(x) - 6})`}>
                <line x1="0" y1="0" x2="0" y2="-46" stroke="#222A4A" strokeWidth="2" />
                <circle cy="-48" r="3" fill="#FFC27A" opacity=".8" />
                <circle cy="-48" r="12" fill="#FFC27A" opacity=".08" />
              </g>
            ))}
            {ENTRIES.map((e, i) => (
              <Sign key={e.year} x={signX(i)} label={String(e.year)} on={i <= active} />
            ))}
            <Sign x={signX(STOPS - 1)} label="seu projeto" on={arrived} last />

            <path d={road} fill="none" stroke="#1B2347" strokeWidth="16" strokeLinejoin="round" />
            <path d={road} fill="none" stroke="#39426B" strokeWidth="1.5" strokeDasharray="14 16" transform="translate(0 1)" />
            <path d={road} fill="none" stroke="url(#journey-trail)" strokeWidth="3" clipPath="url(#journey-traveled)" transform="translate(0 -7)" />

            <g ref={carRef}>
              <g transform={narrow ? 'scale(.85)' : 'scale(1.2)'}>
                <Car spin={spin} />
              </g>
            </g>
          </motion.svg>
        </div>
      </div>
    </section>
  )
}

/* ---------------- movimento reduzido: lista vertical ---------------- */

function List() {
  return (
    <section id="trajetoria" data-field="cloud" className="relative py-20 sm:py-24">
      <div className="page">
        <div className="max-w-3xl">
          <p className="kicker">Trajetória</p>
          <h2 className="mt-4 h-sec text-[clamp(2.4rem,5vw,4.2rem)]">Oito anos colocando sistemas no ar.</h2>
        </div>
        <ol className="relative mt-12 flex flex-col gap-10">
          {[...ENTRIES].reverse().map((e) => (
            <li key={e.title} className="grid sm:grid-cols-[200px_1fr] gap-2 sm:gap-12">
              <p className="text-[15px] text-muted tnum sm:text-right">{e.when}</p>
              <div>
                <h3 className="font-display text-[clamp(1.4rem,2.2vw,1.85rem)] font-semibold leading-tight">{e.title}</h3>
                <p className="mt-1 text-signal text-[15px]">{e.org}</p>
                <p className="mt-3 text-soft max-w-[62ch]">{e.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default function Journey() {
  const reduce = useReducedMotion()
  return reduce ? <List /> : <Road />
}
