import {
  AlarmClockCheck,
  ArrowRight,
  Award,
  BadgeCheck,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  CircuitBoard,
  Clock3,
  Crown,
  FileCode,
  FileSpreadsheet,
  FolderKanban,
  GaugeCircle,
  Globe2,
  Handshake,
  Headphones,
  HeartHandshake,
  LayoutDashboard,
  LineChart,
  MessageCircle,
  Network,
  QrCode,
  ShieldCheck,
  Sparkles,
  TimerReset,
  TrendingUp,
  Users,
  UsersRound,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./PropostaPresentation.module.css";
import type { SlideDefinition } from "./types";
import CountdownPrice from "./CountdownPrice";
import CTAButtons from "./CTAButtons";

const baseHeroDetails = [
  { label: "Cliente", value: "Etal Prestação de Serviços LTDA" },
  { label: "Projeto", value: "Sistema de Gestão Integrado" },
  { label: "Desenvolvedor", value: "Hugo Viegas" },
];

const benefits = [
  {
    icon: GaugeCircle,
    title: "Registro Impecável",
    description:
      "Checklists digitais eliminam falhas manuais e dão precisão ao contrato.",
  },
  {
    icon: FolderKanban,
    title: "Tudo organizado",
    description:
      "Fluxos, pessoas e equipamentos centralizados em uma stack única.",
  },
  {
    icon: LineChart,
    title: "Indicadores vivos",
    description: "KPIs, SLA e dashboards conectados às entregas diárias.",
  },
];

const timeline = [
  {
    title: "Módulo 1 — QR + Plano de Trabalho",
    description: "Rotinas operacionais inteligentes com check-in por QR Code.",
    duration: "1-2 meses",
  },
  {
    title: "Módulo 2 — KPIs & Dashboards",
    description:
      "Insights e relatórios automáticos alimentados pelo time em campo.",
    duration: "1-2 meses",
  },
  {
    title: "Módulo 3 — Manutenção",
    description: "Controle de preventiva e corretiva com histórico completo.",
    duration: "1-2 meses",
  },
  {
    title: "Módulo 4 — HC & Pessoas",
    description: "Comparativo contrato x realizado com alertas proativos.",
    duration: "1-2 meses",
  },
  {
    title: "Módulo 5 — Chamados",
    description: "Atendimento interno com SLA, notificações.",
    duration: "1-2 meses",
  },
];

const comparison = {
  saas: {
    label: "Soluções SaaS",
    price: "R$ 15.000 – 60.000/ano",
    bullets: [
      "Licenças por usuário e módulos fragmentados",
      "Integração limitada entre equipes",
      "Cobrança recorrente",
    ],
  },
  custom: {
    label: "Sob medida tradicional",
    price: "R$ 60.000 – 150.000",
    bullets: [
      "Projeto demorado, contrato fechado",
      "Equipe terceirizada com pouco domínio do contexto",
      "Suporte vendido à parte",
    ],
  },
  ours: {
    label: "Proposta Hugo Viegas",
    price: "Investimento único: R$ ??.???",
    bullets: [
      "5 módulos desenhados com você",
      "Stack full Google + app responsivo",
      "Suporte dedicado por 12 meses",
    ],
  },
};

const roiHighlights = [
  {
    icon: Clock3,
    title: "Payback estimado",
    value: "12–18 meses",
    description:
      "Retorno via ganho operacional e cortes de assinaturas paralelas.",
  },
  {
    icon: TrendingUp,
    title: "Economia anual",
    value: "R$ 24.000",
    description: "Redução de retrabalho + centralização de dados.",
  },
  {
    icon: ShieldCheck,
    title: "Zero taxas escondidas",
    value: "Contrato fechado",
    description: "Sistema passa a ser 100% da Etal. Nada de mensalidades*.",
  },
];

const portfolio = [
  {
    title: "Sistema educacional inteligente",
    description: "Rotinas, desempenho e relatórios automatizados para escolas.",
    stack: "Apps Script + Sheets",
    icon: Sparkles,
  },
  {
    title: "Dashboard de vendas em tempo real",
    description: "KPIs com insights instantâneos e alertas de metas.",
    stack: "Google Planilhas + Apps Script",
    icon: LayoutDashboard,
  },
  {
    title: "Controle de estoque com QR",
    description: "Automação logística com PWA e leitura offline.",
    stack: "PWA + Apps Script",
    icon: CircuitBoard,
  },
];

const slides: SlideDefinition[] = [
  {
    id: "hero",
    title: "Sistema de Gestão Integrado",
    accent: "iris",
    Component: () => (
      <div className={styles.slideContent}>
        <div className={styles.heroIcon}>
          <Network size={38} strokeWidth={1.8} />
        </div>
        <div>
          <h1 className={styles.heroTitle}>Sistema de Gestão Integrado</h1>
          <p className={styles.heroSubtitle}>
            Uma operação única, orquestrada em 5 módulos que conversam entre si
            e alinham Etal, clientes e campo.
          </p>
        </div>
        <div className={styles.detailGrid}>
          {baseHeroDetails.map((item) => (
            <div key={item.label} className={styles.detailItem}>
              <span className={styles.detailLabel}>{item.label}</span>
              <span className={styles.detailValue}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "problems",
    title: "Desafios atuais da operação",
    accent: "mint",
    Component: () => (
      <div className={styles.slideContent}>
        <header>
          <h2 className={styles.sectionTitle}>Onde o controle trava hoje?</h2>
          <p className={styles.sectionDescription}>
            Diagnóstico feito junto ao time Etal: precisão, rastreabilidade e
            visão em tempo real são os pontos críticos a resolver.
          </p>
        </header>
        <div className={styles.problemGrid}>
          {[
            {
              icon: AlarmClockCheck,
              title: "Registro manual impreciso",
              description:
                "Sem um fluxo único, obrigações contratuais ficam sujeitas a esquecimentos.",
            },
            {
              icon: FileSpreadsheet,
              title: "Planilhas desconectadas",
              description:
                "Equipamentos e rotinas espalhados em arquivos diferentes, difíceis de auditar.",
            },
            {
              icon: MessageCircle,
              title: "Chamados por e-mail",
              description:
                "Ordem de serviço sem SLA definido e baixa rastreabilidade.",
            },
            {
              icon: GaugeCircle,
              title: "Sem visão consolidada",
              description:
                "Difícil comparar programado x executado para tomada de decisão.",
            },
          ].map(({ icon: Icon, title, description }) => (
            <article key={title} className={styles.problemCard}>
              <span className={styles.iconBadge}>
                <Icon size={22} />
              </span>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardDescription}>{description}</p>
            </article>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "modules",
    title: "Sistema em 5 módulos conectados",
    accent: "azure",
    Component: () => (
      <div className={styles.slideContent}>
        <header>
          <h2 className={styles.sectionTitle}>O ecossistema completo</h2>
          <p className={styles.sectionDescription}>
            Cada módulo resolve uma dor específica e alimenta os demais para que
            a gestão aconteça em tempo real.
          </p>
        </header>
        <div className={styles.moduleGrid}>
          {[
            {
              icon: QrCode,
              title: "QR + Plano de Trabalho",
              meta: "Checklists responsivos",
              description:
                "Rotinas configuráveis, scanner offline e locais agrupados.",
            },
            {
              icon: LayoutDashboard,
              title: "KPIs & Dashboards",
              meta: "Insights ao vivo",
              description:
                "Visão executiva da operação com alertas e dashboards inteligentes.",
            },
            {
              icon: Wrench,
              title: "Gestão de Manutenção",
              meta: "Preventiva e corretiva",
              description:
                "Agenda, histórico e controle de utilização por ativo.",
            },
            {
              icon: Users,
              title: "HC & Pessoas",
              meta: "Contrato x realizado",
              description: "Mapa do quadro funcional com controle de variação.",
            },
            {
              icon: Headphones,
              title: "Chamados & OS",
              meta: "SLA garantido",
              description:
                "Fila única com status, notificações e rastreabilidade.",
            },
          ].map(({ icon: Icon, title, meta, description }) => (
            <article key={title} className={styles.moduleCard}>
              <span className={styles.moduleIcon}>
                <Icon size={24} />
              </span>
              <div>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.moduleMeta}>{meta}</p>
              </div>
              <p className={styles.cardDescription}>{description}</p>
            </article>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "demo",
    title: "Veja funcionando",
    accent: "sunrise",
    Component: () => (
      <div className={styles.slideContent}>
        <header>
          <h2 className={styles.sectionTitle}>Experiência interativa</h2>
          <p className={styles.sectionDescription}>
            Simulação navegável com fluxo de QR Codes, chamados e dashboards —
            construída com a mesma stack do produto final.
          </p>
        </header>
        <div className={styles.ctaBlock}>
          <Button
            size="lg"
            className={styles.actionButton}
            onClick={() =>
              window.open(
                "https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/6375412fe6adff7c864872e61569f6e1/47b5e2f0-e80e-42d5-aa71-b887978a5267/index.html",
                "_blank"
              )
            }
          >
            <ArrowRight size={20} />
            Explorar protótipo
          </Button>
          <div className={styles.actionMeta}>
            <span className={styles.detailLabel}>Responsivo e offline</span>
            <span className={styles.detailLabel}>
              Integra com Google Workspace
            </span>
            <span className={styles.detailLabel}>
              Fluxo espelhado à operação real
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "qr",
    title: "QR Code + Plano de Trabalho",
    accent: "amber",
    Component: () => (
      <div className={styles.slideContent}>
        <div className={styles.twoColumn}>
          <section className={styles.visualPanel}>
            <div className={styles.visualHighlight}>
              <QrCode size={32} />
              <div>
                <h3 className={styles.cardTitle}>Cada ponto com identidade</h3>
                <p className={styles.cardDescription}>
                  Etiquetas únicas conectadas ao checklist que o colaborador
                  executa no local.
                </p>
              </div>
            </div>
            <div className={styles.visualList}>
              {[
                "Scanner offline, sincroniza quando volta o sinal",
                "Plano de trabalho configurável por local",
                "Registros seguros e de fácil acesso.",
              ].map((item) => (
                <p key={item} className={styles.cardDescription}>
                  • {item}
                </p>
              ))}
            </div>
          </section>
          <section className={styles.benefitList}>
            {benefits.map(({ icon: Icon, title, description }) => (
              <article key={title} className={styles.benefitItem}>
                <Icon size={26} />
                <div>
                  <h3 className={styles.cardTitle}>{title}</h3>
                  <p className={styles.cardDescription}>{description}</p>
                </div>
              </article>
            ))}
          </section>
        </div>
      </div>
    ),
  },
  {
    id: "kpis",
    title: "KPIs e dashboards ao vivo",
    accent: "violet",
    Component: () => (
      <div className={styles.slideContent}>
        <header>
          <h2 className={styles.sectionTitle}>Gestão orientada por dados</h2>
          <p className={styles.sectionDescription}>
            Indicadores estratégicos e operacionais conectados aos checklists e
            chamados em tempo real.
          </p>
        </header>
        <div className={styles.twoColumn}>
          <section className={styles.visualPanel}>
            <div className={styles.visualHighlight}>
              <LayoutDashboard size={32} />
              <div>
                <h3 className={styles.cardTitle}>Painéis executivos</h3>
                <p className={styles.cardDescription}>
                  SLA, produtividade, aderência por contrato e alertas.
                </p>
              </div>
            </div>
            <div className={styles.visualList}>
              {[
                "Dashboards em Google Apps Script e Sheets",
                "Alertas no e-mail quando necessário",
                "Histórico exportável em PDF e Sheets",
              ].map((item) => (
                <p key={item} className={styles.cardDescription}>
                  • {item}
                </p>
              ))}
            </div>
          </section>
          <section className={styles.visualPanel}>
            <div className={styles.visualHighlight}>
              <BarChart3 size={30} />
              <div>
                <h3 className={styles.cardTitle}>Indicadores operacionais</h3>
                <p className={styles.cardDescription}>
                  Acompanhamento de tarefas por turno, local e responsável.
                </p>
              </div>
            </div>
            <div className={styles.visualList}>
              {[
                "Comparativos programado x realizado",
                "Metas mensais com linha de tendência",
                "Export fácil para reuniões e auditorias",
              ].map((item) => (
                <p key={item} className={styles.cardDescription}>
                  • {item}
                </p>
              ))}
            </div>
          </section>
        </div>
      </div>
    ),
  },
  {
    id: "maintenance",
    title: "Gestão de manutenção inteligente",
    accent: "magenta",
    Component: () => (
      <div className={styles.slideContent}>
        <header>
          <h2 className={styles.sectionTitle}>Seus ativos sempre auditáveis</h2>
          <p className={styles.sectionDescription}>
            Preventiva, corretiva, disponibilidade e fator de utilização em um
            único painel.
          </p>
        </header>
        <div className={styles.twoColumn}>
          <section className={styles.visualPanel}>
            <div className={styles.visualHighlight}>
              <CalendarClock size={30} />
              <div>
                <h3 className={styles.cardTitle}>Agenda inteligente</h3>
                <p className={styles.cardDescription}>
                  Calendário de manutenções com prioridades, responsáveis e
                  reprogramação automática.
                </p>
              </div>
            </div>
            <div className={styles.visualList}>
              {[
                "Histórico completo do equipamento",
                "Peças e materiais vinculados à OS",
                "Alertas quando o equipamento precisa de manutenção",
              ].map((item) => (
                <p key={item} className={styles.cardDescription}>
                  • {item}
                </p>
              ))}
            </div>
          </section>
          <section className={styles.visualPanel}>
            <div className={styles.visualHighlight}>
              <TimerReset size={30} />
              <div>
                <h3 className={styles.cardTitle}>
                  Análises de disponibilidade
                </h3>
                <p className={styles.cardDescription}>
                  Indicadores e backlog com foco em decisão rápida.
                </p>
              </div>
            </div>
            <div className={styles.visualList}>
              {[
                "Integração com planilha de ativos existente",
                "Painel de severidade por local",
                "Gatilhos para abrir chamado automaticamente",
              ].map((item) => (
                <p key={item} className={styles.cardDescription}>
                  • {item}
                </p>
              ))}
            </div>
          </section>
        </div>
      </div>
    ),
  },
  {
    id: "people",
    title: "HC — Pessoas sob controle",
    accent: "iris",
    Component: () => (
      <div className={styles.slideContent}>
        <header>
          <h2 className={styles.sectionTitle}>Equipe alinhada ao contrato</h2>
          <p className={styles.sectionDescription}>
            Visão mensal do headcount planejado vs. realizado e seus impactos em
            orçamento e qualidade.
          </p>
        </header>
        <div className={styles.twoColumn}>
          <section className={styles.visualPanel}>
            <div className={styles.visualHighlight}>
              <UsersRound size={30} />
              <div>
                <h3 className={styles.cardTitle}>Variação controlada</h3>
                <p className={styles.cardDescription}>
                  Alertas automáticos quando uma equipe ultrapassar o limite
                  contratado.
                </p>
              </div>
            </div>
            <div className={styles.visualList}>
              {[
                "Dashboard mensal com metas e real",
                "Comparativo por turno e local",
                "Histórico consolidado para auditorias",
              ].map((item) => (
                <p key={item} className={styles.cardDescription}>
                  • {item}
                </p>
              ))}
            </div>
          </section>
          <section className={styles.visualPanel}>
            <div className={styles.visualHighlight}>
              <BadgeCheck size={30} />
              <div>
                <h3 className={styles.cardTitle}>Integração de dados</h3>
                <p className={styles.cardDescription}>
                  Importa e consolida planilhas atuais, com validação
                  automática.
                </p>
              </div>
            </div>
            <div className={styles.visualList}>
              {[
                "Upload simples de dados existentes",
                "Registros preparados para auditoria",
                "Indicadores de produtividade por colaborador",
              ].map((item) => (
                <p key={item} className={styles.cardDescription}>
                  • {item}
                </p>
              ))}
            </div>
          </section>
        </div>
      </div>
    ),
  },
  {
    id: "tickets",
    title: "Chamados com SLA garantido",
    accent: "mint",
    Component: () => (
      <div className={styles.slideContent}>
        <header>
          <h2 className={styles.sectionTitle}>
            Atendimento com rastreabilidade total
          </h2>
          <p className={styles.sectionDescription}>
            Da abertura ao fechamento, cada ordem de serviço tem responsável,
            prazo e evidências registradas.
          </p>
        </header>
        <div className={styles.supportGrid}>
          {[
            {
              icon: MessageCircle,
              title: "Portal único",
              description:
                "Formulário intuitivo com captura de anexos e prioridade.",
            },
            {
              icon: Handshake,
              title: "Fluxo colaborativo",
              description:
                "Transferência entre equipes e comunicação dentro da OS.",
            },
            {
              icon: AlarmClockCheck,
              title: "SLA monitorado",
              description:
                "Alertas por e-mail e painel com informações necessárias.",
            },
          ].map(({ icon: Icon, title, description }) => (
            <article key={title} className={styles.supportCard}>
              <Icon size={28} />
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardDescription}>{description}</p>
            </article>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "timeline",
    title: "Cronograma evolutivo",
    accent: "azure",
    Component: () => (
      <div className={styles.slideContent}>
        <header>
          <h2 className={styles.sectionTitle}>
            Entrega em ondas, valor desde o início
          </h2>
          <p className={styles.sectionDescription}>
            Cada módulo é entregue de forma incremental, mas a arquitetura
            permite priorizar o que for mais importante.
          </p>
        </header>
        <div className={styles.timeline}>
          {timeline.map(({ title, description, duration }) => (
            <div key={title} className={styles.timelineItem}>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardDescription}>{description}</p>
              <span className={styles.detailLabel}>{duration}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "support",
    title: "Tranquilidade garantida",
    accent: "sunrise",
    Component: () => (
      <div className={styles.slideContent}>
        <header>
          <h2 className={styles.sectionTitle}>
            Você não fica sozinho após a entrega
          </h2>
          <p className={styles.sectionDescription}>
            Suporte, treinamento e transferência total do conhecimento fazem
            parte do pacote.
          </p>
        </header>
        <div className={styles.supportGrid}>
          {[
            {
              icon: Headphones,
              title: "1 ano de suporte",
              description: "Atendimento direto comigo para ajustes e evolução.",
            },
            {
              icon: Award,
              title: "Treinamento completo",
              description: "Capacitação online com manuais & vídeos dedicados.",
            },
            {
              icon: Crown,
              title: "Sistema é 100% Etal*",
              description:
                "Código, infraestrutura e dados são entregues na sua conta.",
            },
          ].map(({ icon: Icon, title, description }) => (
            <article key={title} className={styles.supportCard}>
              <Icon size={28} />
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardDescription}>{description}</p>
            </article>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "comparison",
    title: "Comparativo de mercado",
    accent: "violet",
    Component: () => (
      <div className={styles.slideContent}>
        <header>
          <h2 className={styles.sectionTitle}>
            Por que faz sentido construir esse projeto com o Hugo
          </h2>
          <p className={styles.sectionDescription}>
            O investimento único entrega autonomia, personalização profunda e
            suporte presente.
          </p>
        </header>
        <div className={styles.comparisonGrid}>
          {[comparison.saas, comparison.custom, comparison.ours].map(
            ({ label, price, bullets }, index) => (
              <article key={label} className={styles.comparisonCard}>
                <span className={styles.comparisonBadge}>
                  {index === 0
                    ? "Mercado SaaS"
                    : index === 1
                    ? "Custom"
                    : "Nossa proposta"}
                </span>
                <div className={styles.comparisonHighlight}>
                  {index === 2 ? (
                    <ShieldCheck size={26} />
                  ) : (
                    <FileCode size={26} />
                  )}
                  <div>
                    <h3 className={styles.cardTitle}>{label}</h3>
                    <p className={styles.cardDescription}>{price}</p>
                  </div>
                </div>
                <ul className={styles.visualList}>
                  {bullets.map((item) => (
                    <li key={item} className={styles.cardDescription}>
                      • {item}
                    </li>
                  ))}
                </ul>
              </article>
            )
          )}
        </div>
      </div>
    ),
  },
  {
    id: "roi",
    title: "Investimento e retorno",
    accent: "amber",
    Component: () => (
      <div className={styles.slideContent}>
        <header>
          <h2 className={styles.sectionTitle}>
            ROI projetado com base em seus custos atuais
          </h2>
          <p className={styles.sectionDescription}>
            Mais do que um software, é redução mensurável e escalabilidade nas
            operações.
          </p>
        </header>
        <div className={styles.roiGrid}>
          {roiHighlights.map(({ icon: Icon, title, value, description }) => (
            <article key={title} className={styles.roiCard}>
              <Icon size={32} />
              <div>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.roiFigure}>{value}</p>
              </div>
              <p className={styles.cardDescription}>{description}</p>
            </article>
          ))}
        </div>
        <section className={styles.investmentCard}>
          <h3 className={styles.cardTitle}>Investimento único</h3>
          <CountdownPrice finalValue={40000} duration={2400} />
          <p className={styles.cardDescription}>
            Entrega completa dos 5 módulos + 12 meses de suporte evolutivo.
          </p>
        </section>
      </div>
    ),
  },
  {
    id: "portfolio",
    title: "Experiência comprovada",
    accent: "magenta",
    Component: () => (
      <div className={styles.slideContent}>
        <header>
          <h2 className={styles.sectionTitle}>
            Projetos que sustentam esta proposta
          </h2>
          <p className={styles.sectionDescription}>
            Transformações digitais entregues em operação real, com foco em
            automação e dados.
          </p>
        </header>
        <div className={styles.portfolioGrid}>
          {portfolio.map(({ title, description, stack, icon: Icon }) => (
            <article key={title} className={styles.portfolioCard}>
              <Icon size={26} />
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardDescription}>{description}</p>
              <span className={styles.portfolioTech}>{stack}</span>
            </article>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "why",
    title: "Por que Hugo Viegas?",
    accent: "iris",
    Component: () => (
      <div className={styles.slideContent}>
        <header>
          <h2 className={styles.sectionTitle}>
            Parceiro técnico e estratégico
          </h2>
          <p className={styles.sectionDescription}>
            Participação direta no discovery, construção e evolução do produto —
            com comunicação transparente e decisões guiadas por dados.
          </p>
        </header>
        <div className={styles.supportGrid}>
          {[
            {
              icon: Globe2,
              title: "Eco-sistema conectado",
              description:
                "Domínio da stack Google + PWA com entregas em produção.",
            },
            {
              icon: HeartHandshake,
              title: "Imersão no negócio",
              description:
                "Juntos desde a concepção até a sustentação, sem terceirizar.",
            },
            {
              icon: Sparkles,
              title: "Inovação progressiva",
              description:
                "Roadmap evolutivo baseado no que gera resultado concreto.",
            },
          ].map(({ icon: Icon, title, description }) => (
            <article key={title} className={styles.supportCard}>
              <Icon size={28} />
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardDescription}>{description}</p>
            </article>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "cta",
    title: "Pronto para transformar?",
    accent: "sunrise",
    Component: () => (
      <div className={styles.slideContent}>
        <div className={styles.ctaBlock}>
          <header>
            <h2 className={styles.sectionTitle}>
              Vamos começar o capítulo digital da Etal
            </h2>
            <p className={styles.sectionDescription}>
              Um kick-off dedicado para alinhar prioridades, validar o escopo e
              partir para a construção.
            </p>
          </header>
          <CTAButtons />
          <div className={styles.contactLine}>
            <CheckCircle2 size={18} />
            <span>hugoviegas3.0@gmail.com</span>
            <span>•</span>
            <span>+55 31 98395-9494</span>
          </div>
        </div>
      </div>
    ),
  },
];

export default slides;
