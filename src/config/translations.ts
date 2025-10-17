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
    EN: `My career path has been defined by a combination of technical excellence, hands-on problem-solving, and a commitment to delivering measurable business impact.

My IT journey began in May 2020 at ETAL Prestação de Serviços in Belo Horizonte, Brazil, where I managed Windows Server environments supporting 50+ employees across multiple departments. Tasked with routine administrative tasks, I recognized an opportunity to automate and optimize. Using JavaScript, Node.js, Express.js, PHP, and MySQL, I developed a custom full-stack application that integrated on-premise systems with Google Workspace APIs. The result was transformative: administrative processing time dropped by 90%, and the solution became the standard workflow for hundreds of employees.

This success demonstrated a principle I've carried throughout my career: the most valuable technical work combines rapid diagnosis, clear documentation, and process optimization to create systems that make people's work easier and faster.

In January 2019 to February 2020, I worked as a Digital Designer and Web Developer at DabliumMusic, where I designed and developed business websites using HTML, CSS, and JavaScript, creating visual identities and digital marketing materials for client portfolios.

In September 2024, I joined Erin College in Dublin as an IT Support Specialist and System Administrator. Here, I manage the complete IT infrastructure for an educational institution with 120+ users. My responsibilities span the full technical stack: I administer Google Workspace enterprise environments including user accounts, access controls, security groups, and organizational units. I manage Active Directory user accounts, permissions, and Group Policy configurations ensuring secure authentication across the Windows Server and Google Workspace hybrid environment. I perform hardware and software troubleshooting, device configuration, system restoration, and patch management. I design and maintain network services ensuring campus-wide connectivity and efficient resource access. I create comprehensive technical documentation and user guides, and I train staff members on internal systems and best practices.

In parallel with my professional work, I am pursuing a Bachelor of Science (Honours) in Computing - Software Engineering at CCT College Dublin (September 2024 - August 2025, Expected Grade: First Class Honours). The curriculum includes Software Development, System Architecture, Database Management, Web Technologies, Linux and Windows Server Administration, Cloud Computing, Network Fundamentals, Information Security, and Algorithms and Data Structures.

Earlier, I completed a Technologist Degree in Analysis and Systems Development at UNICNEC in Brazil (March 2018 - July 2021). This foundation equipped me with formal training in Software Engineering, Database Design and Implementation, System Analysis, Object-Oriented Programming, Linux Server Administration, Network Configuration, Web Development, and Project Management.

I also completed a Professional English Language Programme (Level C1 - Advanced) at ICOT College in Dublin (August 2022 - April 2024), achieving C1 Advanced proficiency.

What drives my work is the intersection of three things: technical depth, user empathy, and operational clarity. Whether I'm configuring Active Directory permissions, automating a workflow with Google Apps Script, or training staff on a new system, the goal is always the same—make complex systems simple, reduce friction, and free teams to focus on what matters.

I'm now looking for opportunities where this blend of hands-on technical expertise, infrastructure knowledge, and process optimization mindset can drive real value.`,
    PT: `Minha jornada profissional foi definida por uma combinação de excelência técnica, resolução de problemas prática e um compromisso com a entrega de impacto mensurável nos negócios.

Minha jornada em TI começou em maio de 2020 na ETAL Prestação de Serviços em Belo Horizonte, Brasil, onde gerenciei ambientes Windows Server apoiando 50+ funcionários em múltiplos departamentos. Encarregado de tarefas administrativas rotineiras, reconheci uma oportunidade de automação e otimização. Usando JavaScript, Node.js, Express.js, PHP e MySQL, desenvolvi uma aplicação full-stack personalizada que integrou sistemas on-premise com APIs do Google Workspace. O resultado foi transformador: o tempo de processamento administrativo caiu 90%, e a solução se tornou o fluxo de trabalho padrão para centenas de funcionários.

Esse sucesso demonstrou um princípio que carreguei ao longo de minha carreira: o trabalho técnico mais valioso combina diagnóstico rápido, documentação clara e otimização de processos para criar sistemas que facilitam e aceleram o trabalho das pessoas.

De janeiro de 2019 a fevereiro de 2020, trabalhei como Designer Digital e Desenvolvedor Web na DabliumMusic, onde projetei e desenvolvi sites de negócios usando HTML, CSS e JavaScript, criando identidades visuais e materiais de marketing digital para portfólios de clientes.

Em setembro de 2024, me juntei ao Erin College em Dublin como Especialista em Suporte de TI e Administrador de Sistemas. Aqui, gerencio a infraestrutura de TI completa para uma instituição educacional com 120+ usuários. Minhas responsabilidades abrangem toda a pilha técnica: administro ambientes empresariais do Google Workspace incluindo contas de usuários, controles de acesso, grupos de segurança e unidades organizacionais. Gerencio contas de usuários do Active Directory, permissões e configurações de Group Policy garantindo autenticação segura no ambiente híbrido Windows Server e Google Workspace. Realizo troubleshooting de hardware e software, configuração de dispositivos, restauração de sistemas e gerenciamento de patches. Projeto e mantenho serviços de rede garantindo conectividade em todo o campus e acesso eficiente a recursos. Crio documentação técnica abrangente e guias de usuário, e treino funcionários em sistemas internos e melhores práticas.

Paralelamente ao meu trabalho profissional, estou cursando um Bacharelado em Computação - Engenharia de Software (Honras) no CCT College Dublin (setembro de 2024 - agosto de 2025, Nota Esperada: First Class Honours). O currículo inclui Desenvolvimento de Software, Arquitetura de Sistemas, Gestão de Banco de Dados, Tecnologias Web, Administração de Linux e Windows Server, Cloud Computing, Fundamentos de Rede, Segurança da Informação e Algoritmos e Estruturas de Dados.

Anteriormente, completei um Technologist Degree em Análise e Desenvolvimento de Sistemas na UNICNEC no Brasil (março de 2018 - julho de 2021). Esta formação me equipou com treinamento formal em Engenharia de Software, Design e Implementação de Banco de Dados, Análise de Sistemas, Programação Orientada a Objetos, Administração de Linux, Configuração de Redes, Desenvolvimento Web e Gestão de Projetos.

Também completei um Programa Profissional de Inglês (Nível C1 - Avançado) no ICOT College em Dublin (agosto de 2022 - abril de 2024), alcançando proficiência C1 Avançada.

O que impulsiona meu trabalho é a interseção de três coisas: profundidade técnica, empatia com o usuário e clareza operacional. Seja configurando permissões do Active Directory, automatizando um fluxo com Google Apps Script ou treinando funcionários em um novo sistema, o objetivo é sempre o mesmo — tornar sistemas complexos simples, reduzir atrito e libertar equipes para focar no que importa.

Agora estou buscando oportunidades onde essa combinação de expertise técnica prática, conhecimento de infraestrutura e mentalidade de otimização de processos possa gerar valor real.`,
  },
};

export const getTranslation = (key: string, language: LanguageCode): string => {
  return translations[key]?.[language] || key;
};
