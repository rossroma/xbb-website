describe('message sidebar categories', () => {
  const loginByApi = () => {
    cy.request('POST', 'http://localhost:3000/v1/admin/auth/login', {
      username: 'admin',
      password: '123456'
    }).then((response) => {
      const token = response.body.data.access_token
      cy.visit('/admin/message/1', {
        onBeforeLoad(win) {
          win.localStorage.setItem('admin_token', token)
        }
      })
    })
  }

  it('shows four message categories in sidebar and switches by route', () => {
    loginByApi()

    cy.contains('h2', '留言管理 - 在线留言').should('be.visible')
    cy.get('.category-tabs').should('not.exist')

    cy.contains('.el-sub-menu__title', '留言管理').click()

    cy.get('.sidebar .el-menu-item:visible').contains('在线留言').should('exist')
    cy.get('.sidebar .el-menu-item:visible').contains('加入我们').should('exist')
    cy.get('.sidebar .el-menu-item:visible').contains('在线申请').should('exist')
    cy.get('.sidebar .el-menu-item:visible').contains('免费注册').should('exist')

    cy.get('.sidebar .el-menu-item:visible').contains('加入我们').click()
    cy.url().should('include', '/admin/message/2')
    cy.contains('h2', '留言管理 - 加入我们').should('be.visible')

    cy.get('.sidebar .el-menu-item:visible').contains('免费注册').click()
    cy.url().should('include', '/admin/message/4')
    cy.contains('h2', '留言管理 - 免费注册').should('be.visible')

    cy.get('.el-table').should('be.visible')
    cy.get('.search-area').should('be.visible')
  })
})
