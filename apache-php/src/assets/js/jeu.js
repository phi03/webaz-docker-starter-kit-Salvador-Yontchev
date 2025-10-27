map = L.map('map').setView([51.5, -0.09], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

    // function onMapClick(e) {
    //     alert("You clicked the map at " + e.latlng);
    // }

    // map.on('click', onMapClick);

Vue.createApp({
  data() {
    return {
        inventaire : []

    };
    },
    computed: {

    },
    methods: {
      submit(){
        
      },

    },
    mounted() {
        // Création de la carte Leaflet
        const map = L.map('map').setView([51.5, -0.09], 5);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // Récupérer les objets de départ depuis l'API
        fetch('/objets') // suppose que ta route GET /objets renvoie les objets départ
            .then(res => res.json())
            .then(data => {
                data.forEach(obj => {
                    const geo = JSON.parse(obj.geom);
                    const marker = L.marker([geo.coordinates[1], geo.coordinates[0]], {
                        title: obj.nom,
                        icon: L.icon({
                            iconUrl: obj.img,
                            iconSize: [40, 40],
                            iconAnchor: [20, 40],
                            popupAnchor: [0, -40]
                        })
                    }).addTo(map).bindPopup(obj.nom);

                    // stocker le marker dans l'objet
                    obj.leafletMarker = marker;

                    // clic sur l'objet pour le récupérer
                    marker.on('click', () => {
                        this.ajouterObjet(obj);
                    });

                    this.objetsCarte.push(obj);
                });
            });
    }   
}).mount('#app');