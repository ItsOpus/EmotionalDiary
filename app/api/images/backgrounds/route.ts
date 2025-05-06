import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.PIXABAY_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "API key is not configured" }, { status: 500 })
    }

    // Search for high-quality nature images that work well as backgrounds
    const response = await fetch(
      `https://pixabay.com/api/?key=${apiKey}&q=nature+landscape&image_type=photo&orientation=horizontal&category=nature&min_width=1920&editors_choice=true&per_page=10`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch from Pixabay API")
    }

    const data = await response.json()

    // Extract just the image URLs and photographer info for the backgrounds
    const backgrounds = data.hits.map((hit: any) => ({
      imageUrl: hit.largeImageURL,
      photographer: hit.user,
      photographerUrl: `https://pixabay.com/users/${hit.user}-${hit.user_id}/`,
      pixabayUrl: hit.pageURL,
    }))

    return NextResponse.json(backgrounds)
  } catch (error) {
    console.error("Error fetching background images:", error)
    return NextResponse.json({ error: "Failed to fetch background images" }, { status: 500 })
  }
}
