describe('ads import repair for download center', () => {
  const loginByApi = () => {
    cy.request('POST', 'http://localhost:3000/v1/admin/auth/login', {
      username: 'admin',
      password: '123456'
    }).then((response) => {
      const token = response.body.data.access_token
      cy.visit('/admin/ads/types/50/items', {
        onBeforeLoad(win) {
          win.localStorage.setItem('admin_token', token)
        }
      })
    })
  }

  it('shows repaired old ads in 下载中心 slot', () => {
    loginByApi()

    cy.contains('h2', '下载中心').should('be.visible')
    cy.get('.el-table').should('be.visible')
    cy.get('.el-table tbody tr').its('length').should('eq', 2)
    cy.contains('.el-table', '钉钉扫码部署').should('be.visible')
    cy.contains('.el-table', '扫码下载APP').should('be.visible')
  })
})
