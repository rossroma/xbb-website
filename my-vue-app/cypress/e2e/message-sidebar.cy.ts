describe('message sidebar categories', () => {
  const loginByApi = () => {
    cy.request('POST', 'http://localhost:3000/v1/admin/auth/login', {
      username: 'admin',
      password: '123456'
    }).then((response) => {
      const token = response.body.data.access_token
      cy.visit('/admin/message', {
        onBeforeLoad(win) {
          win.localStorage.setItem('admin_token', token)
        }
      })
    })
  }

  it('shows message management page with category filter', () => {
    loginByApi()

    // 默认显示"留言管理"
    cy.contains('h2', '留言管理').should('be.visible')

    // 侧边栏显示"留言管理"菜单项
    cy.get('.sidebar .el-menu-item:visible').contains('留言管理').should('exist')

    // 分类筛选下拉框存在
    cy.get('.search-area').contains('分类').should('exist')

    // 表格可见
    cy.get('.el-table').should('be.visible')
    cy.get('.search-area').should('be.visible')
  })

  it('navigates to category via route and shows correct title', () => {
    loginByApi()

    // 通过路由访问分类 4（免费注册）
    cy.visit('/admin/message/4', {
      onBeforeLoad(win) {
        const token = win.localStorage.getItem('admin_token')
        if (token) {
          win.localStorage.setItem('admin_token', token)
        }
      }
    })

    cy.contains('h2', '留言管理 - 免费注册').should('be.visible')

    // 通过路由访问分类 2（加入我们）
    cy.visit('/admin/message/2', {
      onBeforeLoad(win) {
        const token = win.localStorage.getItem('admin_token')
        if (token) {
          win.localStorage.setItem('admin_token', token)
        }
      }
    })

    cy.contains('h2', '留言管理 - 加入我们').should('be.visible')
  })
})
