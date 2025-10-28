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
        <div id ="app">

            <h1>Nom du Jeu</h1>

            <button onclick="window.location.href='/jeu'">Commencer le jeu</button>

            <button @click='f_messagefame'>Hall of fame</button>
            <button @click='f_messageInfo'>Infos</button>

            <div id="message" v-if="messageInfo" class="message-popup">
                <div id ="Info" v-html="messageInfo"></div>
                <button @click="fermerMessageInfo">OK</button>
            </div>

            <div id="message" v-if="messagefame" class="message-popup">
                <div id="fame">
                    <h1>Hall of Fame</h1>
                    <ol>
                        <li v-for="score in topScores" :key="score.id">
                            {{ score.pseudo }} - {{ score.temps }} s
                        </li>
                    </ol>
                    <button @click="fermerMessagefame">OK</button>
                </div>
            </div>

        </div>
    <script src="../assets/js/accueil.js"></script>
</body>
</html>