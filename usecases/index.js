let RegisterUser = require("./RegisterUser");
let UserRepository = require("../services/UserRepository")
let DatabaseAccessService = require("../services/DatabaseAccessService");
let MerchantsDatabaseAccessService = require("../services/MerchantsDatabaseAccessService")
const RegisterMerchant = require("./RegisterMerchant");
const MerchantRepository = require("../services/MerchantRepository");
const ManageUsers = require("./ManageUsers");

let userRepository = new UserRepository(new DatabaseAccessService())
let registerUser = new RegisterUser(userRepository)
let registerMerchant = new RegisterMerchant(new MerchantRepository(new MerchantsDatabaseAccessService()))
let manageUsers = new ManageUsers(userRepository)

module.exports = { registerUser, registerMerchant, manageUsers }