module.exports = {
    inscrire: function(email, mdp1, mdp2, table, db){
        return new Promise(function(resolve){
            if(email){
                db.query("SELECT email FROM "+table+" where email = ?", [email], function(err, resultats){
                    if(err) res.status(500).send("Erreur: ressource");
                    if(resultats.length){
                        resolve("Adresse email déjà utilisé");
                    }
                    else{
                        if(mdp1 == mdp2){
                            resolve(true);
                        }
                        else{
                            resolve("Confirmation mot de passe incorrecte");
                        }
                    }
                })      
            }
            else{
                resolve("Erreur: aucun adresse email");
            }
        })
    }

}