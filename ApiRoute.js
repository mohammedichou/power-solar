var express = require('express')
var AutoConsoCtrl = require('./routes/Ctrl_AutoConso')


exports.router = (function() {
    var apiRouter = express.Router()

    //AutoConso Route
    apiRouter.route('/AutoConso').get(AutoConsoCtrl.Auto_conso)
    apiRouter.route('/AutoConso').post(AutoConsoCtrl.Auto_conso_2)

    return apiRouter
})();