import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mail, MapPin, Clock, Linkedin, Github, Send, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. I'll get back to you within 24 hours.",
    });
    
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'hugoviegas3.1@gmail.com',
      link: 'mailto:hugoviegas3.1@gmail.com'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Dublin, Ireland',
      link: null
    },
    {
      icon: Clock,
      label: 'Response Time',
      value: 'Within 24 hours',
      link: null
    }
  ];

  const socialLinks = [
    {
      icon: Linkedin,
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/hviegas/',
      color: 'text-blue-400'
    },
    {
      icon: Github,
      label: 'GitHub',
      url: 'https://github.com/hugoviegas/',
      color: 'text-primary'
    },
    {
      icon: Mail,
      label: 'Email',
      url: 'mailto:hugoviegas3.1@gmail.com',
      color: 'text-secondary'
    }
  ];

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 fade-in">
          <h2 className="heading-section mb-6">{t('contactTitle')}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('contactDescription')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="space-y-8 slide-up">
            <div>
              <h3 className="text-3xl font-bold text-gradient mb-4">{t('sendMessageTitle')}</h3>
              <p className="text-muted-foreground">{t('contactPrompt')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Input
                    name="name"
                      placeholder={t('placeholder.name')}
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="glass border-white/20 bg-card/50 focus:border-primary transition-all duration-300"
                  />
                </div>
                <div>
                  <Input
                    name="email"
                    type="email"
                    placeholder={t('placeholder.email')}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="glass border-white/20 bg-card/50 focus:border-primary transition-all duration-300"
                  />
                </div>
              </div>
              
              <Input
                name="subject"
                placeholder={t('placeholder.subject')}
                value={formData.subject}
                onChange={handleChange}
                required
                className="glass border-white/20 bg-card/50 focus:border-primary transition-all duration-300"
              />
              
              <Textarea
                name="message"
                placeholder={t('placeholder.project')}
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                className="glass border-white/20 bg-card/50 focus:border-primary transition-all duration-300"
              />
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn-hero w-full text-lg py-6"
              >
                {isSubmitting ? (
                  t('send.sending')
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    {t('send.sendMessage')}
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8 slide-up delay-300">
            <div>
              <h3 className="text-3xl font-bold text-gradient mb-4">{t('getInTouch')}</h3>
              <p className="text-muted-foreground">{t('connectWithMe')}</p>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <div key={index} className="glass p-6 rounded-xl hover:glass-strong transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{info.label}</div>
                      {info.link ? (
                        <a 
                          href={info.link} 
                          className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <div className="text-lg font-semibold text-foreground">{info.value}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="glass p-6 rounded-xl">
              <h4 className="text-xl font-semibold text-gradient mb-4">{t('connectWithMe')}</h4>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 hover:scale-105 transition-all duration-300 group"
                  >
                    <social.icon className={`w-5 h-5 ${social.color} group-hover:scale-110 transition-transform`} />
                    <span className="text-muted-foreground group-hover:text-primary transition-colors">
                      {social.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Availability Status */}
            <div className="glass p-6 rounded-xl border border-accent/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                <Badge className="bg-accent/10 text-accent border-accent/30">
                  {t('availableForWork')}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{t('availabilityText')}</p>
            </div>

            {/* Current Time */}
            <div className="glass p-4 rounded-xl text-center">
              <div className="text-sm text-muted-foreground mb-1">{t('currentTimeInDublin')}</div>
              <div className="text-lg font-semibold text-primary">
                {new Date().toLocaleTimeString('en-IE', { 
                  timeZone: 'Europe/Dublin',
                  hour: '2-digit',
                  minute: '2-digit'
                })} GMT
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;