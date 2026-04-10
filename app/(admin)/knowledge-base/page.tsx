"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useAuth } from "@/lib/auth-context"
import { fetchKnowledgeBase, formatDate } from "@/lib/mock-api"
import type { KnowledgeArticle } from "@/lib/types"
import { Plus, ChevronDown, Search, BookOpen, FileText, Clock, Pencil } from "lucide-react"
import { toast } from "sonner"

export default function KnowledgeBasePage() {
  const { company } = useAuth()
  const [articles, setArticles] = useState<KnowledgeArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null)

  useEffect(() => {
    fetchKnowledgeBase(company.id).then((data) => {
      setArticles(data)
      setLoading(false)
    })
  }, [company.id])

  const categories = [...new Set(articles.map((a) => a.category))]
  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getArticlesByCategory = (category: string) =>
    filteredArticles.filter((a) => a.category === category)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Knowledge Base"
        description="Internal documentation and guides for your team."
        breadcrumbs={[{ label: "Knowledge Base" }]}
        actions={
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 size-4" /> New Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Article</DialogTitle>
                <DialogDescription>Add a new knowledge base article.</DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  toast.success("Article created")
                }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <Label>Title</Label>
                  <Input placeholder="Article title" required />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Category</Label>
                  <Input placeholder="e.g., Onboarding, Technical" required />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Content</Label>
                  <Textarea placeholder="Write your article content..." className="min-h-48" />
                </div>
                <Button type="submit">Create Article</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Articles</p>
              <p className="text-2xl font-bold text-foreground">{articles.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
              <FileText className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="text-2xl font-bold text-foreground">{categories.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500/10">
              <Clock className="size-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="text-lg font-bold text-foreground">
                {articles.length > 0 ? formatDate(articles[0].updatedAt) : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        {categories.map((category) => {
          const categoryArticles = getArticlesByCategory(category)
          if (categoryArticles.length === 0) return null

          return (
            <Collapsible key={category} defaultOpen>
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg bg-muted/50 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                <span>{category}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {categoryArticles.length}
                  </Badge>
                  <ChevronDown className="size-4 transition-transform" />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <div className="grid gap-3">
                  {categoryArticles.map((article) => (
                    <Card
                      key={article.id}
                      className="border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedArticle(article)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground">{article.title}</h3>
                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                              {article.content.substring(0, 150)}...
                            </p>
                            <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                              <span>By {article.author}</span>
                              <span>Updated {formatDate(article.updatedAt)}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="size-8 shrink-0">
                            <Pencil className="size-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </div>

      {selectedArticle && (
        <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedArticle.title}</DialogTitle>
              <DialogDescription>
                By {selectedArticle.author} | Last updated: {formatDate(selectedArticle.updatedAt)}
              </DialogDescription>
            </DialogHeader>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-foreground whitespace-pre-wrap">{selectedArticle.content}</p>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setSelectedArticle(null)}>
                Close
              </Button>
              <Button onClick={() => toast.success("Edit mode enabled")}>
                <Pencil className="mr-2 size-4" /> Edit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
