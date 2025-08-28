// Configuração de idiomas e traduções
export const languages = {
  EN: {
    code: 'EN',
    name: 'English',
    flag: '🇺🇸'
  },
  PT: {
    code: 'PT',
    name: 'Português',
    flag: '🇧🇷'
  }
} as const;

export type LanguageCode = keyof typeof languages;
