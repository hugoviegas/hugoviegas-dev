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
      <div className="relative pl-12 md:pl-16 pb-8 last:pb-0">
        <div className="absolute left-[18px] md:left-5 w-3 h-3 rounded-full bg-primary border-2 border-background shadow-lg"></div>
        <div className="glass-card glass-card-hover p-6">
          <div className="flex flex-wrap gap-1.5 mb-2">
            <Badge
              variant="outline"
              className="border border-primary/40 text-primary text-xs px-2 py-0.5"
            >
              <Calendar className="w-2.5 h-2.5 mr-1" />
              {exp.period}
            </Badge>
            <Badge
              variant="outline"
              className="border border-secondary/40 text-secondary text-xs px-2 py-0.5"
            >
              <MapPin className="w-2.5 h-2.5 mr-1" />
              {exp.location}
            </Badge>
          </div>

          <h4 className="mb-1 text-lg font-semibold text-foreground">
            {exp.title}
          </h4>
          <h5 className="mb-2 text-sm font-semibold text-primary">
            {exp.company}
          </h5>
          <p className="caption-text mb-3 text-left">{exp.description}</p>

          <div className="space-y-1.5">
            {visibleAchievements.map((achievement, achIndex) => (
              <div
                key={`${cardKey}-ach-${achIndex}`}
                className="flex items-start gap-2"
              >
                <div className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full bg-accent"></div>
                <span className="caption-text">{achievement}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isExpanded}
            className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <img
              src={coinIcon}
              alt=""
              aria-hidden="true"
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
    <section
      id="experience"
      className="section-y relative w-full bg-muted/20"
    >
      <div className="section-wrapper relative z-10">
        <div className="section-header fade-in">
          <h2 className="heading-section mb-4">{t("experienceTitle")}</h2>
          <p className="body-text mx-auto max-w-3xl">{t("experienceIntro")}</p>
        </div>

        {/* Work Experience & Education - Side by Side */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Work Experience Section */}
          <div>
            <div className="flex items-center gap-2 mb-6 slide-up">
              <div className="w-10 h-10 shrink-0 rounded-full bg-primary flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="heading-card">{t("workExperienceTitle")}</h3>
            </div>

            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border"></div>
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
              <div className="w-10 h-10 shrink-0 rounded-full bg-secondary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-secondary-foreground" />
              </div>
              <h3 className="heading-card">{t("educationTitle")}</h3>
            </div>

            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border"></div>
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
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Certifications - Collapsible */}
        <div className="glass-card p-6 slide-up">
          <button
            onClick={() => setIsCertsExpanded(!isCertsExpanded)}
            className="flex min-h-11 w-full items-center justify-between hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 rounded-full bg-accent flex items-center justify-center">
                <Award className="w-5 h-5 text-accent-foreground" />
              </div>
              <h3 className="heading-card">{t("certificationsTitle")}</h3>
            </div>
            <img
              src={coinIcon}
              alt=""
              aria-hidden="true"
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
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/40 transition-colors"
                >
                  <div className="w-1.5 h-1.5 shrink-0 rounded-full bg-accent"></div>
                  <span className="caption-text">{cert}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Focus - Collapsible */}
        <div className="glass-card p-6 slide-up delay-150">
          <button
            onClick={() => setIsFocusExpanded(!isFocusExpanded)}
            className="flex min-h-11 w-full items-center justify-between hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 rounded-full bg-secondary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-secondary-foreground" />
              </div>
              <h3 className="heading-card">{t("currentFocusLabel")}</h3>
            </div>
            <img
              src={coinIcon}
              alt=""
              aria-hidden="true"
              className={`w-4 h-4 object-contain transition-transform duration-300 ${
                isFocusExpanded ? "rotate-180" : ""
              }`}
            />
          </button>

          {isFocusExpanded && (
            <div className="mt-3 animate-in fade-in duration-300">
              <p className="caption-text mb-3 text-left">
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
                    className="bg-secondary/15 text-secondary border border-secondary/30 text-xs px-2 py-0.5"
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
