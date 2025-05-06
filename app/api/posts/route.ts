import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("emotional-diary")

    const posts = await db.collection("posts").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, author } = await request.json()

    if (!title || !content || !author) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("emotional-diary")

    const post = {
      title,
      content,
      author,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: [],
    }

    const result = await db.collection("posts").insertOne(post)

    return NextResponse.json(
      {
        _id: result.insertedId,
        ...post,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
