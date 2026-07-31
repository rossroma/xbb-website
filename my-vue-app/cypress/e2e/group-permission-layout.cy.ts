describe('group permission layout', () => {
  it('shows functional bulk actions above permission groups and content bulk actions with content section', () => {
    const adminToken = Cypress.env('adminToken')

    cy.visit('/admin/groups', {
      onBeforeLoad(win) {
        win.localStorage.setItem('admin_token', adminToken)
      }
    })

    cy.contains('h2', '用户组管理').should('be.visible')
    cy.contains('button', '设置权限').first().click()
    cy.contains('.el-dialog__title', '设置权限').should('be.visible')

    cy.get('.perm-top-actions').within(() => {
      cy.contains('功能权限').should('be.visible')
      cy.contains('全选').should('be.visible')
      cy.contains('全不选').should('be.visible')
      cy.contains('反选').should('be.visible')
    })

    cy.get('.perm-top-actions').then(($top) => {
      const topRect = $top[0].getBoundingClientRect()
      cy.get('.perm-group').first().then(($group) => {
        const groupRect = $group[0].getBoundingClientRect()
        expect(topRect.top).to.be.lessThan(groupRect.top)
      })
    })

    cy.get('.perm-section-header').scrollIntoView().within(() => {
      cy.contains('内容板块管理').should('be.visible')
      cy.get('.category-footer-actions').should('contain.text', '内容板块')
      cy.get('.category-footer-actions').should('contain.text', '全选')
      cy.get('.category-footer-actions').should('contain.text', '全不选')
      cy.get('.category-footer-actions').should('contain.text', '反选')
    })
  })
})
