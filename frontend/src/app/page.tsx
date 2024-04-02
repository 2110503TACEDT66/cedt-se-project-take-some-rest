import Banner from '@/components/complex/Banner'
import CampgroundPanelHome from '@/components/complex/CampgroundPanelHome'
import getCampgrounds from '@/libs/campgrounds/getCampgrounds'

export default async function Home() {
  const campground: CampgroundItem[] = (await getCampgrounds('limit=3')).data

  return (
    <main>
      <Banner />
      <CampgroundPanelHome campgrounds={campground} />
    </main>
  )
}
