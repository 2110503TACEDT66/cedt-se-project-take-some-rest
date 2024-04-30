describe('Epic 1: Review', () => {
  beforeEach(() => {
    cy.visit(`http://localhost:3000/login`)
    cy.get('[data-cy=email]').type('thirathawat996@gmail.com')
    cy.get('[data-cy=password]').type('000000')
    cy.get('[data-cy=login]').click()
    cy.wait(2000)
    cy.get('[data-testid=card]').first().click()
  })

  it('should display review panel and card', () => {
    cy.get('[data-cy=reviewPanel]').should('exist')
    cy.get('[data-cy=reviewCard]').should('exist')
  })

  it('should create review', () => {
    cy.get('[data-cy=createReview]').click()
    cy.get('[data-cy=campground-rating]').click()
    cy.get('[data-cy=reviewText]').type('This is a test review')
    cy.get('[data-cy=submitReview]').click()
    cy.reload()
    cy.get('[data-cy=reviewCard]')
      .get('[data-cy=cardText]')
      .contains('This is a test review')
  })

  it('should delete review', () => {
    cy.get('[data-cy=reviewCard]').first().get('[data-cy=deleteReview]').click()
    cy.reload()
    cy.get('[data-cy=reviewCard]')
      .first()
      .get('[data-cy=cardText]')
      .contains('This is a test review')
      .should('not.exist')
  })
})
