import CampgroundCardHome from '../basic/card/CampgroundCardHome'
import ViewMoreCampgroundCard from '../basic/card/ViewMoreCampgroundCard'

export default function CampgroundPanelHome({
  campgrounds,
}: {
  campgrounds: CampgroundItem[]
}) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mx-10 my-16 justify-center '>
      {campgrounds.map((obj: CampgroundItem) => (
        <CampgroundCardHome campground={obj} />
      ))}
      <ViewMoreCampgroundCard />
    </div>
  )
}
