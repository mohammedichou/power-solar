
// Donnée de base
let PRIX_ACHAT_KWH = 0.1579
let PRIX_VENTE_KWH = 0.1
let PRIX_POLY_M2 = 250
let PRIX_ONDULEUR = 1000
let PRIX_RACCORDEMENT = 1000
let PRIX_VENTE_TOTAL_KWH = 0.185


// calcul de surface 
var facteur_correction = 1
var Conso_Annuelle = 3000
var puissance_install = Conso_Annuelle / facteur_correction
var facteur_Surface_Pc = 8
var SPanneau = (puissance_install / 1000 ) * facteur_Surface_Pc
var Facteur_ensolleilement = 1.35

// cout de l'installation 
let COUT_TOTAL = (PRIX_POLY_M2 * SPanneau) + PRIX_ONDULEUR + PRIX_RACCORDEMENT
let PRIX_REVENTE = 1170
let COUT_ABO = 25
let PRIME = 1170

//Gain conso & Revenu 
var Prod_Panneau_conso = 0.55 * Conso_Annuelle * Facteur_ensolleilement
var Prod_Panneau_vente = 0.45 * Conso_Annuelle * Facteur_ensolleilement
var Gain_conso_annuel = Prod_Panneau_conso * PRIX_ACHAT_KWH
var Gain_revente_annul = Prod_Panneau_vente * PRIX_VENTE_KWH



module.exports = {
    Auto_conso: function(req,res){
        var Tab1 = []
        createObjTab().then(function(res1){
            Tab1 = res1
            create_OBJ_Donnée().then(function(res2){
                res.status(200).json({"resultat" : 
                {"Tab" : Tab1,
                "valeur" : res2}
                })
            })
        })
    },
    Auto_conso_2: function(req,res){
        var Tab1 = []
        console.log(req.body.conso)
        console.log(req.body.fcorrect)
        console.log(req.body.fensol)
        reloadData(req.body.conso,req.body.fcorrect,req.body.fensol).then(function(res1){
            if(res1 === "OK"){
                createObjTab().then(function(res1){
                    Tab1 = res1
                    create_OBJ_Donnée().then(function(res2){
                        res.status(200).json({"resultat" : 
                        {"Tab" : Tab1,
                        "valeur" : res2}
                        })
                    })
                })
            }
            else{
                res.status(400).json({"Error" : "POST KO"})
            }
        })

        
    }
}

function create_OBJ_Donnée(){
    return new Promise((resolve) => {
        data = { 
            "Calcul_de_surface" : {
                "conso_annuelle" : Conso_Annuelle,
                "Facteur_de_correction" : facteur_correction,
                "Puissance_install" : puissance_install,
                "Facteur_surface_pc": facteur_Surface_Pc,
                "Spanneau": SPanneau,
                "Facteur_ensoleillement" : Facteur_ensolleilement
            },"Cout_de_l'installation" : {
                "cout_total" : COUT_TOTAL,
                "prix_revente": PRIX_REVENTE,
                "Cout_abo": COUT_ABO,
                "Prime" : PRIME
            },"Donné_de_base" : {
                "PRIX_ACHAT_KWH" : PRIX_ACHAT_KWH,
                "PRIX_VENTE_KWH": PRIX_VENTE_KWH,
                "PRIX_POLY_M2": PRIX_POLY_M2,
                "PRIX_ONDULEUR" : PRIX_ONDULEUR,
                "PRIX_RACCORDEMENT" : PRIX_RACCORDEMENT,
                "PRIX_VENTE_TOTAL_KWH" : PRIX_VENTE_TOTAL_KWH
            },"Gain" : {
                "Prod_Panneau_conso" : Prod_Panneau_conso,
                "Prod_Panneau_vente": Prod_Panneau_vente,
                "Gain_conso_annuel": Gain_conso_annuel,
                "Gain_revente_annul" : Gain_revente_annul
            }
        }
        resolve(data)
    })
}

function createObjTab(){
    return new Promise((resolve) => {
        var invests = []
        var GainAutoConso = []
        var GainVenteTotal = []
        var alpha = 1.03
        var i = 0;
        for(i = 0 ; i < 25 ; i++){
            if(i == 0){
                invests.push(COUT_TOTAL) 
            }else{
                if(i == 9 || i == 19){
                    invests.push(invests[i-1]+COUT_ABO+PRIX_ONDULEUR) 
                }else{
                    invests.push(invests[i-1]+COUT_ABO)
                }
                 
                
            }
             
        }
        for(i = 0 ; i < 25 ; i++){
            if(i == 0){
                GainAutoConso.push(Gain_conso_annuel + Gain_revente_annul + (PRIME / 5))
            }else{
                if(i<5){
                    GainAutoConso.push(GainAutoConso[i-1] + (alpha * Gain_conso_annuel) + Gain_revente_annul + (PRIME / 5))
                }else{
                    GainAutoConso.push(GainAutoConso[i-1] + (alpha * Gain_conso_annuel) + Gain_revente_annul)
                }
                alpha += 0.03
            }   
        }
        for(i = 0 ; i < 25 ; i++){
            if(i == 0){
                GainVenteTotal.push(Conso_Annuelle * PRIX_VENTE_TOTAL_KWH)
            }else{
                GainVenteTotal.push(GainVenteTotal[0]*(i+1))
            }
             
        }
        var obj = {"Investissement" : invests,
                   "GainsAutoConso" : GainAutoConso,
                   "GainVenteTotale" : GainVenteTotal}

        resolve(obj)
    })
}

function reloadData (conso, fcorrect, fensol){
    return new Promise((resolve) => {
        facteur_correction = fcorrect
        Conso_Annuelle = conso
        Facteur_ensolleilement = fensol
        puissance_install = Conso_Annuelle / facteur_correction
        SPanneau = (puissance_install / 1000 ) * facteur_Surface_Pc
        Prod_Panneau_conso = 0.55 * Conso_Annuelle * Facteur_ensolleilement
        Prod_Panneau_vente = 0.45 * Conso_Annuelle * Facteur_ensolleilement
        Gain_conso_annuel = Prod_Panneau_conso * PRIX_ACHAT_KWH
        Gain_revente_annul = Prod_Panneau_vente * PRIX_VENTE_KWH
        resolve("OK")
    })
    
}