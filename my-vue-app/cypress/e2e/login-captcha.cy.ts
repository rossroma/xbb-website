describe('login captcha UI', () => {
  it('loads and refreshes captcha and rejects wrong code', () => {
    cy.visit('/login')

    cy.contains('管理员登录').should('be.visible')
    cy.get('.captcha-image')
      .should('be.visible')
      .invoke('attr', 'src')
      .then((firstSrc) => {
        cy.get('.captcha-card').click()
        cy.get('.captcha-image')
          .invoke('attr', 'src')
          .should((secondSrc) => {
            expect(secondSrc).to.not.equal(firstSrc)
          })
      })

    cy.get('input[placeholder="请输入用户名"]').clear().type('admin')
    cy.get('input[placeholder="请输入密码"]').clear().type('123456')
    cy.get('input[placeholder="请输入计算结果"]').clear().type('99')
    cy.contains('button', '登录').click()

    cy.contains('.el-message', '算式结果错误').should('be.visible')
  })
})
