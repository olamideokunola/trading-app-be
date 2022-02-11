
class TraderRepository {
    /**
     * @param {DatabaseAccessService} tradersDatabaseAccessService
     */
    constructor(tradersDatabaseAccessService) {
      this._tradersDatabaseAccessService = tradersDatabaseAccessService;
    }

    async getTraders(){
      return await this._tradersDatabaseAccessService.getTraders()
    }

    async getTrader(id){
      return await this._tradersDatabaseAccessService.getTrader(id)
    }

}

module.exports = TraderRepository