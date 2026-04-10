'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, RefreshCw, Check } from 'lucide-react'
import { toast } from 'sonner'

interface Ticket {
  id: string
  ticket_number: string
  title: string
  description: string
  status: string
  priority: string
  category: string
  created_at: string
  updated_at: string
  is_published: boolean
  responses: TicketResponse[]
}

interface TicketResponse {
  id: string
  message: string
  responder: {
    email: string
    first_name?: string
    last_name?: string
  }
  created_at: string
  published_on_site: boolean
}

const statusColors: Record<string, string> = {
  open: 'bg-blue-500',
  in_progress: 'bg-yellow-500',
  waiting_customer: 'bg-orange-500',
  resolved: 'bg-green-500',
  closed: 'bg-gray-500',
}

const priorityColors: Record<string, string> = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
}

interface TicketDetailProps {
  ticketId: string
  userId?: string
  isAdmin?: boolean
}

export function TicketDetail({ ticketId, userId, isAdmin = false }: TicketDetailProps) {
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newResponse, setNewResponse] = useState('')
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Fetch ticket data
  const fetchTicket = async () => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}`)
      if (!response.ok) throw new Error('Failed to fetch ticket')
      
      const data = await response.json()
      setTicket(data)
    } catch (error) {
      toast.error('Failed to load ticket details')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTicket()
    
    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchTicket, 30000)
    return () => clearInterval(interval)
  }, [ticketId])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchTicket()
    setIsRefreshing(false)
    toast.success('Ticket updated')
  }

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newResponse.trim() || !userId) return

    setIsSubmittingResponse(true)
    try {
      const response = await fetch(`/api/tickets/${ticketId}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responderId: userId,
          message: newResponse,
          isAdminResponse: false,
          publishOnSite: false,
        }),
      })

      if (!response.ok) throw new Error('Failed to submit response')

      setNewResponse('')
      await fetchTicket()
      toast.success('Response submitted')
    } catch (error) {
      toast.error('Failed to submit response')
    } finally {
      setIsSubmittingResponse(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  if (!ticket) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Ticket not found</p>
        </CardContent>
      </Card>
    )
  }

  // Filter responses: show all if admin, show only published if user
  const visibleResponses = isAdmin
    ? ticket.responses
    : ticket.responses.filter((r) => r.published_on_site)

  return (
    <div className="space-y-6">
      {/* Ticket Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{ticket.ticket_number}</Badge>
                <Badge className={`${statusColors[ticket.status]}`}>
                  {ticket.status.replace('_', ' ')}
                </Badge>
                <Badge className={`${priorityColors[ticket.priority]}`}>
                  {ticket.priority}
                </Badge>
              </div>
              <CardTitle className="text-2xl">{ticket.title}</CardTitle>
              <CardDescription>
                Created on {new Date(ticket.created_at).toLocaleDateString()}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Category</h4>
              <p className="text-muted-foreground">{ticket.category.replace('_', ' ')}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="whitespace-pre-wrap text-muted-foreground">{ticket.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Responses Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Responses</h3>
        
        {visibleResponses.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No responses yet {!isAdmin && '(admin responses will appear here)'}
              </p>
            </CardContent>
          </Card>
        ) : (
          visibleResponses.map((response) => (
            <Card key={response.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">
                      {response.responder.first_name || response.responder.email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(response.created_at).toLocaleString()}
                    </p>
                  </div>
                  {response.published_on_site && (
                    <div className="flex items-center gap-1 text-green-600">
                      <Check className="size-4" />
                      <span className="text-sm">Published</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{response.message}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Response Form (for users) */}
      {!isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Response</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitResponse} className="space-y-4">
              <Textarea
                placeholder="Your response or additional information..."
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                rows={4}
              />
              <Button
                type="submit"
                disabled={isSubmittingResponse || !newResponse.trim()}
              >
                {isSubmittingResponse && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Submit Response
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
