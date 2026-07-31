describe('group permissions old model', () => {
  const loginByApi = () => {
    cy.request('POST', 'http://localhost:3000/v1/admin/auth/login', {
      username: 'admin',
      password: '123456'
    }).then((response) => {
      const token = response.body.data.access_token
      cy.visit('/admin/groups', {
        onBeforeLoad(win) {
          win.localStorage.setItem('admin_token', token)
        }
      })
    })
  }

  it('shows content category permissions in permission dialog', () => {
    loginByApi()

    cy.contains('h2', '用户组管理').should('be.visible')
    cy.contains('button', '设置权限').first().click()

    cy.contains('.el-dialog__title', '设置权限').should('be.visible')
    cy.contains('.perm-section-title', '内容板块管理').scrollIntoView().should('be.visible')
    cy.contains('.perm-group-title', '产品中心').should('exist')
    cy.contains('.perm-group-title', '案例中心').should('exist')
    cy.contains('.perm-group-title', '客户服务').should('exist')
    cy.contains('.perm-group-title', '渠道合作').should('exist')
    cy.contains('.perm-group-children', '[2级]产品功能').should('exist')
    cy.contains('.perm-group-children', '[2级]行业案例').should('exist')
    cy.contains('.perm-group-title', '参数管理').should('not.exist')
    cy.contains('.perm-group-title', '会员管理').should('not.exist')
    cy.contains('.perm-group-title', '数据采集').should('not.exist')
  })
})
