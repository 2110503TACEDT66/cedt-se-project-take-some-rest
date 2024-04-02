import CampgroundCardHome from '@/components/basic/card/CampgroundCardHome'
import { render, screen } from '@testing-library/react'

const mockData = {
  _id: '123456789',
  name: 'Sample campground',
  tel: '012-345-6789',
  address: {
    houseNumber: '1',
    lane: '2',
    road: 'Sample road',
    subDistrict: 'Sample sub district',
    district: 'Sample district',
    province: 'Sample province',
    postalCode: '10000',
    link: 'https://www.google.com/maps',
  },
  website: 'https://www.google.com/',
  pictures: [],
  facilities: ['Toilet', 'Wifi', 'Parking'],
  tentForRent: false,
  amount: 5,
}

describe('Campground card', () => {
  beforeEach(() => {
    render(<CampgroundCardHome campground={mockData} />)
  })

  it('should have title', () => {
    const title = screen.getByText('Sample campground')
    expect(title).toBeInTheDocument
  })

  it('should not have image', () => {
    const img = screen.queryByRole('img')
    expect(img).toBeNull
  })

  it('should have all information', () => {
    const province = screen.getByText('Sample province')
    expect(province).toBeInTheDocument

    const site = screen.getByText('Site number : 5')
    expect(site).toBeInTheDocument

    const tel = screen.getByText('Tel : 012-345-6789')
    expect(tel).toBeInTheDocument
  })

  it('should have tags', () => {
    const tagSection = screen.getByTestId('tags')
    expect(tagSection.childElementCount).toBe(3)
  })

  it('should have link', async () => {
    const card = screen.getByTestId('card')
    const href = card.getAttribute('href')
    expect(href).toContain('/campgrounds/view/123456789')
  })
})
