import CampgroundCardCampgrounds from '../basic/card/CampgroundCardCampgrounds'

export default function CampgroundPanelCampgrounds({
  campgrounds,
  bookmarkedCampgroundIds,
  handleChange,
}: {
  campgrounds: CampgroundItem[]
  bookmarkedCampgroundIds: string[]
  handleChange?: Function
}) {
  // console.log(bookmarkedCampgroundIds)
  //console.log(campgrounds)
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-9'>
      {campgrounds.map((obj) => (
        <CampgroundCardCampgrounds
          key={obj._id}
          campground={obj}
          isBookmarked={bookmarkedCampgroundIds.includes(obj._id)}
          handleChange={handleChange}
        />
      ))}
    </div>
  )
}
