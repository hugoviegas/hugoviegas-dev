import { LanguageCode } from "./languages";

export interface Translation {
  EN: string;
  PT: string;
}

export interface Translations {
  [key: string]: Translation;
}

export const translations: Translations = {
  // Navigation
  about: { EN: "About", PT: "Sobre" },
  projects: { EN: "Projects", PT: "Projetos" },
  projectsMenuTitle: { EN: "Projects", PT: "Projetos" },
  projectsMenuBigBangDuel: { EN: "Big Bang Duel", PT: "Big Bang Duel" },
  projectsMenuDarcy: { EN: "D'Arcy McGee's", PT: "D'Arcy McGee's" },
  experience: { EN: "Experience", PT: "Experiência" },
  contact: { EN: "Contact", PT: "Contato" },

  // Hero Section
  hello: { EN: "Hello, I'm", PT: "Olá, eu sou" },
  goodMorning: { EN: "Hi, Good Morning! I'm", PT: "Oi, Bom Dia! Eu sou" },
  goodAfternoon: { EN: "Hi, Good Afternoon! I'm", PT: "Oi, Boa Tarde! Eu sou" },
  goodEvening: { EN: "Hi, Good Evening! I'm", PT: "Oi, Boa Noite! Eu sou" },
  goodNight: { EN: "Hi, Good Night! I'm", PT: "Oi, Boa Noite! Eu sou" },
  role: {
    EN: "IT Support Specialist → Full-Stack Developer",
    PT: "Especialista em TI → Desenvolvedor Full-Stack",
  },
  description: {
    EN: "IT professional with 4+ years of experience in technical support, system administration, and infrastructure management. Expert in Active Directory administration, user account management, and technical troubleshooting across Windows and Linux environments. Currently supporting IT operations for 120+ users in Dublin educational institution.",
    PT: "Profissional de TI com 4+ anos de experiência em suporte técnico, administração de sistemas e gestão de infraestrutura. Especialista em administração de Active Directory, gestão de contas de usuários e resolução de problemas técnicos em ambientes Windows e Linux. Atualmente suportando operações de TI para 120+ usuários em instituição educacional em Dublin.",
  },
  viewProjects: { EN: "View My Projects", PT: "Ver Meus Projetos" },
  getInTouch: { EN: "Get In Touch", PT: "Entre em Contato" },
  seeResume: { EN: "See Resume", PT: "Ver Currículo" },
  downloadResume: { EN: "Download Resume", PT: "Baixar Currículo" },

  // About Section
  journeySummary1: {
    EN: "IT professional with 4+ years of progressive experience in technical support and system administration. Started my IT career with ETAL in 2020, where I managed Windows Server environments for 50+ employees and developed a custom JavaScript automation solution using Node.js, Express.js, and Google Workspace APIs that reduced administrative processing time by 90%. This success demonstrated the power of combining technical expertise with process optimization to deliver measurable business impact.",
    PT: "Profissional de TI com 4+ anos de experiência progressiva em suporte técnico e administração de sistemas. Iniciei minha carreira em TI na ETAL em 2020, onde gerenciei ambientes Windows Server para 50+ funcionários e desenvolvi uma solução de automação personalizada em JavaScript usando Node.js, Express.js e APIs do Google Workspace que reduziu o tempo de processamento administrativo em 90%. Esse sucesso demonstrou o poder de combinar expertise técnica com otimização de processos para gerar impacto comercial mensurável.",
  },
  journeySummary2: {
    EN: "In September 2024, I joined Erin College as an IT Support Specialist and System Administrator, where I provide hands-on technical support and system administration for an educational institution with 120+ users. I manage Google Workspace enterprise environments, administer Active Directory user accounts and Group Policy configurations, and implement security policies following information security best practices. Concurrently, I'm pursuing a Bachelor of Science (Honours) in Computing - Software Engineering at CCT College Dublin, combining professional practice with academic study to deepen my technical expertise and career development.",
    PT: "Em setembro de 2024, me juntei ao Erin College como Especialista em Suporte de TI e Administrador de Sistemas, onde forneço suporte técnico prático e administração de sistemas para uma instituição educacional com 120+ usuários. Gerencio ambientes empresariais do Google Workspace, administro contas de usuários do Active Directory e configurações de Group Policy, e implemento políticas de segurança seguindo as melhores práticas de segurança da informação. Simultaneamente, estou cursando um Bacharelado em Computação - Engenharia de Software (Honras) no CCT College Dublin, combinando prática profissional com estudo acadêmico para aprofundar minha expertise técnica e desenvolvimento de carreira.",
  },
  readFullStory: { EN: "Read Full Story", PT: "Ler História Completa" },
  fullStoryTitle: { EN: "My Complete Journey", PT: "Minha Jornada Completa" },

  // Skills Section
  skillsTitle: { EN: "Skills & Technologies", PT: "Habilidades & Tecnologias" },
  otherSkills: { EN: "Other Skills", PT: "Outras Habilidades" },
  showMoreSkills: { EN: "Show More Skills", PT: "Mostrar Mais Habilidades" },
  showLessSkills: { EN: "Show Less", PT: "Mostrar Menos" },

  // Experience Section
  experienceTitle: {
    EN: "Professional Experience",
    PT: "Experiência Profissional",
  },
  present: { EN: "Present", PT: "Atual" },

  // Projects Section
  projectsTitle: { EN: "Featured Projects", PT: "Projetos em Destaque" },
  viewProject: { EN: "View Project", PT: "Ver Projeto" },
  viewCode: { EN: "View Code", PT: "Ver Código" },

  // Contact Section
  contactTitle: { EN: "Let's Work Together", PT: "Vamos Trabalhar Juntos" },
  contactDescription: {
    EN: "Ready to bring your ideas to life? Let's discuss your next project.",
    PT: "Pronto para dar vida às suas ideias? Vamos discutir seu próximo projeto.",
  },

  // Stats Section
  statsTitle: { EN: "Results That Matter", PT: "Resultados Que Importam" },

  // Footer
  footerText: {
    EN: "Built with passion using React, TypeScript, and Tailwind CSS.",
    PT: "Construído com paixão usando React, TypeScript e Tailwind CSS.",
  },

  // Additional UI strings
  aboutTitle: { EN: "About Me", PT: "Sobre Mim" },
  aboutSummary: {
    EN: "IT professional with 4+ years of hands-on experience in technical support, system administration, and infrastructure management across enterprise and educational environments. Proven expertise in Active Directory administration, user account management, and technical troubleshooting in Windows and Linux server environments. Currently supporting IT operations for 120+ users in Dublin.",
    PT: "Profissional de TI com 4+ anos de experiência prática em suporte técnico, administração de sistemas e gestão de infraestrutura em ambientes corporativos e educacionais. Expertise comprovada em administração de Active Directory, gestão de contas de usuários e resolução de problemas técnicos em ambientes de servidores Windows e Linux. Atualmente suportando operações de TI para 120+ usuários em Dublin.",
  },
  myJourney: { EN: "Professional Background", PT: "Histórico Profissional" },

  // Highlights
  highlight1Title: {
    EN: "4+ Years Experience",
    PT: "4+ Anos de Experiência",
  },
  highlight1Desc: {
    EN: "Technical support, system administration, and infrastructure management",
    PT: "Suporte técnico, administração de sistemas e gestão de infraestrutura",
  },
  highlight2Title: {
    EN: "90% Process Reduction",
    PT: "Redução de 90% nos Processos",
  },
  highlight2Desc: {
    EN: "JavaScript automation solution with Node.js, Express.js, and Google Workspace",
    PT: "Solução de automação JavaScript com Node.js, Express.js e Google Workspace",
  },
  highlight3Title: {
    EN: "Active Directory & Google Workspace",
    PT: "Active Directory & Google Workspace",
  },
  highlight3Desc: {
    EN: "Expert in user account management, permissions, and hybrid IT infrastructure",
    PT: "Especialista em gestão de contas de usuários, permissões e infraestrutura de TI híbrida",
  },
  highlight4Title: { EN: "Continuous Learning", PT: "Aprendizado Contínuo" },
  highlight4Desc: {
    EN: "Currently pursuing Computer Science degree (Honours) at CCT College Dublin",
    PT: "Cursando Bacharelado em Ciência da Computação (Honras) no CCT College Dublin",
  },

  technicalSkills: { EN: "Technical Skills", PT: "Habilidades Técnicas" },
  languagesTitle: { EN: "Languages", PT: "Idiomas" },
  native: { EN: "Native", PT: "Nativo" },
  c1Proficiency: { EN: "C1 Proficiency", PT: "Proficiência C1" },

  // Projects
  projectsIntro: {
    EN: "A showcase of innovative solutions that demonstrate my journey from IT Support to Full-Stack Development, with measurable impact and cutting-edge technologies.",
    PT: "Uma seleção de soluções que mostram minha evolução de Suporte de TI a Desenvolvedor Full-Stack, com impacto mensurável e tecnologias modernas.",
  },
  "category.All": { EN: "All", PT: "Todos" },
  "category.Automation": { EN: "Automation", PT: "Automação" },
  "category.Web Development": {
    EN: "Web Development",
    PT: "Desenvolvimento Web",
  },
  "category.Mobile": { EN: "Mobile", PT: "Mobile" },

  // Individual projects (titles, descriptions, metrics)
  "project.1.title": {
    EN: "D'Arcy McGee's Irish Pub",
    PT: "D'Arcy McGee's Irish Pub",
  },
  "project.1.description": {
    EN: "Restaurant website & admin dashboard (demo)",
    PT: "Site de restaurante e painel administrativo (demo)",
  },
  "project.1.metrics": { EN: "Live Client Website", PT: "Site do Cliente" },

  "project.2.title": {
    EN: "Business Process Automation System",
    PT: "Sistema de Automação de Processos",
  },
  "project.2.description": {
    EN: "Custom JavaScript solution integrated with Google Sheets and AppSheet that reduced critical business processes by 90%.",
    PT: "Solução personalizada em JavaScript integrada ao Google Sheets e AppSheet que reduziu processos críticos em 90%.",
  },
  "project.2.metrics": {
    EN: "90% time reduction",
    PT: "Redução de 90% no tempo",
  },

  "project.3.title": {
    EN: "Modern E-Commerce Platform",
    PT: "Plataforma de E-Commerce Moderna",
  },
  "project.3.description": {
    EN: "Full-stack e-commerce solution with authentication, payment processing and admin dashboard.",
    PT: "Solução full-stack de e-commerce com autenticação, processamento de pagamentos e painel administrativo.",
  },
  "project.3.metrics": { EN: "Full-stack solution", PT: "Solução full-stack" },

  "project.4.title": {
    EN: "Project Management Dashboard",
    PT: "Dashboard de Gestão de Projetos",
  },
  "project.4.description": {
    EN: "Collaborative task management app with real-time updates and project analytics.",
    PT: "Aplicativo de gestão de tarefas colaborativo com atualizações em tempo real e análises de projetos.",
  },
  "project.4.metrics": {
    EN: "Team collaboration",
    PT: "Colaboração de equipe",
  },

  "project.5.title": {
    EN: "Big Bang Duel",
    PT: "Big Bang Duel",
  },
  "project.5.description": {
    EN: "Interactive strategy duel game with guest entry, AI/solo play, and a smooth path for player accounts.",
    PT: "Jogo de duelo estratégico interativo com entrada de convidado, gameplay solo com IA e uma jornada simples para contas de jogadores.",
  },
  "project.5.metrics": {
    EN: "Playable game",
    PT: "Jogo jogável",
  },

  "badge.featuredProject": {
    EN: "Featured Project",
    PT: "Projeto em Destaque",
  },
  liveDemo: { EN: "Live Demo", PT: "Ver Demo" },
  code: { EN: "Code", PT: "Código" },
  projectsCTA: {
    EN: "Want to see more of my work or discuss a project?",
    PT: "Quer ver mais do meu trabalho ou discutir um projeto?",
  },
  projectsCTABtn: { EN: "Let's Work Together", PT: "Vamos Trabalhar Juntos" },
  darcyTitle: {
    EN: "D'Arcy McGee's Irish Pub",
    PT: "D'Arcy McGee's Irish Pub",
  },
  darcySummary: {
    EN: "Restaurant website and admin dashboard demo for a modern Irish pub experience.",
    PT: "Demonstração de site e painel administrativo para a experiência de um pub irlandês moderno.",
  },
  darcyStack: { EN: "Stack", PT: "Tecnologias" },
  darcyDemoButton: { EN: "View embedded demo", PT: "Ver demo incorporada" },
  darcyOpenFull: { EN: "Open full demo", PT: "Abrir demo completa" },
  darcyBack: { EN: "Back to Projects", PT: "Voltar aos Projetos" },
  darcyDemoNote: {
    EN: "Portfolio demo — fictional data",
    PT: "Demo do portfólio — dados fictícios",
  },
  darcyIframeFallback: {
    EN: "Unable to load demo preview. Open the full demo instead.",
    PT: "Não foi possível carregar a prévia da demo. Abra a demo completa.",
  },
  darcyAskTitle: {
    EN: "Ask about this project",
    PT: "Pergunte sobre este projeto",
  },
  darcySuggestedQuestions: {
    EN: "Suggested questions",
    PT: "Perguntas sugeridas",
  },
  darcyChatDescription: {
    EN: "Ask about the business goals, workflow, or impact of the D'Arcy McGee's project.",
    PT: "Pergunte sobre os objetivos, o fluxo de trabalho ou o impacto do projeto D'Arcy McGee's.",
  },
  darcyCloseChat: { EN: "Close chat", PT: "Fechar chat" },
  darcyLoadingResponse: {
    EN: "Loading response...",
    PT: "A carregar resposta...",
  },
  darcyChatError: {
    EN: "We couldn't get a response. Please try again.",
    PT: "Não foi possível obter uma resposta. Tente novamente.",
  },
  darcySafetyNote: {
    EN: "Answers use the approved project context and do not expose source code or real operational data.",
    PT: "As respostas usam o contexto aprovado do projeto e não expõem código-fonte nem dados operacionais reais.",
  },
  chatOpen: { EN: "Open chat", PT: "Abrir chat" },
  chatClose: { EN: "Close chat", PT: "Fechar chat" },
  chatGreeting: { EN: "Hi! 👋", PT: "Olá! 👋" },
  chatDescription: {
    EN: "I'm Hugo's assistant. Ask about technology, projects, or skills.",
    PT: "Sou o assistente do Hugo. Pergunte sobre tecnologia, projetos ou habilidades.",
  },
  chatQuestionLabel: { EN: "Question", PT: "Pergunta" },
  chatInputPlaceholder: {
    EN: "Type your question...",
    PT: "Digite sua pergunta...",
  },
  chatSend: { EN: "Send question", PT: "Enviar pergunta" },
  chatLoading: { EN: "Loading response...", PT: "A carregar resposta..." },
  chatError: {
    EN: "An error occurred. Please try again.",
    PT: "Ocorreu um erro. Tente novamente.",
  },
  darcyQuestionProblem: {
    EN: "What problem did this project solve?",
    PT: "Que problema este projeto resolveu?",
  },
  darcyQuestionAdmin: {
    EN: "Why did Hugo build an admin dashboard?",
    PT: "Por que o Hugo criou um painel administrativo?",
  },
  darcyQuestionAi: {
    EN: "How did the AI menu import save time?",
    PT: "Como a importação de menu com IA poupou tempo?",
  },
  darcyQuestionReservations: {
    EN: "Was online reservation available?",
    PT: "Havia reservas online?",
  },
  darcyQuestionData: {
    EN: "Does the demo use real restaurant data?",
    PT: "A demo usa dados reais do restaurante?",
  },
  darcyQuestionImpact: {
    EN: "What impact did the website have?",
    PT: "Qual foi o impacto do site?",
  },

  bigBangTitle: {
    EN: "Big Bang Duel",
    PT: "Big Bang Duel",
  },
  bigBangSummary: {
    EN: "A fast strategy duel game that can be tried immediately as a guest before continuing with Google sign-in for returning players.",
    PT: "Um jogo de duelo estratégico e rápido que pode ser testado imediatamente como visitante antes de continuar com login do Google para jogadores recorrentes.",
  },
  bigBangStack: { EN: "Stack", PT: "Tecnologias" },
  bigBangOpenFull: { EN: "Play full game", PT: "Jogar jogo completo" },
  bigBangReadStory: { EN: "Read full story", PT: "Ler história completa" },
  bigBangBack: { EN: "Back to Projects", PT: "Voltar aos Projetos" },
  bigBangBackToProject: { EN: "Back to project", PT: "Voltar ao projeto" },
  bigBangStoryTitle: {
    EN: "The story behind Big Bang Duel",
    PT: "A história por trás do Big Bang Duel",
  },
  bigBangStoryIntro: {
    EN: "A guest-first game concept that turns a quick browser session into a full strategic duel experience.",
    PT: "Um conceito de jogo pensado para começar rapidamente em navegador e evoluir para uma experiência de duelo estratégico completa.",
  },
  bigBangStoryLoading: {
    EN: "Loading story...",
    PT: "A carregar a história...",
  },
  bigBangStoryError: {
    EN: "The story could not be loaded right now. Please try again later.",
    PT: "A história não pôde ser carregada agora. Tente novamente mais tarde.",
  },
  bigBangDemoButton: { EN: "Live game preview", PT: "Prévia ao vivo do jogo" },
  bigBangDemoNote: {
    EN: "A live preview of the public game experience.",
    PT: "Uma prévia ao vivo da experiência pública do jogo.",
  },
  bigBangPreviewCaption: {
    EN: "Live mobile-format preview of the game",
    PT: "Prévia ao vivo do jogo em formato móvel",
  },
  bigBangPreviewLoading: {
    EN: "Loading preview...",
    PT: "A carregar prévia...",
  },
  bigBangPreviewFallback: {
    EN: "The live preview is unavailable right now. You can still open the full game directly below.",
    PT: "A prévia ao vivo não está disponível no momento. Pode abrir o jogo completo diretamente abaixo.",
  },
  bigBangIframeFallback: {
    EN: "The live preview is unavailable right now. You can still open the full game directly below.",
    PT: "A prévia ao vivo não está disponível no momento. Pode abrir o jogo completo diretamente abaixo.",
  },
  bigBangAskTitle: {
    EN: "Ask about Big Bang Duel",
    PT: "Pergunte sobre o Big Bang Duel",
  },
  bigBangChatDescription: {
    EN: "Ask about guest access, game flow, the player account journey, or Hugo's contribution.",
    PT: "Pergunte sobre acesso de convidado, fluxo do jogo, jornada da conta do jogador ou a contribuição do Hugo.",
  },
  bigBangSuggestedQuestions: {
    EN: "Suggested questions",
    PT: "Perguntas sugeridas",
  },
  bigBangSafetyNote: {
    EN: "Answers use the approved game context and do not expose source code, Firebase configuration, or internal implementation details.",
    PT: "As respostas usam o contexto aprovado do jogo e não expõem código-fonte, configuração do Firebase nem detalhes internos de implementação.",
  },
  bigBangLoadingResponse: {
    EN: "Loading answer...",
    PT: "A carregar resposta...",
  },
  bigBangChatError: {
    EN: "We couldn't get a response. Please try again.",
    PT: "Não foi possível obter uma resposta. Tente novamente.",
  },
  bigBangQuestionGuest: {
    EN: "What can I try as a guest?",
    PT: "O que posso testar como convidado?",
  },
  bigBangQuestionGoogle: {
    EN: "How does Google sign-in work for returning players?",
    PT: "Como funciona o login com Google para jogadores recorrentes?",
  },
  bigBangQuestionJourney: {
    EN: "What is the player account journey at a high level?",
    PT: "Qual é a jornada da conta do jogador em alto nível?",
  },
  bigBangQuestionAvailable: {
    EN: "Where can I access the full game?",
    PT: "Onde posso acessar o jogo completo?",
  },
  bigBangQuestionBuilt: {
    EN: "What did Hugo build in this project?",
    PT: "O que o Hugo construiu neste projeto?",
  },
  bigBangQuestionChallenges: {
    EN: "What were the main challenges?",
    PT: "Quais foram os principais desafios?",
  },
  bigBangTryTitle: {
    EN: "What you can try",
    PT: "O que você pode testar",
  },
  bigBangTryBody: {
    EN: "The game is designed to be approachable from the first click, with a guest path that opens the AI/solo experience immediately and a Google sign-in route for returning players.",
    PT: "O jogo foi pensado para ser acessível desde o primeiro clique, com um caminho de convidado que abre imediatamente a experiência solo com IA e uma rota de login com Google para jogadores recorrentes.",
  },
  bigBangBuiltTitle: {
    EN: "What I built",
    PT: "O que eu construí",
  },
  bigBangChallengesTitle: {
    EN: "Key challenges",
    PT: "Principais desafios",
  },
  bigBangTechTitle: {
    EN: "Technology overview",
    PT: "Visão geral da tecnologia",
  },
  bigBangFaqTitle: { EN: "FAQ", PT: "Perguntas frequentes" },
  bigBangFaqIntro: {
    EN: "Everything you need to know about the project, the game flow, and the guest experience.",
    PT: "Tudo o que precisa saber sobre o projeto, o fluxo do jogo e a experiência de convidado.",
  },
  bigBangTechReact: { EN: "React", PT: "React" },
  bigBangTechTypeScript: { EN: "TypeScript", PT: "TypeScript" },
  bigBangTechVite: { EN: "Vite", PT: "Vite" },
  bigBangTechTailwind: { EN: "Tailwind CSS", PT: "Tailwind CSS" },
  bigBangTechZustand: { EN: "Zustand", PT: "Zustand" },
  bigBangTechFirebaseAuth: { EN: "Firebase Authentication", PT: "Firebase Authentication" },
  bigBangTechFirestore: { EN: "Firestore", PT: "Firestore" },
  bigBangTechRealtime: { EN: "Firebase Realtime Database", PT: "Firebase Realtime Database" },
  bigBangTryItemGuest: {
    EN: "Guest entry for an immediate AI/solo experience",
    PT: "Acesso de convidado para uma experiência imediata solo contra a IA",
  },
  bigBangTryItemGoogle: {
    EN: "Google sign-in for returning players",
    PT: "Login com Google para jogadores recorrentes",
  },
  bigBangTryItemJourney: {
    EN: "A clear account journey that stays understandable at a high level",
    PT: "Uma jornada de conta clara e fácil de compreender em alto nível",
  },
  bigBangTryItemAccess: {
    EN: "Full game access at duel.hugoviegas.dev",
    PT: "Acesso ao jogo completo em duel.hugoviegas.dev",
  },
  bigBangBuiltItemExperience: {
    EN: "Designed the public-facing game experience around a low-friction entry flow.",
    PT: "Desenhei a experiência pública do jogo em torno de um fluxo de entrada simples e acessível.",
  },
  bigBangBuiltItemProduct: {
    EN: "Built the product work needed to support a playable game, identity flow, and user progression model.",
    PT: "Construí o trabalho de produto necessário para suportar um jogo jogável, fluxo de identidade e modelo de progressão do utilizador.",
  },
  bigBangBuiltItemFlow: {
    EN: "Worked across the game experience and the system behind it so the first visit feels responsive and approachable.",
    PT: "Trabalhei em toda a experiência do jogo e no sistema por detrás dela para que a primeira visita seja responsiva e acessível.",
  },
  bigBangChallengeResponsive: {
    EN: "Keeping fast game interactions responsive while the game state updates smoothly.",
    PT: "Manter as interações rápidas do jogo responsivas enquanto o estado do jogo se atualiza sem problemas.",
  },
  bigBangChallengeGuest: {
    EN: "Managing guest access without overstating permanent account or multiplayer capabilities.",
    PT: "Gerir o acesso de convidado sem exagerar as capacidades permanentes de conta ou multijogador.",
  },
  bigBangChallengeSystems: {
    EN: "Separating real-time game concerns from player profile and progression concerns.",
    PT: "Separar as questões de jogo em tempo real das preocupações de perfil e progressão do jogador.",
  },
  bigBangChallengeFriction: {
    EN: "Making the game easy to try without friction, even for players who do not want to commit immediately.",
    PT: "Fazer com que o jogo seja fácil de experimentar sem fricção, mesmo para jogadores que não querem comprometer-se imediatamente.",
  },
  bigBangActionReload: { EN: "Reload", PT: "Recarregar" },
  bigBangActionShoot: { EN: "Shoot", PT: "Atirar" },
  bigBangActionDodge: { EN: "Dodge", PT: "Esquivar" },
  bigBangActionCounter: { EN: "Counterattack", PT: "Contra-golpe" },
  bigBangActionDouble: { EN: "Double Shot", PT: "Tiro duplo" },
  "bigBangFaq.q1": { EN: "How did Big Bang Duel begin?", PT: "Como começou o Big Bang Duel?" },
  "bigBangFaq.a1": {
    EN: "The idea started from a childhood card game, then turned into a browser-based duel experience built and iterated by Hugo in a focused development sprint.",
    PT: "A ideia começou num jogo de cartas de infância e depois evoluiu para uma experiência de duelo online construída e iterada pelo Hugo numa sprint de desenvolvimento focada.",
  },
  "bigBangFaq.q2": { EN: "What inspired the visual identity?", PT: "O que inspirou a identidade visual?" },
  "bigBangFaq.a2": {
    EN: "The visual direction combines a cartoon look with a Wild West mood, shaped through early AI concept exploration and a clear desire for a game that feels complete but easy to understand.",
    PT: "A direção visual combina um visual cartoon com um ambiente de Velho Oeste, moldado por exploração inicial de conceitos com IA e pelo desejo de criar um jogo completo mas fácil de compreender.",
  },
  "bigBangFaq.q3": { EN: "How does the game work?", PT: "Como funciona o jogo?" },
  "bigBangFaq.a3": {
    EN: "Each match is turn-based, each player starts with four health points, and each round is built around choosing one of five actions while managing ammunition, risk, and the opponent's pattern.",
    PT: "Cada partida é por turnos, cada jogador começa com quatro pontos de vida e cada ronda envolve escolher uma de cinco ações enquanto gere munição, risco e o padrão do adversário.",
  },
  "bigBangFaq.q4": { EN: "What do Reload, Shoot, Dodge, Counterattack, and Double Shot do?", PT: "O que fazem Recarregar, Atirar, Esquivar, Contra-golpe e Tiro duplo?" },
  "bigBangFaq.a4": {
    EN: "Reload gains one ammunition; Shoot spends one ammunition and deals damage if the opponent does not defend; Dodge avoids a normal shot and reduces damage from a Double Shot; Counterattack spends one ammunition and returns damage in specific situations; Double Shot spends two ammunition and is a stronger attack with a two-use match limit.",
    PT: "Recarregar ganha uma munição; Atirar gasta uma munição e causa dano se o adversário não se defender; Esquivar evita um tiro normal e reduz dano de Tiro duplo; Contra-golpe gasta uma munição e devolve dano em situações específicas; Tiro duplo gasta duas munições e é um ataque mais forte com um limite de duas utilizações por partida.",
  },
  "bigBangFaq.q5": { EN: "What are the six classes and how does mastery affect them?", PT: "Quais são as seis classes e como a maestria afeta cada uma?" },
  "bigBangFaq.a5": {
    EN: "The six classes are Sharpshooter, Strategist, Sneak, Ricochet, Bloodthirsty, and Healer. Each class has a chance-based effect linked to its mastery level, which makes class specialization matter as players level up.",
    PT: "As seis classes são Atirador, Estrategista, Sorrateiro, Ricochete, Sanguinário e Curandeiro. Cada classe tem um efeito baseado em probabilidade associado ao nível de maestria, o que faz com que a especialização em classes passe a importar à medida que o jogador evolui.",
  },
  "bigBangFaq.q6": { EN: "How does progression work?", PT: "Como funciona a progressão?" },
  "bigBangFaq.a6": {
    EN: "Players unlock and buy characters through progression, complete achievements, and tackle daily, weekly, and monthly missions that reward in-game currency and keep the game varied.",
    PT: "Os jogadores desbloqueiam e compram personagens por progressão, completam conquistas e realizam missões diárias, semanais e mensais que recompensam moeda do jogo e mantêm o jogo variado.",
  },
  "bigBangFaq.q7": { EN: "What can a guest try?", PT: "O que um visitante pode testar como convidado?" },
  "bigBangFaq.a7": {
    EN: "Guests can choose one of the first three characters, play solo against the AI, and learn the main mechanics without committing to an account immediately. Guests cannot play online, access every character, or access the global ranking.",
    PT: "Os convidados podem escolher um dos três primeiros personagens, jogar em modo solo contra a IA e aprender as mecânicas principais sem criar imediatamente uma conta. Os convidados não podem jogar online, usar todos os personagens nem aceder ao ranking global.",
  },
  "bigBangFaq.q8": { EN: "What was Hugo's role in the project?", PT: "Qual foi o papel do Hugo no projeto?" },
  "bigBangFaq.a8": {
    EN: "Hugo built the complete game concept and experience, from rules and art direction to frontend, backend, authentication, progression, and solo AI behaviour, with his brother contributing to early ideas, testing, and balancing feedback.",
    PT: "O Hugo construiu o conceito e a experiência completa do jogo, desde as regras e direção artística até frontend, backend, autenticação, progressão e comportamento da IA solo, com o seu irmão a contribuir para ideias iniciais, testes e feedback de equilíbrio.",
  },
  "bigBangFaq.q9": { EN: "What was the biggest technical and design challenge?", PT: "Qual foi o maior desafio técnico e de design?" },
  "bigBangFaq.a9": {
    EN: "The biggest challenge was balancing the rules and making the AI hard to exploit while still fair. Hugo had to revisit design choices when the AI became too dominant or too predictable.",
    PT: "O maior desafio foi equilibrar as regras e criar uma IA desafiante sem ser injusta. O Hugo teve de rever escolhas de design quando a IA ficou demasiado dominante ou demasiado previsível.",
  },
  "bigBangFaq.q10": { EN: "What comes next for the game?", PT: "O que vem a seguir para o jogo?" },
  "bigBangFaq.a10": {
    EN: "The project is still evolving, with more rules, refinement, and deeper systems planned as the game continues to grow beyond the playable prototype stage.",
    PT: "O projeto continua em evolução, com mais regras, refinamentos e sistemas mais profundos planeados à medida que o jogo cresce para além do estado de protótipo jogável.",
  },

  // Contact
  sendMessageTitle: { EN: "Send a Message", PT: "Enviar uma Mensagem" },
  contactPrompt: {
    EN: "Have a project in mind? I'd love to hear about it.",
    PT: "Tem um projeto em mente? Adoraria saber sobre ele.",
  },
  "placeholder.name": { EN: "Your Name", PT: "Seu Nome" },
  "placeholder.email": { EN: "Your Email", PT: "Seu Email" },
  "placeholder.subject": { EN: "Subject", PT: "Assunto" },
  "placeholder.project": {
    EN: "Tell me about your project...",
    PT: "Me conte sobre seu projeto...",
  },
  "toast.messageSentTitle": { EN: "Message Sent!", PT: "Mensagem Enviada!" },
  "toast.messageSentDesc": {
    EN: "Thank you for reaching out. I'll get back to you within 24 hours.",
    PT: "Obrigado pelo contato. Responderei em até 24 horas.",
  },
  "send.sending": { EN: "Sending...", PT: "Enviando..." },
  "send.sendMessage": { EN: "Send Message", PT: "Enviar Mensagem" },
  "send.successTitle": { EN: "Message Sent!", PT: "Mensagem Enviada!" },
  "send.successMessage": {
    EN: "Thank you for reaching out. I'll get back to you within 24 hours.",
    PT: "Obrigado pelo contato. Responderei em até 24 horas.",
  },
  "send.errorTitle": { EN: "Error", PT: "Erro" },
  "send.errorMessage": {
    EN: "Failed to send message. Please try again or contact me directly.",
    PT: "Falha ao enviar mensagem. Tente novamente ou entre em contato diretamente.",
  },
  "validation.nameRequired": {
    EN: "Name is required",
    PT: "Nome é obrigatório",
  },
  "validation.emailRequired": {
    EN: "Email is required",
    PT: "Email é obrigatório",
  },
  "validation.emailInvalid": {
    EN: "Please enter a valid email",
    PT: "Por favor, insira um email válido",
  },
  "validation.subjectRequired": {
    EN: "Subject is required",
    PT: "Assunto é obrigatório",
  },
  "validation.messageRequired": {
    EN: "Message is required",
    PT: "Mensagem é obrigatória",
  },
  "validation.messageTooShort": {
    EN: "Message must be at least 10 characters",
    PT: "Mensagem deve ter pelo menos 10 caracteres",
  },
  "validation.errorTitle": { EN: "Validation Error", PT: "Erro de Validação" },
  "validation.errorMessage": {
    EN: "Please fix the errors and try again.",
    PT: "Por favor, corrija os erros e tente novamente.",
  },
  connectWithMe: { EN: "Connect With Me", PT: "Conecte-se Comigo" },
  availableForWork: {
    EN: "Available for Work",
    PT: "Disponível para Trabalho",
  },
  availabilityText: {
    EN: "Currently accepting new projects and opportunities.",
    PT: "Atualmente aceitando novos projetos e oportunidades.",
  },
  currentTimeInDublin: {
    EN: "Current time in Dublin",
    PT: "Hora atual em Dublin",
  },

  // Footer
  "footer.copyright": {
    EN: "© {year} Hugo Viegas. All rights reserved.",
    PT: "© {year} Hugo Viegas. Todos os direitos reservados.",
  },
  "footer.madeWith": { EN: "Made with", PT: "Feito com" },
  "footer.inLocation": { EN: "in Dublin, Ireland", PT: "em Dublin, Irlanda" },
  "footer.additionalInfo": {
    EN: "Available for freelance work and full-time opportunities • Fluent in Portuguese & English • Open to remote and hybrid arrangements",
    PT: "Disponível para trabalho freelance e oportunidades em tempo integral • Fluente em Português e Inglês • Aberto a arranjos remotos e híbridos",
  },

  // Stats
  "stats.processReduction": {
    EN: "Process Time Reduction",
    PT: "Redução do Tempo de Processo",
  },
  "stats.viewsGrowth": {
    EN: "Users Supported",
    PT: "Usuários Suportados",
  },
  "stats.yearsExperience": {
    EN: "Years Experience",
    PT: "Anos de Experiência",
  },
  "stats.countriesWorked": { EN: "Countries Worked", PT: "Países Trabalhados" },

  // Experience
  experienceIntro: {
    EN: "A professional journey spanning technical support, system administration, and infrastructure management across Brazil and Ireland, with expertise in Active Directory, Google Workspace, and process automation.",
    PT: "Uma jornada profissional abrangendo suporte técnico, administração de sistemas e gestão de infraestrutura no Brasil e Irlanda, com expertise em Active Directory, Google Workspace e automação de processos.",
  },
  timelineTitle: {
    EN: "Professional Timeline",
    PT: "Linha do Tempo Profissional",
  },
  currentFocusLabel: { EN: "Professional Focus", PT: "Foco Profissional" },
  currentFocusText: {
    EN: "Expert in Active Directory administration, user account management, and technical troubleshooting across Windows and Linux environments. Skilled in Google Workspace administration, system automation, and implementing technical solutions that optimize workflows and enhance system reliability.",
    PT: "Especialista em administração de Active Directory, gestão de contas de usuários e resolução de problemas técnicos em ambientes Windows e Linux. Hábil em administração do Google Workspace, automação de sistemas e implementação de soluções técnicas que otimizam fluxos de trabalho e aumentam confiabilidade dos sistemas.",
  },
  certificationsTitle: {
    EN: "Skills & Certifications",
    PT: "Habilidades & Certificações",
  },
  experienceShowMore: {
    EN: "Show more",
    PT: "Ver mais",
  },
  experienceShowLess: {
    EN: "Show less",
    PT: "Ver menos",
  },

  // Work Experience and Education
  workExperienceTitle: {
    EN: "Work Experience",
    PT: "Experiência Profissional",
  },
  educationTitle: {
    EN: "Education",
    PT: "Educação",
  },

  // ---------------------------------------------------------------- Hero
  loadingProfile: { EN: "Loading profile...", PT: "Carregando perfil..." },
  scrollToAbout: {
    EN: "Scroll to the about section",
    PT: "Rolar para a seção sobre",
  },
  imageFailed: {
    EN: "Image unavailable",
    PT: "Imagem indisponível",
  },

  // ---------------------------------------------------------------- Badges
  "badge.fullStack": {
    EN: "Full-Stack Developer",
    PT: "Desenvolvedor Full-Stack",
  },
  "badge.location": { EN: "Dublin, Ireland", PT: "Dublin, Irlanda" },
  "language.portuguese": { EN: "Portuguese", PT: "Português" },
  "language.english": { EN: "English", PT: "Inglês" },

  // ---------------------------------------------------------------- Skills
  "category.Development": { EN: "Development", PT: "Desenvolvimento" },
  "category.IT Support": { EN: "IT Support", PT: "Suporte de TI" },
  "category.Design": { EN: "Design", PT: "Design" },
  skillsCount: { EN: "skills", PT: "habilidades" },

  "exp.1.period": { EN: "Sep 2024 - Present", PT: "Set 2024 - Atual" },
  "exp.1.location": { EN: "Dublin, Ireland", PT: "Dublin, Irlanda" },
  "exp.1.title": {
    EN: "IT Support Specialist",
    PT: "Especialista em Suporte de TI",
  },
  "exp.1.description": {
    EN: "Resolve advanced software/hardware incidents, perform maintenance and device formatting, and restore operations quickly in a live school environment.",
    PT: "Resolvo incidentes avançados de software/hardware, realizo manutenção e formatação de equipamentos e restauro operações rapidamente em um ambiente escolar em operação.",
  },
  "exp.1.a1": {
    EN: "Resolve advanced software/hardware incidents and perform maintenance",
    PT: "Resolução de incidentes avançados de software/hardware e manutenção",
  },
  "exp.1.a2": {
    EN: "Train staff on internal systems with concise documentation",
    PT: "Treinamento da equipe nos sistemas internos com documentação concisa",
  },
  "exp.1.a3": {
    EN: "Manage user accounts and permissions in Active Directory",
    PT: "Gestão de contas e permissões de usuários no Active Directory",
  },
  "exp.1.a4": {
    EN: "Strengthen access security and compliance through governance",
    PT: "Reforço da segurança de acesso e conformidade por meio de governança",
  },

  "exp.2.period": { EN: "May 2020 - Jun 2022", PT: "Mai 2020 - Jun 2022" },
  "exp.2.location": {
    EN: "Belo Horizonte, Brazil",
    PT: "Belo Horizonte, Brasil",
  },
  "exp.2.title": {
    EN: "IT Technical Support",
    PT: "Suporte Técnico de TI",
  },
  "exp.2.description": {
    EN: "Supported corporate systems and handled computer maintenance/formatting with focus on clarity and speed.",
    PT: "Suporte a sistemas corporativos e manutenção/formatação de computadores com foco em clareza e agilidade.",
  },
  "exp.2.a1": {
    EN: "Built custom system integrated with administrative platforms",
    PT: "Construção de sistema próprio integrado às plataformas administrativas",
  },
  "exp.2.a2": {
    EN: "Reduced process times by 90% using JavaScript with Google libraries",
    PT: "Redução de 90% no tempo de processos usando JavaScript com bibliotecas Google",
  },
  "exp.2.a3": {
    EN: "Collaborated on proposal and budgeting materials",
    PT: "Colaboração em materiais de propostas e orçamentos",
  },
  "exp.2.a4": {
    EN: "Aligned technology solutions to business goals",
    PT: "Alinhamento das soluções de tecnologia aos objetivos do negócio",
  },

  "exp.3.period": { EN: "Jan 2019 - Feb 2020", PT: "Jan 2019 - Fev 2020" },
  "exp.3.location": { EN: "Betim, Brazil", PT: "Betim, Brasil" },
  "exp.3.title": {
    EN: "Designer & Social Media Manager",
    PT: "Designer e Gestor de Social Media",
  },
  "exp.3.description": {
    EN: "Created visual identities and user-friendly websites with a focus on usability and conversion.",
    PT: "Criação de identidades visuais e sites amigáveis com foco em usabilidade e conversão.",
  },
  "exp.3.a1": {
    EN: "Managed social media accounts, increasing views by up to 20%",
    PT: "Gestão de redes sociais, aumentando as visualizações em até 20%",
  },
  "exp.3.a2": {
    EN: "Created visual identities and user-friendly websites",
    PT: "Criação de identidades visuais e sites amigáveis",
  },
  "exp.3.a3": {
    EN: "Drove client engagement through user-centered design",
    PT: "Aumento do engajamento dos clientes com design centrado no usuário",
  },
  "exp.3.a4": {
    EN: "Focused on usability and conversion optimization",
    PT: "Foco em usabilidade e otimização de conversão",
  },

  "exp.4.period": { EN: "Sep 2024 - Sep 2025", PT: "Set 2024 - Set 2025" },
  "exp.4.location": { EN: "Dublin, Ireland", PT: "Dublin, Irlanda" },
  "exp.4.title": {
    EN: "Computer Science Student",
    PT: "Estudante de Ciência da Computação",
  },
  "exp.4.description": {
    EN: "Pursuing a Computer Science degree (EQF Level 8) with focus on software development and modern technologies.",
    PT: "Cursando Ciência da Computação (EQF Nível 8) com foco em desenvolvimento de software e tecnologias modernas.",
  },
  "exp.4.a1": {
    EN: "Full-stack web development specialization",
    PT: "Especialização em desenvolvimento web full-stack",
  },
  "exp.4.a2": {
    EN: "Advanced programming and algorithms",
    PT: "Programação avançada e algoritmos",
  },
  "exp.4.a3": {
    EN: "Database design and management",
    PT: "Modelagem e gestão de bancos de dados",
  },
  "exp.4.a4": {
    EN: "Software engineering principles",
    PT: "Princípios de engenharia de software",
  },

  "exp.5.period": { EN: "Mar 2018 - Jul 2021", PT: "Mar 2018 - Jul 2021" },
  "exp.5.location": { EN: "Itaúna, Brazil", PT: "Itaúna, Brasil" },
  "exp.5.title": {
    EN: "Analysis and Systems Development",
    PT: "Análise e Desenvolvimento de Sistemas",
  },
  "exp.5.description": {
    EN: "Completed a technologist degree in Analysis and Systems Development, building foundational knowledge in technology and business processes.",
    PT: "Concluí o curso de tecnólogo em Análise e Desenvolvimento de Sistemas, construindo a base em tecnologia e processos de negócio.",
  },
  "exp.5.a1": {
    EN: "Technology fundamentals and systems analysis",
    PT: "Fundamentos de tecnologia e análise de sistemas",
  },
  "exp.5.a2": {
    EN: "Business process analysis and optimization",
    PT: "Análise e otimização de processos de negócio",
  },
  "exp.5.a3": {
    EN: "Project management and development methodologies",
    PT: "Gestão de projetos e metodologias de desenvolvimento",
  },
  "exp.5.a4": {
    EN: "Communication and technical documentation skills",
    PT: "Comunicação e documentação técnica",
  },

  "cert.1": {
    EN: "JavaScript (Node.js, Express)",
    PT: "JavaScript (Node.js, Express)",
  },
  "cert.2": { EN: "Google Apps Script", PT: "Google Apps Script" },
  "cert.3": {
    EN: "Google Workspace Administration",
    PT: "Administração do Google Workspace",
  },
  "cert.4": {
    EN: "Active Directory Management",
    PT: "Gestão de Active Directory",
  },
  "cert.5": {
    EN: "Adobe Creative Suite (Illustrator, Photoshop, InDesign)",
    PT: "Adobe Creative Suite (Illustrator, Photoshop, InDesign)",
  },
  "cert.6": {
    EN: "ITSM Practices & L2/L3 Support",
    PT: "Práticas de ITSM e Suporte N2/N3",
  },
  "cert.7": {
    EN: "Technical Documentation",
    PT: "Documentação Técnica",
  },
  "cert.8": {
    EN: "Access Governance & Security",
    PT: "Governança de Acesso e Segurança",
  },

  "focus.1": {
    EN: "Full-Stack Development",
    PT: "Desenvolvimento Full-Stack",
  },
  "focus.2": { EN: "Process Automation", PT: "Automação de Processos" },
  "focus.3": {
    EN: "Google Workspace Integration",
    PT: "Integração com Google Workspace",
  },
  "focus.4": {
    EN: "Technical Documentation",
    PT: "Documentação Técnica",
  },
  "focus.5": {
    EN: "Security & Compliance",
    PT: "Segurança e Conformidade",
  },
  "focus.6": { EN: "User Experience", PT: "Experiência do Usuário" },

  // --------------------------------------------------------------- Contact
  "contact.emailLabel": { EN: "Email", PT: "Email" },
  "contact.locationLabel": { EN: "Location", PT: "Localização" },
  "contact.responseLabel": { EN: "Response Time", PT: "Tempo de Resposta" },
  "contact.responseValue": { EN: "Within 24 hours", PT: "Em até 24 horas" },

  // ---------------------------------------------------------- World clocks
  "clocks.currentTime": { EN: "Current time", PT: "Hora atual" },
  "clocks.offsetNow": { EN: "Offset now:", PT: "Fuso agora:" },

  // ---------------------------------------------------------------- Footer
  formulaDAssistant: {
    EN: "Formula D assistant",
    PT: "Assistente Formula D",
  },

  // ------------------------------------------------------- Navigation / a11y
  "nav.me": { EN: "Me", PT: "Eu" },
  "aria.switchToPt": {
    EN: "Switch to Portuguese",
    PT: "Mudar para português",
  },
  "aria.switchToEn": { EN: "Switch to English", PT: "Mudar para inglês" },
  "aria.toggleTheme": { EN: "Toggle theme", PT: "Alternar tema" },
  "aria.openMenu": { EN: "Open menu", PT: "Abrir menu" },
  "aria.closeMenu": { EN: "Close menu", PT: "Fechar menu" },
  "aria.navigateTo": { EN: "Navigate to", PT: "Ir para" },
  "aria.backToTop": { EN: "Back to top", PT: "Voltar ao topo" },

  // -------------------------------------------------------------- Not found
  "notFound.title": {
    EN: "404 - Page Not Found",
    PT: "404 - Página Não Encontrada",
  },
  "notFound.description": {
    EN: "The page you're looking for doesn't exist.",
    PT: "A página que você procura não existe.",
  },
  "notFound.cta": { EN: "Return to Home", PT: "Voltar ao Início" },

  fullStory: {
    EN: `A long time ago I found a spark. At eight years old, a first phone became my training droid — downloading .jar games, tweaking settings and customizing things were my first experiments with systems (my tiny training droid did more beeps than features). At eleven, curiosity became a mission: a Lego robotics championship at school. We built and programmed a robot with a drag‑and‑drop language, won regionals and reached nationals. Tools were humble, but the lesson was clear: like a young Padawan, I had found a path worth mastering (no robes required).

Years later, at seventeen, a first job as a supermarket apprentice funded my first laptop (my first cockpit). With it came image and video editing, system restores, and an obsession with how things work under the hood. At eighteen, formal training in Analysis and Systems Development gave structure to that curiosity — programming logic, mathematics, databases and web development became the foundation for building real systems.

In 2021 a small venture took shape with a friend and my older brother: a videomaker and social media studio (my brother the wise co‑pilot). It sharpened storytelling and design, but it also revealed a deeper calling — solving operational problems with code. In IT at a services company, in stolen hours, AppSheet on top of Google Sheets became the engine for an internal app that simplified daily processes (a small rebellion against slow processes). I learned HR and finance workflows end‑to‑end to design it properly. The result: the timesheet close for 400+ employees fell from four days to about one. Curiosity met impact; making messy workflows simple became my signature.

Ireland came next. A year of saving made the move possible for better opportunities and full English immersion. Two years in hospitality accelerated fluency and cultural understanding. In September 2024, the path doubled down: a Higher Diploma in Science of Computing at CCT College and an IT role at Erin College began the same month. The academic effort paid off with First‑Class results. At work, spreadsheet automation evolved with AI prompting and sharper programming logic — projects across departments were streamlined and each week revealed another layer of automation possible within Google's ecosystem.

Alongside this, a practical challenge from the restaurant job led to building the D'Arcy McGee's website. With AI tooling, UX study and hands‑on engineering, a fast, functional site shipped — proof that delivering quick, reliable value is a repeatable skill (almost a pixel‑perfect lightsaber, but not quite). Today I seek a front‑end or full‑stack role that values curiosity, product sense and the ability to turn complex processes into elegant, measurable solutions. The drive is the same as that eleven‑year‑old at the robotics table: learn fast, build well, and keep moving.
`,

    PT: `Há muito tempo encontrei uma faísca. Aos oito anos, um primeiro celular virou meu pequeno droide de treino — baixar joguinhos .jar, mexer em configurações e personalizar tudo foram meus primeiros experimentos com sistemas (meu droide fazia mais bipes que milagres). Aos onze, a curiosidade virou missão: um campeonato escolar de robótica Lego. Construímos e programamos um robô com uma linguagem de arrastar e soltar, vencemos a etapa regional e chegamos ao nacional. As ferramentas eram simples, mas a lição ficou clara: como um jovem Padawan, encontrei um caminho a ser dominado (sem túnicas, por enquanto).

Anos depois, aos dezessete, o primeiro emprego como aprendiz de supermercado financiou meu primeiro notebook (meu primeiro cockpit). Com ele vieram edição de imagem e vídeo, restaurações de sistema e a obsessão por entender como as coisas funcionam por baixo do capô. Aos dezoito, a formação em Análise e Desenvolvimento de Sistemas deu estrutura a essa curiosidade — lógica de programação, matemática, bancos de dados e desenvolvimento web tornaram‑se a base para construir sistemas reais.

Em 2021, com um amigo e meu irmão mais velho, nasceu um pequeno estúdio de videomaker e social media (meu irmão, o co‑piloto sábio). Isso aprimorou a narrativa e o design, mas também revelou um chamado mais profundo — resolver problemas operacionais com código. Em TI, numa empresa de prestação de serviços, nas horas vagas o AppSheet sobre Google Sheets virou o motor de um app interno que simplificou processos diários (uma pequena rebelião contra processos lentos). Aprendi os fluxos de RH e financeiro ponta a ponta para desenhá‑lo bem. O resultado: o fechamento de ponto de mais de 400 colaboradores caiu de quatro dias para cerca de um. Curiosidade virou impacto; transformar processos caóticos em soluções simples virou minha marca.

Veio então a Irlanda. Um ano de economias tornou a mudança possível, em busca de melhores oportunidades e imersão no inglês. Dois anos na hospitalidade aceleraram a fluência e o entendimento cultural. Em setembro de 2024, a jornada se intensificou: um Higher Diploma em Science of Computing no CCT College e um cargo de TI no Erin College começaram no mesmo mês. O esforço acadêmico rendeu First‑Class. No trabalho, as automações em planilhas evoluíram com prompting de IA e lógica de programação mais robusta — projetos em vários departamentos foram otimizados e, a cada semana, surgia uma nova camada de automação possível dentro do ecossistema Google.

Paralelamente, um desafio prático do restaurante onde trabalhava levou à construção do site do D'Arcy McGee's. Com ferramentas de IA, estudo de UX e engenharia prática, saiu um site rápido e funcional — prova de que entregar valor com rapidez é uma habilidade repetível (quase um sabre de luz em pixels). Hoje procuro uma vaga front‑end ou full‑stack que valorize essa combinação de curiosidade, senso de produto e capacidade de transformar processos complexos em soluções elegantes e mensuráveis. A motivação é a mesma daquele garoto de onze anos na mesa de robótica: aprender rápido, construir bem e seguir em frente.`,
  },

  // Contact info labels
  contactEmailLabel: { EN: "Email", PT: "Email" },
  contactLocationLabel: { EN: "Location", PT: "Localização" },
  contactLocationValue: { EN: "Dublin, Ireland", PT: "Dublin, Irlanda" },
  contactResponseLabel: { EN: "Response Time", PT: "Tempo de Resposta" },
  contactResponseValue: { EN: "Within 24 hours", PT: "Em até 24 horas" },

  // Spoken languages
  portuguese: { EN: "Portuguese", PT: "Português" },
  english: { EN: "English", PT: "Inglês" },

  // Fun Stuff / Widgets section
  funStuffTitle: { EN: "Fun Stuff", PT: "Fun Stuff" },
  funStuffDescription: {
    EN: "Some experiments and interactive toys I've built.",
    PT: "Alguns experimentos e brinquedos interativos que eu criei.",
  },

  // Programming Skills section
  programmingSkillsTitle: {
    EN: "Programming Languages & Tools",
    PT: "Linguagens de Programação & Ferramentas",
  },
  itSkillsTitle: {
    EN: "IT & Infrastructure",
    PT: "TI & Infraestrutura",
  },
};

export const getTranslation = (key: string, language: LanguageCode): string => {
  return translations[key]?.[language] || key;
};
