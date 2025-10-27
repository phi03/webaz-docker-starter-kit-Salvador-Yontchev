<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chasse aux trésors | S.A.S & G.Y</title>
    <script src="https://cdn.jsdelivr.net/npm/vue"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
    crossorigin=""></script>
    <link rel="stylesheet" href="../assets/CSS/style_jeu.css">
</head>

<body>
    <div id ="app">

        <h1>Nom du jeu</h1>

        <div id="menu">
            <button id="btn-infos" class="btn-menu">Menu</button>
            <button id="btn-triche" class="btn-menu">Triche</button>
            <button id="btn-fame" class="btn-menu">Hall of fame</button>
        </div>

        <div id="map"></div>

        <div class="inventaire">
            <h2>Inventaire</h2>
            <ul id="liste-inventaire">
                <!-- Les éléments de l'inventaire seront ajoutés ici dynamiquement -->
            </ul>
        </div>

    <script src="../assets/js/jeu.js"></script>
</body>
</html>