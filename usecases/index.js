let RegisterUser = require("./RegisterUser");
let UserRepository = require("../services/UserRepository")
let DatabaseAccessService = require("../services/DatabaseAccessService");
let MerchantsDatabaseAccessService = require("../services/MerchantsDatabaseAccessService")
const RegisterMerchant = require("./RegisterMerchant");
const MerchantRepository = require("../services/MerchantRepository");
const ManageUsers = require("./ManageUsers");
const ManageTraders = require("./ManageTraders");
const TraderRepository = require("../services/TraderRepository");
const TradersDatabaseAccessService = require("../services/TradersDatabaseAccessService");

let userRepository = new UserRepository(new DatabaseAccessService())
let registerUser = new RegisterUser(userRepository)
let registerMerchant = new RegisterMerchant(new MerchantRepository(new MerchantsDatabaseAccessService()))
let manageUsers = new ManageUsers(userRepository)
let manageTraders = new ManageTraders(new TraderRepository(new TradersDatabaseAccessService()))

module.exports = { registerUser, registerMerchant, manageUsers, manageTraders }