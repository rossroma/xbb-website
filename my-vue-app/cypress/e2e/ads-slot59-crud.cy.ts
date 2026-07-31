describe('ads CRUD in slot 59', () => {
  const loginByApi = () => {
    cy.request('POST', 'http://localhost:3000/v1/admin/auth/login', {
      username: 'admin',
      password: '123456'
    }).then((response) => {
      const token = response.body.data.access_token
      cy.visit('/admin/ads/types/59/items', {
        onBeforeLoad(win) {
          win.localStorage.setItem('admin_token', token)
        }
      })
    })
  }

  it('creates updates and deletes an ad under 测试001广告位', () => {
    const baseTitle = `CRUD测试广告-${Date.now()}`
    const updatedTitle = `${baseTitle}-已修改`

    loginByApi()

    cy.contains('h2', '测试001广告位').should('be.visible')

    cy.contains('button', '新增广告').click()
    cy.get('.el-dialog').should('be.visible')
    cy.get('.el-dialog input[placeholder="请输入广告名称"]').clear().type(baseTitle)
    cy.get('.el-dialog input[placeholder="请输入副标题"]').clear().type('CRUD测试副标题')
    cy.get('.el-dialog input[placeholder="请输入链接地址"]').clear().type('https://example.com/crud-test')
    cy.contains('.el-dialog button', '确定').click()

    cy.contains('.el-table', baseTitle).should('be.visible')

    cy.contains('tr', baseTitle).within(() => {
      cy.contains('button', '编辑').click()
    })
    cy.get('.el-dialog').should('be.visible')
    cy.get('.el-dialog input[placeholder="请输入广告名称"]').clear().type(updatedTitle)
    cy.contains('.el-dialog button', '确定').click()

    cy.contains('.el-table', updatedTitle).should('be.visible')

    cy.contains('tr', updatedTitle).within(() => {
      cy.contains('button', '删除').click()
    })
    cy.contains('.el-message-box button', '确定').click()

    cy.contains('.el-table', updatedTitle).should('not.exist')
  })
})
