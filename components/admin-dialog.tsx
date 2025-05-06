"use client"

import { useState } from "react"
import { Shield, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AdminDialogProps {
  isMobile?: boolean
}

export default function AdminDialog({ isMobile = false }: AdminDialogProps) {
  const [password, setPassword] = useState("")
  const [postId, setPostId] = useState("")
  const [commentId, setCommentId] = useState("")
  const [commentPostId, setCommentPostId] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const handleDeletePost = async () => {
    if (password !== "987412374123") {
      toast({
        title: "Incorrect password",
        description: "The admin password you entered is incorrect.",
        variant: "destructive",
      })
      return
    }

    if (!postId.trim()) {
      toast({
        title: "Post ID required",
        description: "Please enter a post ID to delete.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete post")
      }

      toast({
        title: "Post deleted",
        description: "The post has been successfully deleted.",
      })

      setIsOpen(false)
      setPassword("")
      setPostId("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteComment = async () => {
    if (password !== "987412374123") {
      toast({
        title: "Incorrect password",
        description: "The admin password you entered is incorrect.",
        variant: "destructive",
      })
      return
    }

    if (!commentPostId.trim() || !commentId.trim()) {
      toast({
        title: "IDs required",
        description: "Please enter both post ID and comment ID to delete.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/admin/posts/${commentPostId}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete comment")
      }

      toast({
        title: "Comment deleted",
        description: "The comment has been successfully deleted.",
      })

      setIsOpen(false)
      setPassword("")
      setCommentId("")
      setCommentPostId("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the comment. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isMobile ? (
          <Button
            variant="ghost"
            className="w-full justify-start px-3 py-2 text-white/70 hover:text-white hover:bg-white/10"
          >
            <Shield className="h-5 w-5 mr-2" />
            Admin Panel
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10">
            <Shield className="h-4 w-4 mr-2" />
            Admin
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="glass-card border-white/20">
        <DialogHeader>
          <DialogTitle>Admin Panel</DialogTitle>
          <DialogDescription>Enter your admin password to manage content.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts">Delete Posts</TabsTrigger>
            <TabsTrigger value="comments">Delete Comments</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="admin-password">Admin Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20"
                placeholder="Enter admin password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="post-id">Post ID to Delete</Label>
              <Input
                id="post-id"
                value={postId}
                onChange={(e) => setPostId(e.target.value)}
                className="bg-white/10 border-white/20"
                placeholder="Enter post ID"
              />
            </div>
            <Button variant="destructive" onClick={handleDeletePost} className="w-full">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Post
            </Button>
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="comment-admin-password">Admin Password</Label>
              <Input
                id="comment-admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20"
                placeholder="Enter admin password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="comment-post-id">Post ID</Label>
              <Input
                id="comment-post-id"
                value={commentPostId}
                onChange={(e) => setCommentPostId(e.target.value)}
                className="bg-white/10 border-white/20"
                placeholder="Enter post ID containing the comment"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="comment-id">Comment ID to Delete</Label>
              <Input
                id="comment-id"
                value={commentId}
                onChange={(e) => setCommentId(e.target.value)}
                className="bg-white/10 border-white/20"
                placeholder="Enter comment ID"
              />
            </div>
            <Button variant="destructive" onClick={handleDeleteComment} className="w-full">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Comment
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
