describe('layout bottom gap', () => {
  it('does not show extra bottom white gap on message page scroll', () => {
    const adminToken = Cypress.env('adminToken')

    cy.visit('/admin/message/1', {
      onBeforeLoad(win) {
        win.localStorage.setItem('admin_token', adminToken)
      }
    })

    cy.get('.app-main').then(($main) => {
      const el = $main[0] as HTMLElement
      el.scrollTop = el.scrollHeight
    })

    cy.get('.app-main').then(($main) => {
      const el = $main[0] as HTMLElement
      expect(el.scrollHeight - el.scrollTop - el.clientHeight).to.be.lessThan(4)
    })
  })
})
