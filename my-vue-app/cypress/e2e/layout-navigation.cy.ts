describe('layout navigation structure', () => {
  const loginByApi = () => {
    cy.request('POST', 'http://localhost:3000/v1/admin/auth/login', {
      username: 'admin',
      password: '123456'
    }).then((response) => {
      const token = response.body.data.access_token
      cy.visit('/admin/dashboard', {
        onBeforeLoad(win) {
          win.localStorage.setItem('admin_token', token)
        }
      })
    })
  }

  it('moves logs under system management and shows 查看前台 in top-right actions', () => {
    loginByApi()

    cy.get('.sidebar').should('not.contain.text', '日志管理')
    cy.contains('.el-sub-menu__title', '系统管理').click()
    cy.get('.sidebar').should('contain.text', '操作日志')
    cy.get('.sidebar').should('contain.text', '登录日志')
    cy.get('.sidebar').should('contain.text', '日志统计')

    cy.get('.quick-actions').should('contain.text', '查看前台')
    cy.get('.quick-action').should('have.attr', 'href', '/client')
    cy.get('.quick-action').should('have.attr', 'target', '_blank')
  })
})
