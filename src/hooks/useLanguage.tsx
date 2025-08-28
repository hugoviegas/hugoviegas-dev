import { useState, useEffect } from "react";
import { languages, LanguageCode } from "@/config/languages";

interface Translations {
  [key: string]: {
    EN: string;
    PT: string;
  };
}

const translations: Translations = {
  about: { EN: "About", PT: "Sobre" },
  projects: { EN: "Projects", PT: "Projetos" },
  experience: { EN: "Experience", PT: "Experiência" },
  contact: { EN: "Contact", PT: "Contato" },
  hello: { EN: "Hello, I'm", PT: "Olá, eu sou" },
  role: {
    EN: "IT Support Specialist → Full-Stack Developer",
    PT: "Especialista em TI → Desenvolvedor Full-Stack",
  },
  description: {
    EN: "IT professional in Dublin with experience in technical support, automation, and web development. Combines fast diagnosis, clear documentation, and outcome focus—such as 90% operational time reductions—to ship secure, scalable, and easy-to-use solutions.",
    PT: "Profissional de TI em Dublin com experiência em suporte técnico, automação e desenvolvimento web. Combina diagnóstico rápido, documentação clara e foco em resultados—como reduções de 90% no tempo operacional—para entregar soluções seguras, escaláveis e fáceis de usar.",
  },
  viewProjects: { EN: "View My Projects", PT: "Ver Meus Projetos" },
  getInTouch: { EN: "Get In Touch", PT: "Entre em Contato" },
  journeySummary1: {
    EN: "My path began with early curiosity—tinkering with phones at eight, winning robotics championships at eleven, and pursuing formal training in Analysis and Systems Development at eighteen. This foundation led to IT work where I discovered the power of automation, creating solutions that reduced processes by 90% and streamlined operations for hundreds of employees.",
    PT: "Meu caminho começou com curiosidade precoce—brincando com celulares aos oito anos, vencendo campeonatos de robótica aos onze e cursando Análise e Desenvolvimento de Sistemas aos dezoito. Essa base me levou ao trabalho em TI onde descobri o poder da automação, criando soluções que reduziram processos em 90% e otimizaram operações para centenas de funcionários.",
  },
  journeySummary2: {
    EN: "Moving to Ireland in 2022 opened new horizons—balancing hospitality work with English immersion while saving for better opportunities. In 2024, I began studying Computer Science at CCT College and started as an IT Support Specialist at Erin College, achieving First-Class academic results while automating departmental processes and building websites that deliver real value.",
    PT: "Mudar para a Irlanda em 2022 abriu novos horizontes—equilibrando trabalho na hospitalidade com imersão no inglês enquanto economizava para melhores oportunidades. Em 2024, comecei a estudar Ciência da Computação na CCT College e iniciei como Especialista em Suporte de TI na Erin College, alcançando resultados acadêmicos de Primeira Classe enquanto automatizava processos departamentais e construía sites que entregam valor real.",
  },
  readFullStory: { EN: "Read Full Story", PT: "Ler História Completa" },
  fullStoryTitle: { EN: "My Complete Journey", PT: "Minha Jornada Completa" },
  fullStory: {
    EN: `The first spark came early. At eight, a first phone opened a door to a world of tinkering—downloading .jar games, changing settings, and personalizing everything became a playground for curiosity. At eleven, that curiosity met purpose: a Lego robotics championship at school. Building and programming a robot with a drag‑and‑drop language, the team won regionals and reached nationals. Resources were limited, but the lesson was profound: technology wasn't just interesting—it was a path worth pursuing and mastering.

A few years later, at seventeen, after a first job as a young apprentice in a supermarket, the savings went into a first laptop. That purchase unlocked image and video editing, PC formatting, and a deeper dive into how things work under the hood. At eighteen, formal training followed: a degree in Analysis and Systems Development brought programming logic, math, databases, and web development into focus. The foundation for building real systems was set.

In 2021, with a friend and an older brother, a videomaker and social media venture took shape. It sharpened design sensibility and content skills, but it also made something clear: the real passion was solving operational problems with code. That opportunity arrived in IT, at a services company where the official remit was basic support and file organization. In the free hours, an underused tool—AppSheet over Google Sheets—became the engine for an internal app that simplified daily processes. To design it well, HR and finance workflows were learned end‑to‑end. The result: the timesheet close for 400+ employees dropped from four days to about one. Curiosity met impact, and the satisfaction of turning messy workflows into simple tools turned into a signature.

Ireland came next—a year of saving made the move possible for better opportunities and English immersion. Two years working in hospitality accelerated fluency and cultural understanding. In September 2024, the focus doubled down: a Higher Diploma in Science of Computing at CCT College and an IT role at Erin College began in the same month. The academic effort paid off with First‑Class results. On the job, spreadsheet automation skills leveled up with AI prompting and programming logic—projects across departments were streamlined, and each week revealed a new layer of automation possible within Google's ecosystem.

Alongside this, a practical challenge arrived from the restaurant job: build the D'Arcy McGee's website. With AI tooling, design/UX study, and hands‑on engineering, a fast, functional site came together—proof that shipping value quickly is a repeatable skill, not a one‑off. Today, the search is for a front‑end or full‑stack role that rewards exactly this mix: curiosity, product sense, and the ability to turn complex processes into elegant, measurable solutions. The drive remains the same as that eleven‑year‑old at the robotics table: learn fast, build well, and keep moving.`,
    PT: `A primeira faísca veio cedo. Aos oito anos, um primeiro celular abriu a porta para um mundo de experimentação — baixar joguinhos em formato .jar, mexer em configurações e personalizar tudo virou um parque de diversões para a curiosidade. Aos onze, essa curiosidade encontrou propósito: um campeonato escolar de robótica Lego. Construindo e programando um robô com uma linguagem de arrastar e soltar, a equipe venceu a etapa regional e chegou ao nacional. Faltaram recursos, mas sobrou lição: tecnologia não era só interessante — era um caminho a ser perseguido e dominado.

Alguns anos depois, aos dezessete, após o primeiro emprego como jovem aprendiz em supermercado, as economias viraram o primeiro notebook. Essa compra destravou edição de imagens e vídeo, formatação de PCs e um mergulho mais profundo em como as coisas funcionam por baixo do capô. Aos dezoito, veio a formação formal: Análise e Desenvolvimento de Sistemas trouxe lógica de programação, matemática, bancos de dados e desenvolvimento web. A base para construir sistemas reais estava lançada.

Em 2021, com um amigo e o irmão mais velho, nasceu um estúdio de videomaker e social media. A sensibilidade de design e conteúdo evoluiu, mas outra certeza cresceu: a verdadeira paixão era resolver problemas operacionais com código. A chance apareceu em TI, numa empresa de prestação de serviços onde o escopo oficial era suporte básico e organização de arquivos. Nas horas vagas, uma ferramenta pouco explorada — AppSheet sobre Google Sheets — virou o motor de um app interno para simplificar rotinas diárias. Para desenhá-lo bem, foi preciso aprender ponta a ponta os fluxos de RH e financeiro. O resultado: o fechamento de ponto de mais de 400 colaboradores caiu de quatro dias para cerca de um. Curiosidade virou impacto — e transformar fluxos caóticos em ferramentas simples virou marca registrada.

Veio a Irlanda — um ano de economia financiou a mudança, buscando mais oportunidades e imersão no inglês. Dois anos na hospitalidade aceleraram a fluência e o entendimento cultural. Em setembro de 2024, o foco dobrou: um Higher Diploma em Science of Computing na CCT College e um cargo de TI na Erin College começaram no mesmo mês. O esforço acadêmico rendeu resultado de First‑Class. No trabalho, as automações em planilhas subiram de nível com uso de IA e lógica de programação — processos de diversas áreas foram otimizados, e a cada semana surgia uma nova camada de automação possível dentro do ecossistema Google.

Em paralelo, um desafio prático veio do restaurante onde trabalhava: construir o site do D'Arcy McGee's. Com ferramentas de IA, estudo de design/UX e engenharia mão na massa, saiu um site rápido e funcional — prova de que entregar valor depressa é uma habilidade repetível. Hoje, a meta é uma vaga front‑end ou full‑stack que valorize exatamente esse conjunto: curiosidade, senso de produto e capacidade de transformar processos complexos em soluções elegantes e mensuráveis. A energia é a mesma daquele garoto de onze anos na mesa de robótica: aprender rápido, construir bem e seguir em frente.`,
  },
};

export const useLanguage = () => {
  const [language, setLanguage] = useState<LanguageCode>("EN");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("language") as LanguageCode;
      if (saved && saved in languages) setLanguage(saved);
    } catch (e) {
      // ignore in non-browser env
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("language", language);
    } catch (e) {
      // ignore
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "EN" ? "PT" : "EN"));
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
    currentLanguage,
  };
};
