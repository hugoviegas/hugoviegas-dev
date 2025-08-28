import React from "react";
import { MapPin, Calendar, BookOpen, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "../hooks/useLanguage";

export function ExperienceSection(props) {
  const experiences = [
    {
      period: "Sep 2024 – Present",
      title: "IT Support Specialist",
      company: "Erin College, Dublin",
      location: "Dublin, Ireland",
      description:
        "Resolve advanced software/hardware incidents, perform maintenance and device formatting, and restore operations quickly in a live school environment.",
      achievements: [
        "Resolve advanced software/hardware incidents and perform maintenance",
        "Train staff on internal systems with concise documentation",
        "Manage user accounts and permissions in Active Directory",
        "Strengthen access security and compliance through governance",
      ],
    },
    {
      period: "May 2020 – Jun 2022",
      title: "IT Technical Support",
      company: "ETAL Prestação de Serviços",
      location: "Belo Horizonte, Brazil",
      description:
        "Supported corporate systems and handled computer maintenance/formatting with focus on clarity and speed.",
      achievements: [
        "Built custom system integrated with administrative platforms",
        "Reduced process times by 90% using JavaScript with Google libraries",
        "Collaborated on proposal and budgeting materials",
        "Aligned technology solutions to business goals",
      ],
    },
    {
      period: "Jan 2019 – Feb 2020",
      title: "Designer & Social Media Manager",
      company: "DabliuMusic",
      location: "Betim, Brazil",
      description:
        "Created visual identities and user-friendly websites with a focus on usability and conversion.",
      achievements: [
        "Managed social media accounts, increasing views by up to 20%",
        "Created visual identities and user-friendly websites",
        "Drove client engagement through user-centered design",
        "Focused on usability and conversion optimization",
      ],
    },
    {
      period: "Sep 2024 – Sep 2025",
      title: "Computer Science Student",
      company: "CCT College Dublin",
      location: "Dublin, Ireland",
      description:
        "Pursuing Computer Science degree (EQF Level 8) with focus on software development and modern technologies.",
      achievements: [
        "Full-stack web development specialization",
        "Advanced programming and algorithms",
        "Database design and management",
        "Software engineering principles",
      ],
    },
    {
      period: "Mar 2018 – Jul 2021",
      title: "Analysis and Systems Development",
      company: "UNICNEC",
      location: "Itaúna, Brazil",
      description:
        "Completed technologist degree in Analysis and Systems Development, building foundational knowledge in technology and business processes.",
      achievements: [
        "Technology fundamentals and systems analysis",
        "Business process analysis and optimization",
        "Project management and development methodologies",
        "Communication and technical documentation skills",
      ],
    },
  ];

  const certifications = [
    "JavaScript (Node.js, Express)",
    "Google Apps Script",
    "Google Workspace Administration",
    "Active Directory Management",
    "Adobe Creative Suite (Illustrator, Photoshop, InDesign)",
    "ITSM Practices & L2/L3 Support",
    "Technical Documentation",
    "Access Governance & Security",
  ];

  const { t } = useLanguage(); // previously caused ReferenceError: useLanguage is not defined

  return (
    <section id="experience" className="py-20 bg-muted/5">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 fade-in">
          <h2 className="heading-section mb-6">{t("experienceTitle")}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("experienceIntro")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Timeline Column */}
          <div className="space-y-8 slide-up">
            <h3 className="text-3xl font-bold text-gradient mb-8">
              {t("timelineTitle")}
            </h3>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary to-secondary"></div>

              {experiences.map((exp, index) => (
                <div key={index} className="relative pl-20 pb-12 last:pb-0">
                  {/* Timeline Dot */}
                  <div className="absolute left-6 w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg"></div>

                  <div className="glass p-6 rounded-xl hover:glass-strong transition-all duration-300">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge
                        variant="outline"
                        className="text-primary border-primary/50"
                      >
                        <Calendar className="w-3 h-3 mr-1" />
                        {exp.period}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-secondary border-secondary/50"
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        {exp.location}
                      </Badge>
                    </div>

                    <h4 className="text-xl font-bold text-gradient mb-2">
                      {exp.title}
                    </h4>
                    <h5 className="text-lg text-primary font-semibold mb-3">
                      {exp.company}
                    </h5>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {exp.description}
                    </p>

                    <div className="space-y-2">
                      {exp.achievements.map((achievement, achIndex) => (
                        <div key={achIndex} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-muted-foreground">
                            {achievement}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills & Certifications Column */}
          <div className="space-y-8 slide-up delay-300">
            {/* Current Focus */}
            <div className="glass p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-bold text-gradient">
                  {t("currentFocusLabel")}
                </h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {t("currentFocusText") ||
                  "Currently transitioning from IT Support to Full-Stack Development while studying Computer Science at CCT College Dublin."}
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Full-Stack Development",
                  "Process Automation",
                  "Google Workspace Integration",
                  "Technical Documentation",
                  "Security & Compliance",
                  "User Experience",
                ].map((focus, index) => (
                  <Badge
                    key={index}
                    className="bg-primary/10 text-primary border-primary/30"
                  >
                    {focus}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="glass p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-secondary" />
                <h3 className="text-2xl font-bold text-gradient">
                  {t("certificationsTitle")}
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-muted-foreground">{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-6 text-center rounded-xl hover:neon-glow transition-all duration-300">
                <div className="text-3xl font-bold text-primary mb-2">90%</div>
                <div className="text-sm text-muted-foreground">
                  Process Reduction
                </div>
              </div>
              <div className="glass p-6 text-center rounded-xl hover:neon-glow transition-all duration-300">
                <div className="text-3xl font-bold text-secondary mb-2">
                  +20%
                </div>
                <div className="text-sm text-muted-foreground">
                  Views Growth
                </div>
              </div>
              <div className="glass p-6 text-center rounded-xl hover:neon-glow transition-all duration-300">
                <div className="text-3xl font-bold text-accent mb-2">4+</div>
                <div className="text-sm text-muted-foreground">
                  Years Experience
                </div>
              </div>
              <div className="glass p-6 text-center rounded-xl hover:neon-glow transition-all duration-300">
                <div className="text-3xl font-bold text-primary mb-2">2</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExperienceSection;
