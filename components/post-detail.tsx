"use client"

import type React from "react"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Heart, MessageCircle, Send, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { DiaryPost, Comment } from "./diary-feed"

interface PostDetailProps {
  post: DiaryPost
}

export default function PostDetail({ post }: PostDetailProps) {
  const [likes, setLikes] = useState(post.likes)
  const [comments, setComments] = useState<Comment[]>(post.comments)
  const [commentAuthor, setCommentAuthor] = useState("")
  const [commentContent, setCommentContent] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to like post")

      setLikes(likes + 1)
    } catch (error) {
      console.error("Error liking post:", error)
      toast({
        title: "Error",
        description: "Failed to like the post",
        variant: "destructive",
      })
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!commentAuthor.trim() || !commentContent.trim()) {
      return
    }

    try {
      const response = await fetch(`/api/posts/${post._id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author: commentAuthor,
          content: commentContent,
        }),
      })

      if (!response.ok) throw new Error("Failed to add comment")

      const newComment = await response.json()
      setComments([...comments, newComment])
      setCommentAuthor("")
      setCommentContent("")

      toast({
        title: "Comment added",
        description: "Your comment has been added successfully",
      })
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Error",
        description: "Failed to add your comment",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="diary-content">
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white/70 hover:text-white mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>

        {post.imageUrl && (
          <div className="mb-6 relative w-full h-80 rounded-lg overflow-hidden">
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

        <div className="whitespace-pre-wrap text-white/90 mb-6">{post.content}</div>

        <div className="flex justify-between items-center text-sm text-white/60 mb-6">
          <span className="font-medium text-white/80">{post.author}</span>
          <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
        </div>
        <div className="text-xs italic text-white/30 text-right">Post ID: {post._id}</div>
      </div>

      <div className="flex items-center gap-4 border-t border-white/10 pt-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLike}
          className="flex items-center gap-1 text-white/70 hover:text-pink-400 hover:bg-pink-400/10"
        >
          <Heart className="h-4 w-4" />
          <span>{likes}</span>
        </Button>

        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-white/70">
          <MessageCircle className="h-4 w-4" />
          <span>{comments.length} comments</span>
        </Button>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-medium text-white">Comments</h2>

        <form onSubmit={handleSubmitComment} className="space-y-3">
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

        {comments.length > 0 ? (
          <div className="space-y-4 pt-2">
            {comments.map((comment) => (
              <div key={comment._id} className="flex gap-3 p-3 bg-white/5 rounded-lg">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/20">{comment.author.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {comment.author} <span className="text-xs text-white/40">(ID: {comment._id})</span>
                    </span>
                    <span className="text-xs text-white/50">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-white/80 mt-1">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/50 text-center py-4">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  )
}
