import { motion } from 'framer-motion'
import { Cloud, Database, GitBranch, Globe, Server, Workflow } from 'lucide-react'
import { SectionHeader } from './Section'

const items = [
  { icon: Server, title: 'ECS Cluster', desc: 'Prod + Dev com 4 containers por task: PHP-FPM, Nginx, Horizon, Scheduler.', tag: 'us-east-1' },
  { icon: Database, title: 'RDS', desc: 'MariaDB e MySQL gerenciados, múltiplas instâncias por domínio de negócio.', tag: 'Managed' },
  { icon: Globe, title: 'CloudFront', desc: 'CDN global para 3 distribuições (admin, cliente, homolog) com HTTPS e invalidação via CLI.', tag: 'CDN' },
  { icon: Cloud, title: 'S3', desc: 'Hosting dos SPAs, storage de arquivos da aplicação e versionamento dos .env de ECS.', tag: 'Storage' },
  { icon: GitBranch, title: 'CI/CD', desc: 'GitHub Actions → ECR → Update Service no ECS. Deploy automático por branch (main/dev).', tag: 'Actions' },
  { icon: Workflow, title: 'Observabilidade', desc: 'CloudWatch Logs centralizados, health checks em load balancers por ambiente.', tag: 'CloudWatch' },
]

export default function Infra() {
  return (
    <section id="infra" className="relative py-28 px-6">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Infraestrutura"
          title={<>Não paro no <span className="gradient-text">`git push`</span>.</>}
          description="Cuido da infra que mantém o produto no ar — da imagem Docker ao DNS, passando por CDN, banco, filas e alertas."
        />

        <div className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((it, i) => {
              const Icon = it.icon
              return (
                <motion.div
                  key={it.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="group relative glass rounded-2xl p-6 overflow-hidden hover:-translate-y-1 transition-transform"
                >
                  <div className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-brand-violet/10 blur-2xl group-hover:bg-brand-cyan/20 transition-colors" />
                  <div className="relative flex items-start justify-between mb-4">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-cyan/30 to-brand-violet/30 ring-1 ring-white/10">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 border border-white/10 rounded-full px-2 py-0.5">{it.tag}</span>
                  </div>
                  <h3 className="font-display text-lg text-white mb-1.5">{it.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{it.desc}</p>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="mt-10 glass glow-border rounded-2xl p-6 font-mono text-sm text-gray-300 overflow-x-auto"
          >
            <div className="text-xs text-brand-cyan mb-3">~ fluxo de deploy típico</div>
            <pre className="leading-relaxed whitespace-pre">
{`git push origin main
  ─► GitHub Actions: build php-fpm + nginx
      ─► push para ECR
          ─► update task-definition
              ─► ECS rolling deploy (cluster WalletLote)
                  ─► CloudFront invalidation
                      ─► 🟢 produção atualizada`}
            </pre>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
