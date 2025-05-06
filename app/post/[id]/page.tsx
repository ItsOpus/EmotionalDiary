import { notFound } from "next/navigation"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import BackgroundSlideshow from "@/components/background-slideshow"
import PostDetail from "@/components/post-detail"

interface PostPageProps {
  params: {
    id: string
  }
}

async function getPost(id: string) {
  try {
    if (!ObjectId.isValid(id)) {
      return null
    }

    const client = await clientPromise
    const db = client.db("emotional-diary")

    const post = await db.collection("posts").findOne({ _id: new ObjectId(id) })

    if (!post) {
      return null
    }

    return {
      ...post,
      _id: post._id.toString(),
    }
  } catch (error) {
    console.error("Error fetching post:", error)
    return null
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.id)

  if (!post) {
    notFound()
  }

  return (
    <div className="relative min-h-screen pt-20">
      <BackgroundSlideshow />
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <PostDetail post={post} />
        </div>
      </div>
    </div>
  )
}
