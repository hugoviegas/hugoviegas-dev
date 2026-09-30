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
import coinIcon from "@/assets/lego-bricks/gold-coin-2d.webp";

interface TimelineEntry {
  period: string;
  title: string;
  company: string;
  location: string;
  description: string;
  achievements: string[];
}

// Defined at module level so its identity is stable across renders; an inline
// component would remount on every toggle and drop keyboard focus.
function TimelineItem({
  exp,
  cardKey,
  isExpanded,
  onToggle,
}: {
  exp: TimelineEntry;
  cardKey: string;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { t } = useLanguage();
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

        {exp.achievements.length > 0 && (
          <div id={`${cardKey}-achievements`} className="space-y-1.5">
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
        )}

        {exp.achievements.length > 3 && (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isExpanded}
            aria-controls={`${cardKey}-achievements`}
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <img
              src={coinIcon}
              alt=""
              className={`w-4 h-4 object-contain transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
            {isExpanded ? t("experienceShowLess") : t("experienceShowMore")}
          </button>
        )}
      </div>
    </div>
  );
}

export function ExperienceSection(props) {
  const { t } = useLanguage();

  const workExperiences: TimelineEntry[] = [
    {
      period: "Sep 2024 – Present",
      title: "IT Support Specialist | System Administrator",
      company: "Erin College, Dublin",
      location: "Dublin, Ireland",
      description:
        "Designed, developed, and maintain a full-stack internal ERP platform alongside IT infrastructure and system administration for an educational institution in Dublin.",
      achievements: [
        "Designed, developed, and maintain a full-stack ERP (HR, payroll, finance, student management, ticketing) with React, TypeScript, and Google Apps Script, supporting 120+ users",
        "Build automation tools and data pipelines to reduce manual work and improve process efficiency",
        "Provide hands-on technical support and system administration to 120+ users",
        "Manage Google Workspace enterprise environment with user accounts and access controls",
        "Administer Active Directory user accounts, permissions, and Group Policy configurations",
        "Configure and manage network services ensuring campus-wide connectivity",
        "Create comprehensive technical documentation and user guides",
        "Implement security policies following information security best practices",
      ],
    },
    {
      period: t("exp.freelance.period"),
      title: t("exp.freelance.title"),
      company: t("exp.freelance.company"),
      location: t("exp.freelance.location"),
      description: t("exp.freelance.description"),
      achievements: [t("exp.freelance.a1"), t("exp.freelance.a2")],
    },
    {
      period: "May 2020 – Jun 2022",
      title: "IT Systems Support Specialist",
      company: "ETAL Prestação de Serviços LTDA",
      location: "Belo Horizonte, Brazil",
      description:
        "Managed IT systems and developed automation solutions for a services company in Brazil, combining technical support with software development to streamline operations.",
      achievements: [
        "Provided technical support for a Windows Server environment supporting employees across multiple departments",
        "Managed user accounts, permissions, and access controls",
        "Performed system maintenance including hardware troubleshooting and workstation configurations",
        "Developed a custom automation solution with JavaScript (Node.js, Express.js), PHP, and MySQL, reducing administrative processing time by 90%",
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

  const education: typeof workExperiences = [
    {
      period: "Sep 2024 – Sep 2025",
      title: "Higher Diploma in Science in Computing",
      company: "CCT College Dublin",
      location: "Dublin, Ireland",
      description:
        "Completed with a First Class final grade (EQF level 8), covering software development, system architecture, database management, and web technologies.",
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
      period: t("edu.icot.period"),
      title: t("edu.icot.title"),
      company: t("edu.icot.company"),
      location: t("edu.icot.location"),
      description: t("edu.icot.description"),
      achievements: [],
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

  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
    {},
  );

  const toggleCard = (key: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
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
            type="button"
            onClick={() => setIsCertsExpanded(!isCertsExpanded)}
            aria-expanded={isCertsExpanded}
            aria-controls="experience-certifications"
            className="w-full flex items-center justify-between mb-0 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <Award className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base lg:text-lg font-bold text-green-700 dark:text-green-500">
                {t("certificationsTitle")}
              </h3>
            </div>
            <img
              src={coinIcon}
              alt=""
              className={`w-4 h-4 object-contain transition-transform duration-300 ${
                isCertsExpanded ? "rotate-180" : ""
              }`}
            />
          </button>

          {isCertsExpanded && (
            <div
              id="experience-certifications"
              className="grid grid-cols-1 gap-1 mt-3 animate-in fade-in duration-300"
            >
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
            type="button"
            onClick={() => setIsFocusExpanded(!isFocusExpanded)}
            aria-expanded={isFocusExpanded}
            aria-controls="experience-focus"
            className="w-full flex items-center justify-between mb-0 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base lg:text-lg font-bold text-orange-700 dark:text-orange-500">
                {t("currentFocusLabel")}
              </h3>
            </div>
            <img
              src={coinIcon}
              alt=""
              className={`w-4 h-4 object-contain transition-transform duration-300 ${
                isFocusExpanded ? "rotate-180" : ""
              }`}
            />
          </button>

          {isFocusExpanded && (
            <div
              id="experience-focus"
              className="mt-3 animate-in fade-in duration-300"
            >
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
                    className="bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30 text-xs px-2 py-0.5"
                  >
                    {focus}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExperienceSection;
