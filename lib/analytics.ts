interface AnalyticsEvent {
  event: string
  properties?: Record<string, unknown>
  timestamp: number
  sessionId: string
}

class Analytics {
  private sessionId: string
  private events: AnalyticsEvent[] = []
  private isClient = typeof window !== 'undefined'

  constructor() {
    this.sessionId = this.generateSessionId()
    if (this.isClient) {
      this.initSession()
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private initSession(): void {
    this.track('session_start', {
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      url: window.location.href,
      timestamp: new Date().toISOString()
    })

    window.addEventListener('beforeunload', () => {
      this.track('session_end', {
        duration: Date.now() - parseInt(this.sessionId.split('-')[0])
      })
      this.flush()
    })

    setInterval(() => {
      this.flush()
    }, 30000)
  }

  track(event: string, properties?: Record<string, unknown>): void {
    if (!this.isClient) return

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        path: window.location.pathname,
        userAgent: navigator.userAgent
      },
      timestamp: Date.now(),
      sessionId: this.sessionId
    }

    this.events.push(analyticsEvent)

    if (this.events.length > 50) {
      this.flush()
    }
  }

  private async flush(): Promise<void> {
    if (this.events.length === 0) return

    const eventsToSend = [...this.events]
    this.events = []

    console.log('Analytics events to send:', eventsToSend)
  }

  trackAreaIncrement(areaName: string): void {
    this.track('area_increment', {
      area_name: areaName,
      action: 'increment_count'
    })
  }

  trackLootRecord(type: 'rune' | 'item', name: string, areaName: string): void {
    this.track('loot_recorded', {
      loot_type: type,
      loot_name: name,
      area_name: areaName
    })
  }

  trackCustomAreaAdd(areaName: string): void {
    this.track('custom_area_added', {
      area_name: areaName
    })
  }

  trackAreaSelect(areaName: string): void {
    this.track('area_selected', {
      area_name: areaName
    })
  }
}

export const analytics = new Analytics()