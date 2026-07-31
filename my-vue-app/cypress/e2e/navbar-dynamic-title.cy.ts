describe('navbar dynamic title', () => {
  it('shows 公司名称 + 后台管理系统 in navbar title', () => {
    const adminToken = Cypress.env('adminToken')
    cy.visit('/admin/dashboard', {
      onBeforeLoad(win) {
        win.localStorage.setItem('admin_token', adminToken)
      }
    })

    cy.contains('.title', '销帮帮CRM后台管理系统').should('be.visible')
  })
})
