
Vue.createApp({
  data() {
    return {
        inventaire : [],
        objetsCarte: [],
        map: null,

    };
    },
    computed: {

    },
    methods: {

        // Ajout d'un marker sur la carte
        ajouterMarker(obj) {

            let geo = JSON.parse(obj.geom);
            console.log('ok')
            let marker = L.marker([geo.coordinates[1], geo.coordinates[0]], {
                title: obj.nom,
                icon: L.icon({
                    iconUrl: obj.img,
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                    popupAnchor: [0, -40]
                })
            });

            obj.leafletMarker = marker;

            // Faire une disjoinction de cas sur le type de l'objet
            marker.on('click', () => {if(obj.type_objet === "récupérable") {this.ajouterObjetInventaire(obj)}
                                        if(obj.type_objet === "code"){this.code(obj)}
                                        if(obj.type_objet === "bloqué_par_objet"){
                                            if (this.inventaire.find(o => o.nom === obj.objet_bloquant)) {
                                                this.debloquer(obj);
                                            }
                                            else {
                                                this.afficherIndice(obj.indice);
                                            }
                                        }
                                        if(obj.type_objet === "bloqué_par_code"){return;}
                                        
                                        
                                        }); 

            // Si c’est un objet de départ, on l’ajoute à la carte
            if (obj.depart) 
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

                    // Retirer le marker de la carte
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
            
            this.objetsCarte.forEach(obj => {

                let marker = obj.leafletMarker;
                if (!marker) {return;};

                if (zoomActuel >= obj.zoom_min) {
                    if (!this.map.hasLayer(obj.leafletMarker)) {
                        obj.leafletMarker.addTo(this.map);
                    }
                } else {
                    if (this.map.hasLayer(obj.leafletMarker)) {
                        this.map.removeLayer(obj.leafletMarker);
                    }
                }
            });
        }, 

        // Affichage du code
        code(obj) {
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

        // Débloquer un objet bloqué par un autre objet
        debloquer(obj) {
            return;
        },


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