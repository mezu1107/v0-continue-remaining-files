export type PersonalityMode = 'professional' | 'friendly' | 'technical'

export interface PersonalityProfile {
  mode: PersonalityMode
  tone: string
  vocabulary: string[]
  examples: string[]
  cta: string
}

export const PersonalityModes: Record<PersonalityMode, PersonalityProfile> = {
  professional: {
    mode: 'professional',
    tone: 'Formal, authoritative, solution-focused',
    vocabulary: [
      'enterprise',
      'strategic',
      'ROI',
      'optimization',
      'implementation',
      'stakeholder',
      'deliverable',
    ],
    examples: [
      'Drive measurable business outcomes',
      'Strategic partnership approach',
      'Optimize operational efficiency',
    ],
    cta: 'Schedule Executive Briefing',
  },
  friendly: {
    mode: 'friendly',
    tone: 'Casual, warm, relatable, conversational',
    vocabulary: [
      'awesome',
      'amazing',
      'love',
      'easy',
      'fun',
      'simple',
      'happy',
      'excited',
    ],
    examples: [
      "We'd love to help you grow",
      'Making digital marketing fun and effective',
      'Your success is our mission',
    ],
    cta: 'Let\'s Chat',
  },
  technical: {
    mode: 'technical',
    tone: 'Precise, data-driven, technical details',
    vocabulary: [
      'algorithm',
      'API',
      'integration',
      'infrastructure',
      'scalability',
      'performance',
      'optimization',
      'architecture',
    ],
    examples: [
      'Microservices-based architecture',
      'Real-time data synchronization',
      'Automated CI/CD pipeline',
    ],
    cta: 'View Technical Specs',
  },
}

// Detect user personality preference
export function detectPersonalityPreference(
  userAgent?: string,
  referrer?: string,
  keywords?: string[]
): PersonalityMode {
  // Check localStorage for saved preference
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('personality_mode')
    if (saved && ['professional', 'friendly', 'technical'].includes(saved)) {
      return saved as PersonalityMode
    }
  }

  // Detect from keywords in URL or content
  if (keywords) {
    const techKeywords = ['api', 'dev', 'code', 'technical', 'architecture']
    const hasTechKeywords = keywords.some((k) =>
      techKeywords.some((tk) => k.toLowerCase().includes(tk))
    )
    if (hasTechKeywords) return 'technical'
  }

  // Detect from referrer (GitHub, Stack Overflow = technical)
  if (referrer && ['github', 'stackoverflow', 'dev'].some((s) => referrer.includes(s))) {
    return 'technical'
  }

  // Default to professional
  return 'professional'
}

// Apply personality to content
export function applyPersonality(
  content: string,
  mode: PersonalityMode,
  replacements?: Record<string, string>
): string {
  let result = content

  const personality = PersonalityModes[mode]

  // Replace generic terms with personality-specific ones
  const defaultReplacements: Record<PersonalityMode, Record<string, string>> = {
    professional: {
      'powerful solution': 'enterprise-grade solution',
      'easy to use': 'streamlined implementation',
      'great results': 'measurable business outcomes',
    },
    friendly: {
      'powerful solution': 'awesome solution',
      'easy to use': 'super easy to use',
      'great results': 'amazing results',
    },
    technical: {
      'powerful solution': 'high-performance solution',
      'easy to use': 'simple integration',
      'great results': 'optimized performance metrics',
    },
  }

  const finalReplacements = { ...defaultReplacements[mode], ...replacements }

  Object.entries(finalReplacements).forEach(([key, value]) => {
    result = result.replace(new RegExp(key, 'gi'), value)
  })

  return result
}

// Get personality-aware CTA
export function getPersonalityCTA(mode: PersonalityMode): string {
  return PersonalityModes[mode].cta
}

// Save personality preference
export function savePersonalityPreference(mode: PersonalityMode) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('personality_mode', mode)
  }
}
