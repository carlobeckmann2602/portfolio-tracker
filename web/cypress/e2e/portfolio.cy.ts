describe('Portfolio', () => {

  it('displays portfolio page', () => {
    cy.visit('/')
     cy.get('h1').contains('Portfolio')
  })

})
