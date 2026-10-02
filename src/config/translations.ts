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
    EN: "Software Developer",
    PT: "Desenvolvedor de Software",
  },
  description: {
    EN: "I design and build full-stack web platforms and automation tools with React, TypeScript, and Google Apps Script, including an internal ERP supporting 120+ users. 5+ years across full-stack development and IT infrastructure. Based in Dublin, Ireland.",
    PT: "Projeto e desenvolvo plataformas web full-stack e ferramentas de automação com React, TypeScript e Google Apps Script, incluindo um ERP interno que atende 120+ usuários. 5+ anos de experiência em desenvolvimento full-stack e infraestrutura de TI. Baseado em Dublin, Irlanda.",
  },
  viewProjects: { EN: "View Projects", PT: "Ver projetos" },
  // Draft value line from the redesign brief, pending Hugo's approval.
  heroValue: {
    EN: "I build practical digital solutions, block by block.",
    PT: "Construo soluções digitais práticas, bloco por bloco.",
  },
  heroLocation: { EN: "Dublin, Ireland", PT: "Dublin, Irlanda" },
  heroDownloadCv: { EN: "Download CV", PT: "Baixar currículo" },
  heroFlipHint: { EN: "Click to flip", PT: "Clique para virar" },
  heroFlipLabel: { EN: "Flip picture. Showing", PT: "Virar imagem. Mostrando" },
  heroFacePhoto: { EN: "a photo of Hugo", PT: "uma foto do Hugo" },
  heroFaceMinifig: { EN: "Hugo as a LEGO minifigure", PT: "o Hugo como minifigura LEGO" },
  heroNowShowing: { EN: "Now showing", PT: "Agora mostrando" },
  heroSceneAlt: {
    EN: "LEGO scene: Hugo's minifigure working at his desk in Dublin",
    PT: "Cena LEGO: a minifigura do Hugo trabalhando em sua mesa em Dublin",
  },
  getInTouch: { EN: "Get In Touch", PT: "Entre em Contato" },
  seeResume: { EN: "See Resume", PT: "Ver Currículo" },
  downloadResume: { EN: "Download Resume", PT: "Baixar Currículo" },

  // About Section
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
  projectsHeading: { EN: "Projects", PT: "Projetos" },
  projectsLead: { EN: "Selected work.", PT: "Trabalhos selecionados." },
  projectPage: { EN: "Project page", PT: "Página do projeto" },
  projectLive: { EN: "Live site", PT: "Ver site" },
  projectCode: { EN: "Code", PT: "Código" },
  projectsPrev: { EN: "Previous projects", PT: "Projetos anteriores" },
  projectsNext: { EN: "Next projects", PT: "Próximos projetos" },
  projectsPage: { EN: "Show project", PT: "Mostrar projeto" },
  projectsCarousel: { EN: "carousel", PT: "carrossel" },
  experienceHeading: { EN: "Experience", PT: "Experiência" },
  skillsHeading: { EN: "Skills", PT: "Habilidades" },
  skillsProgramming: { EN: "Programming", PT: "Programação" },
  skillsIt: { EN: "IT and infrastructure", PT: "TI e infraestrutura" },
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
    EN: "Software Developer with 5+ years of combined experience in full-stack development and IT infrastructure. I build web platforms and automation tools with React, TypeScript, and Google Apps Script, including an internal ERP supporting 120+ users in Dublin.",
    PT: "Desenvolvedor de Software com 5+ anos de experiência combinada em desenvolvimento full-stack e infraestrutura de TI. Construo plataformas web e ferramentas de automação com React, TypeScript e Google Apps Script, incluindo um ERP interno que atende 120+ usuários em Dublin.",
  },
  myJourney: { EN: "Professional Background", PT: "Histórico Profissional" },


  technicalSkills: { EN: "Technical Skills", PT: "Habilidades Técnicas" },
  languagesTitle: { EN: "Languages", PT: "Idiomas" },
  native: { EN: "Native", PT: "Nativo" },
  c1Proficiency: { EN: "C1 Proficiency", PT: "Proficiência C1" },

  // Projects
  projectsIntro: {
    EN: "Selected projects I designed and built, from a client restaurant website to a browser strategy game.",
    PT: "Projetos selecionados que projetei e desenvolvi, de um site para um restaurante cliente a um jogo de estratégia no navegador.",
  },
  "category.All": { EN: "All", PT: "Todos" },
  "category.Automation": { EN: "Automation", PT: "Automação" },
  "category.Web Development": {
    EN: "Web Development",
    PT: "Desenvolvimento Web",
  },
  "category.Mobile": { EN: "Mobile", PT: "Mobile" },

  // Individual projects (titles, descriptions, metrics)
  "project.1.metrics": { EN: "Live Client Website", PT: "Site do Cliente" },

  "project.2.metrics": {
    EN: "Four days to about one",
    PT: "De quatro dias para cerca de um",
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
  darcyStack: { EN: "Stack", PT: "Tecnologias" },
  projectTryIt: { EN: "Try it", PT: "Experimente" },
  projectLoadDemo: { EN: "Load the demo", PT: "Carregar a demo" },
  projectLoadNote: { EN: "Loads only when you ask.", PT: "Carrega só quando você pedir." },
  projectFacts: { EN: "Key facts", PT: "Fatos principais" },
  factType: { EN: "Type", PT: "Tipo" },
  factStack: { EN: "Stack", PT: "Tecnologias" },
  factDemo: { EN: "Demo", PT: "Demo" },
  factDemoValue: { EN: "Runs in the browser", PT: "Roda no navegador" },
  projectNext: { EN: "Next project", PT: "Próximo projeto" },
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
  darcySafetyNote: {
    EN: "Answers use the approved project context and do not expose source code or real operational data.",
    PT: "As respostas usam o contexto aprovado do projeto e não expõem código-fonte nem dados operacionais reais.",
  },
  // ------------------------------------------------ Portfolio assistant
  "assistant.title": { EN: "Portfolio assistant", PT: "Assistente do portfólio" },
  "assistant.projectTitle": { EN: "Project assistant", PT: "Assistente do projeto" },
  "assistant.ai": { EN: "AI", PT: "IA" },
  "assistant.notHugo": {
    EN: "Not Hugo",
    PT: "Não é o Hugo",
  },
  "assistant.welcomeTitle": { EN: "Ask about Hugo's work", PT: "Pergunte sobre o trabalho do Hugo" },
  "assistant.welcomeText": {
    EN: "I'm an AI assistant, not Hugo. I answer from his approved portfolio notes: projects, experience, skills and education.",
    PT: "Sou um assistente de IA, não o Hugo. Respondo com base nas notas aprovadas do portfólio: projetos, experiência, habilidades e formação.",
  },
  "assistant.projectWelcomeText": {
    EN: "I'm an AI assistant, not Hugo. I answer from the approved notes for this project.",
    PT: "Sou um assistente de IA, não o Hugo. Respondo com base nas notas aprovadas deste projeto.",
  },
  "assistant.placeholder": { EN: "Ask about Hugo's work…", PT: "Pergunte sobre o trabalho do Hugo…" },
  "assistant.projectPlaceholder": { EN: "Ask about this project…", PT: "Pergunte sobre este projeto…" },
  "assistant.limitPlaceholder": { EN: "Question limit reached", PT: "Limite de perguntas atingido" },
  "assistant.inputLabel": { EN: "Ask a question about Hugo's work", PT: "Faça uma pergunta sobre o trabalho do Hugo" },
  "assistant.send": { EN: "Send question", PT: "Enviar pergunta" },
  "assistant.who": { EN: "Assistant", PT: "Assistente" },
  "assistant.you": { EN: "You", PT: "Você" },
  "assistant.from": { EN: "From", PT: "Fonte" },
  "assistant.answering": { EN: "Looking through Hugo's notes…", PT: "Consultando as notas do Hugo…" },
  "assistant.error": {
    EN: "I couldn't get an answer just now. Check your connection and try again.",
    PT: "Não consegui responder agora. Verifique sua conexão e tente novamente.",
  },
  "assistant.retry": { EN: "Try again", PT: "Tentar novamente" },
  "assistant.limit": {
    EN: "You've reached the question limit for now. Email Hugo at hugoviegas3.1@gmail.com or try again later.",
    PT: "Você atingiu o limite de perguntas por enquanto. Escreva para o Hugo em hugoviegas3.1@gmail.com ou tente mais tarde.",
  },
  "assistant.disclaimer": {
    EN: "AI answers can be wrong. Check the CV or contact Hugo for details.",
    PT: "Respostas de IA podem errar. Confira o currículo ou fale com o Hugo.",
  },
  "assistant.newChat": { EN: "Start a new chat", PT: "Começar nova conversa" },
  "assistant.open": { EN: "Open portfolio assistant", PT: "Abrir assistente do portfólio" },
  "assistant.close": { EN: "Close portfolio assistant", PT: "Fechar assistente do portfólio" },
  "assistant.tooltip": { EN: "Ask the portfolio assistant", PT: "Pergunte ao assistente do portfólio" },
  "assistant.context": { EN: "Context", PT: "Contexto" },
  "assistant.start": { EN: "Start a conversation", PT: "Começar uma conversa" },
  "assistant.hide": { EN: "Hide assistant", PT: "Esconder assistente" },
  "assistant.conversation": { EN: "Conversation", PT: "Conversa" },
  "assistant.suggest1": { EN: "What does Hugo do at Erin College?", PT: "O que o Hugo faz no Erin College?" },
  "assistant.suggest2": { EN: "Which projects can I try?", PT: "Quais projetos posso testar?" },
  "assistant.suggest3": { EN: "What is Hugo's main tech stack?", PT: "Qual é a stack principal do Hugo?" },
  "assistant.suggest4": { EN: "How can I contact Hugo?", PT: "Como posso falar com o Hugo?" },
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
  bigBangStack: { EN: "Stack", PT: "Tecnologias" },
  bigBangOpenFull: { EN: "Play full game", PT: "Jogar jogo completo" },
  bigBangReadStory: { EN: "Read full story", PT: "Ler história completa" },
  bigBangBack: { EN: "Back to Projects", PT: "Voltar aos Projetos" },
  bigBangBackToProject: { EN: "Back to project", PT: "Voltar ao projeto" },
  bigBangStoryTitle: {
    EN: "The story behind Big Bang Duel",
    PT: "A história por trás do Big Bang Duel",
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
  bigBangTechTitle: {
    EN: "Technology overview",
    PT: "Visão geral da tecnologia",
  },
  bigBangFaqTitle: { EN: "FAQ", PT: "Perguntas frequentes" },
  bigBangFaqIntro: {
    EN: "Everything you need to know about the project, the game flow, and the guest experience.",
    PT: "Tudo o que precisa saber sobre o projeto, o fluxo do jogo e a experiência de convidado.",
  },
  bigBangActionReload: { EN: "Reload", PT: "Recarregar" },
  bigBangActionShoot: { EN: "Shoot", PT: "Atirar" },
  bigBangActionDodge: { EN: "Dodge", PT: "Esquivar" },
  bigBangActionCounter: { EN: "Counterattack", PT: "Contra-golpe" },
  bigBangActionDouble: { EN: "Double Shot", PT: "Tiro duplo" },

  // Contact
  sendMessageTitle: { EN: "Send a Message", PT: "Enviar uma Mensagem" },
  contactHeading: { EN: "Contact", PT: "Contato" },
  contactLead: {
    EN: "Send a message or reach me directly.",
    PT: "Envie uma mensagem ou fale comigo diretamente.",
  },
  aboutHeading: { EN: "About", PT: "Sobre" },
  storyCta: { EN: "Read my story", PT: "Ler minha história" },
  storySub: {
    EN: "A short animated intro. Text version available.",
    PT: "Uma breve introdução animada. Versão em texto disponível.",
  },
  footerFun: { EN: "Fun stuff", PT: "Coisas divertidas" },
  contactPrompt: {
    EN: "Have a project in mind? I'd love to hear about it.",
    PT: "Tem um projeto em mente? Adoraria saber sobre ele.",
  },
  "label.name": { EN: "Name", PT: "Nome" },
  "label.email": { EN: "Email", PT: "Email" },
  "label.subject": { EN: "Subject", PT: "Assunto" },
  "label.message": { EN: "Message", PT: "Mensagem" },
  "placeholder.name": { EN: "Your Name", PT: "Seu Nome" },
  "placeholder.email": { EN: "Your Email", PT: "Seu Email" },
  "placeholder.subject": { EN: "Subject", PT: "Assunto" },
  "placeholder.project": {
    EN: "Tell me about your project...",
    PT: "Me conte sobre seu projeto...",
  },
  "toast.messageSentTitle": { EN: "Message Sent!", PT: "Mensagem Enviada!" },
  "toast.messageSentDesc": {
    EN: "Thanks, your message was sent.",
    PT: "Obrigado, sua mensagem foi enviada.",
  },
  "send.sending": { EN: "Sending...", PT: "Enviando..." },
  "send.sendMessage": { EN: "Send Message", PT: "Enviar Mensagem" },
  "send.successTitle": { EN: "Message Sent!", PT: "Mensagem Enviada!" },
  "send.successMessage": {
    EN: "Thanks, your message was sent.",
    PT: "Obrigado, sua mensagem foi enviada.",
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
    EN: "Full-stack development and IT infrastructure experience across Ireland and Brazil, from an internal ERP platform to workflow automation.",
    PT: "Experiência em desenvolvimento full-stack e infraestrutura de TI na Irlanda e no Brasil, de uma plataforma ERP interna à automação de fluxos de trabalho.",
  },
  timelineTitle: {
    EN: "Professional Timeline",
    PT: "Linha do Tempo Profissional",
  },
  currentFocusLabel: { EN: "Professional Focus", PT: "Foco Profissional" },
  currentFocusText: {
    EN: "Building full-stack web platforms and automation with React, TypeScript, Node.js, and Google Apps Script, backed by hands-on experience with Windows/Linux, Active Directory, and Google Workspace.",
    PT: "Desenvolvimento de plataformas web full-stack e automações com React, TypeScript, Node.js e Google Apps Script, com experiência prática em Windows/Linux, Active Directory e Google Workspace.",
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
  heroImageAlt: {
    EN: "Hugo Viegas, Software Developer",
    PT: "Hugo Viegas, Desenvolvedor de Software",
  },
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
  "aria.mainNavigation": {
    EN: "Main navigation",
    PT: "Navegação principal",
  },
  "aria.openMenu": { EN: "Open menu", PT: "Abrir menu" },
  "aria.closeMenu": { EN: "Close menu", PT: "Fechar menu" },
  "aria.navigateTo": { EN: "Navigate to", PT: "Ir para" },
  "aria.backToTop": { EN: "Back to top", PT: "Voltar ao topo" },
  "nav.skills": { EN: "Skills", PT: "Habilidades" },
  "nav.allProjects": { EN: "All projects", PT: "Todos os projetos" },
  "nav.sections": { EN: "Sections", PT: "Seções" },
  "nav.currentSection": { EN: "Current section", PT: "Seção atual" },
  "nav.openSections": { EN: "Open section menu", PT: "Abrir menu de seções" },
  "nav.projectTypeBigBang": { EN: "Browser strategy game", PT: "Jogo de estratégia no navegador" },
  "nav.projectTypeDarcy": { EN: "Client website · Irish pub", PT: "Site de cliente · pub irlandês" },

  // -------------------------------------------------------- Top controls
  "controls.settings": { EN: "Site settings", PT: "Configurações do site" },
  "controls.languageLabelEn": {
    EN: "Language: English. Switch to Portuguese (Mudar para português)",
    PT: "Language: English. Switch to Portuguese (Mudar para português)",
  },
  "controls.languageLabelPt": {
    EN: "Idioma: português. Mudar para inglês (Switch to English)",
    PT: "Idioma: português. Mudar para inglês (Switch to English)",
  },
  "controls.darkTheme": { EN: "Dark theme", PT: "Tema escuro" },
  "controls.darkOn": { EN: "Dark theme on", PT: "Tema escuro ativado" },
  "controls.lightOn": { EN: "Light theme on", PT: "Tema claro ativado" },
  "controls.spaceship": { EN: "Background spaceship", PT: "Nave ao fundo" },
  "controls.spaceshipShow": { EN: "Show the spaceship", PT: "Mostrar a nave" },
  "controls.spaceshipHide": { EN: "Hide the spaceship", PT: "Esconder a nave" },
  "controls.spaceshipDarkOnly": {
    EN: "Show the spaceship (it flies in the dark theme)",
    PT: "Mostrar a nave (ela voa no tema escuro)",
  },
  "controls.spaceshipReduced": {
    EN: "Off while your device prefers reduced motion",
    PT: "Desligada enquanto seu dispositivo prefere menos movimento",
  },
  "controls.spaceshipOnMsg": { EN: "Spaceship on", PT: "Nave ligada" },
  "controls.spaceshipOffMsg": { EN: "Spaceship off", PT: "Nave desligada" },

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

  // ---------------------------------------------------------------- SEO
  "seo.breadcrumbHome": { EN: "Home", PT: "Início" },
  "seo.home.title": {
    EN: "Hugo Viegas | Software Developer in Dublin, Ireland",
    PT: "Hugo Viegas | Desenvolvedor de Software em Dublin, Irlanda",
  },
  "seo.home.description": {
    EN: "Hugo Viegas is a Software Developer in Dublin, Ireland, with 5+ years of combined experience in full-stack development and IT infrastructure. Projects built with React, TypeScript, and Google Apps Script, including an internal ERP supporting 120+ users.",
    PT: "Hugo Viegas é Desenvolvedor de Software em Dublin, Irlanda, com 5+ anos de experiência combinada em desenvolvimento full-stack e infraestrutura de TI. Projetos com React, TypeScript e Google Apps Script, incluindo um ERP interno que atende 120+ usuários.",
  },
  "seo.darcy.title": {
    EN: "D'Arcy McGee's Restaurant Website | Hugo Viegas",
    PT: "Site do Restaurante D'Arcy McGee's | Hugo Viegas",
  },
  "seo.darcy.description": {
    EN: "Restaurant website and admin dashboard for D'Arcy McGee's Irish pub, designed and built by Hugo Viegas. Shown as a portfolio demo with fictional data.",
    PT: "Site e painel administrativo para o pub irlandês D'Arcy McGee's, projetados e desenvolvidos por Hugo Viegas. Apresentado como demo do portfólio com dados fictícios.",
  },
  "seo.bigBang.title": {
    EN: "Big Bang Duel Strategy Game | Hugo Viegas",
    PT: "Jogo de Estratégia Big Bang Duel | Hugo Viegas",
  },
  "seo.bigBang.description": {
    EN: "Big Bang Duel is a fast browser strategy duel game by Hugo Viegas. Play immediately as a guest, or continue with Google sign-in as a returning player.",
    PT: "Big Bang Duel é um jogo de duelo estratégico e rápido no navegador, criado por Hugo Viegas. Jogue na hora como visitante ou continue com login do Google.",
  },
  "seo.bigBangStory.title": {
    EN: "The Story Behind Big Bang Duel | Hugo Viegas",
    PT: "A História por Trás do Big Bang Duel | Hugo Viegas",
  },
  "seo.bigBangStory.description": {
    EN: "How Hugo Viegas turned a childhood card game into Big Bang Duel, a browser strategy duel game.",
    PT: "Como Hugo Viegas transformou um jogo de cartas da infância no Big Bang Duel, um jogo de duelo estratégico no navegador.",
  },
  "seo.archived.description": {
    EN: "Archived experiment by Hugo Viegas. Not part of the main portfolio.",
    PT: "Experimento arquivado de Hugo Viegas. Não faz parte do portfólio principal.",
  },
  "seo.formulaD.title": {
    EN: "Formula D (archived) | Hugo Viegas",
    PT: "Formula D (arquivado) | Hugo Viegas",
  },
  "seo.lightsaber.title": {
    EN: "Lightsaber Viewer (archived) | Hugo Viegas",
    PT: "Visualizador de Sabre de Luz (arquivado) | Hugo Viegas",
  },
  "seo.microFalcon.title": {
    EN: "Micro Falcon Viewer (archived) | Hugo Viegas",
    PT: "Visualizador Micro Falcon (arquivado) | Hugo Viegas",
  },
  "seo.starship.title": {
    EN: "Starship Demo (archived) | Hugo Viegas",
    PT: "Demo de Nave Espacial (arquivado) | Hugo Viegas",
  },
  "seo.admin.title": {
    EN: "Admin | Hugo Viegas",
    PT: "Admin | Hugo Viegas",
  },
  "seo.admin.description": {
    EN: "Private area. Not part of the public portfolio.",
    PT: "Área privada. Não faz parte do portfólio público.",
  },
  "seo.notFound.title": {
    EN: "Page Not Found | Hugo Viegas",
    PT: "Página Não Encontrada | Hugo Viegas",
  },

  // ------------------------------------------------------- Accessibility
  "a11y.skipToContent": {
    EN: "Skip to main content",
    PT: "Pular para o conteúdo principal",
  },
  "a11y.githubProfile": {
    EN: "GitHub profile (opens in a new tab)",
    PT: "Perfil no GitHub (abre em nova aba)",
  },
  "a11y.linkedinProfile": {
    EN: "LinkedIn profile (opens in a new tab)",
    PT: "Perfil no LinkedIn (abre em nova aba)",
  },
  "a11y.emailHugo": {
    EN: "Email Hugo Viegas",
    PT: "Enviar email para Hugo Viegas",
  },
  "a11y.expandCube": { EN: "Expand cube", PT: "Expandir cubo" },
  "a11y.closeCube": { EN: "Close expanded cube", PT: "Fechar cubo expandido" },
  "a11y.playCubeMoves": { EN: "Play cube moves", PT: "Executar movimentos do cubo" },

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
  funStuffTitle: { EN: "Fun Stuff", PT: "Coisas divertidas" },
  funStuffShow: { EN: "Show experiments", PT: "Mostrar experimentos" },
  funStuffHide: { EN: "Hide experiments", PT: "Esconder experimentos" },
  funStuffCollapsed: {
    EN: "World clocks, a Rubik's cube and two 3D model viewers. Nothing loads until you ask.",
    PT: "Relógios mundiais, um cubo mágico e dois visualizadores 3D. Nada carrega até você pedir.",
  },
  funStuffLoading: { EN: "Loading 3D experience…", PT: "Carregando experiência 3D…" },
  funStuffDescription: {
    EN: "Optional experiments, off the main path.",
    PT: "Experimentos opcionais, fora do caminho principal.",
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
