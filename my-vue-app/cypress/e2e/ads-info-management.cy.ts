describe('ads info management flow', () => {
  const loginByApi = () => {
    cy.request('POST', 'http://localhost:3000/v1/admin/auth/login', {
      username: 'admin',
      password: '123456'
    }).then((response) => {
      const token = response.body.data.access_token
      cy.visit('/admin/ads/types', {
        onBeforeLoad(win) {
          win.localStorage.setItem('admin_token', token)
        }
      })
    })
  }

  it('navigates from ad slot management to filtered ad items by 信息管理', () => {
    loginByApi()

    cy.visit('/admin/ads')
    cy.url().should('include', '/admin/ads/types')
    cy.get('.sidebar').should('contain.text', '广告位管理')
    cy.get('.sidebar').should('not.contain.text', '广告列表')

    cy.contains('td', '首页-Banner3图').should('be.visible')
    cy.contains('tr', '首页-Banner3图').within(() => {
      cy.contains('button', '信息管理').click()
    })

    cy.url().should('match', /\/admin\/ads\/types\/\d+\/items$/)
    cy.contains('h2', '首页-Banner3图').should('be.visible')
    cy.get('.el-table').should('be.visible')
    cy.get('.el-table tbody tr').its('length').should('be.greaterThan', 0)
    cy.get('.filter-container').should('contain.text', '首页-Banner3图')
  })
})
