"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { translations, Language, TranslationKeys } from "./translations"

type TranslationContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: TranslationKeys
  dir: "ltr" | "rtl"
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

const LANGUAGE_KEY = "app_language"

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(LANGUAGE_KEY) as Language | null
    if (saved && (saved === "en" || saved === "ur")) {
      setLanguageState(saved)
    }
    setMounted(true)
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem(LANGUAGE_KEY, lang)
    document.documentElement.dir = lang === "ur" ? "rtl" : "ltr"
    document.documentElement.lang = lang
  }, [])

  useEffect(() => {
    if (mounted) {
      document.documentElement.dir = language === "ur" ? "rtl" : "ltr"
      document.documentElement.lang = language
    }
  }, [language, mounted])

  const value: TranslationContextType = {
    language,
    setLanguage,
    t: translations[language],
    dir: language === "ur" ? "rtl" : "ltr",
  }

  if (!mounted) {
    return null
  }

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error("useTranslation must be used within TranslationProvider")
  }
  return context
}
