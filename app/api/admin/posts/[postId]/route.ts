import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function DELETE(request: Request, { params }: { params: { postId: string } }) {
  try {
    const postId = params.postId
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

    const result = await db.collection("posts").deleteOne({
      _id: new ObjectId(postId),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
