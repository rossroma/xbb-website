describe('pagination locale zh-cn', () => {
  it('renders Chinese pagination labels on ads types page', () => {
    const adminToken = Cypress.env('adminToken')

    cy.visit('/admin/ads/types', {
      onBeforeLoad(win) {
        win.localStorage.setItem('admin_token', adminToken)
      }
    })

    cy.get('.el-pagination').should('be.visible')
    cy.get('.el-pagination').should('contain.text', '共 10 条')
    cy.get('.el-pagination').should('contain.text', '条/页')
    cy.get('.el-pagination').should('not.contain.text', 'Total')
    cy.get('.el-pagination').should('not.contain.text', '/page')
  })
})
