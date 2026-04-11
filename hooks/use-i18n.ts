import { useEffect, useState } from "react"

const messages: Record<string, any> = {
  en: require("../messages/en.json"),
  de: require("../messages/de.json"),
  zh: require("../messages/zh.json"),
  tr: require("../messages/tr.json"),
  ja: require("../messages/ja.json"),
  ur: require("../messages/ur.json"),
}

export function useI18n() {
  const [language, setLanguage] = useState("en")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Get language from localStorage or default to 'en'
    const savedLang = localStorage.getItem("language") || "en"
    setLanguage(savedLang)
    setIsLoaded(true)
  }, [])

  const t = (key: string): string => {
    const keys = key.split(".")
    let value: any = messages[language]

    for (const k of keys) {
      value = value?.[k]
    }

    return value || key
  }

  const changeLanguage = (lang: string) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
    // Dispatch custom event for other components to listen
    window.dispatchEvent(
      new CustomEvent("languageChanged", { detail: { language: lang } })
    )
  }

  return {
    t,
    language,
    changeLanguage,
    isLoaded,
  }
}
