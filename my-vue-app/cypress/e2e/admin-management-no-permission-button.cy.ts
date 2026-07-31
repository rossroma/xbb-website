describe('admin management actions', () => {
  it('does not show per-admin 权限 button', () => {
    const adminToken = Cypress.env('adminToken')

    cy.visit('/admin/admins', {
      onBeforeLoad(win) {
        win.localStorage.setItem('admin_token', adminToken)
      }
    })

    cy.contains('h2', '管理员管理').should('be.visible')
    cy.get('.el-table').should('be.visible')
    cy.get('.el-table').should('not.contain.text', '权限')
    cy.get('.el-table').should('contain.text', '编辑')
    cy.get('.el-table').should('contain.text', '删除')
  })
})
