import { Code, Globe, Users, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import SkillsSection from '@/components/SkillsSection';
import StatsSection from '@/components/StatsSection';

const AboutSection = () => {
  const highlights = [
    {
      icon: Zap,
      title: 'Process Optimization',
      description: 'Developed custom JavaScript system that reduced process times by 90%'
    },
    {
      icon: Globe,
      title: 'International Experience',
      description: 'Working in Dublin while maintaining Brazilian roots and perspectives'
    },
    {
      icon: Users,
      title: 'Cross-functional Skills',
      description: 'Bridging IT Support expertise with modern web development practices'
    },
    {
      icon: Code,
      title: 'Continuous Learning',
      description: 'Currently pursuing Computer Science degree at CCT College Dublin'
    }
  ];

  return (
    <section id="about" className="py-20 bg-muted/5">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 fade-in">
          <h2 className="heading-section mb-6">About Me</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From troubleshooting complex IT issues to crafting elegant web solutions, 
            I bring a unique perspective that combines technical support excellence with 
            modern development practices.
          </p>
        </div>

        {/* Stats Section */}
        <div className="mb-20">
          <StatsSection />
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Story Column */}
          <div className="space-y-8 slide-up">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gradient">My Journey</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Starting as an IT Support Specialist in Brazil, I've spent over 4 years mastering the art of 
                problem-solving and system optimization. My move to Dublin opened new opportunities to blend 
                this expertise with cutting-edge web development.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The breakthrough moment came when I developed a custom JavaScript automation system that 
                integrated with Google Sheets and AppSheet, reducing critical business processes by 90%. 
                This achievement sparked my passion for creating efficient, scalable solutions through code.
              </p>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {highlights.map((highlight, index) => (
                <div key={index} className="card-skill">
                  <highlight.icon className="w-8 h-8 text-primary mb-4 mx-auto" />
                  <h4 className="font-semibold text-lg mb-2">{highlight.title}</h4>
                  <p className="text-sm text-muted-foreground">{highlight.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Column */}
          <div className="space-y-8 slide-up delay-300">
            <h3 className="text-3xl font-bold text-gradient">Technical Skills</h3>
            
            <SkillsSection />

            {/* Languages */}
            <div className="glass p-6 rounded-xl">
              <h4 className="text-xl font-semibold text-primary mb-4">Languages</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Portuguese</span>
                  <Badge variant="secondary">Native</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>English</span>
                  <Badge variant="secondary">C1 Proficiency</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;