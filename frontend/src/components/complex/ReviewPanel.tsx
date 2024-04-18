import ReviewCard from '../basic/card/ReviewCard'

export default function ReviewsPanel({ reviews }: { reviews: reviewItem[] }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-9 mt-3 mb-10'>
      {reviews.map((obj) => (
        <ReviewCard review={obj} />
      ))}
    </div>
  )
}
