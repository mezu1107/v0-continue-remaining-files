export interface ABTest {
  id: string
  name: string
  description: string
  type: 'headline' | 'cta' | 'content' | 'design' | 'layout'
  variants: ABVariant[]
  status: 'active' | 'completed' | 'paused'
  startDate: Date
  endDate?: Date
  confidenceLevel: number // 0-100
  winner?: string // variant ID
}

export interface ABVariant {
  id: string
  name: string
  content: string | object
  conversions: number
  views: number
  conversionRate: number
  confidence: number
}

export interface ABTestResult {
  testId: string
  variant: ABVariant
  isDifferencesignificant: boolean
  estimatedLift: number
  recommendation: string
}

// A/B Test Manager
export class ABTestEngine {
  private tests: Map<string, ABTest> = new Map()
  private userVariants: Map<string, string> = new Map() // userId -> variantId

  constructor() {
    this.loadTestsFromAPI()
  }

  // Load active tests from API
  private async loadTestsFromAPI() {
    try {
      const response = await fetch('/api/admin/ab-tests')
      const data = await response.json()
      data.tests?.forEach((test: ABTest) => {
        this.tests.set(test.id, test)
      })
    } catch (error) {
      console.error('Failed to load A/B tests:', error)
    }
  }

  // Assign user to variant (consistent within session)
  public assignVariant(testId: string, userId: string): ABVariant | null {
    const test = this.tests.get(testId)
    if (!test || test.status !== 'active') return null

    const key = `${testId}-${userId}`
    let variantId = this.userVariants.get(key)

    if (!variantId) {
      // Random assignment (50/50 for now, can be weighted)
      variantId = test.variants[Math.floor(Math.random() * test.variants.length)].id
      this.userVariants.set(key, variantId)
      this.saveVariantAssignment(userId, testId, variantId)
    }

    return test.variants.find((v) => v.id === variantId) || null
  }

  // Track conversion
  public async trackConversion(testId: string, variantId: string, userId: string) {
    try {
      await fetch('/api/admin/ab-tests/conversions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId, variantId, userId }),
      })
    } catch (error) {
      console.error('Failed to track conversion:', error)
    }
  }

  // Track pageview
  public async trackView(testId: string, variantId: string, userId: string) {
    try {
      await fetch('/api/admin/ab-tests/views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId, variantId, userId }),
      })
    } catch (error) {
      console.error('Failed to track view:', error)
    }
  }

  // Calculate statistical significance
  public calculateSignificance(variant1: ABVariant, variant2: ABVariant): {
    isSignificant: boolean
    pValue: number
    confidence: number
  } {
    // Chi-square test for proportions
    const p1 = variant1.conversionRate
    const p2 = variant2.conversionRate
    const n1 = variant1.views
    const n2 = variant2.views

    const pooledP = (variant1.conversions + variant2.conversions) / (n1 + n2)
    const se = Math.sqrt(pooledP * (1 - pooledP) * (1 / n1 + 1 / n2))
    const z = (p1 - p2) / se

    const pValue = 2 * (1 - this.normalCDF(Math.abs(z))) // two-tailed
    const isSignificant = pValue < 0.05 // 95% confidence
    const confidence = (1 - pValue) * 100

    return { isSignificant, pValue, confidence }
  }

  // Normal distribution CDF (for statistical calculations)
  private normalCDF(z: number): number {
    return 0.5 * (1 + Math.tanh(Math.sqrt(Math.PI / 8) * z))
  }

  // Get test results
  public getResults(testId: string): ABTestResult | null {
    const test = this.tests.get(testId)
    if (!test || test.variants.length < 2) return null

    const v1 = test.variants[0]
    const v2 = test.variants[1]

    const { isSignificant, confidence } = this.calculateSignificance(v1, v2)
    const lift = ((v1.conversionRate - v2.conversionRate) / v2.conversionRate) * 100

    let recommendation = 'Continue testing...'
    if (isSignificant) {
      if (v1.conversionRate > v2.conversionRate) {
        recommendation = `Winner found! "${v1.name}" outperforms by ${lift.toFixed(1)}%`
      } else {
        recommendation = `Winner found! "${v2.name}" outperforms by ${Math.abs(lift).toFixed(1)}%`
      }
    }

    return {
      testId,
      variant: v1.conversionRate > v2.conversionRate ? v1 : v2,
      isDifferencesignificant: isSignificant,
      estimatedLift: lift,
      recommendation,
    }
  }

  // Save variant assignment to backend
  private async saveVariantAssignment(userId: string, testId: string, variantId: string) {
    try {
      await fetch('/api/admin/ab-tests/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, testId, variantId }),
      })
    } catch (error) {
      console.error('Failed to save variant assignment:', error)
    }
  }
}

// Singleton instance
let instance: ABTestEngine | null = null

export function getABTestEngine(): ABTestEngine {
  if (!instance) {
    instance = new ABTestEngine()
  }
  return instance
}
