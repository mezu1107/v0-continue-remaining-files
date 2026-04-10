import { useCallback } from 'react'
import type { Locale } from '@/i18n.config'

type MessageKeys = 
  | 'common'
  | 'navigation'
  | 'hero'
  | 'services'
  | 'tickets'
  | 'admin'
  | 'footer'
  | 'errors'

type DeepKeyOf<T> = T extends Record<string, any>
  ? {
      [K in keyof T]: T[K] extends Record<string, any>
        ? `${string & K}.${string & DeepKeyOf<T[K]>}`
        : `${string & K}`
    }[keyof T]
  : never

export function useTranslations(locale: Locale) {
  const messages = require(`@/messages/${locale}.json`)

  const t = useCallback(
    (key: string, defaultValue?: string): string => {
      const keys = key.split('.')
      let value: any = messages

      for (const k of keys) {
        value = value?.[k]
      }

      return value ?? defaultValue ?? key
    },
    [messages]
  )

  return { t, locale }
}

// Export all messages for static generation
export async function getMessages(locale: Locale) {
  try {
    return await import(`@/messages/${locale}.json`)
  } catch {
    return await import('@/messages/en.json')
  }
}
