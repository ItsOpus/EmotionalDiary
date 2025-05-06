"use client"

import type React from "react"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { DiaryPost } from "./diary-feed"

interface DiaryCardProps {
  post: DiaryPost
  onLike: (postId: string) => void
  onAddComment: (postId: string, comment: { author: string; content: string }) => void
}

export default function DiaryCard({ post, onLike, onAddComment }: DiaryCardProps) {
  const [commentAuthor, setCommentAuthor] = useState("")
  const [commentContent, setCommentContent] = useState("")
  const [showCommentForm, setShowCommentForm] = useState(false)

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

  return (
    <div className="diary-content">
      <h3 className="text-xl font-medium text-white mb-2">{post.title}</h3>
      <p className="text-white/80 mb-4">{post.content}</p>

      <div className="flex justify-between items-center text-sm text-white/60 mb-4">
        <span>{post.author}</span>
        <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className="flex items-center gap-1 text-white/70 hover:text-pink-400 hover:bg-pink-400/10"
        >
          <Heart className="h-4 w-4" />
          <span>{post.likes}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCommentForm}
          className="flex items-center gap-1 text-white/70 hover:text-blue-400 hover:bg-blue-400/10"
        >
          <MessageCircle className="h-4 w-4" />
          <span>{post.comments.length}</span>
        </Button>
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
