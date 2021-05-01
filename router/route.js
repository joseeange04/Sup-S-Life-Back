var controller = require("../controller/controller");
var login = require("../controller/login");
var middleware = require("../middleware/auth");

// On injecte le router d"express, nous en avons besoin pour définir les routes 
module.exports = function(router) {   
    router.get("/", controller.index);
    router.get("/list", controller.list);
    router.post("/api/v1/register", login.register);
    router.post("/api/v1/login", login.connexion);
};