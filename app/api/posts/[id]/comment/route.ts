import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { author, content } = await request.json()

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 })
    }

    if (!author || !content) {
      return NextResponse.json({ error: "Author and content are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("emotional-diary")

    const comment = {
      _id: new ObjectId().toString(),
      author,
      content,
      createdAt: new Date().toISOString(),
    }

    const result = await db.collection("posts").updateOne({ _id: new ObjectId(id) }, { $push: { comments: comment } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(comment)
  } catch (error) {
    console.error("Error adding comment:", error)
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 })
  }
}
