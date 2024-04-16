import ReviewCard from "../basic/card/ReviewCard" 

export default function ReviewsPanel({
  reviews,
}: {
  reviews: reviewItem[]
}) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-9'>
      {reviews.map((obj) => (
        <ReviewCard 
        userName={obj.user.name}
        rating= {obj.score}
        comment={obj.comment}/>
      ))}
    </div>
  )
}
