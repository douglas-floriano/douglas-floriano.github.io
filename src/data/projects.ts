export type Shot = { src: string; caption: string; mobile?: boolean }

export type Case = {
  slug: string
  name: string
  org: 'IB System' | 'Projeto pessoal'
  period: string
  status: string
  summary: string
  problem: string
  role: string
  decisions: string[]
  stack: string[]
  results?: string[]
  shots: Shot[]
  shotsNote?: string
  logo?: { src: string; alt: string }
}

export type Other = {
  slug: string
  name: string
  org: 'IB System' | 'Projeto pessoal'
  line: string
  stack: string
  shots?: Shot[]
  url?: string
}

const P = '/projects/'

export const CASES: Case[] = [
  {
    slug: 'lotemobile',
    name: 'Lotemobile e LoteIA',
    org: 'IB System',
    period: '2025 até hoje',
    status: 'Lotemobile em produção · LoteIA em testes',
    summary: 'ERP para loteadoras e incorporadoras, e um app em que o gestor opera esse ERP conversando por texto ou voz.',
    problem:
      'Loteadora controla venda, contrato, parcelas, reajuste, comissão, obra e cobrança. O Lotemobile cobre tudo isso, mas com centenas de telas: para saber quem está inadimplente ou quanto entrou hoje, o gestor precisava de vários cliques, e a conciliação bancária tomava horas.',
    role:
      'Sou o maior autor do código do backend em 2026 (2.125 commits). Mexo em backend, frontend e infraestrutura, e criei o app LoteIA e quase todo o módulo de IA do backend.',
    decisions: [
      'O pedido passa por três filtros antes de chegar a um modelo: palavra-chave (custo zero), a especialidade que respondeu por último e, só no fim, um classificador. Das cerca de 135 ferramentas, uma busca BM25 escolhe as que cabem no contexto, o que deixa rodar até um modelo local de 9B, com o Claude como alternativa.',
      'Nada é gravado direto. Baixa de parcela, boleto ou conciliação viram um cartão de confirmação: a IA prepara e a pessoa aprova.',
      'Criei o Lote Connect, um servidor MCP com OAuth 2.1 para o cliente ligar o próprio assistente ao sistema. Os dados pessoais são mascarados antes de chegar ao modelo.',
    ],
    stack: ['Laravel 10', 'PHP 8.2', 'MariaDB', 'AWS ECS', 'Horizon', 'React', 'Expo', 'React Native', 'Claude', 'Qwen local', 'Qdrant', 'Whisper', 'MCP'],
    results: [
      'Lotemobile em produção em vários clientes, cada um com ambiente isolado.',
      '326 ferramentas abertas para assistentes externos pelo Lote Connect.',
      'LoteIA em testes, a caminho das lojas, com 11 especialidades de negócio.',
    ],
    shots: [
      { src: P + 'loteia/03-chat-inadimplentes.webp', caption: 'Pergunta sobre inadimplentes, com as ferramentas que o agente consultou', mobile: true },
      { src: P + 'loteia/05-cartao-de-sim.webp', caption: 'Boleto preparado pela IA esperando a confirmação da pessoa', mobile: true },
      { src: P + 'loteia/04-espelho-de-lotes.webp', caption: 'Espelho da quadra com simulação de parcelas no chat', mobile: true },
      { src: P + 'loteia/06-agentes.webp', caption: 'Agentes especialistas, cada um com seu assunto', mobile: true },
      { src: P + 'loteia/07-avisos-dos-agentes.webp', caption: 'Avisos e pedidos de decisão enviados pelos agentes', mobile: true },
      { src: P + 'loteia/09-anexos.webp', caption: 'Anexos: extrato OFX, arquivo de retorno, certificado e câmera', mobile: true },
      { src: P + 'loteia/10-conversa-por-voz.webp', caption: 'Modo de conversa por voz', mobile: true },
    ],
    shotsNote: 'Prints de ambiente de demonstração, com dados fictícios.',
  },
  {
    slug: 'zap-tarefas',
    name: 'zap-tarefas',
    org: 'Projeto pessoal',
    period: '2026',
    status: 'uso diário no suporte dos sistemas da IB System',
    summary: 'Pedido que chega no WhatsApp vira uma correção de código pronta para eu revisar.',
    problem:
      'Clientes e colegas pedem ajuste pelo WhatsApp a qualquer hora, misturando bug, dúvida e pedido de relatório. Eu gastava tempo só para entender o pedido, achar o cliente certo, abrir os logs e reproduzir o problema.',
    role:
      'Fiz sozinho. Um serviço lê as mensagens dos contatos autorizados, agrupa por pessoa, classifica o pedido e entrega para um agente trabalhar numa cópia isolada do repositório. Eu recebo diagnóstico, diff, testes rodados e uma resposta sugerida.',
    decisions: [
      'Dois modelos: um leve faz a triagem em segundos e um mais forte executa. Regras em código corrigem os erros de triagem que já conheço, como confundir número de ambiente com número de parcela.',
      'O agente só tem as ferramentas que liberei: lê logs da AWS do cliente certo, consulta o banco só para leitura (a consulta é recusada se cita coluna que não existe), altera código e roda testes. Commit, push e envio de mensagem ficam fora do alcance dele.',
      'Quando o pedido é para outra pessoa do time, ele vai para o IB Dispatch, o painel de pedidos que também fiz para a IB System, onde o Claude de cada dev abre e responde pedidos por MCP.',
    ],
    stack: ['Node.js 22', 'SQLite', 'Claude Code', 'Evolution GO', 'GitHub CLI', 'AWS CLI'],
    results: [
      'Em 7 dias, 1 em cada 3 pedidos saiu pronto para eu só aprovar.',
      'Tempo mediano de 1h12 entre a mensagem e a entrega.',
      'O cliente só recebe o aviso depois que o deploy termina com sucesso.',
    ],
    shots: [
      { src: P + 'zap-tarefas/02-painel-geral.webp', caption: 'Painel de 7 dias: tempo de ciclo, taxa de resolução e uso de IA' },
      { src: P + 'zap-tarefas/03-tarefa.webp', caption: 'Tarefa de correção que subiu para teste, com botão de reverter (nomes e dados do pedido borrados)' },
      { src: P + 'ib-dispatch/escritorio.webp', caption: 'IB Dispatch, o escritório virtual da IB System, que recebe os pedidos repassados (nomes dos colegas borrados)' },
    ],
  },
  {
    slug: 'ibpag',
    name: 'IB Pag',
    org: 'IB System',
    period: '2026',
    status: 'produto da IB System',
    summary: 'Pagamento pré-pago com cartão NFC em eventos, com maquininha própria e painel de gestão.',
    problem:
      'Em evento grande, caixa com dinheiro vivo gera fila e erro de troco. No IB Pag o público carrega saldo num cartão NFC e consome nos foodtrucks e estações, e o organizador acompanha tudo na hora.',
    role:
      'Trabalho no produto junto com o time. A maquininha roda um app Android nativo, a API atende maquininha, terminais e painel, e a venda de créditos conversa com o IB Ticket.',
    decisions: [
      'App nativo em Kotlin com Jetpack Compose na Gertec GPOS780, usando o SDK da Gertec para NFC e impressora.',
      'API em Fastify com Drizzle sobre MariaDB; o pedido chega na cozinha ou na estação em tempo real por SSE.',
      'Painel em React para eventos, restaurante com comandas e estoque, PDV de balcão e fidelidade.',
    ],
    stack: ['Kotlin', 'Jetpack Compose', 'Gertec GPOS780', 'Fastify', 'Drizzle', 'MariaDB', 'React', 'SSE'],
    shots: [],
  },
  {
    slug: 'ibticket',
    name: 'IB Ticket',
    org: 'IB System',
    period: '2026',
    status: 'em produção',
    summary: 'Venda e gestão de ingressos, com app para quem compra e app de portaria.',
    problem:
      'Produtor de evento precisa vender online, receber por PIX e cartão, validar ingresso na portaria sem fila e acompanhar a venda por canal enquanto o evento acontece.',
    role: 'Sou o principal desenvolvedor, autor de mais de 80% do código entre API, painel web e os dois apps.',
    decisions: [
      'Uma plataforma para várias organizadoras, com checkout por PIX e cartão, cupons, afiliados e relatório por canal de venda.',
      'Ingresso digital com QR validado ao vivo no app de portaria, feito em Expo.',
      'Ingresso e lembretes enviados pelo WhatsApp oficial (Meta Cloud API), e venda de créditos integrada ao IB Pag.',
    ],
    stack: ['Laravel 11', 'MySQL 8', 'Redis', 'React', 'Vite', 'Expo', 'React Native', 'AWS', 'Meta Cloud API'],
    shots: [],
    logo: { src: P + 'logos/ibticket.webp', alt: 'Logo do IB Ticket' },
  },
  {
    slug: 'apuracao-tse',
    name: 'Apuração ao vivo',
    org: 'Projeto pessoal',
    period: '2026',
    status: 'usado na noite do 1º turno de 2026',
    summary: 'Painel da apuração das eleições lendo direto os arquivos JSON que o TSE publica.',
    problem:
      'Na noite da eleição eu queria ver presidente, governador e senado de São Paulo e os outros estados numa tela só, atualizando assim que o TSE publica, sem ficar trocando de página no site oficial.',
    role: 'Fiz sozinho, em Node.js sem nenhuma dependência. O servidor consulta o TSE e manda cada mudança para o navegador.',
    decisions: [
      'Uma única conexão HTTP/2 com If-None-Match: quando nada mudou, o TSE responde 304 e quase não custa nada. A mudança chega ao navegador por SSE.',
      'Cada cargo tem sua frequência (presidente a cada 500 ms, governador de SP a cada 1 s, os demais mais devagar) e tudo passa por um limitador que corta a taxa pela metade se o TSE devolver 429.',
      'Os votos do exterior aparecem antes da totalização: o servidor decodifica os boletins de urna (formato ASN.1) seção por seção.',
    ],
    stack: ['Node.js 20', 'HTTP/2', 'SSE', 'ASN.1', 'HTML', 'CSS'],
    shots: [
      { src: P + 'apuracao-tse/01-painel.webp', caption: 'Painel em tela única: presidente, São Paulo, mapa dos estados e exterior' },
      { src: P + 'apuracao-tse/02-celular.webp', caption: 'No celular a tela vira uma página rolável', mobile: true },
    ],
    shotsNote: 'Prints do simulador local: os percentuais são fictícios, não é resultado oficial.',
  },
  {
    slug: 'mandapedir',
    name: 'MandaPedir',
    org: 'Projeto pessoal',
    period: '2025 até hoje',
    status: 'em produção',
    summary: 'Sistema para bar e restaurante: salão, cozinha, delivery e pedido pela mesa na mesma fila.',
    problem:
      'A primeira versão tinha uma tela para cada coisa e, no meio do movimento, ninguém achava nada. Pedido do salão, do delivery e do balcão ficavam em lugares diferentes.',
    role: 'Fiz do produto ao servidor: backend, frontend, integração com WhatsApp e pagamento, e a hospedagem.',
    decisions: [
      'Troquei cerca de 20 telas por quatro áreas: Operar, Cozinha, Cardápio e Negócio. A planta do salão mostra valor e tempo de cada mesa.',
      'Cada restaurante é um cliente separado no mesmo sistema. O cliente final pede pelo celular lendo o QR da mesa, sem instalar nada.',
      'O WhatsApp avisa o cliente em cada etapa do pedido, e as áreas de entrega são desenhadas no mapa com preço e prazo.',
    ],
    stack: ['Laravel 12', 'React', 'Vite', 'MariaDB', 'Evolution API', 'Google Maps', 'Mercado Pago', 'Docker', 'Oracle Cloud'],
    shots: [
      { src: P + 'mandapedir-operar.webp', caption: 'Operar: salão, entregas e balcão na mesma fila' },
      { src: P + 'mandapedir-cliente-mobile.webp', caption: 'Cardápio público: o cliente pede pelo link', mobile: true },
      { src: P + 'mandapedir-cozinha.webp', caption: 'Cozinha: a fazer, fazendo e pronto, com modo TV' },
      { src: P + 'mandapedir-ajustes.webp', caption: 'Áreas de entrega desenhadas no mapa, com preço e prazo' },
    ],
  },
]

export const OTHERS: Other[] = [
  {
    slug: 'hasgym',
    name: 'HASGym',
    org: 'Projeto pessoal',
    line: 'Gestão de academia com perfis de dono, instrutor e aluno, app nativo e bloqueio automático quando a mensalidade atrasa. Em beta.',
    stack: 'Laravel 11, React 19, Expo',
    shots: [
      { src: P + 'hasgym-owner-dashboard.webp', caption: 'Painel do dono: alunos ativos, mensalidades e ocupação' },
      { src: P + 'hasgym-instr-exercises.webp', caption: 'Biblioteca de exercícios com vídeo, grupo muscular e equipamento' },
      { src: P + 'hasgym-student-mobile-workouts.webp', caption: 'Treino do dia no app do aluno', mobile: true },
      { src: P + 'hasgym-student-mobile-evolution.webp', caption: 'Evolução de cargas e medidas', mobile: true },
    ],
  },
  {
    slug: 'bolsa-quant',
    name: 'Bolsa Quant',
    org: 'Projeto pessoal',
    line: 'Simulador de estratégias de investimento com custos, slippage e imposto. Nos testes fora da amostra, nenhuma estratégia ganhou de comprar e segurar.',
    stack: 'Python, FastAPI, PostgreSQL, React',
    shots: [
      { src: P + 'bolsa-quant/01-simulador-e-se.webp', caption: 'R$ 20 em PETR4 há 5 anos, comparado com CDI e Ibovespa' },
      { src: P + 'bolsa-quant/03-estrategia-explicada.webp', caption: 'Estratégia explicada: quando compra, quando vende e exemplo em reais' },
      { src: P + 'bolsa-quant/02-melhores-estrategias.webp', caption: 'Estratégias comparadas no mesmo ativo e período' },
    ],
  },
  {
    slug: 'transcritor-musical',
    name: 'Transcritor musical',
    org: 'Projeto pessoal',
    line: 'De um MP3 para melodia, cifra, partitura e tablatura de violão, com redes neurais rodando no próprio computador.',
    stack: 'Python, PyTorch, Demucs, CREPE',
    shots: [
      { src: P + 'transcritor-musical/02-resultado.webp', caption: 'Resultado: tom, compasso, andamento, capotraste e arquivos' },
      { src: P + 'transcritor-musical/04-arranjo-partitura-tablatura.webp', caption: 'Arranjo para violão solo com partitura e tablatura' },
    ],
  },
  {
    slug: 'racha-terca',
    name: 'Racha de Terça',
    org: 'Projeto pessoal',
    line: 'Notas, ranking e sorteio de times equilibrados para o futebol semanal dos amigos.',
    stack: 'Next.js 14, Drizzle, Postgres',
    url: 'https://racha-terca.vercel.app',
    shots: [
      { src: P + 'racha-inicio.webp', caption: 'Início: status da rodada e último pódio', mobile: true },
      { src: P + 'racha-card.webp', caption: 'Card com nota geral e atributos', mobile: true },
      { src: P + 'racha-times.webp', caption: 'Sorteio de times equilibrados pelas médias', mobile: true },
    ],
  },
  {
    slug: 'hrtinvest',
    name: 'HRT Invest',
    org: 'IB System',
    line: 'Investimentos tokenizados: portal web e app do investidor sobre a mesma API, com contratos e assinatura eletrônica.',
    stack: 'Laravel 10, Next.js 15, Expo',
  },
  {
    slug: 'ibcore',
    name: 'IB Core',
    org: 'IB System',
    line: 'Hub que liga os produtos da IB System em masterplans. Fiz a infraestrutura na AWS e a integração com o IB Ticket.',
    stack: 'AWS ECS Fargate, GitHub Actions',
  },
]
