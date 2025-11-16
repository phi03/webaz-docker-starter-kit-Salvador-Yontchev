<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chasse aux trésors | S.A.S & G.Y</title>

    <link rel="apple-touch-icon" sizes="57x57" href="../assets/favicone/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="../assets/favicone/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="../assets/favicone/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="../assets/favicone/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="../assets/favicone/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="../assets/favicone/apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="../assets/favicone/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="../assets/favicone/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="../assets/favicone/apple-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192"  href="../assets/favicone/android-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="../assets/favicone/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="../assets/favicone/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="../assets/favicone/favicon-16x16.png">
    <link rel="manifest" href="../assets/favicone/manifest.json">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="../assets/favicone/ms-icon-144x144.png">
    <meta name="theme-color" content="#ffffff">

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

                <div id="timer" class="timer">
                    <span>Temps restant :</span>
                    <span>{{ formatTemps(tempsRestant) }}</span>
                </div>

                <h1>Nom du jeu</h1>

                <div id="menu">
                    <button id ="btn-menu" onclick="window.location.href='/'">Menu</button>
                    <button id="btn-triche" class="btn-menu" @click="afficherTriche">Triche</button>
                </div>

                <div v-if="afficherIntro" class="intro-bandeau">
                    <div class="intro-contenu">
                        <h2 v-html="pagesIntro[etapeIntro].titre"></h2>
                        <p v-html="pagesIntro[etapeIntro].texte"></p>
                        <button @click="suivantIntro">
                        {{ pagesIntro[etapeIntro].bouton }}
                        </button>
                    </div>
                </div>

                <div id="map"></div>

                <div class="inventaire">
                    <h2>Inventaire</h2>
                    <ul id="liste-inventaire">
                        <li v-for="objet in inventaire" :key="objet.id">
                        <img 
                        :src="objet.img" 
                        :alt="objet.nom" 
                        :title="objet.indice" 
                        class="objet-inventaire"
                        :class="{ 'selected': objet === objet_selectionne }"
                        @click="selectionner_Objet(objet)" />
                        </li>
                    </ul>
                </div>

                <div id="message" v-if="messageTexte" class="message-popup">
                    <p>{{ messageTexte }}</p>
                    <button @click="fermerMessage" v-bind:onclick="redirectionMessage">OK</button>
                </div>

                <form id="message_prompt" v-if="afficherPrompt" class="message-popup" @submit.prevent="submit_score" @keyup.13="submit_score">
                    <p><label for="pseudo">Bravo vous avez gagné 🏆</p> <p>Veuillez entrez votre pseudo pour sauvegarder votre score :</label><p>
                    <p><input type="text" id="pseudo" class="input-pseudo" v-model="messagePrompt"/></p>
                    <button>Valider</button>
                </div>
            </div>

        <script src="../assets/js/jeu.js"></script>
    </body>
</html>