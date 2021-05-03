var connexion = require("../service/connexion")();
var service = require("../service/service");
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    register: function(req, res){
        console.log("==> POST REGISTER");
        var donnee = req.body;
        var nom = donnee.name, prenom = donnee.fname, appelation = donnee.aname, foyer = donnee.foyer, email = donnee.email, promotion = donnee.promotion, mdp1 = donnee.pass, mdp2 = donnee.re_pass;
        connexion.then(function(db){
            service.inscrire(email, mdp1, mdp2, "etudiant", db).then(function(verification){
                if(verification !== true){
                    res.status(403).send(verification);
                }
                else{
                    bcrypt.hash(mdp1, saltRounds, function(err, hash) {
                        db.query("INSERT INTO etudiant(nom, prenom, appelation, foyer, email, promotion, mdp) VALUES(?,?,?,?,?,?,?)", [nom, prenom, appelation, foyer, email, promotion, hash], function(err){
                            if(err) return res.status(500).send("Erreur: ressource");
                            res.send("Etudiant Bien enregistré !");
                        })
                    });
                }
            })
        })
    },
    
    connexion: function(req, res){
        console.log("==> POST CONNEXION ");
        var email = req.body.email, mdp = req.body.pass, table = req.body.table;
        console.log(email, mdp, table);
        if(email){
            connexion.then(function(db){
                db.query("SELECT * FROM "+table+" where email = ?", [email], function(err, resultats){
                    console.log(resultats);

                    if(err) res.status(500).send("Erreur: ressource");
                    if(resultats.length == 1){
                        bcrypt.compare(mdp, resultats[0].mdp, function(err, result) {
                            if(result === true){
                                res.send("Vous êtes connecter "+ resultats[0].appelation);
                            }
                            else{
                                res.status(403).send("Vérifier votre mot de passe");
                            }
                        });
                    }
                    else{
                        res.status(403).send("Vérifier votre adresse email");
                    }
                })
            })
        }
        else{
            res.send("Aucun adresse email");
        }
    },

    r_register:function(req, res){
        console.log("==> POST REGISTER REFERANT");
        var donnee = req.body;
        var nom = donnee.name, prenom = donnee.fname, appelation = donnee.aname, email = donnee.email, phone = donnee.phone, mdp1 = donnee.pass, mdp2 = donnee.re_pass;
        connexion.then(function(db){
            service.inscrire(email, mdp1, mdp2, "referant", db).then(function(verification){
                if(verification !== true){
                    res.status(403).send(verification);
                }
                else{
                    bcrypt.hash(mdp1, saltRounds, function(err, hash){
                        db.query("INSERT INTO referant(nom, prenom, appelation, email, tel, mdp) VALUES (?,?,?,?,?,?)", [nom, prenom, appelation, email, phone, hash], function(err){
                            if(err) return res.status(500).send("Erreur: ressource");
                            res.send("Référant bien enregistré!");
                        })
                    });
                }
            })
        });
    }
    
}