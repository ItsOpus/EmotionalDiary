"use client"

import { useEffect, useState } from "react"
import DiaryCard from "./diary-card"
import { Skeleton } from "@/components/ui/skeleton"

export type DiaryPost = {
  _id: string
  title: string
  content: string
  author: string
  createdAt: string
  likes: number
  comments: Comment[]
}

export type Comment = {
  _id: string
  author: string
  content: string
  createdAt: string
}

export default function DiaryFeed() {
  const [posts, setPosts] = useState<DiaryPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts")
        if (!response.ok) throw new Error("Failed to fetch posts")
        const data = await response.json()
        setPosts(data)
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to like post")

      setPosts(posts.map((post) => (post._id === postId ? { ...post, likes: post.likes + 1 } : post)))
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

  const handleAddComment = async (postId: string, comment: { author: string; content: string }) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(comment),
      })

      if (!response.ok) throw new Error("Failed to add comment")

      const newComment = await response.json()

      setPosts(
        posts.map((post) => (post._id === postId ? { ...post, comments: [...post.comments, newComment] } : post)),
      )
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="diary-content">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
            <div className="mt-4 flex justify-between items-center">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="diary-content text-center py-12">
        <h3 className="text-xl font-medium text-white mb-2">No diary entries yet</h3>
        <p className="text-white/70">Be the first to share your thoughts and feelings!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <DiaryCard key={post._id} post={post} onLike={handleLike} onAddComment={handleAddComment} />
      ))}
    </div>
  )
}
