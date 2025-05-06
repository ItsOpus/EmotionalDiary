import Link from "next/link"
import { Button } from "@/components/ui/button"
import DiaryFeed from "@/components/diary-feed"
import BackgroundSlideshow from "@/components/background-slideshow"

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <BackgroundSlideshow />
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white">Emotional Diary</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Share your thoughts and feelings with the world. Express yourself freely in a safe space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/create">Create New Entry</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>

        <div className="mt-16">
          <DiaryFeed />
        </div>
      </div>
    </div>
  )
}
