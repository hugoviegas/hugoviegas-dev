// Hard-coded content that used to live inside components, kept as the seed
// source and dual-run reference until the post-cutover cleanup removes it.
// Text that already has translation keys stays in src/config/translations.ts.
import type { SkillGroup } from "./types";

export interface LegacyProject {
  id: string;
  titleKey: string;
  descriptionKey: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  technologies: string[];
  liveUrl: string;
  githubUrl: string;
  detailPath: string;
  published: boolean;
}

// Formerly the `projects` array in ProjectsSection.tsx.
export const legacyProjects: LegacyProject[] = [
  {
    id: "darcy-mcgees",
    titleKey: "project.1.title",
    descriptionKey: "project.1.description",
    image: "darcy-mcgees",
    imageWidth: 1280,
    imageHeight: 720,
    technologies: ["HTML5", "CSS3", "ReactJs", "Responsive Design"],
    liveUrl: "https://www.darcymcgeespub.com/",
    // GitHub repo is not publicly reachable; hidden until Hugo approves a public URL.
    githubUrl: "",
    detailPath: "/projects/darcy-mcgees",
    published: true,
  },
  {
    id: "big-bang-duel",
    titleKey: "project.5.title",
    descriptionKey: "project.5.description",
    image: "big-bang-duel",
    imageWidth: 864,
    imageHeight: 557,
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS", "Zustand", "Firebase"],
    liveUrl: "https://duel.hugoviegas.dev",
    githubUrl: "https://github.com/hugoviegas/Big-bang-Duel",
    detailPath: "/projects/big-bang-duel",
    published: true,
  },
  {
    // ETAL QR Registration / automation: draft until Hugo approves public content.
    id: "etal-automation",
    titleKey: "project.2.title",
    descriptionKey: "project.2.description",
    image: "",
    imageWidth: 0,
    imageHeight: 0,
    technologies: ["AppSheet", "Google Sheets"],
    liveUrl: "",
    githubUrl: "",
    detailPath: "",
    published: false,
  },
];

export interface LegacySkill {
  en: string;
  ptBR: string;
  iconKey?: string;
}

const same = (label: string, iconKey?: string): LegacySkill => ({
  en: label,
  ptBR: label,
  iconKey,
});

// Formerly `programmingSkills` and `itSkills` in SkillsSection.tsx.
export const legacyProgrammingSkills: LegacySkill[] = [
  same("HTML5", "html"),
  same("CSS3", "css"),
  same("JavaScript", "javascript"),
  same("PHP", "php"),
  same("Java", "java"),
  same("Python", "python"),
  same("C", "c"),
  same("Vue.js", "vue"),
  same("React", "react"),
  same("Shell/Bash", "shell"),
  same("SQL", "sql"),
];

export const legacyItSkills: LegacySkill[] = [
  same("Active Directory", "active-directory"),
  same("Google Workspace", "google-workspace"),
  same("Windows Server", "windows-server"),
  same("Linux", "linux"),
  same("Docker", "docker"),
  // The hard-coded version showed "Network" in PT mode too.
  { en: "Network", ptBR: "Redes", iconKey: "network" },
];

// Formerly the English-only `certifications` array in ExperienceSection.tsx.
// PT-BR labels are new: the hard-coded version showed English in PT mode.
export const legacyCertifications: LegacySkill[] = [
  { en: "Google Workspace Administration", ptBR: "Administração do Google Workspace" },
  { en: "Active Directory Management", ptBR: "Gestão de Active Directory" },
  { en: "Windows Server Administration", ptBR: "Administração do Windows Server" },
  same("JavaScript (Node.js, Express.js)"),
  same("Google Apps Script"),
  { en: "MySQL Database Management", ptBR: "Gestão de Banco de Dados MySQL" },
  { en: "System Monitoring & Troubleshooting", ptBR: "Monitoramento e Diagnóstico de Sistemas" },
  { en: "Information Security Best Practices", ptBR: "Boas Práticas de Segurança da Informação" },
  {
    en: "Technical Documentation & Process Optimization",
    ptBR: "Documentação Técnica e Otimização de Processos",
  },
  { en: "HTML5 & CSS3 Development", ptBR: "Desenvolvimento HTML5 e CSS3" },
];

// Formerly the English-only "current focus" badges in ExperienceSection.tsx.
export const legacyFocus: LegacySkill[] = [
  same("Active Directory"),
  same("Google Workspace"),
  { en: "System Administration", ptBR: "Administração de Sistemas" },
  { en: "Process Automation", ptBR: "Automação de Processos" },
  { en: "Technical Support", ptBR: "Suporte Técnico" },
  { en: "Infrastructure Management", ptBR: "Gestão de Infraestrutura" },
];

export interface CvSkill extends LegacySkill {
  group: Extract<SkillGroup, "programming" | "it">;
}

// Skills listed on Hugo's CV ("Software Developer" PDF, October 2026), with
// proficiency suffixes removed and combined entries split. Entries whose label
// matches a site skill (case-insensitive) are dropped by the seed; the rest are
// seeded as unpublished drafts for Hugo to review.
export const cvSkills: CvSkill[] = [
  { group: "it", en: "Windows Server environments", ptBR: "Ambientes Windows Server" },
  {
    group: "it",
    en: "Active Directory (Group Policy, DNS, DHCP)",
    ptBR: "Active Directory (Group Policy, DNS, DHCP)",
  },
  { group: "it", en: "Microsoft 365 Administration", ptBR: "Administração do Microsoft 365" },
  { group: "it", en: "Backup & Disaster Recovery", ptBR: "Backup e Recuperação de Desastres" },
  { group: "it", en: "Google Workspace Administration", ptBR: "Administração do Google Workspace" },
  { group: "it", en: "Linux Server Administration", ptBR: "Administração de Servidores Linux" },
  {
    group: "it",
    en: "Network administration (TCP/IP, DNS, DHCP fundamentals)",
    ptBR: "Administração de redes (fundamentos de TCP/IP, DNS, DHCP)",
  },
  {
    group: "it",
    en: "Network troubleshooting and connectivity management",
    ptBR: "Diagnóstico de redes e gestão de conectividade",
  },
  {
    group: "it",
    en: "Information security best practices and access controls",
    ptBR: "Boas práticas de segurança da informação e controles de acesso",
  },
  {
    group: "it",
    en: "Security policy implementation and user authentication",
    ptBR: "Implementação de políticas de segurança e autenticação de usuários",
  },
  { group: "it", en: "Firewall management basics", ptBR: "Noções de gestão de firewall" },
  { group: "programming", ...same("React.js") },
  { group: "programming", ...same("Node.js") },
  { group: "programming", ...same("Bootstrap") },
  { group: "programming", ...same("HTML") },
  { group: "programming", ...same("CSS") },
  { group: "programming", ...same("Python") },
  // The CV reads "Google Api et Firebase".
  { group: "programming", ...same("Google APIs") },
  { group: "programming", ...same("Firebase") },
  { group: "programming", ...same("Google Apps Script") },
  { group: "programming", ...same("PowerShell") },
  { group: "programming", ...same("SQL / MySQL") },
  { group: "programming", ...same("HTML5") },
  { group: "programming", ...same("CSS3") },
  { group: "programming", en: "Git version control", ptBR: "Controle de versão Git" },
  {
    group: "programming",
    en: "Software testing documentation",
    ptBR: "Documentação de testes de software",
  },
];
