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
    EN: "D'Arcy McGee's Irish Pub Website",
    PT: "Site do D'Arcy McGee's Irish Pub",
  },
  "project.1.description": {
    EN: "Professional restaurant website featuring modern responsive design, interactive menu system, event listings, and seamless user experience.",
    PT: "Site profissional para restaurante com design responsivo, sistema de menu interativo, lista de eventos e experiência de usuário fluida.",
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

  fullStory: {
    EN: `The first spark came early. At eight, a first phone opened a door to a world of tinkering—downloading .jar games, changing settings, and personalizing everything became a playground for curiosity. At eleven, that curiosity met purpose: a Lego robotics championship at school. Building and programming a robot with a drag‑and‑drop language, the team won regionals and reached nationals. Resources were limited, but the lesson was profound: technology wasn't just interesting—it was a path worth pursuing and mastering.

A few years later, at seventeen, after a first job as a young apprentice in a supermarket, the savings went into a first laptop. That purchase unlocked image and video editing, PC formatting, and a deeper dive into how things work under the hood. At eighteen, formal training followed: a degree in Analysis and Systems Development brought programming logic, math, databases, and web development into focus. The foundation for building real systems was set.

In 2021, with a friend and an older brother, a videomaker and social media venture took shape. It sharpened design sensibility and content skills, but it also made something clear: the real passion was solving operational problems with code. That opportunity arrived in IT, at a services company where the official remit was basic support and file organization. In the free hours, an underused tool—AppSheet over Google Sheets—became the engine for an internal app that simplified daily processes. To design it well, HR and finance workflows were learned end‑to‑end. The result: the timesheet close for 400+ employees dropped from four days to about one. Curiosity met impact, and the satisfaction of turning messy workflows into simple tools turned into a signature.

Ireland came next—a year of saving made the move possible for better opportunities and English immersion. Two years working in hospitality accelerated fluency and cultural understanding. In September 2024, the focus doubled down: a Higher Diploma in Science of Computing at CCT College and an IT role at Erin College began in the same month. The academic effort paid off with First‑Class results. On the job, spreadsheet automation skills leveled up with AI prompting and programming logic—projects across departments were streamlined, and each week revealed a new layer of automation possible within Google's ecosystem.

Alongside this, a practical challenge arrived from the restaurant job: build the D'Arcy McGee's website. With AI tooling, design/UX study, and hands‑on engineering, a fast, functional site came together—proof that shipping value quickly is a repeatable skill, not a one‑off. Today, the search is for a front‑end or full‑stack role that rewards exactly this mix: curiosity, product sense, and the ability to turn complex processes into elegant, measurable solutions. The drive remains the same as that eleven‑year‑old at the robotics table: learn fast, build well, and keep moving.`,
    PT: `A primeira faísca veio cedo. Aos oito anos, um primeiro celular abriu a porta para um mundo de experimentação — baixar joguinhos em formato .jar, mexer em configurações e personalizar tudo virou um parque de diversões para a curiosidade. Aos onze, essa curiosidade encontrou propósito: um campeonato escolar de robótica Lego. Construindo e programando um robô com uma linguagem de arrastar e soltar, a equipe venceu a etapa regional e chegou ao nacional. Faltaram recursos, mas sobrou lição: tecnologia não era só interessante — era um caminho a ser perseguido e dominado.

Alguns anos depois, aos dezessete, após o primeiro emprego como jovem aprendiz em supermercado, as economias viraram o primeiro notebook. Essa compra destravou edição de imagens e vídeo, formatação de PCs e um mergulho mais profundo em como as coisas funcionam por baixo do capô. Aos dezoito, veio a formação formal: Análise e Desenvolvimento de Sistemas trouxe lógica de programação, matemática, bancos de dados e desenvolvimento web. A base para construir sistemas reais estava lançada.

Em 2021, com um amigo e o irmão mais velho, nasceu um estúdio de videomaker e social media. A sensibilidade de design e conteúdo evoluiu, mas outra certeza cresceu: a verdadeira paixão era resolver problemas operacionais com código. A chance apareceu em TI, numa empresa de prestação de serviços onde o escopo oficial era suporte básico e organização de arquivos. Nas horas vagas, uma ferramenta pouco explorada — AppSheet sobre Google Sheets — virou o motor de um app interno para simplificar rotinas diárias. Para desenhá-lo bem, foi preciso aprender ponta a ponta os fluxos de RH e financeiro. O resultado: o fechamento de ponto de mais de 400 colaboradores caiu de quatro dias para cerca de um. Curiosidade virou impacto — e transformar fluxos caóticos em ferramentas simples virou marca registrada.

Veio a Irlanda — um ano de economia financiou a mudança, buscando mais oportunidades e imersão no inglês. Dois anos na hospitalidade aceleraram a fluência e o entendimento cultural. Em setembro de 2024, o foco dobrou: um Higher Diploma em Science of Computing na CCT College e um cargo de TI na Erin College começaram no mesmo mês. O esforço acadêmico rendeu resultado de First‑Class. No trabalho, as automações em planilhas subiram de nível com uso de IA e lógica de programação — processos de diversas áreas foram otimizados, e a cada semana surgia uma nova camada de automação possível dentro do ecossistema Google.

Em paralelo, um desafio prático veio do restaurante onde trabalhava: construir o site do D'Arcy McGee's. Com ferramentas de IA, estudo de design/UX e engenharia mão na massa, saiu um site rápido e funcional — prova de que entregar valor depressa é uma habilidade repetível. Hoje, a meta é uma vaga front‑end ou full‑stack que valorize exatamente esse conjunto: curiosidade, senso de produto e capacidade de transformar processos complexos em soluções elegantes e mensuráveis. A energia é a mesma daquele garoto de onze anos na mesa de robótica: aprender rápido, construir bem e seguir em frente.`,
  },
};

export const getTranslation = (key: string, language: LanguageCode): string => {
  return translations[key]?.[language] || key;
};
