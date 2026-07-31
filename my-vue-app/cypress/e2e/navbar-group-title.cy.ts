describe('navbar group title', () => {
  it('shows zyx group title in navbar', () => {
    const zyxToken = Cypress.env('zyxToken')

    cy.visit('/admin/dashboard', {
      onBeforeLoad(win) {
        win.localStorage.setItem('admin_token', zyxToken)
      }
    })

    cy.contains('.username', 'zyx').should('be.visible')
    cy.contains('.group-title', '渠道部').should('be.visible')
  })
})
