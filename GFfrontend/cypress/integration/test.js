Cypress.on('uncaught:exception', (err, runnable) => {
    return false
})
describe('login', function(){
    this.beforeEach(()=>{
        cy.visit('http://localhost:8000/user/login')
        cy.get('.ant-pro-form-login-main').get('#username').type('cat')
        cy.get('.ant-pro-form-login-main').get('#password').type('007')
        cy.get('button:contains("Login")').click()
        cy.url().should('include', '/homepage')
        })
    
    it('incorrectLogin', function(){
       cy.visit('http://localhost:8000/user/login')
       cy.get('.ant-pro-form-login-main').get('#username').type('cat')
       cy.get('.ant-pro-form-login-main').get('#password').type('1234')
       cy.get('button:contains("Login")').click()
       cy.url().should('include', '/user/login') 
     })
    
    it('forwardPersonalpage', function () {
        cy.contains('link').click()
        cy.url().should('include', '/account/view?link')
        cy.get('button:contains("Follow")').click()
        cy.url().should('eq', 'http://localhost:8000/account/view?link')
        cy.get('button:contains("Mutual")').click()
        cy.url().should('eq', 'http://localhost:8000/account/view?link')
     })
    it('forwardPostpage', function(){
        cy.contains('banan').click()
        cy.url().should('include', '/group/post?22')
     })
    it('forwardGrouppage', function () {
        cy.contains('Apple').click()
        cy.url().should('include', '/group/content?22')
        cy.get('button:contains("Join")').click()
        cy.url().should('eq', 'http://localhost:8000/group/content?22')
        cy.get('button:contains("Post")').click()
        cy.url().should('eq', 'http://localhost:8000/form/createPost?22')
            //submit
        cy.get('button:contains("Quit")').click()
        cy.url().should('eq', 'http://localhost:8000/group/content?22')
     })
    
    it('forwardPersonalCenterpage', function () {
        cy.get('#root > div > section > div > header.ant-layout-header.ant-pro-fixed-header > div > div.ant-space.ant-space-horizontal.ant-space-align-center.right___3L8KG > div:nth-child(2) > span').click()
        cy.contains('Personal Center').click()
        cy.url().should('include', '/account/center?cat')
     })
   
    it('forwardSettingspage', function () {
        cy.get('#root > div > section > div > header.ant-layout-header.ant-pro-fixed-header > div > div.ant-space.ant-space-horizontal.ant-space-align-center.right___3L8KG > div:nth-child(2) > span').click()
        cy.contains('Settings').click()
        cy.url().should('include', '/account/settings?cat')
     })

    it('forwardCreateGrouppage', function () {
        cy.get('#root > div > section > div > header.ant-layout-header.ant-pro-fixed-header > div > div.ant-space.ant-space-horizontal.ant-space-align-center.right___3L8KG > div:nth-child(2) > span').click()
        cy.contains('Created Groups').click()
        cy.url().should('include', '/account/selectGroups/created?cat')
        //create
     })
    it('forwardJoinGrouppage', function () {
        cy.get('#root > div > section > div > header.ant-layout-header.ant-pro-fixed-header > div > div.ant-space.ant-space-horizontal.ant-space-align-center.right___3L8KG > div:nth-child(2) > span').click()
        cy.contains('Created Groups').click()
        cy.url().should('include', '/account/selectGroups/joined?cat')   
     })

    it('Logout', function () {
        cy.get('#root > div > section > div > header.ant-layout-header.ant-pro-fixed-header > div > div.ant-space.ant-space-horizontal.ant-space-align-center.right___3L8KG > div:nth-child(2) > span').click()
        cy.contains('Log out').click()
        cy.url().should('include', '/user/login')  
     })
})
