import CampgroundCardCampgrounds from '../basic/card/CampgroundCardCampgrounds'

export default function CampgroundPanelCampgrounds({
  campgrounds,
}: {
  campgrounds: CampgroundItem[]
}) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-9'>
      {campgrounds.map((obj) => (
        <CampgroundCardCampgrounds campground={obj} />
      ))}
    </div>
  )
}
