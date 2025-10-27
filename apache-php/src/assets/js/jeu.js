
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

            marker.on('click', () => this.ajouterObjetInventaire(obj));

            // Si c’est un objet de départ, on l’ajoute à la carte
            if (obj.depart) 
            {
                marker.addTo(this.map);
            } 
            else 
            {
                this.objetsCarte.push(obj); // sinon on le stocke pour le zoom
            }
        },

        ajouterObjetInventaire(obj) {

            // Vérifie si l'objet n'est pas déjà dans l'inventaire
            if (!this.inventaire.find(o => o.id === obj.id)) 
                {
                    this.inventaire.push(obj);

                    // Retirer le marker de la carte
                    if (obj.leafletMarker)
                        {
                            this.map.removeLayer(obj.leafletMarker);
                            obj.leafletMarker = null;
                        }

                    // Retire l'objet de objetsCarte pour ne plus gérer son affichage via zoom
                    let index = this.objetsCarte.findIndex(o => o.id === obj.id);
                    if (index !== -1)
                        {
                            this.objetsCarte.splice(index, 1);
                        }
                }
        },
        
        majObjetsZoom() {

            let  zoomActuel = this.map.getZoom();
            console.log("Zoom actuel :", zoomActuel);

            this.objetsCarte.forEach(obj => {

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

    },
    mounted() {
        // Création de la carte Leaflet
        this.map = L.map('map').setView([51.5, -0.09], 1);

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