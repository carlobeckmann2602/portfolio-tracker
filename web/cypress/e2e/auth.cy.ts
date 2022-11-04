describe('Portfolio', () => {

  it('displays login page', () => {
    cy.visit('/login')
     cy.get('h1').contains('Login')
  })

  it('displays register page', () => {
    cy.visit('/register')
     cy.get('h1').contains('Register')
  })

})

export {};