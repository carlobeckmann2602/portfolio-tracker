describe('Portfolio', () => {

  it('displays portfolio page', () => {
    cy.visit('http://localhost:3000/')
     cy.get('h1').contains('Portfolio')
  })

})
