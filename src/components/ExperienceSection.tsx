<<<<<<< HEAD
import { MapPin, Calendar, BookOpen, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";

/** Company names stay untranslated; every other string comes from translations. */
const EXPERIENCE_IDS = [1, 2, 3, 4, 5] as const;
const COMPANIES: Record<number, string> = {
  1: "Erin College, Dublin",
  2: "ETAL Prestação de Serviços",
  3: "DabliuMusic",
  4: "CCT College Dublin",
  5: "UNICNEC",
};

const CERTIFICATION_IDS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const FOCUS_IDS = [1, 2, 3, 4, 5, 6] as const;

const KEY_STATS = [
  { value: "90%", labelKey: "stats.processReduction", tone: "text-primary" },
  { value: "+20%", labelKey: "stats.viewsGrowth", tone: "text-secondary" },
  {
    value: "4+",
    labelKey: "stats.yearsExperience",
    tone: "text-brand-accent",
  },
  { value: "2", labelKey: "stats.countriesWorked", tone: "text-primary" },
];

const ExperienceSection = () => {
  const { t } = useLanguage();

  return (
    <section id="experience" className="section-shell bg-muted/20">
      <div className="section-wrapper">
        <div className="fade-in mb-12 text-center md:mb-16">
          <h2 className="heading-section mb-4">{t("experienceTitle")}</h2>
          <p className="body-text mx-auto max-w-3xl">{t("experienceIntro")}</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Timeline column */}
          <div className="slide-up space-y-8">
            <h3 className="heading-card text-gradient">{t("timelineTitle")}</h3>

            <div className="relative">
              {/* Timeline rail */}
              <div
                className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-primary to-secondary md:left-8"
                aria-hidden="true"
              />

              {EXPERIENCE_IDS.map((id) => (
                <div
                  key={id}
                  className="relative pb-10 pl-12 last:pb-0 md:pl-20"
                >
                  {/* Timeline dot */}
                  <div
                    className="absolute left-[9px] top-6 h-4 w-4 rounded-full border-4 border-background bg-primary shadow-lg md:left-[25px]"
                    aria-hidden="true"
                  />

                  <div className="glass-card p-5 transition-transform duration-300 hover:-translate-y-0.5 md:p-6">
                    <div className="mb-4 flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="border-primary/50 text-primary"
                      >
                        <Calendar className="mr-1 h-3 w-3" />
                        {t(`exp.${id}.period`)}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-secondary/50 text-secondary"
                      >
                        <MapPin className="mr-1 h-3 w-3" />
                        {t(`exp.${id}.location`)}
                      </Badge>
                    </div>

                    <h4 className="mb-1 text-lg font-bold text-foreground md:text-xl">
                      {t(`exp.${id}.title`)}
                    </h4>
                    <p className="mb-3 font-semibold text-primary">
                      {COMPANIES[id]}
                    </p>
                    <p className="caption-text mb-4">
                      {t(`exp.${id}.description`)}
                    </p>

                    <ul className="space-y-2">
                      {[1, 2, 3, 4].map((a) => (
                        <li key={a} className="flex items-start gap-2">
                          <span
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-accent"
                            aria-hidden="true"
                          />
                          <span className="text-sm text-muted-foreground">
                            {t(`exp.${id}.a${a}`)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Focus, certifications & stats column */}
          <div className="slide-up space-y-8 delay-300">
            <div className="glass-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <BookOpen className="h-6 w-6 shrink-0 text-primary" />
                <h3 className="heading-card text-gradient">
                  {t("currentFocusLabel")}
                </h3>
              </div>
              <p className="caption-text mb-4">{t("currentFocusText")}</p>
              <div className="flex flex-wrap gap-2">
                {FOCUS_IDS.map((id) => (
                  <Badge
                    key={id}
                    variant="outline"
                    className="border-primary/30 bg-primary/10 text-primary"
=======
import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  BookOpen,
  Award,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "../hooks/useLanguage";
import coinIcon from "@/assets/lego-bricks/gold-coin-2d.png";

export function ExperienceSection(props) {
  const workExperiences = [
    {
      period: "Sep 2024 – Present",
      title: "IT Support Specialist | System Administrator",
      company: "Erin College, Dublin",
      location: "Dublin, Ireland",
      description:
        "Responsible for IT infrastructure and system administration at an educational institution in Dublin, supporting daily operations and maintaining enterprise environments.",
      achievements: [
        "Provide hands-on technical support and system administration to 120+ users",
        "Manage Google Workspace enterprise environment with user accounts and access controls",
        "Administer Active Directory user accounts, permissions, and Group Policy configurations",
        "Configure and manage network services ensuring campus-wide connectivity",
        "Create comprehensive technical documentation and user guides",
        "Implement security policies following information security best practices",
      ],
    },
    {
      period: "May 2020 – Jun 2022",
      title: "IT Systems Support Specialist",
      company: "ETAL Prestação de Serviços LTDA",
      location: "Belo Horizonte, Brazil",
      description:
        "Managed IT systems and developed automation solutions for a services company in Brazil, combining technical support with software development to streamline operations.",
      achievements: [
        "Provided technical support for Windows Server environment supporting 50+ employees",
        "Managed user accounts, permissions, and access controls",
        "Performed system maintenance including hardware troubleshooting and workstation configurations",
        "Developed custom JavaScript automation (Node.js, Express.js) reducing processing time by 90%",
        "Built full-stack application integrating on-premise systems with Google Workspace APIs",
        "Created technical documentation and standard operating procedures",
        "Achieved high first-call resolution rates through systematic troubleshooting",
      ],
    },
    {
      period: "Jan 2019 – Feb 2020",
      title: "Digital Designer | Web Developer",
      company: "DabliumMusic",
      location: "Betim, Brazil",
      description:
        "Handled web development and digital branding for a creative studio, delivering client-facing websites and marketing materials.",
      achievements: [
        "Designed and developed business websites using HTML, CSS, and JavaScript",
        "Created visual identities and digital marketing materials",
        "Managed web hosting configurations and performed technical website maintenance",
        "Supported client portfolio development and brand strategy",
      ],
    },
  ];

  const education = [
    {
      period: "Sep 2024 – Aug 2025",
      title:
        "Bachelor of Science (Honours) in Computing - Software Engineering",
      company: "CCT College Dublin",
      location: "Dublin, Ireland",
      description:
        "Pursuing honours degree in Software Engineering with focus on software development, system architecture, database management, and web technologies. Expected Grade: First Class Honours.",
      achievements: [
        "Software Development and System Architecture",
        "Database Management and Web Technologies",
        "Linux and Windows Server Administration",
        "Cloud Computing and Network Fundamentals",
        "Information Security and Algorithms & Data Structures",
        "Combining academic study with professional IT practice",
      ],
    },
    {
      period: "Mar 2018 – Jul 2021",
      title: "Technologist Degree in Analysis and Systems Development",
      company: "UNICNEC",
      location: "Itaúna, Brazil",
      description:
        "Completed higher education technology diploma with focus on software engineering and systems development. Key subjects included system analysis, database design, and network configuration.",
      achievements: [
        "Software Engineering and System Analysis",
        "Database Design and Implementation",
        "Object-Oriented Programming",
        "Linux Server Administration (practical coursework)",
        "Network Configuration and Web Development",
        "Project Management and Technical Communication",
      ],
    },
  ];

  const certifications = [
    "Google Workspace Administration",
    "Active Directory Management",
    "Windows Server Administration",
    "JavaScript (Node.js, Express.js)",
    "Google Apps Script",
    "MySQL Database Management",
    "System Monitoring & Troubleshooting",
    "Information Security Best Practices",
    "Technical Documentation & Process Optimization",
    "HTML5 & CSS3 Development",
  ];

  const { t } = useLanguage();
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
    {},
  );

  const toggleCard = (key: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Timeline Item Component - Compact Version
  const TimelineItem = ({
    exp,
    cardKey,
    isExpanded,
    onToggle,
  }: {
    exp: (typeof workExperiences)[number];
    cardKey: string;
    isExpanded: boolean;
    onToggle: () => void;
  }) => {
    const visibleAchievements = isExpanded
      ? exp.achievements
      : exp.achievements.slice(0, 3);

    return (
      <div className="relative pl-16 pb-8 last:pb-0">
        <div className="absolute left-5 w-3 h-3 bg-primary rounded-full border-2 border-background shadow-lg"></div>
        <div className="glass p-4 rounded-lg hover:glass-strong transition-all duration-300">
          <div className="flex flex-wrap gap-1.5 mb-2">
            <Badge
              variant="outline"
              className="text-primary border-primary/50 text-xs px-2 py-0"
            >
              <Calendar className="w-2.5 h-2.5 mr-1" />
              {exp.period}
            </Badge>
            <Badge
              variant="outline"
              className="text-secondary border-secondary/50 text-xs px-2 py-0"
            >
              <MapPin className="w-2.5 h-2.5 mr-1" />
              {exp.location}
            </Badge>
          </div>

          <h4 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-1">
            {exp.title}
          </h4>
          <h5 className="text-sm text-primary font-semibold mb-2">
            {exp.company}
          </h5>
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed text-left">
            {exp.description}
          </p>

          <div className="space-y-1.5">
            {visibleAchievements.map((achievement, achIndex) => (
              <div
                key={`${cardKey}-ach-${achIndex}`}
                className="flex items-start gap-2"
              >
                <div className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-muted-foreground">
                  {achievement}
                </span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isExpanded}
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <img
              src={coinIcon}
              alt="Toggle details"
              className={`w-4 h-4 object-contain transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
            {isExpanded ? t("experienceShowLess") : t("experienceShowMore")}
          </button>
        </div>
      </div>
    );
  };

  return (
    <section id="experience" className="py-20 bg-muted/3 relative w-full">
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="mb-16 fade-in">
          <h2 className="heading-section mb-6 text-center">
            {t("experienceTitle")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-center leading-relaxed">
            {t("experienceIntro")}
          </p>
        </div>

        {/* Work Experience & Education - Side by Side */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Work Experience Section */}
          <div>
            <div className="flex items-center gap-2 mb-6 slide-up">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-blue-500">
                {t("workExperienceTitle")}
              </h3>
            </div>

            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-blue-500/30"></div>
              <div className="space-y-0">
                {workExperiences.map((exp, index) => {
                  const cardKey = `work-${index}`;
                  return (
                    <TimelineItem
                      key={cardKey}
                      exp={exp}
                      cardKey={cardKey}
                      isExpanded={Boolean(expandedCards[cardKey])}
                      onToggle={() => toggleCard(cardKey)}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div>
            <div className="flex items-center gap-2 mb-6 slide-up">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-purple-500">
                {t("educationTitle")}
              </h3>
            </div>

            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-blue-500/30"></div>
              <div className="space-y-0">
                {education.map((edu, index) => {
                  const cardKey = `edu-${index}`;
                  return (
                    <TimelineItem
                      key={cardKey}
                      exp={edu}
                      cardKey={cardKey}
                      isExpanded={Boolean(expandedCards[cardKey])}
                      onToggle={() => toggleCard(cardKey)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Certifications Section */}
        <SkillsSection certifications={certifications} t={t} />
      </div>
    </section>
  );
}

// Skills & Certifications Component with independent expand/collapse
function SkillsSection({ certifications, t }) {
  const [isCertsExpanded, setIsCertsExpanded] = useState(true);
  const [isFocusExpanded, setIsFocusExpanded] = useState(true);

  return (
    <div className="mt-12">
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Certifications - Collapsible */}
        <div className="glass-strong rounded-lg p-4 slide-up">
          <button
            onClick={() => setIsCertsExpanded(!isCertsExpanded)}
            className="w-full flex items-center justify-between mb-0 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <Award className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base lg:text-lg font-bold text-green-500">
                {t("certificationsTitle")}
              </h3>
            </div>
            <img
              src={coinIcon}
              alt="Toggle skills"
              className={`w-4 h-4 object-contain transition-transform duration-300 ${
                isCertsExpanded ? "rotate-180" : ""
              }`}
            />
          </button>

          {isCertsExpanded && (
            <div className="grid grid-cols-1 gap-1 mt-3 animate-in fade-in duration-300">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-1.5 rounded hover:bg-muted/20 transition-colors"
                >
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-muted-foreground">{cert}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Focus - Collapsible */}
        <div className="glass-strong rounded-lg p-4 slide-up delay-150">
          <button
            onClick={() => setIsFocusExpanded(!isFocusExpanded)}
            className="w-full flex items-center justify-between mb-0 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base lg:text-lg font-bold text-orange-500">
                {t("currentFocusLabel")}
              </h3>
            </div>
            <img
              src={coinIcon}
              alt="Toggle focus"
              className={`w-4 h-4 object-contain transition-transform duration-300 ${
                isFocusExpanded ? "rotate-180" : ""
              }`}
            />
          </button>

          {isFocusExpanded && (
            <div className="mt-3 animate-in fade-in duration-300">
              <p className="text-xs text-muted-foreground mb-3 leading-relaxed text-left">
                {t("currentFocusText")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Active Directory",
                  "Google Workspace",
                  "System Administration",
                  "Process Automation",
                  "Technical Support",
                  "Infrastructure Management",
                ].map((focus, index) => (
                  <Badge
                    key={index}
                    className="bg-orange-500/10 text-orange-400 border-orange-500/30 text-xs px-2 py-0.5"
>>>>>>> 57341ddefe7f3b416527f9e2d2bc41d6daab08c4
                  >
                    {t(`focus.${id}`)}
                  </Badge>
                ))}
              </div>
            </div>
<<<<<<< HEAD

            <div className="glass-card p-6">
              <div className="mb-4 flex items-center gap-3">
                <Award className="h-6 w-6 shrink-0 text-secondary" />
                <h3 className="heading-card text-gradient">
                  {t("certificationsTitle")}
                </h3>
              </div>
              <ul className="grid grid-cols-1 gap-1">
                {CERTIFICATION_IDS.map((id) => (
                  <li
                    key={id}
                    className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/60"
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full bg-brand-accent"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-muted-foreground">
                      {t(`cert.${id}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {KEY_STATS.map((stat) => (
                <div
                  key={stat.labelKey}
                  className="glass-card p-6 text-center transition-all duration-300 hover:neon-glow"
                >
                  <div className={`mb-2 text-3xl font-bold ${stat.tone}`}>
                    {stat.value}
                  </div>
                  <div className="caption-text">{t(stat.labelKey)}</div>
                </div>
              ))}
            </div>
          </div>
=======
          )}
>>>>>>> 57341ddefe7f3b416527f9e2d2bc41d6daab08c4
        </div>
      </div>
    </div>
  );
};

export { ExperienceSection };
export default ExperienceSection;
