describe('operation log sentences', () => {
  it('renders full readable sentences in operation log list', () => {
    const adminToken = Cypress.env('adminToken')

    cy.visit('/admin/logs/operations', {
      onBeforeLoad(win) {
        win.localStorage.setItem('admin_token', adminToken)
      }
    })

    cy.contains('用户“admin”修改了用户组“管理员”的权限配置').should('be.visible')
    cy.contains('广告位#').should('not.exist')
    cy.contains('用户“admin”新增了“ces1”').should('not.exist')
  })
})
