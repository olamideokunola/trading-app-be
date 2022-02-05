let jwt =  require('jsonwebtoken')
let config = require("../config/auth.config")

class UserRepository {
    /**
     * @param {DatabaseAccessService} databaseAccessService
     */
    constructor(databaseAccessService) {
      this._databaseAccessService = databaseAccessService;
    }

    async userExists(userData) {
      return await this._databaseAccessService.findOne('user', userData) ? true : false
    }

    async getAccount(userData) {

      let nullAccountAResponse = { traderAccount: null, msg: 'Account not found'}
      
      let account =  await this._databaseAccessService.getAccount(userData.email)

      console.log(account)

      return !account ? nullAccountAResponse : { traderAccount: account }

    }

    async createUser(userData) {
      return await this._databaseAccessService.create('user', userData)
    }

    async createTraderAccount({ email, accountData }){
      return await this._databaseAccessService.createTraderAccount({ email, accountData })
    }

    async createTraderRoleForUser(email){
      console.log(`In createTraderRoleForUser email is ${email}`)
      
      let {user, role } = await this._databaseAccessService.createTraderRoleForUser(email)

      return {user, role}
    }

    async getIdDoc(docId){
      return await this._databaseAccessService.getIdDoc(docId)
    }

    async getDefaultCurrency(countryName){
      return await this._databaseAccessService.getDefaultCurrency(countryName)
    }

    async getCurrencies(userId){
      return await this._databaseAccessService.getCurrencies(userId)
    }

    async addWalletAccount({ email, walletAccountData }) {
      return await this._databaseAccessService.addWalletAccount({ email, walletAccountData })
    }

    async deletePasswordResetToken({email}) {
      console.log(`in deletePasswordResetToken, email is ${email}`)
      return await this._databaseAccessService.deletePasswordResetToken({ email })
    }

    async newPasswordResetToken({email}) {
      console.log(`about to create reset token, email is ${email}`)
      var token = jwt.sign({ email: email }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      let verified = this.verifyToken(token)
      console.log(`test verify: `)
      console.log(verified)

      let decoded = jwt.decode(token)
      console.log(`test decode: `)
      console.log(decoded)

      return token
    }

    verifyToken(token){
      let verified = jwt.verify(token, config.secret)
      return verified
    }

    async tokenInDb(email, passwordResetToken){
      let tokenInDb = await this._databaseAccessService.tokenInDb(email, passwordResetToken)

      console.log(`Token is db is ${tokenInDb}`)

      return tokenInDb
    }

    async createPasswordResetToken({email}){
      console.log(`in createPasswordResetToken, email is ${email}`)
      let newToken = await this.newPasswordResetToken({email})

      console.log(newToken)
      
      let created = await this._databaseAccessService.createPasswordResetToken({ email, newToken})

      if(!created) return

      return {email, newToken}
    }

    async changePassword({email, password}){

      let success = await this._databaseAccessService.changePassword({ email, password})

      return {success}
    }

    async getUserAccounts(){
      
      let usersAccounts = await this._databaseAccessService.getUserAccounts()

      return usersAccounts
    }
}

module.exports = UserRepository