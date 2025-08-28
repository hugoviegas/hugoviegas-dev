import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Filter } from "lucide-react";
import automationProject from "@/assets/project-automation.jpg";
import ecommerceProject from "@/assets/project-ecommerce.jpg";
import taskManagerProject from "@/assets/project-taskmanager.jpg";
import darcyMcgeesProject from "@/assets/project-darcy-mcgees.jpg";

const ProjectsSection = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const { t } = useLanguage();

  const projects = [
    {
      id: 1,
      title: "D'Arcy McGee's Irish Pub Website",
      description:
        "Professional restaurant website for D'Arcy McGee's Irish Pub featuring modern responsive design, interactive menu system, event listings, and seamless user experience. Built with focus on brand representation and customer engagement for this authentic Irish establishment in Dublin.",
      image: darcyMcgeesProject,
      technologies: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
      category: "Web Development",
      featured: true,
      liveUrl: "https://www.darcymcgeespub.com/",
      githubUrl: "https://github.com/hugoviegas/mcgees-irish-pub-online",
      metrics: "Live Client Website",
    },
    {
      id: 2,
      title: "Business Process Automation System",
      description:
        "Custom JavaScript solution integrated with Google Sheets and AppSheet that reduced critical business processes by 90%. Features real-time data synchronization, automated workflows, and comprehensive reporting dashboard.",
      image: automationProject,
      technologies: [
        "JavaScript",
        "Google Apps Script",
        "AppSheet",
        "Google Sheets",
      ],
      category: "Automation",
      featured: true,
      liveUrl: "#",
      githubUrl: "#",
      metrics: "90% time reduction",
    },
    {
      id: 3,
      title: "Modern E-Commerce Platform",
      description:
        "Full-stack e-commerce solution built with React and Node.js. Features include user authentication, payment processing, inventory management, and admin dashboard.",
      image: ecommerceProject,
      technologies: ["React", "Node.js", "Express", "MongoDB", "Stripe"],
      category: "Web Development",
      featured: false,
      liveUrl: "#",
      githubUrl: "#",
      metrics: "Full-stack solution",
    },
    {
      id: 4,
      title: "Project Management Dashboard",
      description:
        "Collaborative task management application with real-time updates, team collaboration features, and project analytics. Built with modern web technologies.",
      image: taskManagerProject,
      technologies: ["React", "TypeScript", "Tailwind CSS", "Supabase"],
      category: "Web Development",
      featured: false,
      liveUrl: "#",
      githubUrl: "#",
      metrics: "Team collaboration",
    },
  ];

  // Keep internal keys for filtering and provide translated labels for display
  const categories = [
    { key: "All", label: t("category.All") },
    { key: "Automation", label: t("category.Automation") },
    { key: "Web Development", label: t("category.Web Development") },
    { key: "Mobile", label: t("category.Mobile") },
  ];

  const filteredProjects =
    selectedFilter === "All"
      ? projects
      : projects.filter((project) => project.category === selectedFilter);

  return (
    <section id="projects" className="py-20">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 fade-in">
          <h2 className="heading-section mb-6">{t("projectsTitle")}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("projectsIntro")}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 slide-up">
          {categories.map((category) => (
            <Button
              key={category.key}
              variant={selectedFilter === category.key ? "default" : "outline"}
              onClick={() => setSelectedFilter(category.key)}
              className={`${
                selectedFilter === category.key
                  ? "bg-primary text-background shadow-lg scale-105"
                  : "btn-ghost hover:scale-105"
              } transition-all duration-300 hover:shadow-md`}
            >
              <Filter
                className={`w-4 h-4 mr-2 transition-transform duration-300 ${
                  selectedFilter === category.key ? "rotate-180" : ""
                }`}
              />
              {category.label}
              {selectedFilter === category.key && (
                <span className="ml-2 text-xs bg-background/20 px-2 py-1 rounded-full">
                  {filteredProjects.length}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`card-project rounded-2xl overflow-hidden ${
                project.featured ? "md:col-span-2 lg:col-span-2" : ""
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Project Image */}
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 md:h-64 object-cover transition-transform duration-500 hover:scale-110"
                />
                {project.featured && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-accent text-background font-semibold">
                      {t("badge.featuredProject")}
                    </Badge>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="glass-strong">
                    {t(`project.${project.id}.metrics`) || project.metrics}
                  </Badge>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gradient">
                    {t(`project.${project.id}.title`) || project.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t(`project.${project.id}.description`) ||
                      project.description}
                  </p>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <Badge
                      key={techIndex}
                      variant="outline"
                      className="text-primary border-primary/50"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* Project Links */}
                <div className="flex gap-4 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="btn-ghost flex-1"
                    onClick={() => window.open(project.liveUrl, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t("liveDemo")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="btn-ghost flex-1"
                    onClick={() => window.open(project.githubUrl, "_blank")}
                  >
                    <Github className="w-4 h-4 mr-2" />
                    {t("code")}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12 fade-in">
          <p className="text-lg text-muted-foreground mb-6">
            {t("projectsCTA")}
          </p>
          <Button
            className="btn-hero"
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {t("projectsCTABtn")}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
