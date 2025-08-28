import { useState, useEffect } from 'react';
import { languages, LanguageCode } from '@/config/languages';

interface Translations {
  [key: string]: {
    EN: string;
    PT: string;
  };
}

const translations: Translations = {
  about: { EN: 'About', PT: 'Sobre' },
  projects: { EN: 'Projects', PT: 'Projetos' },
  experience: { EN: 'Experience', PT: 'Experiência' },
  contact: { EN: 'Contact', PT: 'Contato' },
  hello: { EN: 'Hello, I\'m', PT: 'Olá, eu sou' },
  role: { EN: 'IT Support Specialist → Full-Stack Developer', PT: 'Especialista em TI → Desenvolvedor Full-Stack' },
  description: {
    EN: 'Transforming 4+ years of IT Support expertise into innovative web solutions. Based in Dublin, passionate about problem-solving and continuous learning.',
    PT: 'Transformando 4+ anos de experiência em Suporte de TI em soluções web inovadoras. Baseado em Dublin, apaixonado por resolução de problemas e aprendizado contínuo.'
  },
  viewProjects: { EN: 'View My Projects', PT: 'Ver Meus Projetos' },
  getInTouch: { EN: 'Get In Touch', PT: 'Entre em Contato' }
};

export const useLanguage = () => {
  const [language, setLanguage] = useState<LanguageCode>('EN');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('language') as LanguageCode;
      if (saved && saved in languages) setLanguage(saved);
    } catch (e) {
      // ignore in non-browser env
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('language', language);
    } catch (e) {
      // ignore
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'EN' ? 'PT' : 'EN');
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const currentLanguage = languages[language];

  return {
    language,
    setLanguage,
    toggleLanguage,
    t,
    currentLanguage
  };
};
