var express = require('express')
var AutoConsoCtrl = require('./routes/Ctrl_AutoConso')
var VenteTotalCtrl = require('./routes/Ctrl_VenteTotal')


exports.router = (function() {
    var apiRouter = express.Router()

    //AutoConso Route
    apiRouter.route('/AutoConso').get(AutoConsoCtrl.Auto_conso)
    apiRouter.route('/AutoConso').post(AutoConsoCtrl.Auto_conso_2)
    apiRouter.route('/VenteTotal').get(VenteTotalCtrl.VenteTotal)
    apiRouter.route('/VenteTotal').post(VenteTotalCtrl.VenteTotal2)

    return apiRouter
})();