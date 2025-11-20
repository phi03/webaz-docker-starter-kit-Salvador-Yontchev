Vue.createApp({
    data() 
    {
        return {
            inventaire : [],           // Liste des objets dans l'inventaire
            objetsDebloques: [],       // Liste des objets actuellement débloqués

            map: null,                 // Instance de la carte Leaflet
            cheatTile: null,           // Couche de triche
            markersGroup: null,        // Couche de markers sur la carte
            objet_selectionne: null,   // Objet actuellement sélectionné dans l'inventaire
            code : '',                 // Code entré par l'utilisateur
            
            messageTexte: '',         // Texte de la boîte de message
            afficherPrompt: false,    // Indique si le prompt pour score final est affiché
            messagePrompt: '',        // Texte entrée par l'utilisateur dans le prompt
            redirectionMessage: '',   // Redirection après avoir fermé le message
            
            jeuEnCours: false,         // Indique si le jeu est en cours
            tempsTotal: 600,           // Temps de jeu maximum en secondes
            tempsRestant: null,        // Temps restant en secondes
            timer_interval: null,      // Référence à l'intervalle du timer
            tricheActive: false,       // Affichage couche de triche

            afficherIntro: true,      // Affichage intro 
            afficherOutro: false,     // Affichage outro
            etapeIntro: 0,             // Index de la page actuelle de l'intro
            etapeOutro: 0,             // Index de la page actuelle de l'outro
            pagesIntro: [
            {
                titre: "Au 3 joyeux pirates ! ⚓",
                texte: ` <p>Nouveau ? Hm je me disais que ta frimousse ne me rappelait rien...</p>
                            <p>Tu m'as l'air d'être un navigateur je me trompe ?</p>
                            <p>Ah oui le transport marchand... de nos jours ce sont presque 80% des exportations qui passent par les mers, 
                            le trafic maritime international pourrait bien être responsable du rejet de 17% de CO2 dans l'atmosphère...</p>
                            <p>Oh mais je ne me suis pas présenté ! Je suis le capitaine Sierra de Gascogne aussi connu sous le nom de cap'tain SG... 
                            J'étais le capitaine de l'EverGiven.</p>
                            <p>COMMENT !! Tu ne connais pas l'EverGiven ? Tu es bien le seul... mais si rappel toi le navire qui a bloqué le canal de 
                            Suez pendant six jours en 2021.</p>
                            <p>Peu glorieux me diras-tu... Alors depuis je me terre dans les tavernes Singapouriennes à boire du jus d'ananas. 
                            Mais détrompes toi petit j'ai eu mon heure de gloire, j'étais un pirate renommé avant et j'avais même un trésor... mon précieux trésor...</p>

                            <p>Un jour alors que je navigais dans ces eaux tumultueuses bravant les tempêtes, luttant pour ma survie !
                            J'ai malheureusement égaré le code permettant d'ouvrir mon coffre quelque part...</p>
                            <p>Dis moi jeune homme aiderais tu un vieux pirate comme moi à retrouver son trésor ?</p>`,
                bouton: "Suivant ➡️"
            },
            {
                titre: "Soyez attentif, curieux et stratégique ⚓",
                texte: `<p>Votre objectif : arriver à ouvrir le coffre du capitaine SG échoué quelque part près de Dumai 
                            sur les rives du détroit de Malacca.</p>
                        <p>Mais attention votre temps est limité ! Il ne vous restera plus que 10 minutes à partir du moment ou vous quitterez cette page ! </p>
                        <p>Pour cela collectez les objets présents sur la carte et faites attention aux panneaux... 
                            ils peuvent vous donner de précieuses indications... ou pas !</p>
                        <p>Un bouton triche est à votre disposition si vous vous sentez perdu.</p>
                        <div id = "pfin"><p>Bonne chance matelot ! 🦜​ </p></div>`,
                bouton: "Commencer l’aventure 🚢"
            }
            ],
            pagesOutro: [
            {
                titre: "De retour au détroit de Malacca...",
                texte: `Ohé moussaillons !! Vous êtes enfin de retour ? Fantastique alors ce trésor vous l'avez ouvert ? 
                        Vous ouvrez le coffre, un nuage de poussière s'en échappe... Mais il est vide !! Pas un sou, pas un diamant... 
                        rien ! Comment ça rien mai non mais vous êtes miope ma parole !! ah attendez si mais si là... mai non plus près !
                        Vous vous approcher et sur le fond du coffre une inscription vous apparait alors...</p>`,
                bouton: "Lire l'inscription 📜"
            },
            {
                titre: "Recette du Sancocho : ragoût national du Panama",
                texte: `<p>Ingrédients :</p>
                        <ul>
                            <li>1 poulet découpé en morceaux</li>
                            <li>2 litres d'eau</li>
                            <li>4 à 5 pommes de terre</li>
                            <li>2 épis de maïs coupés en tronçons</li>
                            <li>1 oignon haché</li>
                            <li>2 tomates coupées en dés</li>
                            <li>2 gousse d'ail émincée</li>
                            <li>1 branche de céleri hachée</li>
                            <li>1 bouquet de culantro (coriandre)</li>
                            <li>1 poivron vert coupé en dés</li>
                            <li>sel</li>
                            <li>poivre</li>
                            <li>cumin</li>
                        </ul>
                        <p>Préparation :</p>
                        <ul>
                        <li>Dans une grande marmite, faites bouillir l'eau et ajoutez les morceaux de poulet. Laissez cuire pendant environ 30 minutes en écumant régulièrement.</li>
                        <li>Ajoutez les pommes de terre, le maïs, l'oignon, les tomates, l'ail, le céleri, le culantro et le poivron vert. Assaisonnez avec du sel, du poivre et du cumin selon votre goût.</li>
                        <li>Laissez mijoter pendant encore 20 minutes, jusqu'à ce que les légumes soient tendres retirer le poulet une fois bien cuit.</li>
                        <li>Servez chaud, accompagné de riz blanc et de tranches d'avocat. Bon appétit !</li>
                        </ul>
                        <p>Vous fermez le coffre, un peu déçu mais avec une nouvelle recette en tête pour régaler vos amis à votre retour au port.</p>
`,
                bouton: "Terminer l'aventure !"
            }
            ]
        };
    },
    methods: 
    {
        // ---------------------------- GESTION MESSAGES ET INTRO ----------------------------
        /**
         * Passe à la page suivante de l’intro ou démarre le jeu si c’est la dernière page
         * 
         * @returns {void}
         */
        suivantIntro() 
        {
            if (this.etapeIntro < this.pagesIntro.length - 1) 
            {
                this.etapeIntro++;       // passe la page
            } 
            else 
            {
                this.afficherIntro = false; // quitte l’intro
                this.demarrerJeu()
            }
        },

        /**
         * Passe à la page suivante de l’outro ou affiche le prompt si c’est la dernière page
         * 
         * @returns {void}
         */
        suivantOutro()
        {
            if (this.etapeOutro < this.pagesOutro.length - 1) 
            {
                this.etapeOutro++;       // passe la page
            }
            else 
            {
                this.afficherOutro = false; // quitte l’outro
                this.afficherPrompt = true;
            }
        },

        /**
         * Affiche un message à l'utilisateur dans une boîte de dialogue au centre de l'écran
         * 
         * @param {string} texte - Le texte du message à afficher
         * @returns {void}
         */
        afficherMessage(texte) 
        {
            this.messageTexte = texte;
        },

        /**
         * Ferme la boîte de message
         * 
         * @returns {void}
         */
        fermerMessage() 
        {
            this.messageTexte = '';
        },

        // ---------------------------- GESTION DEBUT ET FIN JEU ----------------------------
        /**
         * Démarre le jeu en initialisant le temps restant et en lançant le timer
         * 
         * @returns {void}
         */
        demarrerJeu() {

            if(this.messageTexte !== '') 
            {
                this.fermerMessage();
            }

            this.tempsRestant = this.tempsTotal;
            this.jeuEnCours = true;

            this.timer_interval = setInterval(() => 
            {
                if (this.tempsRestant > 0) 
                {
                    this.tempsRestant--;
                } 
                else 
                {
                    this.terminerJeu();
                }
            }, 1000);
        },

        /**
         * Formate le temps en secondes en une chaîne de caractères MM : SS
         * 
         * @param {number} t - Le temps en secondes
         * @returns {string} - Le temps formaté en MM : SS
         */
        formatTemps(t) 
        {
            let min = Math.floor(t / 60);
            let sec = t % 60;
            return `${min.toString().padStart(2,'0')} : ${sec.toString().padStart(2,'0')}`;
        },

        /**
         * Termine le jeu en arrêtant le timer et en affichant le message de fin
         * 
         * @returns {void}
         */
        terminerJeu() 
        {
            this.jeuEnCours = false;
            clearInterval(this.timer_interval); // stop le timer

            // Si le temps est écoulé, le joueur a perdu
            if (this.tempsRestant <= 0) 
            {
                this.afficherMessage("🐟​Il n'y a plus de temps ! Vous avez perdu. 🐟​");
                this.redirectionMessage = "window.location.href='/'";
                return;
            }
            // Si le joueur a terminé avant la fin du temps on lui demande son pseudo
            else
            {
                this.afficherOutro = true;
            }
        },

        /**
         * Soumet le score du joueur en envoyant son pseudo et son temps restant au serveur
         * 
         * @returns {void}
         */
        submit_score(){
            // Vérification du pseudo
            if(this.messagePrompt.trim() !== '') 
            {
                // Envoi des données au serveur
                let pseudo = this.messagePrompt.trim(); 
                let donnees = new FormData();
                donnees.append('pseudo', pseudo);
                donnees.append('temps', this.tempsRestant);
                fetch('/scores', 
                {
                    method: 'POST',
                    body: donnees
                })
                .then(res => res.json())
                .then(data => 
                {
                    // Gestion de la réponse du serveur
                    if (data.status !== 'success')
                    {
                        this.afficherMessage("Désolé, une erreur est survenue lors de l'enregistrement de votre score.");
                    }
                    else
                    {
                        this.afficherMessage(`Félicitations ${pseudo} ! Votre score a été enregistré avec succès.`);
                        this.redirectionMessage = "window.location.href='/'";
                    }
                });
                this.afficherPrompt = false;
            }
            else
            {
                this.afficherMessage("Veuillez entrer un pseudo valide.");
            }
        },

        // ---------------------------- GESTION OBJETS ET CARTE ----------------------------

        /**
         * Soumet le code saisi par l'utilisateur pour un objet donné et vérifie s'il est correct
         * 
         * @param {Object} obj - L'objet pour lequel le code est soumis
         * @param {string} codeSaisi - Le code saisi par l'utilisateur
         * @returns {void}
         */
        submit(obj, codeSaisi) 
        {
            fetch(`/objets?id=${obj.id}`)
                .then(res => res.json())
                .then(data => 
                {
                    // Vérification du code saisi
                    let codeCorrect = data[0]['code'];
                    if(codeSaisi === codeCorrect) 
                    {
                        if(obj.fin == 't')
                        {
                            this.terminerJeu()
                        }
                        else
                        {
                            this.debloquer(obj);
                            this.afficherMessage('Code correct ! Objet ouvert.​🔓​');
                        }
                    } 
                    else 
                    {
                        this.afficherMessage('Code incorrect, retentez votre chance.🔒​');
                    }
                });
        },

        /**
         * Ajoute un marker pour un objet sur la carte
         * 
         * @param {Object} obj - L'objet à ajouter en tant que marker
         * @returns {void}
         */
        ajouterMarker(obj) 
        {
            // Création du marker Leaflet
            let geo = JSON.parse(obj.geom);
            let marker = L.marker([geo.coordinates[1], geo.coordinates[0]], 
            {
                title: obj.nom,
                icon: L.icon(
                {
                    iconUrl: obj.img,
                    iconSize: [80, 80],
                    iconAnchor: [20, 40],
                    popupAnchor: [0, -40]
                })
            });

            // Faire une disjonction de cas sur le type de l'objet
            marker.on('click', () => {
                                        if(obj.type_objet === "récupérable") 
                                        {
                                            this.ajouterObjetInventaire(obj)
                                        }
                                        else if(obj.type_objet === "code")
                                        {
                                            this.f_code(obj)
                                        }
                                        else if(obj.type_objet === "bloqué_par_objet")
                                        {
                                            if (this.objet_selectionne && this.objet_selectionne.id === obj.objet_bloquant) 
                                            {
                                                this.debloquer(obj, true);
                                            }
                                            else 
                                            {
                                                this.afficherIndice(obj);
                                            }
                                        }
                                        else if(obj.type_objet === "bloqué_par_code")
                                        {
                                            obj.leafletMarker.bindPopup(`
                                                <div>
                                                    <h3> Veuillez saisir le code : </h3>
                                                    <form id="codeForm">
                                                        <input type="text" id="codeInput" placeholder="Code..." maxlength="4" required/>

                                                        <button id ="valider" type="submit">Valider</button>
                                                    </form>
                                                    <button id ="indiceBtn">Indice</button>
                                                </div>`,{minWidth: 250}).openPopup();

                                                //Obligation d'utiliser du js natif pour gérer le formulaire dans le popup Leaflet ajouté dynamiquement car sinon Vue.js ne le reconnait pas                                                                                  
                                                let form = document.getElementById("codeForm");                 //Récupère le formulaire
                                                let indiceBtn = document.getElementById("indiceBtn");  

                                                form.addEventListener("submit", (e) =>                           //Ajoute un écouteur d'évènement sur le formulaire
                                                {                         
                                                    e.preventDefault();                                          //Empêche le rechargement de la page
                                                    let codeValue = document.getElementById("codeInput").value;  //Récupère la valeur entrée
                                                    this.submit(obj, codeValue);                                 //Appelle la méthode submit avec l'objet et le code entré
                                                });
                                                
                                                indiceBtn.addEventListener("click", () => 
                                                {
                                                    this.afficherIndice(obj);
                                                });

                                                obj.leafletMarker.on('popupclose', () => 
                                                {
                                                    obj.leafletMarker.unbindPopup();
                                                });
                                        }
                                        else if (obj.type_objet === "indication")
                                        {
                                            this.afficherIndice(obj)
                                        }
                                    }); 

            // Ajout du marker à la carte
            marker.addTo(this.markersGroup);

            obj.leafletMarker = marker;
            this.objetsDebloques.push(obj);
        },

        /**
         * Ajoute un objet à l'inventaire du joueur
         * 
         * @param {Object} obj - L'objet à ajouter à l'inventaire
         * @returns {void}
         */
        ajouterObjetInventaire(obj) 
        {
            // Vérifie si l'objet n'est pas déjà dans l'inventaire
            if (!this.inventaire.find(o => o.id === obj.id)) 
            {
                this.inventaire.push(obj);

                // Retire le marker de la carte
                if (obj.leafletMarker && this.markersGroup.hasLayer(obj.leafletMarker)) 
                {
                    this.markersGroup.removeLayer(obj.leafletMarker);
                }
                
                obj.leafletMarker = null;
            }
        },

        /**
         * Met à jour l'affichage des objets sur la carte en fonction du niveau de zoom actuel
         * 
         * @returns {void}
         */
        majObjetsZoom() 
        {
            let zoomActuel = this.map.getZoom();

            // Mise à jour de l'affichage des markers des objets débloqués en fonction du zoom
            this.objetsDebloques.forEach(obj => 
            {
                let marker = obj.leafletMarker;
                
                // Si l'objet a été débloqué mais que son marker est null (objet récupéré ou supprimé après déblocage), on ne fait rien
                if (marker == null) {
                    return;
                }

                // Affichage ou masquage du marker en fonction du niveau de zoom
                if (zoomActuel >= obj.zoom_min) 
                {
                    if (!this.markersGroup.hasLayer(marker))
                    {
                        marker.addTo(this.markersGroup);
                    }
                } 
                else 
                {
                    if (this.markersGroup.hasLayer(marker)) 
                    {
                        this.markersGroup.removeLayer(marker);
                    }
                }
            });
        },

        /**
         * Affiche le code pour un objet de type "code"
         * 
         * @param {Object} obj - L'objet pour lequel afficher le code
         * @returns {void}
         */
        f_code(obj) 
        {
            // Ferme le popup actuel si il y en a une ouverte avant d'en ouvrir un nouveau
            if (obj.leafletMarker.getPopup() !== undefined && obj.leafletMarker.getPopup() !== null)
            {
                obj.leafletMarker.unbindPopup();
                obj.leafletMarker.closePopup();
            }
            obj.leafletMarker.bindPopup(`<div id="code"><h3> ${obj.code}</h3></div>`).openPopup();
        },

        /**
         * Affiche l'indice pour un objet bloqué par un autre objet
         * 
         * @param {Object} obj - L'objet pour lequel afficher l'indice
         * @returns {void}
         */
        afficherIndice(obj) 
        {
            // Ferme le popup actuel si il y en a une ouverte avant d'en ouvrir un nouveau
            if (obj.leafletMarker.getPopup() !== undefined && obj.leafletMarker.getPopup() !== null)
            {
                obj.leafletMarker.unbindPopup();
                obj.leafletMarker.closePopup();
            }

            obj.leafletMarker.bindPopup(`<div id="indice"><h3><em>Indice :</em></h3><p> ${obj.indice}</p></div>`).openPopup();
        },

        /**
         * Sélectionner un objet dans l'inventaire
         * 
         * @param {Object} obj - L'objet à sélectionner
         * @returns {void}
         */
        selectionner_Objet(obj) 
        {
            if(this.objet_selectionne === obj) 
            {
                this.objet_selectionne = null;
            } 
            else 
            {
                this.objet_selectionne = obj; 
            }
        },

        /**
         * Débloque un objet sur la carte en utilisant un objet de l'inventaire ou un code
         * @param {Object} obj - L'objet à débloquer
         * @param {boolean} suppr_inventaire - Indique si on utilise un objet de l'inventaire pour débloquer
         * @returns {void}
         */
        debloquer(obj, suppr_inventaire = false) 
        {
            this.markersGroup.removeLayer(obj.leafletMarker);
            obj.leafletMarker = null;

            // Retirer l'objet utilisé de l'inventaire
            if (suppr_inventaire) {
                this.inventaire = this.inventaire.filter(o => o.id !== this.objet_selectionne.id);
                this.objet_selectionne = null;
            }

            // Ajouter l'objet libéré à la carte
            fetch(`/objets?id=${obj.objet_libere}`)
                .then(res => res.json())
                .then(data => 
                {
                    if (data.length > 0) 
                    {
                        let obj_libere = data[0];
                        this.ajouterMarker(obj_libere);
                    }
                });
        },

        /**
         * Active ou désactive la couche de triche sur la carte
         * 
         * @returns {void}
         */
        afficherTriche(){
            this.tricheActive = !this.tricheActive;

            // Activer la couche de triche
            if(this.tricheActive) {
                this.afficherMessage("Mode triche activé.");
                let urlCoucheTriche = 'http://localhost:8080/geoserver/Projet_Web/wms';
                this.cheatTile = L.tileLayer.wms(urlCoucheTriche,
                    {
                        layers : 'Projet_Web:objets',
                        format: 'image/png',
                        transparent: true,
                    });
                this.cheatTile.addTo(this.map);
                } 
            // Désactiver la couche de triche
            else {
                this.afficherMessage("Mode triche désactivé.");
                if(this.cheatTile) {
                    this.map.removeLayer(this.cheatTile);
                    this.cheatTile = null;
                }
            }
        },
    },

    mounted() 
    {
        // Création de la carte Leaflet
        this.map = L.map('map', 
            {
                zoomAnimation: false, // animations autorisées lors du zoom
            }).setView([1.045, 103.94], 9);
            
        // Création de la couche de markers
        this.markersGroup = L.layerGroup().addTo(this.map);

        // Ajout de la couche de tuiles OpenStreetMap
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', 
        {
            noWrap: true,
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap'
        }).addTo(this.map);

        // Événement zoom
        this.map.on('zoomend', () => 
        {
            this.majObjetsZoom();
        });

        // Récupère tous les objets de départ
        fetch('/objets')
            .then(res => res.json())
            .then(data => 
                {
                    data.forEach(obj => this.ajouterMarker(obj));
                    this.majObjetsZoom();
                });
    }   
}).mount('#app');