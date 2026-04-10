export const locales = ['en', 'de', 'zh', 'tr', 'ja', 'ur'] as const
export const defaultLocale = 'en' as const

export type Locale = (typeof locales)[number]

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  zh: '中文',
  tr: 'Türkçe',
  ja: '日本語',
  ur: 'اردو',
}
