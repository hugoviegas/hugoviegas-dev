import { MapPin, Calendar, BookOpen, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ExperienceSection = () => {
  const experiences = [
    {
      period: '2020 - Present',
      title: 'IT Support Specialist',
      company: 'Various Companies',
      location: 'Dublin, Ireland & Brazil',
      description: 'Provided comprehensive technical support, managed system infrastructure, and developed automation solutions. Created custom JavaScript system that reduced process times by 90%.',
      achievements: [
        'Reduced critical process times by 90% through automation',
        'Managed Google Workspace and Active Directory environments',
        'Developed custom integrations with Google Sheets & AppSheet',
        'Provided multilingual technical support (EN/PT)'
      ]
    },
    {
      period: '2024 - Present',
      title: 'Computer Science Student',
      company: 'CCT College Dublin',
      location: 'Dublin, Ireland',
      description: 'Pursuing comprehensive Computer Science education focusing on software development, algorithms, and modern web technologies.',
      achievements: [
        'Full-stack web development specialization',
        'Advanced JavaScript and Python programming',
        'Database design and management',
        'Software engineering principles'
      ]
    },
    {
      period: '2019 - 2020',
      title: 'Previous Education',
      company: 'UNICNEC',
      location: 'Brazil',
      description: 'Built foundational knowledge in technology and business processes that inform current approach to problem-solving.',
      achievements: [
        'Technology fundamentals',
        'Business process analysis',
        'Project management basics',
        'Communication skills development'
      ]
    }
  ];

  const certifications = [
    'Google Workspace Administration',
    'Microsoft Office Specialist',
    'Adobe Creative Suite Certified',
    'JavaScript ES6+ Proficiency',
    'React Development Fundamentals',
    'Node.js Backend Development'
  ];

  return (
    <section id="experience" className="py-20 bg-muted/5">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 fade-in">
          <h2 className="heading-section mb-6">Experience & Education</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A journey of continuous learning and innovation, from IT support excellence 
            to full-stack development mastery.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Timeline Column */}
          <div className="space-y-8 slide-up">
            <h3 className="text-3xl font-bold text-gradient mb-8">Professional Timeline</h3>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary to-secondary"></div>
              
              {experiences.map((exp, index) => (
                <div key={index} className="relative pl-20 pb-12 last:pb-0">
                  {/* Timeline Dot */}
                  <div className="absolute left-6 w-4 h-4 bg-primary rounded-full border-4 border-background shadow-lg"></div>
                  
                  <div className="glass p-6 rounded-xl hover:glass-strong transition-all duration-300">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="text-primary border-primary/50">
                        <Calendar className="w-3 h-3 mr-1" />
                        {exp.period}
                      </Badge>
                      <Badge variant="outline" className="text-secondary border-secondary/50">
                        <MapPin className="w-3 h-3 mr-1" />
                        {exp.location}
                      </Badge>
                    </div>
                    
                    <h4 className="text-xl font-bold text-gradient mb-2">{exp.title}</h4>
                    <h5 className="text-lg text-primary font-semibold mb-3">{exp.company}</h5>
                    <p className="text-muted-foreground mb-4 leading-relaxed">{exp.description}</p>
                    
                    <div className="space-y-2">
                      {exp.achievements.map((achievement, achIndex) => (
                        <div key={achIndex} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-muted-foreground">{achievement}</span>
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
                <h3 className="text-2xl font-bold text-gradient">Current Focus</h3>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Bridging my extensive IT Support background with modern web development practices, 
                creating solutions that are both technically sound and user-friendly.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Full-Stack Development', 'System Integration', 'Process Automation', 'UI/UX Design'].map((focus, index) => (
                  <Badge key={index} className="bg-primary/10 text-primary border-primary/30">
                    {focus}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="glass p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-secondary" />
                <h3 className="text-2xl font-bold text-gradient">Skills & Certifications</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-muted-foreground">{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-6 text-center rounded-xl hover:neon-glow transition-all duration-300">
                <div className="text-3xl font-bold text-primary mb-2">4+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="glass p-6 text-center rounded-xl hover:neon-glow transition-all duration-300">
                <div className="text-3xl font-bold text-secondary mb-2">90%</div>
                <div className="text-sm text-muted-foreground">Process Improvement</div>
              </div>
              <div className="glass p-6 text-center rounded-xl hover:neon-glow transition-all duration-300">
                <div className="text-3xl font-bold text-accent mb-2">2</div>
                <div className="text-sm text-muted-foreground">Languages</div>
              </div>
              <div className="glass p-6 text-center rounded-xl hover:neon-glow transition-all duration-300">
                <div className="text-3xl font-bold text-primary mb-2">∞</div>
                <div className="text-sm text-muted-foreground">Learning</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;