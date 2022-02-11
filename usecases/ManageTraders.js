
let ManageTraders = class {

    constructor(traderRepository) {
        this.traderRepository = traderRepository
        this.noAccountResponse = { traderAccount: null, msg: 'Account does not exist' } 
        this.accountExistsResponse = { traderAccount: null, msg: 'Account already exists, no need to create' } 
    }

    async getTraders(){
        try {
            let traders =  await this.traderRepository.getTraders()

            if(!traders) return { success: false, message: 'Traders returned null from database!' }

            return { success: true, message: 'Traders loaded', traders }
        } catch (error) {
            console.error(error) 
            return { success: false, message: error }
        }
    }

    async getTrader(id){
        try {
            let trader =  await this.traderRepository.getTrader(id)

            if(!trader) return { success: false, message: 'Trader returned null from database!' }

            return { success: true, message: 'Trader loaded', trader }
        } catch (error) {
            console.error(error) 
            return { success: false, message: error }
        }
    }
}

module.exports = ManageTraders