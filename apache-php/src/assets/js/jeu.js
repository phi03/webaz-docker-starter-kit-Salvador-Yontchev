map = L.map('map').setView([51.5, -0.09], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

    // function onMapClick(e) {
    //     alert("You clicked the map at " + e.latlng);
    // }

    // map.on('click', onMapClick);