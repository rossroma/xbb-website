describe('global scroll containers', () => {
  it('keeps login page scroll inside login container and body locked', () => {
    cy.visit('/login')

    cy.get('.login-page').should('exist').then(($page) => {
      cy.window().then((win) => {
        const beforeBodyScroll = win.document.documentElement.scrollTop || win.document.body.scrollTop
        const loginPage = $page[0] as HTMLElement
        loginPage.scrollTop = loginPage.scrollHeight
        const afterBodyScroll = win.document.documentElement.scrollTop || win.document.body.scrollTop

        expect(afterBodyScroll).to.eq(beforeBodyScroll)
      })
    })
  })

  it('keeps admin page scroll inside app-main without extra bottom gap', () => {
    const adminToken = Cypress.env('adminToken')

    cy.visit('/admin/message/1', {
      onBeforeLoad(win) {
        win.localStorage.setItem('admin_token', adminToken)
      }
    })

    cy.get('.app-main').should('exist').then(($main) => {
      cy.window().then((win) => {
        const beforeBodyScroll = win.document.documentElement.scrollTop || win.document.body.scrollTop
        const appMain = $main[0] as HTMLElement
        appMain.scrollTop = appMain.scrollHeight
        const afterBodyScroll = win.document.documentElement.scrollTop || win.document.body.scrollTop

        expect(afterBodyScroll).to.eq(beforeBodyScroll)
        expect(appMain.scrollHeight - appMain.scrollTop - appMain.clientHeight).to.be.lessThan(4)
      })
    })
  })
})
