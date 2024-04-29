describe('Epic 1: Filter', () => {
    beforeEach(() => {
        cy.visit(`http://localhost:3000/campgrounds`);
    });

    it('should filter campgrounds by name', () => {
        cy.get('[data-cy="search"]').type('Doi').should('have.value', 'Doi');
        cy.get('[data-cy="search-button"]').click();
        cy.get('[data-cy="Title"]').should('contain.text', 'Doi');
    });

    it('should filter campgrounds by province', () => {
        cy.get('[data-cy="filter"]').click();
        cy.get('[data-cy="provinceType"]').click().type('Chiang Mai').type('{enter}');
        cy.contains('Chiang Mai').click();
        cy.get('[data-cy="cardProvince"]').should('contain.text', 'Chiang Mai');
        cy.get('[data-cy="cardProvince"]').should('not.contain.text', 'Bankok');
    });

    it('should filter campgrounds by facilities', () => {
        cy.get('[data-cy="filter"]').click();
        cy.get('[data-cy="tent"]').click();
        cy.get('[data-cy="search-button"]').click();
        cy.get('[data-cy="tag"]').should('contain.text', 'tent');
    });
});