describe('branding text', () => {
  it('shows 销帮帮CRM后台管理系统 on login page', () => {
    cy.visit('/login')
    cy.contains('销帮帮CRM后台管理系统').should('be.visible')
  })
})
