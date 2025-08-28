import { Github, Linkedin, Mail, Heart } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  const socialLinks = [
    {
      icon: Github,
      url: 'https://github.com/hugoviegas/',
      label: 'GitHub'
    },
    {
      icon: Linkedin,
      url: 'https://www.linkedin.com/in/hviegas/',
      label: 'LinkedIn'
    },
    {
      icon: Mail,
      url: 'mailto:hugoviegas3.1@gmail.com',
      label: 'Email'
    }
  ];

  return (
    <footer className="bg-muted/5 border-t border-white/10">
      <div className="container mx-auto px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-gradient mb-2">Hugo Viegas</h3>
            <p className="text-muted-foreground">
              IT Support Specialist → Full-Stack Developer
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 glass rounded-full hover:glass-strong hover:scale-110 hover:neon-glow transition-all duration-300 group"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5 text-primary group-hover:text-accent transition-colors" />
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>© {currentYear} Hugo Viegas. All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            <span>in Dublin, Ireland</span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Available for freelance work and full-time opportunities • 
            Fluent in Portuguese & English • 
            Open to remote and hybrid arrangements
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;