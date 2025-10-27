<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chasse aux trésors | S.A.S & G.Y</title>
    <script src="https://cdn.jsdelivr.net/npm/vue"></script>
    <link rel="stylesheet" href="../assets/CSS/style_accueil.css">
</head>

<body>
    <div class ="app">

        <h1>Nom du Jeu</h1>

        <button class="btn-menu" @click="goTo('jeu')">Commencer le jeu</button>
        <button class="btn-menu" @click="goTo('hall_of_fame')">Hall of fame</button>
        <button class="btn-menu" @click="goTo('infos')">Infos</button>


    </div>
    <script src="../assets/js/accueil.js"></script>
</body>
</html>