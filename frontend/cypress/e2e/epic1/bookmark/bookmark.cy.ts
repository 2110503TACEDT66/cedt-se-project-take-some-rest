describe('Bookmark', () => {
    beforeEach(() => {
        cy.visit(`http://localhost:3000/login`);
        cy.get('[data-cy=email]').type('thirathawat996@gmail.com');
        cy.get('[data-cy=password]').type('000000');
        cy.get('[data-cy=login]').click();
        cy.wait(2000);
    });

    it('should display bookmark button', () => {
        cy.visit(`http://localhost:3000/campgrounds`);
        cy.get('[data-cy=bookmarkButton]').should('exist');
    });

    it ('should bookmark campground', () => {
        cy.visit(`http://localhost:3000/campgrounds`);
        cy.get('[data-cy=bookmarkButton]').first().click();
        cy.get('[data-cy=bookmarked]').should('exist');
    });

    it ('should display bookmarked campground', () => {
        cy.visit(`http://localhost:3000/bookmarks`);
        cy.get('[data-cy=campgroundCard]').should('have.length', 1);
    });

    it ('should delete bookmarked campground', () => {
        cy.visit(`http://localhost:3000/bookmarks`);
        cy.get('[data-cy=bookmarkButton]').first().click();
        cy.get('[data-cy=bookmarked]').should('not.exist');
        cy.get('[data-cy=campgroundCard]').should('not.exist');
    });
});