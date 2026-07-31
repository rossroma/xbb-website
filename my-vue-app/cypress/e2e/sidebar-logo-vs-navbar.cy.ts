describe('sidebar logo and navbar title', () => {
  it('sidebar shows only company name, navbar shows company + 后台管理系统', () => {
    cy.visit('/admin/dashboard', {
      onBeforeLoad(win) {
        win.localStorage.setItem('admin_token', Cypress.env('adminToken'))
      }
    })

    cy.get('.logo-title').invoke('text').then((logoText) => {
      expect(logoText.trim()).not.to.include('后台管理系统')
      expect(logoText.trim().length).to.be.greaterThan(0)
    })

    cy.contains('.title', '后台管理系统').should('be.visible')
  })
})
