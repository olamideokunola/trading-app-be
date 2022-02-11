
class MerchantRepository {
    /**
     * @param {DatabaseAccessService} merchantsDatabaseAccessService
     */
    constructor(merchantsDatabaseAccessService) {
      this._merchantsDatabaseAccessService = merchantsDatabaseAccessService;
    }

    async createMerchantAccount(merchantData){
      return await this._merchantsDatabaseAccessService.createMerchantAccount(merchantData)
    }

    async updateMerchantAccount(merchantData){
      return await this._merchantsDatabaseAccessService.updateMerchantAccount(merchantData)
    }

    async getMerchants(){
      return await this._merchantsDatabaseAccessService.getMerchants()
    }

    async getMerchant(id){
      return await this._merchantsDatabaseAccessService.getMerchant(id)
    }

}

module.exports = MerchantRepository