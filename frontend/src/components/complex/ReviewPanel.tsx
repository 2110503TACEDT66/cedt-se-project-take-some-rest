import ReviewCard from "../basic/card/ReviewCard" 

export default function ReviewsPanel({
  reviews,
}: {
  reviews: reviewItem[]
}) {
  return (
    <div className='flex flex-row'>
      {reviews.map((obj) => (
        <ReviewCard 
        userName={obj.user.name}
        rating= {obj.score}
        comment={obj.comment}/>
      ))}
    </div>
  )
}