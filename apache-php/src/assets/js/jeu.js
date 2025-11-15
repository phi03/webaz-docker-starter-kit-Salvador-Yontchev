
Vue.createApp({
    data() 
    {
        return {
            inventaire : [],           // Liste des objets dans l'inventaire
            objetsDebloques: [],       // Liste des objets actuellement debloques
            map: null,                 // Instance de la carte Leaflet
            cheatTile: null,           // couche triche
            markersGroup: null,        // Groupe de markers sur la carte
            objet_selectionne: null,   // Objet actuellement sélectionné dans l'inventaire
            code : '',                 // Code entré par l'utilisateur
            
            messageTexte: '',
            afficherPrompt: false,

            messageInfo: '',
            
            jeuEnCours: false,
            tempsTotal: 600,           //temps de jeu
            tempsRestant: 600,         // compteur
            timer_interval: null,
            tricheActive: false,    // affichage couche triche
            

            afficherIntro: false, //affichage intro
            etapeIntro: 0, // index de la page actuelle
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
                texte: `<p>Votre objectif : arriver à ouvrir le coffre du capitaine SG échoué quelque part près de Doumai 
                            sur les rives du détroit de Malacca.</p>
                        <p>Mais attention votre temps est limité ! Il ne vous restera plus que 10 minutes à partir du moment ou vous quitterez cette page ! </p>
                        <p>Pour cela collectez les objets présents sur la carte et faites attention aux panneaux... 
                            ils peuvent vous donner de précieuses indications... ou pas !</p>
                        <p>Un bouton triche est à votre disposition si vous vous sentez perdu.</p>
                        <div id = "pfin"><p>Bonne chance matelot ! 🦜​ </p></div>`,
                bouton: "Commencer l’aventure 🚢"
            }
            ]
        };
    },
    computed: 
    {

    },
    methods: 
    {
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

        afficherMessage(texte) 
        {
            this.messageTexte = texte;
        },
        fermerMessage() 
        {
            this.messageTexte = '';
        },

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

        formatTemps(t) 
        {
            let min = Math.floor(t / 60);
            let sec = t % 60;
            return `${min.toString().padStart(2,'0')} : ${sec.toString().padStart(2,'0')}`;
        },


        terminerJeu() 
        {

            this.jeuEnCours = false;
            clearInterval(this.timer_interval); // stop le timer

            if (this.tempsRestant <= 0) 
            {
                this.afficherMessage("🐟​Il n'y a plus de temps ! Vous avez perdu. 🐟​");

                return;
            }

            // Si le joueur a terminé avant la fin du temps
            this.afficherPrompt = true;
        },

        submit_score(){
            let pseudo = this.messagePrompt.trim();
            if(pseudo === '') 
            {
                alert("Veuillez entrer un pseudo valide.");
                return;
            }
            this.afficherPrompt = false;

            let donnees = new FormData();
            donnees.append('pseudo', pseudo);
            donnees.append('temps', this.tempsRestant);

            fetch('/scores', 
            {
                method: 'POST',
                body: donnees
            })
            window.location.href = '/';
        },

        submit(obj, codeSaisi) 
        {
            fetch(`/objets?id=${obj.id}`)
                .then(res => res.json())
                .then(data => 
                {
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

        // Ajout d'un marker sur la carte
        ajouterMarker(obj) 
        {

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

            // Faire une disjoinction de cas sur le type de l'objet
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

            
            // Si c’est un objet de départ, on l’ajoute à la carte
            marker.addTo(this.markersGroup);
            // Ajout de l'atribut referencant le marker Leaflet à l'objet
            obj.leafletMarker = marker;
            this.objetsDebloques.push(obj);
            console.log(marker);
        },

        // Ajout d'un objet à l'inventaire
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

        //Affichage des objets de la carte selon leur niveau de Zoom
        majObjetsZoom() 
        {

            if (!this.map){
                console.log("La carte n'est pas encore initialisée.");
                return};
            
            let zoomActuel = this.map.getZoom();
            console.log("Zoom actuel :", zoomActuel);

            // Mise à jour de l'affichage des markers existants en fonction du zoom
            this.objetsDebloques.forEach(obj => 
            {
                let marker = obj.leafletMarker;
                
                if (marker == null) {
                    return;
                }
                console.log(marker.getPopup());
                if (zoomActuel >= obj.zoom_min) 
                {
                    if (!this.markersGroup.hasLayer(marker) && (!this.inventaire.find(o => o.id === obj.id)))
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

        // Affichage du code
        f_code(obj) 
        {
            obj.leafletMarker.bindPopup(`<div id="code"><h3> ${obj.code}</h3></div>`).openPopup();
        },

        // Affichage de l'indice pour un objet bloqué par un autre objet
        afficherIndice(obj) 
        {
            console.log("Affichage indice pour l'objet :", obj);
             fetch(`/objets?id=${obj.id}`)
                .then(res => res.json())
                .then(data => 
                {
                    obj.leafletMarker.bindPopup(`<div id="indice"><h3><em>Indice :</em></h3><p> ${data[0]['indice']}</p></div>`).openPopup();
                });
            
        },

        // Sélectionner un objet dans l'inventaire
        selectionner_Objet(obj) 
        {
            if(this.objet_selectionne === obj) 
            {
                this.objet_selectionne = null; // si on reclcic on désélectionne
            } 
            else 
            {
                this.objet_selectionne = obj; // clic = sélectionne l’objet 
            }
        },

        // Débloquer un objet bloqué par un autre objet
        debloquer(obj, suppr_inventaire = false) 
        {
            // Retirer le marker de la carte
            obj.leafletMarker.closePopup();
            obj.leafletMarker.unbindPopup();
            this.markersGroup.removeLayer(obj.leafletMarker);
            obj.leafletMarker = null;

            // Retirer l'objet utilisé de l'inventaire
            if (suppr_inventaire) {
                this.inventaire = this.inventaire.filter(o => o.id !== this.objet_selectionne.id);
                this.objet_selectionne = null;
            }

            // Ajouter l'objet libéré à la carte
            console.log(obj);
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

        afficherTriche(){
            this.tricheActive = !this.tricheActive;

            // Activer la couche de triche
            if(this.tricheActive) {
                this.afficherMessage("Mode triche activé : tous les objets sont visibles sur la carte.");
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
                zoomAnimation: true, // animations autorisées lors du zoom
            }).setView([1.045, 103.94], 9);
            
        this.markersGroup = L.layerGroup().addTo(this.map);
        /*
        // Fix temporaire pour éviter les erreurs quand un marker n’a plus de map évite l'erreur _map is null cannot access property _latlonMarker...
        this.map.on('zoomstart', () => 
        {
            // On empêche Leaflet d’essayer d’animer les markers supprimés
            L.Marker.prototype._animateZoom = function (e) 
            {
                if (!this._map) return; 
                const pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center).round();
                this._setPos(pos);
            };
        });*/

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

            // Restaure le comportement normal de Leaflet
            //delete L.Marker.prototype._animateZoom;
        });

        // Récupère tous les objets de départ
        fetch('/objets')
            .then(res => res.json())
            .then(data => data.forEach(obj => this.ajouterMarker(obj)));

        /*
        setTimeout(() => 
        {
            this.afficherIntro = true;
        }, 2000);*/

    }   
}).mount('#app');