import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("emotional-diary")

    const result = await db.collection("posts").updateOne({ _id: new ObjectId(id) }, { $inc: { likes: 1 } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error liking post:", error)
    return NextResponse.json({ error: "Failed to like post" }, { status: 500 })
  }
}
