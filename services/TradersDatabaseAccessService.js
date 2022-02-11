var {  TraderAccount } = require('../db/models')

class TradersDatabaseAccessService {

    constructor() {
        
    }

    async getTraders(){
        console.log(`in getTraders of TraderDatabaseAccessService`)
        
        let tradersAccounts = await TraderAccount.findAll()

        if(!tradersAccounts) return

        console.log(tradersAccounts)

        console.log('about to log traders accounts')

        let traders = tradersAccounts.map(async ta => {
            console.log(ta)
            console.log(await ta.getUser())
            let clean = ta.toJSON()
            return {
                ...clean,
                email: (await ta.getUser()).email,
                country: (await ta.getUser()).country
            }
        })

        return traders
    }

    async getTrader(id){
        console.log(`in getTrader of TraderDatabaseAccessService`)
        
        let trader = await TraderAccount.findOne({where: {id}})

        if(!trader) return

        console.log(trader)

        console.log('about to log trader account')

        return {
            ...(trader.toJSON()),
            email: (await trader.getUser()).email,
            country: (await trader.getUser()).country
        }
    }
}

module.exports = TradersDatabaseAccessService