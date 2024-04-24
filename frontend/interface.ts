// campground --------------------------------------------------------
interface CampgroundItem {
  campgroundOwner: string
  _id: string
  name: string
  tel: string
  address: {
    houseNumber: string
    lane: string
    road: string
    subDistrict: string
    district: string
    province: string
    postalCode: string
    link: string
  }
  website: string
  pictureString: {
    base64: string
    imageFormat: string
  }
  facilities: string[]
  amount: number
  averageScore: number
}

interface CampgroundsJson {
  // get many
  success: boolean
  count: number
  pagination: {
    next: {
      page: number
      limit: number
    }
  }
  data: CampgroundItem[]
}

interface CampgroundJson {
  // get one
  success: boolean
  data: CampgroundItem
}

interface CampgroundFacilityItem {
  tent: boolean
  toilet: boolean
  electricity: boolean
  wifi: boolean
  parking: boolean
  breakfast: boolean
  store: boolean
}

// campground site --------------------------------------------------------
interface CampgroundSiteItem {
  _id: string
  campground: string
  zone: string
  number: number
  size: {
    swidth: number
    slength: number
    _id: string
  }
  pictureString: {
    base64: string
    imageFormat: string
  }
}

interface CampgroundSitesJson {
  // for many
  success: boolean
  campground: CampgroundItem
  sites: CampgroundSiteItem[]
  pagination: {
    next: {
      page: number
      limit: number
    }
  }
}

interface CampgroundSiteJson {
  // for one
  success: boolean
  campground: CampgroundItem
  site: CampgroundSiteItem
}

// user --------------------------------------------------------
interface UserItem {
  _id: string
  name: string
  tel: string
  email: string
  password: string
  role: string
  requestToBeCampgroundOwner: boolean
  bookmarkCampgrounds: string[]
}

interface UserJson {
  success: boolean
  data: UserItem
}

// reserves --------------------------------------------------------
interface BookedReservesItem {
  _id: string
  campground: CampgroundItem
  site: CampgroundSiteItem
  startDate: Date
}

interface BookedReservesJson {
  success: boolean
  count: number
  pagination: {
    next: {
      page: number
      limit: number
    }
  }
  data: BookedReservesItem[]
}

interface MyReservesItem {
  _id: string
  user: UserItem
  campground: CampgroundItem
  site: CampgroundSiteItem
  preferredName: string
  startDate: Date
  amount: number
  reservedAt: Date
  tentSize: {
    swidth: number
    slength: number
  }
}

interface MyReservesJson {
  success: boolean
  count: number
  pagination: {
    next: {
      page: number
      limit: number
    }
  }
  data: MyReservesItem[]
}

// logs --------------------------------------------------------

interface LogItem {
  _id: string
  user: string
  action: string
  accessedAt: Date
}

interface LogJson {
  success: boolean
  count: number
  pagination: {
    next: {
      page: number
      limit: number
    }
  }
  data: LogItem[]
}

// review --------------------------------------------------------

interface reviewItem {
  _id: string
  user: UserItem
  campground: CampgroundItem
  score: number
  comment: string
  createdAt: Date
  isReport: boolean
}

interface reviewJson {
  success: boolean
  count: number
  pagination: {
    next: {
      page: number
      limit: number
    }
  }
  data: reviewItem[]
}
