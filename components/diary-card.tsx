"use client"

import type React from "react"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageCircle, Send, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { DiaryPost } from "./diary-feed"
import Image from "next/image"
import Link from "next/link"

interface DiaryCardProps {
  post: DiaryPost
  onLike: (postId: string) => void
  onAddComment: (postId: string, comment: { author: string; content: string }) => void
}

export default function DiaryCard({ post, onLike, onAddComment }: DiaryCardProps) {
  const [commentAuthor, setCommentAuthor] = useState("")
  const [commentContent, setCommentContent] = useState("")
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleLike = () => {
    onLike(post._id)
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (commentAuthor.trim() && commentContent.trim()) {
      onAddComment(post._id, {
        author: commentAuthor,
        content: commentContent,
      })
      setCommentAuthor("")
      setCommentContent("")
      setShowCommentForm(false)
    }
  }

  const toggleCommentForm = () => {
    setShowCommentForm(!showCommentForm)
  }

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  // Truncate content for preview
  const previewContent = post.content.length > 100 && !expanded ? post.content.substring(0, 100) + "..." : post.content

  return (
    <div className="diary-content">
      <div className="cursor-pointer" onClick={toggleExpand}>
        <h3 className="text-xl font-medium text-white mb-2">{post.title}</h3>

        {post.imageUrl && (
          <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden">
            <Image
              src={post.imageUrl || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover"
              onError={(e) => {
                // Fallback for invalid images
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=400&width=600"
              }}
            />
          </div>
        )}

        <p className="text-white/80 mb-2">{previewContent}</p>

        {post.content.length > 100 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              toggleExpand()
            }}
            className="text-primary hover:text-primary/80 p-0 h-auto mb-2 flex items-center"
          >
            {expanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" /> Show less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" /> Read more
              </>
            )}
          </Button>
        )}

        <div className="flex justify-between items-center text-sm text-white/60 mb-2">
          <span>{post.author}</span>
          <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            handleLike()
          }}
          className="flex items-center gap-1 text-white/70 hover:text-pink-400 hover:bg-pink-400/10"
        >
          <Heart className="h-4 w-4" />
          <span>{post.likes}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            toggleCommentForm()
          }}
          className="flex items-center gap-1 text-white/70 hover:text-blue-400 hover:bg-blue-400/10"
        >
          <MessageCircle className="h-4 w-4" />
          <span>{post.comments.length}</span>
        </Button>

        <Link href={`/post/${post._id}`} onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-white/70 hover:text-green-400 hover:bg-green-400/10"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View</span>
          </Button>
        </Link>
      </div>

      {showCommentForm && (
        <form onSubmit={handleSubmitComment} className="mt-4 space-y-3">
          <Input
            placeholder="Your name"
            value={commentAuthor}
            onChange={(e) => setCommentAuthor(e.target.value)}
            className="bg-white/10 border-white/20"
            required
          />
          <div className="flex gap-2">
            <Input
              placeholder="Add a comment..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="bg-white/10 border-white/20"
              required
            />
            <Button type="submit" size="icon" variant="ghost">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      )}

      {post.comments.length > 0 && (
        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="comments" className="border-white/10">
            <AccordionTrigger className="text-sm text-white/70 hover:text-white">
              View {post.comments.length} comments
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                {post.comments.map((comment) => (
                  <div key={comment._id} className="flex gap-3">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-primary/20 text-xs">
                        {comment.author.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{comment.author}</span>
                        <span className="text-xs text-white/50">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-white/80">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  )
}
