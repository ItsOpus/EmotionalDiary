"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import BackgroundSlideshow from "@/components/background-slideshow"
import Image from "next/image"

export default function CreatePage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isImageValid, setIsImageValid] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const validateImageUrl = (url: string) => {
    if (!url) {
      setIsImageValid(true)
      return true
    }

    try {
      new URL(url)
      setIsImageValid(true)
      return true
    } catch (e) {
      setIsImageValid(false)
      return false
    }
  }

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setImageUrl(url)
    validateImageUrl(url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim() || !author.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (imageUrl && !isImageValid) {
      toast({
        title: "Invalid image URL",
        description: "Please enter a valid URL for the image",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          author,
          imageUrl: imageUrl || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create post")
      }

      toast({
        title: "Success!",
        description: "Your diary entry has been posted",
      })

      router.push("/")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create your post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen pt-20">
      <BackgroundSlideshow />
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto diary-content">
          <h1 className="text-3xl font-bold text-white mb-6">Create New Diary Entry</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white/10 border-white/20"
                placeholder="Give your entry a title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Your Name</Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="bg-white/10 border-white/20"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (optional)</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={handleImageUrlChange}
                className={`bg-white/10 border-white/20 ${!isImageValid ? "border-red-500" : ""}`}
                placeholder="https://example.com/your-image.jpg"
              />
              {!isImageValid && <p className="text-red-500 text-sm">Please enter a valid URL</p>}

              {imageUrl && isImageValid && (
                <div className="mt-2 relative w-full h-48 rounded-lg overflow-hidden">
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt="Preview"
                    fill
                    className="object-cover"
                    onError={() => setIsImageValid(false)}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Your Thoughts</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px] bg-white/10 border-white/20"
                placeholder="Share your thoughts and feelings..."
                required
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="rounded-full">
                {isSubmitting ? "Posting..." : "Post Diary Entry"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
