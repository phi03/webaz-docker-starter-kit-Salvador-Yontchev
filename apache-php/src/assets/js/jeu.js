
Vue.createApp({
  data() {
    return {
        inventaire : [],           // Liste des objets dans l'inventaire
        objetsCarte: [],           // Liste des objets actuellement sur la carte
        map: null,                 // Instance de la carte Leaflet
        objet_selectionne: null,   // Objet actuellement sélectionné dans l'inventaire
        code : '',                 // Code entré par l'utilisateur
        
        messageTexte: '',

        messageInfo: '',
        
        jeuEnCours: false,
        tempsTotal: 60,           // 5 minutes
        tempsRestant: 60,
        timer_interval: null,
    };
    },
    computed: {

    },
    methods: {

        afficherMessage(texte) {
            this.messageTexte = texte;
        },
        fermerMessage() {
            this.messageTexte = '';
        },

        demarrerJeu() {

            if(this.messageTexte !== '') {
                this.fermerMessage();
            }

            this.tempsRestant = this.tempsTotal;
            this.jeuEnCours = true;

            this.timer_interval = setInterval(() => {
                if (this.tempsRestant > 0) {
                this.tempsRestant--;
                } else {
                this.terminerJeu();
                }
            }, 1000);
        },

        formatTemps(t) {
            let min = Math.floor(t / 60);
            let sec = t % 60;
            return `${min.toString().padStart(2,'0')} : ${sec.toString().padStart(2,'0')}`;
        },


        terminerJeu() {
            this.jeuEnCours = false;
            clearInterval(this.timer_interval); // stop le timer

            if (this.tempsRestant <= 0) {
                this.afficherMessage("🐟​Il n'y a plus de temps ! Vous avez perdu. 🐟​");
                return; // pas d'envoi de score
            }

            // Si le joueur a terminé avant la fin du temps
            let pseudo = prompt("Entrez votre pseudo pour le classement :");
            
            fetch('/score', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({ pseudo: pseudo, tempsRestant: this.tempsRestant })
            })
            .then(res => res.json())
            .then(data => {
                this.afficherMessage("Bravo ! Vous avez réussi.🏆​");
            });
        },

        submit(obj, codeSaisi) {
            fetch(`/objets?id=${obj.id}`)
                .then(res => res.json())
                .then(data => {
                    let codeCorrect = data[0]['code'];
                    if(codeSaisi === codeCorrect) {
                        this.debloquer_code(obj);
                        this.afficherMessage('Code correct ! Objet ouvert.​🔓​');
                    } else {
                        this.afficherMessage('Code incorrect, retentez votre chance.🔒​');
                    }
                });
        },

        // Ajout d'un marker sur la carte
        ajouterMarker(obj) {

            let geo = JSON.parse(obj.geom);
            console.log(obj);
            let marker = L.marker([geo.coordinates[1], geo.coordinates[0]], {
                title: obj.nom,
                icon: L.icon({
                    iconUrl: obj.img,
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                    popupAnchor: [0, -40]
                })
            });

            // Ajout de l'atribut referencant le marker Leaflet à l'objet
            obj.leafletMarker = marker;

            // Faire une disjoinction de cas sur le type de l'objet

            marker.on('click', () => {if(obj.type_objet === "récupérable") {this.ajouterObjetInventaire(obj)}

                                        else if(obj.type_objet === "code"){this.f_code(obj)}

                                        else if(obj.type_objet === "bloqué_par_objet"){

                                            console.log('objet',this.objet_selectionne, obj.objet_bloquant);
                                            
                                            if (this.objet_selectionne && this.objet_selectionne.nom === obj.objet_bloquant) {
                                                this.debloquer(obj);
                                            }
                                            else {
                                                console.log('indice', obj.id);
                                                this.afficherIndice(obj);
                                            }
                                        }
                                        else if(obj.type_objet === "bloqué_par_code"){
                                            obj.leafletMarker.bindPopup(`
                                                <div>
                                                    <h3> Veuillez saisir le code : </h3>
                                                    <form id="codeForm">
                                                        <input type="text" id="codeInput" placeholder="Code..." maxlength="4" required/>

                                                        <button id ="valider" type="submit">Valider</button>
                                                    </form>
                                                </div>`).openPopup();
                                                                                                                //POUR MOI  
                                                console.log('ok')                   
                                                let form = document.getElementById("codeForm");                  //Récupère le formulaire
                                                form.addEventListener("submit", (e) => {                         //Ajoute un écouteur d'évènement sur le formulaire
                                                    e.preventDefault();                                          //Empêche le rechargement de la page
                                                    let codeValue = document.getElementById("codeInput").value;  //Récupère la valeur entrée
                                                    this.submit(obj, codeValue);                                 //Appelle la méthode submit avec l'objet et le code entré
                                                    });
                                        }

                                        else if (obj.type_objet === "indication"){this.afficherIndice(obj)}
                                        
                                        
                                        }); 

            // Si c’est un objet de départ, on l’ajoute à la carte
            if (obj.depart || obj.zoom_min === null) 
            {
                marker.addTo(this.map);
            } 
            else 
            {
                this.objetsCarte.push(obj);  // sinon on le stocke pour le zoom
            }
        },

        // Ajout d'un objet à l'inventaire
        ajouterObjetInventaire(obj) {

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
                    if (obj.leafletMarker)
                        {
                            this.map.removeLayer(obj.leafletMarker);
                            obj.leafletMarker = null;
                        }
                }
        },

        //Affichage des objets de la carte selon leur niveau de Zoom
        majObjetsZoom() {

            let  zoomActuel = this.map.getZoom();
            console.log("Zoom actuel :", zoomActuel);
            
            // Affichage des objet de façon dynamique en fonction du zoom
            fetch(`/objets?zoom=${zoomActuel}`)
                .then(res => res.json())
                .then(data => {
                    data.forEach(obj => {
                        // Vérifie si l'objet n'est pas déjà sur la carte ou dans l'inventaire
                        if (!this.objetsCarte.find(o => o.id === obj.id) && 
                            !this.inventaire.find(o => o.id === obj.id)) {
                            this.ajouterMarker(obj);  // ajoute le marker à la carte /  à objetsCarte
                            
                        }
                    });
                });

                // Mise à jour de l'affichage des markers existants en fonction du zoom
                this.objetsCarte.forEach(obj => {

                    let marker = obj.leafletMarker;
                    if (!marker) return;

                    if (zoomActuel >= obj.zoom_min) {
                        if (!this.map.hasLayer(marker)) {
                            marker.addTo(this.map);
                        }
                    } else {
                        if (this.map.hasLayer(marker)) {
                            marker.remove();  
                        }
                    }
                });
        },

        // Affichage du code
        f_code(obj) {
            fetch(`/objets?id=${obj.id}`)
                .then(res => res.json())
                .then(data => {
                    obj.leafletMarker.bindPopup(`<div><h3> Le code est : ${data[0]['code']}</h3></div>`).openPopup();
                    
                });
        },

        // Affichage de l'indice pour un objet bloqué par un autre objet
        afficherIndice(obj) {
             fetch(`/objets?id=${obj.id}`)
                .then(res => res.json())
                .then(data => {
                    obj.leafletMarker.bindPopup(`<div><h3>Indice : ${data[0]['indice']}</h3></div>`).openPopup();
                });
            
        },

        // Sélectionner un objet dans l'inventaire
        selectionner_Objet(obj) {
            if(this.objet_selectionne === obj) {
                this.objet_selectionne = null; // si on reclcic on deselectionne
            } 
            else {
                this.objet_selectionne = obj; // clic = sélectionne l’objet 
                console.log('Objet sélectionné :', this.objet_selectionne);
                console.log(this.inventaire)
            }
        },

        debloquer_code(obj) {

            this.map.removeLayer(obj.leafletMarker);
            obj.leafletMarker = null;

            if (obj.objet_libere !== null) {

            fetch(`/objets?id=${obj.objet_libere}`)
                .then(res => res.json())
                .then(data => {
                    if (data.length > 0) { // Vérifie si l'objet libéré existe
                        let obj_libere = data[0];
                        this.ajouterMarker(obj_libere);
                    }
                });
            }
        },


        // Débloquer un objet bloqué par un autre objet
        debloquer(obj) {

        this.map.removeLayer(obj.leafletMarker);
        obj.leafletMarker = null;

        // Retirer l'objet utilisé de l'inventaire
        this.inventaire = this.inventaire.filter(o => o.id !== this.objet_selectionne.id);

        this.objet_selectionne = null;

        // Ajouter l'objet libéré à la carte
        console.log(obj);
        fetch(`/objets?id=${obj.objet_libere}`)
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) { // Vérifie si l'objet libéré existe
                    let obj_libere = data[0];
                    this.ajouterMarker(obj_libere);
                }
            });
    
    }

},

    mounted() {
        // Création de la carte Leaflet
        this.map = L.map('map').setView([48.8566, 2.3522], 10);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap'
        }).addTo(this.map);

        // Événement zoom
        this.map.on('zoomend', () => this.majObjetsZoom());

        // Fetch objets départ
        fetch('/objets')
            .then(res => res.json())
            .then(data => data.forEach(obj => this.ajouterMarker(obj)));

    }   
}).mount('#app');