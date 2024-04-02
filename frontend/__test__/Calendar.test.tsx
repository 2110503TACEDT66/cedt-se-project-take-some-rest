import Calendar from '@/components/basic/Calendar'
import { render, screen } from '@testing-library/react'

const mockData = {
  month: 1,
  year: 2024,
  unavailableDates: [1, 5, 7, 9, 10, 11, 13, 15, 19, 20],
}

describe('Calendar', () => {
  beforeEach(() => {
    render(
      <Calendar
        month={mockData.month}
        year={mockData.year}
        unavailableDates={mockData.unavailableDates}
      />
    )
  })

  it('month and year is correct', () => {
    const month = screen.getByText(/January/)
    expect(month).toBeInTheDocument

    const year = screen.getByText(/2024/)
    expect(year).toBeInTheDocument
  })

  it('calendar is correct', () => {
    const calendar = screen.getByTestId('calendar') as HTMLElement
    expect(calendar).toBeInTheDocument
    expect(calendar.children.length).toBeGreaterThanOrEqual(28)

    expect(calendar.getElementsByClassName('bg-cgr-red').length).toBe(
      mockData.unavailableDates.length
    )

    const skip = new Date(mockData.year, mockData.month - 1, 1).getDay()
    for (let i of mockData.unavailableDates) {
      // console.log(skip + i - 1)
      expect(calendar.children[skip + i - 1]).toHaveClass('bg-cgr-red')
    }
  })
})
