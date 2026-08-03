describe('zyx login permissions', () => {
  it('shows zyx in navbar and hides unauthorized menus', () => {
    const zyxToken = Cypress.env('zyxToken')

    cy.visit('/admin/admins', {
      onBeforeLoad(win) {
        win.localStorage.setItem('admin_token', zyxToken)
      }
    })

    cy.url().should('include', '/admin/dashboard')
    cy.contains('.username', 'zyx').should('be.visible')

    cy.get('.sidebar').should('contain.text', '广告位管理')
    cy.get('.sidebar').should('contain.text', '在线留言')
    cy.get('.sidebar').should('contain.text', '客户服务')
    cy.get('.sidebar').should('contain.text', '渠道合作')

    cy.get('.sidebar').should('not.contain.text', '系统设置')
    cy.get('.sidebar').should('not.contain.text', '系统管理')
    cy.get('.sidebar').should('not.contain.text', '管理员管理')
    cy.get('.sidebar').should('not.contain.text', '用户组管理')
    cy.get('.sidebar').should('not.contain.text', '模板管理')

    cy.get('.sidebar').should('not.contain.text', '留言管理')
  })
})
