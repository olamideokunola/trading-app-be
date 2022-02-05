
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

}

module.exports = MerchantRepository