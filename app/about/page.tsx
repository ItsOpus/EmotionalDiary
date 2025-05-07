import BackgroundSlideshow from "@/components/background-slideshow"

export default function AboutPage() {
  return (
    <div className="relative min-h-screen pt-20">
      <BackgroundSlideshow />
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto diary-content">
          <h1 className="text-3xl font-bold text-white mb-6">About Emotional Diary</h1>

          <div className="space-y-6 text-white/80">
            <p>
              Welcome to Emotional Diary, a safe space where you can express your thoughts, feelings, and experiences
              with the world. Our platform is designed to provide a supportive environment for emotional expression and
              connection.
            </p>

            <h2 className="text-xl font-semibold text-white mt-6">Our Mission</h2>
            <p>
              We believe in the power of sharing emotions. By expressing our feelings, we not only process them better
              ourselves, but we also create opportunities for connection with others who may be experiencing similar
              emotions.
            </p>

            <h2 className="text-xl font-semibold text-white mt-6">Community Guidelines</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be respectful and kind in your posts and comments</li>
              <li>Support others in their emotional journeys</li>
              <li>Share authentically, but be mindful of sensitive content</li>
              <li>Respect privacy and confidentiality</li>
              <li>Report any concerning content to administrators</li>
            </ul>

            <h2 className="text-xl font-semibold text-white mt-6">Contact Us</h2>
            <p>
              If you have any questions, suggestions, or concerns, please don't hesitate to reach out to us at
              <a href="mailto:support@emotionaldiary.com" className="text-primary hover:underline ml-1">
                wow.itsopus@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
