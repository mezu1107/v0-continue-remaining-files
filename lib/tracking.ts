// Pixel and conversion tracking utility

export interface TrackingEvent {
  pixelCode: string
  eventType: string
  eventData?: Record<string, any>
  pageUrl?: string
  referrer?: string
}

export interface ConversionEvent {
  type: 'form_submission' | 'purchase' | 'signup' | 'contact' | 'custom'
  value?: number
  email?: string
  phone?: string
}

// Generate or get persistent visitor ID
export function getVisitorId(): string {
  const storageKey = '_am_visitor_id'

  if (typeof window === 'undefined') return ''

  let visitorId = localStorage.getItem(storageKey)

  if (!visitorId) {
    visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(storageKey, visitorId)
  }

  return visitorId
}

// Track a pixel event
export async function trackPixelEvent(event: TrackingEvent): Promise<void> {
  try {
    const payload = {
      pixelCode: event.pixelCode,
      eventType: event.eventType,
      eventData: event.eventData || {},
      visitorId: getVisitorId(),
      pageUrl: event.pageUrl || window.location.href,
      referrer: event.referrer || document.referrer,
    }

    await fetch('/api/pixels/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch (error) {
    console.error('Failed to track pixel event:', error)
    // Silently fail to not interrupt user experience
  }
}

// Track page view
export async function trackPageView(pixelCode: string): Promise<void> {
  await trackPixelEvent({
    pixelCode,
    eventType: 'page_view',
    eventData: {
      page_title: document.title,
      scroll_depth: 0,
    },
  })
}

// Track conversion
export async function trackConversion(pixelCode: string, conversion: ConversionEvent): Promise<void> {
  await trackPixelEvent({
    pixelCode,
    eventType: `conversion_${conversion.type}`,
    eventData: {
      conversion_type: conversion.type,
      conversion_value: conversion.value,
      email: conversion.email,
      phone: conversion.phone,
      timestamp: new Date().toISOString(),
    },
  })
}

// Track form submission
export async function trackFormSubmission(pixelCode: string, formData: Record<string, any>): Promise<void> {
  await trackConversion(pixelCode, {
    type: 'form_submission',
    email: formData.email,
    phone: formData.phone,
  })
}

// Track click
export async function trackClick(pixelCode: string, elementId: string): Promise<void> {
  await trackPixelEvent({
    pixelCode,
    eventType: 'click',
    eventData: {
      element_id: elementId,
      element_text: document.getElementById(elementId)?.textContent,
    },
  })
}

// Track scroll depth
export async function initScrollTracking(pixelCode: string): Promise<void> {
  let maxScroll = 0

  const handleScroll = () => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0

    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent

      // Track milestone scrolls
      if ([25, 50, 75, 100].includes(Math.floor(scrollPercent))) {
        trackPixelEvent({
          pixelCode,
          eventType: 'scroll_depth',
          eventData: {
            scroll_percent: Math.floor(scrollPercent),
          },
        })
      }
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll, { passive: true })
  }
}

// Initialize all tracking for a page
export function initializeTracking(pixelCode: string): void {
  if (typeof window === 'undefined') return

  // Track page view on mount
  trackPageView(pixelCode)

  // Track scroll depth
  initScrollTracking(pixelCode)

  // Track when user leaves
  const handleBeforeUnload = () => {
    navigator.sendBeacon('/api/pixels/events', JSON.stringify({
      pixelCode,
      eventType: 'page_exit',
      visitorId: getVisitorId(),
      pageUrl: window.location.href,
    }))
  }

  window.addEventListener('beforeunload', handleBeforeUnload)
}

// Google Ads conversion tracking
export async function trackGoogleAdsConversion(conversionId: string, conversionLabel: string, conversionValue?: number): Promise<void> {
  try {
    // Using Google Ads conversion tracking API
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        'allow_custom_scripts': true,
        'send_page_view': false,
        'value': conversionValue || 1,
        'currency': 'USD',
      })
    }

    // Also log to our backend
    await fetch('/api/google-ads/conversions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversionId,
        conversionLabel,
        conversionValue,
        timestamp: new Date().toISOString(),
      }),
    })
  } catch (error) {
    console.error('Failed to track Google Ads conversion:', error)
  }
}
