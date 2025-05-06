import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function DELETE(request: Request, { params }: { params: { postId: string; commentId: string } }) {
  try {
    const { postId, commentId } = params
    const { password } = await request.json()

    // Verify admin password
    if (password !== "987412374123") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!ObjectId.isValid(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("emotional-diary")

    // Pull the comment with the matching ID from the comments array
    const result = await db
      .collection("posts")
      .updateOne({ _id: new ObjectId(postId) }, { $pull: { comments: { _id: commentId } } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Comment not found or already deleted" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting comment:", error)
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 })
  }
}
