describe('template edit dialog cleanup', () => {
  it('does not show legacy attribute fields in template dialog', () => {
    const adminToken = Cypress.env('adminToken')

    cy.visit('/admin/templates/index', {
      onBeforeLoad(win) {
        win.localStorage.setItem('admin_token', adminToken)
      }
    })

    cy.contains('h2', '模板管理').should('be.visible')
    cy.contains('button', '编辑').first().click()
    cy.contains('.el-dialog__title', '编辑模板').should('be.visible')

    cy.get('.el-dialog').should('not.contain.text', '属性类型')
    cy.get('.el-dialog').should('not.contain.text', '属性')
    cy.get('.el-dialog').should('contain.text', '模板名称')
    cy.get('.el-dialog').should('contain.text', '模板标识')
    cy.get('.el-dialog').should('contain.text', '模板类型')
  })
})
