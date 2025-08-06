import { LazyImage } from "@/components/ui/lazy-image"
import { LazyLoadWrapper } from "@/components/lazy-load-wrapper"

const RentalRequestPage = () => {
  return (
    <div>
      <h1>Rental Request Page</h1>
      <LazyImage src="/placeholder.jpg" alt="Placeholder" width={500} height={300} />
      <LazyLoadWrapper>
        <p>This content will be lazy loaded.</p>
      </LazyLoadWrapper>
    </div>
  )
}

export default RentalRequestPage
