
Vue.createApp({
    data() 
    {
        return {
            inventaire : [],           // Liste des objets dans l'inventaire
            objetsCarte: [],           // Liste des objets actuellement sur la carte
            map: null,                 // Instance de la carte Leaflet
            objet_selectionne: null,   // Objet actuellement sélectionné dans l'inventaire
            code : '',                 // Code entré par l'utilisateur
            
            messageTexte: '',

            messageInfo: '',
            
            jeuEnCours: false,
            tempsTotal: 600,           //temps de jeu
            tempsRestant: 600,         // compteur
            timer_interval: null,

            afficherIntro: true, //affichage intro
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

        fermerIntro() 
        {
            this.afficherIntro = false;
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

            console.log('HELLO')

            this.jeuEnCours = false;
            clearInterval(this.timer_interval); // stop le timer

            if (this.tempsRestant <= 0) 
            {
                this.afficherMessage("🐟​Il n'y a plus de temps ! Vous avez perdu. 🐟​");

                return;
            }

            // Si le joueur a terminé avant la fin du temps
            let pseudo = prompt("Entrez votre pseudo pour le classement :");
            
            fetch('/scores', 
            {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({ pseudo: pseudo, temps: this.tempsRestant })
            })
            .then(res => res.json())
            .then(data => 
            {
                this.afficherMessage("Bravo ! Vous avez réussi.🏆​");
            });
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
                        this.debloquer_code(obj);
                        this.afficherMessage('Code correct ! Objet ouvert.​🔓​');
                        setTimeout(() => 
                        {
                            if(obj.fin==='t')
                            {
                                console.log("COUCOU")
                                this.terminerJeu()
                            }
                        }, 2000);
                        
                        
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

            // Ajout de l'atribut referencant le marker Leaflet à l'objet
            obj.leafletMarker = marker;

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
                                            
                                            if (this.objet_selectionne && this.objet_selectionne.nom === obj.objet_bloquant) 
                                            {
                                                this.debloquer(obj);
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
                                                    <button id ="indiceBtn" type="indice">Indice</button>
                                                </div>`).openPopup();
                                                                                                                //POUR MOI                   
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
            if (obj.depart || obj.zoom_min === null) 
            {
                marker.addTo(this.map);
            } 
            else if (this.inventaire.find(o => o.id === obj.id)) 
            {
                obj.leafletMarker = null,
                marker.remove(this.map)
            }
            else
            {
                this.objetsCarte.push(obj);  // sinon on le stocke pour le zoom
            }


        },

        // Ajout d'un objet à l'inventaire
        ajouterObjetInventaire(obj) 
        {

            // Vérifie si l'objet n'est pas déjà dans l'inventaire
            if (!this.inventaire.find(o => o.id === obj.id)) 
                {
                    this.inventaire.push(obj);

                    // Retire l'objet de objetsCarte pour ne plus gérer son affichage via zoom
                    let index = this.objetsCarte.findIndex(o => o.id === obj.id);
                    if (index !== -1)
                        {
                            this.objetsCarte.splice(index, 1);
                        }

                    // Retire le marker de la carte
                    if (obj.leafletMarker && this.map.hasLayer(obj.leafletMarker)) 
                        {
                            this.map.removeLayer(obj.leafletMarker);
                        }
                    obj.leafletMarker = null;
                }
        },

        //Affichage des objets de la carte selon leur niveau de Zoom
        majObjetsZoom() 
        {

            if (!this.map){return};

            let  zoomActuel = this.map.getZoom();
            console.log("Zoom actuel :", zoomActuel);

            
            // Affichage des objet de façon dynamique en fonction du zoom  //////////////// telecharger niveau de zoom puis parcours pcq rame bcp
            fetch(`/objets?zoom=${zoomActuel}`)
                .then(res => res.json())
                .then(data => 
                {
                    data.forEach(obj =>
                    {
                        // Vérifie si l'objet n'est pas déjà sur la carte ou dans l'inventaire
                        if (!this.inventaire.some(o => o.id === obj.id) && !this.objetsCarte.some(o => o.id === obj.id)) 
                            {
                                this.ajouterMarker(obj);
                            }
                    });
                });

                // Mise à jour de l'affichage des markers existants en fonction du zoom
                this.objetsCarte.forEach(obj => 
                {

                    let marker = obj.leafletMarker;
                    if (!marker || !this.map) {return};

                    if (zoomActuel+1 >= obj.zoom_min) 
                    {
                        if (!this.map.hasLayer(marker) && (!this.inventaire.find(o => o.id === obj.id)))
                        {
                            marker.addTo(this.map);
                        }
                    } 
                    else 
                    {
                        if (this.map.hasLayer(marker)) 
                        {
                            marker.remove();  
                        }
                    }
                });
        },

        // Affichage du code
        f_code(obj) 
        {
            fetch(`/objets?id=${obj.id}`)
                .then(res => res.json())
                .then(data => 
                {
                    obj.leafletMarker.bindPopup(`<div id="code"><h3> ${data[0]['code']}</h3></div>`).openPopup();
                    
                });
        },

        // Affichage de l'indice pour un objet bloqué par un autre objet
        afficherIndice(obj) 
        {
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

        debloquer_code(obj)
        {
            console.log(obj.fin)
            this.map.removeLayer(obj.leafletMarker);
            obj.leafletMarker = null;

            if (obj.objet_libere !== null) 
            {
                fetch(`/objets?id=${obj.objet_libere}`)
                    .then(res => res.json())
                    .then(data => 
                    {
                        if (data.length > 0)                    // Vérifie si l'objet libéré existe
                        { 
                            let obj_libere = data[0];
                            this.ajouterMarker(obj_libere);
                            obj_libere.zoom_min = 10            //MàJ de l'attribut de zoom pour le faire disparaitre au dézoom
                        }
                    });
            }

            
        },


        // Débloquer un objet bloqué par un autre objet
        debloquer(obj) 
        {

            this.map.removeLayer(obj.leafletMarker);
            obj.leafletMarker = null;

            // Retirer l'objet utilisé de l'inventaire
            this.inventaire = this.inventaire.filter(o => o.id !== this.objet_selectionne.id);

            this.objet_selectionne = null;

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
                        obj_libere.zoom_min = 10
                    }
                });
    
        }

    },

    mounted() 
    {
        // Création de la carte Leaflet
        this.map = L.map('map', 
            {
                zoomAnimation: true, // animations autorisées lors du zoom
            }).setView([1.045, 103.94], 9);

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
        });


        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', 
        {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap'
        }).addTo(this.map);

        // Événement zoom
         
        this.map.on('zoomend', () => 
        {
            this.majObjetsZoom();

            // Restaure le comportement normal de Leaflet
            delete L.Marker.prototype._animateZoom;
        });

        // Fetch des objets départ
        fetch('/objets')
            .then(res => res.json())
            .then(data => data.forEach(obj => this.ajouterMarker(obj)));

        setTimeout(() => 
        {
            this.afficherIntro = true;
        }, 2000);

    }   
}).mount('#app');