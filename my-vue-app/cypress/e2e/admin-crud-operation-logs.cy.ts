describe('admin CRUD operation logs', () => {
  const tokenCommand = "cd /Users/zhengyuxiang/Desktop/code/my-nest-app && node -e \"const jwt=require('jsonwebtoken');process.stdout.write(jwt.sign({sub:21,username:'admin',type:0,group_id:10},'your-super-secret-jwt-key-change-in-production',{expiresIn:'2h'}))\""
  const logCountCommand = "mysql -h127.0.0.1 -uroot -p123456 jfyzcms_db01 -sN -e \"SELECT COUNT(*) FROM web_logs;\""
  const latestLogCommand = "mysql -h127.0.0.1 -uroot -p123456 jfyzcms_db01 -sN -e \"SELECT CONCAT(username,'|',title,'|',type,'|',login_ip) FROM web_logs ORDER BY id DESC LIMIT 1;\""

  const getLogCount = () => cy.exec(logCountCommand).its('stdout').then((v) => Number(v.trim()))
  const getLatestLog = () => cy.exec(latestLogCommand).its('stdout').then((v) => v.trim())

  it('records logs for create update delete admin requests', () => {
    const username = `log_admin_${Date.now()}`
    const updatedUsername = `${username}_u`

    cy.exec(tokenCommand).its('stdout').then((tokenOutput) => {
      const token = tokenOutput.trim()

      getLogCount().then((beforeCreate) => {
        cy.request({
          method: 'POST',
          url: 'http://localhost:3000/v1/admin/admins',
          headers: { Authorization: `Bearer ${token}` },
          body: {
            username,
            password: '123456',
            group_id: 10,
            type: 0,
            status: 1,
          },
        }).then((response) => {
          expect(response.status).to.eq(201)
          const adminId = response.body.id ?? response.body.data?.id
          expect(adminId).to.be.a('number')

          getLogCount().should('eq', beforeCreate + 1)
          getLatestLog().should('include', `admin|${username}|1|127.0.0.1`)

          getLogCount().then((beforeUpdate) => {
            cy.request({
              method: 'PATCH',
              url: `http://localhost:3000/v1/admin/admins/${adminId}`,
              headers: { Authorization: `Bearer ${token}` },
              body: {
                username: updatedUsername,
                group_id: 10,
                type: 0,
                status: 1,
              },
            }).then((updateResponse) => {
              expect(updateResponse.status).to.eq(200)

              getLogCount().should('eq', beforeUpdate + 1)
              getLatestLog().should('include', `admin|${updatedUsername}|2|127.0.0.1`)

              getLogCount().then((beforeDelete) => {
                cy.request({
                  method: 'DELETE',
                  url: `http://localhost:3000/v1/admin/admins/${adminId}`,
                  headers: { Authorization: `Bearer ${token}` },
                }).then((deleteResponse) => {
                  expect(deleteResponse.status).to.eq(200)

                  getLogCount().should('eq', beforeDelete + 1)
                  getLatestLog().should('include', `admin|${updatedUsername}|3|127.0.0.1`)
                })
              })
            })
          })
        })
      })
    })
  })
})
