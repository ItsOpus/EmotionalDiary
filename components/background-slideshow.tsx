"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"

// Fallback background images in case API fails
const fallbackBackgrounds = [
  "/placeholder.svg?height=1080&width=1920",
  "/placeholder.svg?height=1080&width=1920",
  "/placeholder.svg?height=1080&width=1920",
]

interface BackgroundImage {
  imageUrl: string
  photographer: string
  photographerUrl: string
  pixabayUrl: string
}

export default function BackgroundSlideshow() {
  const [backgrounds, setBackgrounds] = useState<BackgroundImage[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchBackgrounds = async () => {
      try {
        const response = await fetch("/api/images/backgrounds")

        if (!response.ok) {
          throw new Error("Failed to fetch backgrounds")
        }

        const data = await response.json()

        if (data.length > 0) {
          setBackgrounds(data)
        } else {
          // If no images returned, use fallbacks
          setBackgrounds(
            fallbackBackgrounds.map((url) => ({
              imageUrl: url,
              photographer: "Placeholder",
              photographerUrl: "#",
              pixabayUrl: "#",
            })),
          )
        }
      } catch (error) {
        console.error("Error fetching backgrounds:", error)
        // Use fallbacks on error
        setBackgrounds(
          fallbackBackgrounds.map((url) => ({
            imageUrl: url,
            photographer: "Placeholder",
            photographerUrl: "#",
            pixabayUrl: "#",
          })),
        )
      } finally {
        setLoading(false)
      }
    }

    fetchBackgrounds()
  }, [])

  useEffect(() => {
    if (backgrounds.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgrounds.length)
    }, 10000) // Change image every 10 seconds

    return () => clearInterval(interval)
  }, [backgrounds.length])

  if (loading || backgrounds.length === 0) {
    return (
      <div className="fixed inset-0 w-full h-full bg-black">
        <div className="absolute inset-0 bg-black/70" />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 w-full h-full">
      {backgrounds.map((bg, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-2000 ease-in-out"
          style={{
            backgroundImage: `url(${bg.imageUrl})`,
            opacity: index === currentIndex ? 1 : 0,
            zIndex: index === currentIndex ? 1 : 0,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-black/60" /> {/* Dark overlay */}
      {/* Photo credit */}
      <div className="absolute bottom-2 right-2 text-xs text-white/40 z-10">
        Photo by{" "}
        <a
          href={backgrounds[currentIndex].photographerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white/60"
        >
          {backgrounds[currentIndex].photographer}
        </a>{" "}
        on{" "}
        <a href="https://pixabay.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/60">
          Pixabay
        </a>
      </div>
    </div>
  )
}
