describe('Epic 1: Site Image', () => {
    beforeEach(() => {
        cy.visit(`http://localhost:3000/`);
        cy.get('[data-testid=card]').contains('Doi Inthanon Park').click();
        cy.get('[data-cy=viewSite]').first().click();
    });

    it('should display site image', () => {
        cy.get('[data-cy=siteImage]').should('be.visible');
    });
});