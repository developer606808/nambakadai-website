import { LazyImage } from "@/components/ui/lazy-image"
import { LazyLoadWrapper } from "@/components/lazy-load-wrapper"

export default function AboutPage() {
  return (
    <main>
      <h1>About Us</h1>
      <p>This is the about page.</p>
      <LazyLoadWrapper>
        <LazyImage src="/images/placeholder.jpg" alt="Placeholder Image" width={500} height={300} />
      </LazyLoadWrapper>
    </main>
  )
}
