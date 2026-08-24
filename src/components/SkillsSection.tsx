import { useLanguage } from "@/hooks/useLanguage";

/* ------------------------------------------------------------------ */
/*  Inline SVG icon components – lightweight, no external libraries    */
/* ------------------------------------------------------------------ */

const HTMLIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 128 128" className={className}>
    <path fill="#E44D26" d="M19.1 113.6L9.1 2h109.7l-10 111.5L63.9 126z" />
    <path fill="#F16529" d="M64 118.7l36.9-10.2 8.6-96H64z" />
    <path
      fill="#EBEBEB"
      d="M64 52.6H45.3l-1.3-14.6H64V23.8H28.7l.3 3.7 3.5 39.1H64zm0 35.2l-.1 0-15.7-4.2-1-11.3H33l2 22.3 29 8z"
    />
    <path
      fill="#fff"
      d="M64 52.6v14.2h17.4l-1.6 18-15.8 4.3v14.7l29-8 .2-2.4 3.3-37.1.4-3.7H64zm0-28.8v14.2h33.9l.3-3.2.7-7.8.3-3.2H64z"
    />
  </svg>
);

const JavaScriptIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 128 128" className={className}>
    <rect fill="#F7DF1E" width="128" height="128" rx="10" />
    <path
      d="M34.4 101.8c2 3.5 4.7 6 9.3 6 3.9 0 6.4-2 6.4-4.7 0-3.3-2.6-4.4-6.9-6.3l-2.4-1c-6.8-2.9-11.4-6.6-11.4-14.3 0-7.1 5.4-12.6 13.9-12.6 6 0 10.4 2.1 13.5 7.6l-7.4 4.8c-1.6-2.9-3.4-4.1-6.1-4.1-2.8 0-4.5 1.8-4.5 4.1 0 2.8 1.8 4 5.8 5.8l2.4 1c8 3.4 12.6 6.9 12.6 14.8 0 8.5-6.7 13.1-15.6 13.1-8.7 0-14.4-4.2-17.1-9.6l7.5-4.6zm32.7-1.4c1.5 2.7 3.6 4.7 7.2 4.7 3.3 0 5.4-1.6 5.4-4v-27h9.3v27.2c0 7.6-5.4 12.8-13.4 12.8-7.2 0-11.4-3.7-13.5-8.2l5-3.5z"
      fill="#323330"
    />
  </svg>
);

const CSSIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 128 128" className={className}>
    <path fill="#1572B6" d="M19.1 113.6L9.1 2h109.7l-10 111.5L63.9 126z" />
    <path fill="#33A9DC" d="M64 118.7l36.9-10.2 8.6-96H64z" />
    <path
      fill="#EBEBEB"
      d="M64 66.1H45.4l-1.3-14.6H64V37.3H28.7l.3 3.6 3.5 39.3H64zm0 31.3l-.1 0-15.7-4.2-1-11.3H33l2 22.3 29 8z"
    />
    <path
      fill="#fff"
      d="M64 66.1v14.2h16.1l-1.5 17-14.6 4v14.7l29-8 .2-2.3 3.3-37.2.4-3.4H64zm0-28.8v14.2h34l.3-3.2 1-10.7.2-3.3H64z"
    />
  </svg>
);

const PHPIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 128 128" className={className}>
    <ellipse cx="64" cy="64" rx="60" ry="36" fill="#8892BF" />
    <text
      x="64"
      y="74"
      textAnchor="middle"
      fill="#fff"
      fontSize="42"
      fontFamily="Arial, sans-serif"
      fontWeight="bold"
    >
      php
    </text>
  </svg>
);

const JavaIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 128 128" className={className}>
    <path
      fill="#EA2D2E"
      d="M47.6 98s-4.5 2.6 3.2 3.5c9.3 1.1 14.1.9 24.3-1.1 0 0 2.7 1.7 6.5 3.2-23.1 9.9-52.3-.6-34-5.6zm-2.8-12.9s-5 3.7 2.7 4.5c9.9 1 17.8 1.1 31.5-1.5 0 0 1.9 1.9 4.8 2.9-27.9 8.2-59 .6-39-5.9z"
    />
    <path
      fill="#EA2D2E"
      d="M69.1 61.6c5.7 6.5-1.5 12.4-1.5 12.4s14.4-7.4 7.8-16.7c-6.2-8.6-10.9-12.9 14.7-27.7 0 0-40.2 10-21 32z"
    />
    <path
      fill="#EA2D2E"
      d="M102.3 108.5s3.3 2.7-3.6 4.8c-13.2 4-54.9 5.2-66.5.2-4.2-1.8 3.6-4.3 6.1-4.8 2.6-.5 4-.4 4-.4-4.7-3.3-30.2 6.4-13 9.2 47 7.5 85.8-3.4 73-9zm-55.6-40.2s-21.4 5.1-7.6 6.9c5.8.8 17.4.6 28.2-.3 8.9-.7 17.8-2.3 17.8-2.3s-3.1 1.3-5.4 2.9c-21.8 5.7-63.9 3.1-51.8-2.8 10.2-5 18.8-4.4 18.8-4.4zm38.5 21.5c22.2-11.5 11.9-22.6 4.8-21.1-.7.2-1.8.6-1.8.6s.5-.7 1.4-1c10.3-3.6 18.2 10.7-4.6 16.4 0 0 .1-.3.2-.9z"
    />
    <path
      fill="#EA2D2E"
      d="M76.6 1.7s12.3 12.3-11.7 31.2c-19.2 15.2-4.4 23.8 0 33.7-11.2-10.1-19.4-19-13.9-27.3C59.1 27 81.4 21.1 76.6 1.7z"
    />
    <path
      fill="#EA2D2E"
      d="M49.4 126.5c21.3 1.4 54.1-.8 54.9-11 0 0-1.5 3.8-17.7 6.9-18.3 3.4-40.8 3-54.2.8 0 0 2.7 2.3 17 3.3z"
    />
  </svg>
);

const PythonIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 128 128" className={className}>
    <path
      fill="#3776AB"
      d="M63.4 1c-9.2 0-17.2 1-23.7 2.8-19.1 5.3-22.6 16.4-22.6 24.6v18h45.2v6H25.6c-13.1 0-24.6 7.8-28.2 22.8-4.1 17.1-4.3 27.8 0 45.6 3.2 13.3 10.8 22.8 23.9 22.8h15.5V124c0-14.8 12.8-27.9 28.2-27.9h45.1c12.5 0 22.6-10.3 22.6-22.8V28.4c0-12.1-10.4-21.2-22.6-24.6C103 1.3 94.4 1 85 1H63.4zm-24.5 14.9c4.6 0 8.4 3.9 8.4 8.6 0 4.7-3.8 8.5-8.4 8.5-4.7 0-8.4-3.8-8.4-8.5 0-4.7 3.7-8.6 8.4-8.6z"
    />
    <path
      fill="#FFD43B"
      d="M93.8 32.4v19c0 15.4-13.2 28.6-28.2 28.6H20.5c-12.3 0-22.6 10.5-22.6 22.9v42.8c0 12.1 10.6 19.3 22.6 22.8 14.4 4.2 28.2 5 45.1 0 11.3-3.3 22.6-10 22.6-22.8V128H43.1v-6h68c13.1 0 18-9.1 22.6-22.8 4.7-14.1 4.5-27.7 0-45.6-3.2-12.8-9.3-22.8-22.6-22.8H93.8zM89.3 119c4.7 0 8.4 3.8 8.4 8.6 0 4.7-3.7 8.5-8.4 8.5-4.6 0-8.4-3.8-8.4-8.5 0-4.8 3.8-8.6 8.4-8.6z"
    />
  </svg>
);

const CIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 128 128" className={className}>
    <circle cx="64" cy="64" r="58" fill="#283593" />
    <text
      x="64"
      y="82"
      textAnchor="middle"
      fill="#fff"
      fontSize="60"
      fontFamily="Arial, sans-serif"
      fontWeight="bold"
    >
      C
    </text>
  </svg>
);

const VueIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 128 128" className={className}>
    <path d="M0 8.9h25.5L64 72.2 102.5 8.9H128L64 119.1z" fill="#42B883" />
    <path d="M25.5 8.9h25.6L64 30.4 76.9 8.9h25.6L64 72.2z" fill="#35495E" />
  </svg>
);

const ReactIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 128 128" className={className}>
    <g fill="#61DAFB">
      <circle cx="64" cy="64" r="11.4" />
      <ellipse
        cx="64"
        cy="64"
        rx="55"
        ry="21.3"
        fill="none"
        stroke="#61DAFB"
        strokeWidth="5.5"
      />
      <ellipse
        cx="64"
        cy="64"
        rx="55"
        ry="21.3"
        fill="none"
        stroke="#61DAFB"
        strokeWidth="5.5"
        transform="rotate(60 64 64)"
      />
      <ellipse
        cx="64"
        cy="64"
        rx="55"
        ry="21.3"
        fill="none"
        stroke="#61DAFB"
        strokeWidth="5.5"
        transform="rotate(120 64 64)"
      />
    </g>
  </svg>
);

const ShellIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 128 128" className={className}>
    <rect width="128" height="128" rx="14" fill="#293036" />
    <path
      d="M20 98l25-28-25-28"
      fill="none"
      stroke="#4EAA25"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="60"
      y1="98"
      x2="108"
      y2="98"
      stroke="#4EAA25"
      strokeWidth="10"
      strokeLinecap="round"
    />
  </svg>
);

const SQLIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 128 128" className={className}>
    <ellipse cx="64" cy="30" rx="48" ry="18" fill="#E48E00" />
    <path
      d="M16 30v68c0 10 21.5 18 48 18s48-8 48-18V30"
      fill="none"
      stroke="#E48E00"
      strokeWidth="6"
    />
    <ellipse
      cx="64"
      cy="64"
      rx="48"
      ry="18"
      fill="none"
      stroke="#E48E00"
      strokeWidth="4"
      opacity="0.5"
    />
    <ellipse
      cx="64"
      cy="98"
      rx="48"
      ry="18"
      fill="none"
      stroke="#E48E00"
      strokeWidth="4"
      opacity="0.5"
    />
    <ellipse
      cx="64"
      cy="30"
      rx="48"
      ry="18"
      fill="none"
      stroke="#E48E00"
      strokeWidth="6"
    />
  </svg>
);

/* -- IT & Infrastructure icons -- */

const ActiveDirectoryIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 128 128" className={className}>
    <rect width="128" height="128" rx="14" fill="#0078D4" />
    <path
      d="M64 24l36 20v40L64 104 28 84V44z"
      fill="none"
      stroke="#fff"
      strokeWidth="6"
      strokeLinejoin="round"
    />
    <circle cx="64" cy="56" r="10" fill="#fff" />
    <path
      d="M48 82c0-9 7.2-16 16-16s16 7 16 16"
      fill="none"
      stroke="#fff"
      strokeWidth="5"
      strokeLinecap="round"
    />
  </svg>
);

const GoogleWorkspaceIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 128 128" className={className}>
    <path d="M25.7 54.6L6.4 44.2l57.6-33.3 19.3 10.4z" fill="#EA4335" />
    <path d="M83.3 21.3l19.3 10.4-57.6 33.3L25.7 54.6z" fill="#4285F4" />
    <path d="M102.6 31.7v64.6l-19.3 10.4V42.1z" fill="#34A853" />
    <path d="M25.7 54.6v64.6l19.3 10.4V65z" fill="#FBBC05" />
    <path d="M45 129.6l57.6-33.3v-64.6L45 65z" fill="#4285F4" opacity="0.6" />
    <path
      d="M25.7 119.2L6.4 108.8V44.2l19.3 10.4z"
      fill="#EA4335"
      opacity="0.6"
    />
  </svg>
);

const WindowsServerIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 128 128" className={className}>
    <rect width="128" height="128" rx="14" fill="#00ADEF" />
    <rect x="18" y="18" width="40" height="40" fill="#fff" rx="2" />
    <rect x="70" y="18" width="40" height="40" fill="#fff" rx="2" />
    <rect x="18" y="70" width="40" height="40" fill="#fff" rx="2" />
    <rect x="70" y="70" width="40" height="40" fill="#fff" rx="2" />
  </svg>
);

const LinuxIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 128 128" className={className}>
    <path
      d="M64 10c-17 0-30 18-30 42 0 13 4 24 10 32-6 4-14 9-14 15 0 8 14 13 34 13s34-5 34-13c0-6-8-11-14-15 6-8 10-19 10-32C94 28 81 10 64 10z"
      fill="#FCC624"
    />
    <circle cx="52" cy="44" r="5" fill="#333" />
    <circle cx="76" cy="44" r="5" fill="#333" />
    <ellipse cx="64" cy="60" rx="6" ry="4" fill="#E8903A" />
    <path
      d="M50 72c4 6 10 9 14 9s10-3 14-9"
      fill="none"
      stroke="#333"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M34 84c-4 3-8 6-8 10 0 6 16 10 38 10s38-4 38-10c0-4-4-7-8-10"
      fill="none"
      stroke="#333"
      strokeWidth="2.5"
    />
  </svg>
);

const DockerIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 128 128" className={className}>
    <path
      d="M124.8 52.1c-4.3-2.5-10-2.8-14.8-1.4-.6-5.2-4-9.7-8-12.9l-1.6-1.3-1.4 1.5c-2.8 3-4.3 7.1-3.8 11.1.2 2.2.9 4.3 2.1 6.1-3 1.7-8.8 2.1-10.4 2.1H2.3l-.2 1.8c-.8 8.8 1.1 17.6 5.8 24.9l.5.7v.1c7.5 11 19.4 15.9 33.6 15.9 25.4 0 46.2-11.7 55.6-36.9 5.8.3 12.2-1.4 15.2-6.9l.8-1.5-1.8-1.1v-.2zm-106 4.4h11.2v11.2H18.8zm0 0h11.2v11.2H18.8zm14 0h11.2v11.2H32.8zm0-13.7h11.2v11.2H32.8zm14 13.7h11.2v11.2H46.8zm0-13.7h11.2v11.2H46.8zm14 13.7h11.2v11.2H60.8zm0-13.7h11.2v11.2H60.8zm14 13.7h11.2v11.2H74.8z"
      fill="#2496ED"
    />
  </svg>
);

const NetworkIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 128 128" className={className}>
    <circle cx="64" cy="28" r="14" fill="#607D8B" />
    <circle cx="28" cy="100" r="14" fill="#607D8B" />
    <circle cx="100" cy="100" r="14" fill="#607D8B" />
    <line
      x1="64"
      y1="42"
      x2="28"
      y2="86"
      stroke="#607D8B"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <line
      x1="64"
      y1="42"
      x2="100"
      y2="86"
      stroke="#607D8B"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <line
      x1="28"
      y1="100"
      x2="100"
      y2="100"
      stroke="#607D8B"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <circle cx="64" cy="28" r="8" fill="#fff" />
    <circle cx="28" cy="100" r="8" fill="#fff" />
    <circle cx="100" cy="100" r="8" fill="#fff" />
  </svg>
);

/* ------------------------------------------------------------------ */
/*  Skill data                                                         */
/* ------------------------------------------------------------------ */

interface Skill {
  name: string;
  icon: React.FC<{ className?: string }>;
  tint: string; // tailwind bg tint for the card
}

const programmingSkills: Skill[] = [
  { name: "HTML5", icon: HTMLIcon, tint: "bg-orange-500/10" },
  { name: "CSS3", icon: CSSIcon, tint: "bg-blue-500/10" },
  { name: "JavaScript", icon: JavaScriptIcon, tint: "bg-yellow-400/10" },
  { name: "PHP", icon: PHPIcon, tint: "bg-purple-500/10" },
  { name: "Java", icon: JavaIcon, tint: "bg-red-500/10" },
  { name: "Python", icon: PythonIcon, tint: "bg-blue-400/10" },
  { name: "C", icon: CIcon, tint: "bg-indigo-500/10" },
  { name: "Vue.js", icon: VueIcon, tint: "bg-emerald-500/10" },
  { name: "React", icon: ReactIcon, tint: "bg-cyan-400/10" },
  { name: "Shell/Bash", icon: ShellIcon, tint: "bg-green-500/10" },
  { name: "SQL", icon: SQLIcon, tint: "bg-orange-400/10" },
];

const itSkills: Skill[] = [
  {
    name: "Active Directory",
    icon: ActiveDirectoryIcon,
    tint: "bg-blue-500/10",
  },
  {
    name: "Google Workspace",
    icon: GoogleWorkspaceIcon,
    tint: "bg-green-400/10",
  },
  { name: "Windows Server", icon: WindowsServerIcon, tint: "bg-sky-500/10" },
  { name: "Linux", icon: LinuxIcon, tint: "bg-yellow-400/10" },
  { name: "Docker", icon: DockerIcon, tint: "bg-blue-400/10" },
  { name: "Network", icon: NetworkIcon, tint: "bg-gray-400/10" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const SkillCard = ({ skill }: { skill: Skill }) => {
  const Icon = skill.icon;
  return (
    <div
      className={`glass-card flex flex-col items-center justify-center gap-2 p-4
                  transition-transform duration-200 hover:scale-105
                  ${skill.tint}`}
    >
      <Icon className="w-10 h-10" />
      <span className="text-center text-sm font-medium leading-tight text-foreground">
        {skill.name}
      </span>
    </div>
  );
};

const SkillsSection = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-10">
      {/* Programming Languages & Tools */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          {t("programmingSkillsTitle")}
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {programmingSkills.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </div>
      </div>

      {/* IT & Infrastructure */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          {t("itSkillsTitle")}
        </h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {itSkills.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;
