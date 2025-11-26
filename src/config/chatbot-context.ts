// Hugo Viegas Portfolio Context for AI Chatbot
// This file contains all the information about Hugo that the chatbot can use to answer questions

export const portfolioContext = {
  personal: {
    name: "Hugo Viegas",
    location: "Dublin, Ireland",
    nationality: "Brazilian",
    email: "hugoviegas3.1@gmail.com",
    github: "https://github.com/hugoviegas/",
    linkedin: "https://www.linkedin.com/in/hviegas/",
    languages: [
      { language: "Portuguese", level: "Native" },
      { language: "English", level: "C1 Proficiency" },
    ],
    availability: "Available for freelance work and full-time opportunities",
    workArrangements: "Open to remote and hybrid arrangements",
  },

  currentRole: {
    title: "IT Support Specialist",
    company: "Erin College Dublin",
    transition: "Transitioning to Full-Stack Developer",
  },

  education: {
    current: {
      degree: "Higher Diploma in Science of Computing",
      institution: "CCT College Dublin",
      startDate: "September 2024",
      achievement: "First-Class academic results",
    },
    previous: {
      degree: "Analysis and Systems Development",
      description:
        "Programming logic, math, databases, and web development fundamentals",
    },
  },

  skills: {
    frontend: [
      "React",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Responsive Design",
    ],
    backend: ["Node.js", "REST APIs", "Database Management"],
    automation: [
      "Google Apps Script",
      "JavaScript automation",
      "Google Workspace integration",
      "AppSheet",
    ],
    tools: [
      "Git",
      "VS Code",
      "Google Sheets",
      "AI tools for development",
      "Vite",
    ],
    other: [
      "IT Support",
      "Technical Documentation",
      "Process Optimization",
      "Team Training",
    ],
  },

  highlights: [
    {
      title: "90% Process Reduction",
      description: "JavaScript + Google Workspace automation solution",
      details:
        "Created internal apps using AppSheet over Google Sheets that simplified daily processes. The timesheet close for 400+ employees dropped from four days to about one day.",
    },
    {
      title: "International Experience",
      description:
        "Working in Dublin while maintaining Brazilian roots and perspectives",
      details:
        "Moved to Ireland in 2022, worked in hospitality to improve English fluency, then transitioned back to IT in 2024.",
    },
    {
      title: "Structured Training",
      description:
        "Improved first-contact resolution through clear documentation",
      details:
        "Creates clear documentation and training materials that help teams work better and faster.",
    },
    {
      title: "Continuous Learning",
      description:
        "Currently pursuing Computer Science degree at CCT College Dublin",
      details:
        "Achieving First-Class academic results while working and building projects.",
    },
  ],

  projects: [
    {
      name: "D'Arcy McGee's Irish Pub Website",
      description:
        "Professional restaurant website featuring modern responsive design, interactive menu system, event listings, and seamless user experience.",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Responsive Design"],
      type: "Web Development",
      status: "Live Client Website",
    },
    {
      name: "Business Process Automation System",
      description:
        "Custom JavaScript solution integrated with Google Sheets and AppSheet that reduced critical business processes by 90%.",
      technologies: [
        "JavaScript",
        "Google Apps Script",
        "Google Sheets",
        "AppSheet",
      ],
      type: "Automation",
      impact: "90% time reduction for 400+ employees",
    },
    {
      name: "Modern E-Commerce Platform",
      description:
        "Full-stack e-commerce solution with authentication, payment processing and admin dashboard.",
      technologies: ["React", "Node.js", "TypeScript", "Authentication"],
      type: "Web Development",
      status: "Full-stack solution",
    },
    {
      name: "Project Management Dashboard",
      description:
        "Collaborative task management app with real-time updates and project analytics.",
      technologies: ["React", "TypeScript", "Real-time updates"],
      type: "Web Development",
      status: "Team collaboration tool",
    },
  ],

  experience: [
    {
      role: "IT Support Specialist",
      company: "Erin College Dublin",
      period: "2024 - Present",
      description:
        "Automating departmental processes and building websites that deliver real value. Spreadsheet automation skills leveled up with AI prompting and programming logic.",
    },
    {
      role: "IT Support & Process Automation",
      company: "Services Company (Brazil)",
      period: "Previous",
      description:
        "Started with basic support and file organization. Created internal apps using AppSheet that reduced timesheet processing from 4 days to 1 day for 400+ employees.",
    },
    {
      role: "Videomaker & Social Media",
      company: "Own venture with friends",
      period: "2021",
      description:
        "Sharpened design sensibility and content skills. Learned about product mindset and user experience.",
    },
  ],

  journey: {
    earlyYears:
      "Started tinkering with phones at age 8, won robotics championships at age 11, built first laptop at 17.",
    education:
      "Pursued Analysis and Systems Development at 18, learning programming logic, databases, and web development.",
    automation:
      "Discovered the power of automation in IT, creating solutions that reduced processes by 90%.",
    ireland:
      "Moved to Ireland in 2022 for better opportunities and English immersion. Started in hospitality, then returned to IT in 2024.",
    current:
      "Now studying Computer Science at CCT College Dublin while working as IT Support Specialist, achieving First-Class results.",
  },

  stats: {
    processReduction: "90%",
    yearsExperience: "5+",
    countriesWorked: 2,
  },
};

// Generate the system prompt for the AI
export const generateSystemPrompt = (language: "EN" | "PT"): string => {
  const ctx = portfolioContext;

  const basePrompt =
    language === "PT"
      ? `Você é um assistente de IA para o portfólio de Hugo Viegas. Seu único propósito é responder perguntas sobre Hugo, sua trajetória profissional, habilidades, projetos e informações presentes no portfólio.

REGRAS IMPORTANTES:
1. Responda APENAS perguntas sobre Hugo Viegas e seu portfólio
2. Para QUALQUER outra pergunta, responda educadamente: "Desculpe, só posso responder dúvidas sobre Hugo Viegas e seu portfólio."
3. Seja conciso e direto nas respostas
4. Use um tom profissional mas amigável
5. Responda em português quando perguntado em português

INFORMAÇÕES SOBRE HUGO:`
      : `You are an AI assistant for Hugo Viegas's portfolio. Your sole purpose is to answer questions about Hugo, his professional journey, skills, projects, and information present in the portfolio.

IMPORTANT RULES:
1. ONLY answer questions about Hugo Viegas and his portfolio
2. For ANY other question, politely respond: "Sorry, I can only answer questions about Hugo Viegas and his portfolio."
3. Be concise and direct in your answers
4. Use a professional but friendly tone
5. Answer in the same language the user asks

INFORMATION ABOUT HUGO:`;

  const contextInfo = `
- Name: ${ctx.personal.name}
- Location: ${ctx.personal.location}
- Nationality: ${ctx.personal.nationality}
- Current Role: ${ctx.currentRole.title} at ${ctx.currentRole.company}, transitioning to ${ctx.currentRole.transition}
- Education: ${ctx.education.current.degree} at ${ctx.education.current.institution} (${ctx.education.current.achievement})
- Languages: ${ctx.personal.languages.map((l) => `${l.language} (${l.level})`).join(", ")}
- Email: ${ctx.personal.email}
- GitHub: ${ctx.personal.github}
- LinkedIn: ${ctx.personal.linkedin}

KEY HIGHLIGHTS:
${ctx.highlights.map((h) => `- ${h.title}: ${h.description}. ${h.details}`).join("\n")}

TECHNICAL SKILLS:
- Frontend: ${ctx.skills.frontend.join(", ")}
- Backend: ${ctx.skills.backend.join(", ")}
- Automation: ${ctx.skills.automation.join(", ")}
- Tools: ${ctx.skills.tools.join(", ")}
- Other: ${ctx.skills.other.join(", ")}

PROJECTS:
${ctx.projects.map((p) => `- ${p.name}: ${p.description} (${p.technologies.join(", ")})`).join("\n")}

PROFESSIONAL EXPERIENCE:
${ctx.experience.map((e) => `- ${e.role} at ${e.company} (${e.period}): ${e.description}`).join("\n")}

JOURNEY:
- ${ctx.journey.earlyYears}
- ${ctx.journey.education}
- ${ctx.journey.automation}
- ${ctx.journey.ireland}
- ${ctx.journey.current}

STATS:
- Process Time Reduction: ${ctx.stats.processReduction}
- Years of Experience: ${ctx.stats.yearsExperience}
- Countries Worked: ${ctx.stats.countriesWorked}

AVAILABILITY: ${ctx.personal.availability}. ${ctx.personal.workArrangements}.`;

  return basePrompt + contextInfo;
};
