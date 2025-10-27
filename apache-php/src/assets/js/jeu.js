
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
      ajouterObjetInventaire(obj) {
            // Vérifie si l'objet n'est pas déjà dans l'inventaire
            if (!this.inventaire.find(o => o.id === obj.id)) {
                this.inventaire.push(obj);
                // Retirer le marker de la carte
                if (obj.leafletMarker) {
                    this.map.removeLayer(obj.leafletMarker);
                }
            }
        }

    },
    mounted() {
        // Création de la carte Leaflet
        this.map = L.map('map').setView([51.5, -0.09], 5);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        // Récupérer les objets de départ depuis l'API
        fetch('/objets') 
            .then(res => res.json())
            .then(data => {
                data.forEach(obj => {
                    let geo = JSON.parse(obj.geom);

                    // Créer un marker Leaflet pour chaque objet
                    let marker = L.marker([geo.coordinates[1], geo.coordinates[0]], {
                        title: obj.nom,
                        icon: L.icon({
                            iconUrl: obj.img,
                            iconSize: [40, 40],
                            iconAnchor: [20, 40],
                            popupAnchor: [0, -40]
                        })
                    }).addTo(this.map).bindPopup(obj.nom);

                    // stocker le marker dans l'objet
                    obj.leafletMarker = marker;

                    // clic sur l'objet pour le récupérer
                    marker.on('click', () => {
                        this.ajouterObjetInventaire(obj);
                    });

                    this.objetsCarte.push(obj);
                });
            });
    }   
}).mount('#app');