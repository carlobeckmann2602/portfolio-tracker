describe('Portfolio', () => {
  
  it('displays login page', () => {
    cy.visit('http://localhost:3000/login')
     cy.get('h1').contains('Login')
  })

  it('displays register page', () => {
    cy.visit('http://localhost:3000/register')
     cy.get('h1').contains('Register')
  })

})
