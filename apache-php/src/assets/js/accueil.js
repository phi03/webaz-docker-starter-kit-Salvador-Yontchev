Vue.createApp({
  data() {
    return {
        messageInfo: '',
        messagefame: false,
        topScores: [],

    };
    },
    methods: {
      /**
       * Affiche le message d'information de bienvenue et les indications de jeu.
       * 
       * @return {void}
       */
      f_messageInfo() {
        this.messageInfo = `<h1> Bienvenue sur S.G Quest ! </h1> 
        <p>Ohé du bateau ! Bien le bonjour mousaillons !
        Êtes-vous prêts à relever le défi ? Avant de vous lancer n'hésitez pas à jeter un oeil aux indications de jeu... Parole de Pirate ! </p>

        <h2> Indications de jeu : </h2>
        <ul>
            <li>Retrouvez le trésor du Pirate S.G le plus rapidement possible ! </li>
            <li>Explorez les différents objets interactifs présents sur la carte.</li>
            <li>Suivez les indices disséminés dans l'environnement du jeu pour trouver les objets nécessaires à votre quête ! </li>
            <li>Prenez garde certains objets ne sont peut être pas là où vous croyez...</li>
            <li>Chaque code correct vous rapproche du trésor final.</li>
            <li>Certains objets sont bloqués par d'autres... Cherchez les dans la carte. </li>
            <li>Si vous vous sentez perdus un bouton de triche est à votre disposition. </li>
            <li>Amusez-vous et bonne chance dans votre quête !</li>
        </ul>

        <h2> Pourquoi ce jeu ? </h2>
        <p>Ce jeu d'escape game est conçu pour stimuler votre esprit, encourager la résolution de problèmes et offrir une expérience immersive sur 
        le thème du transport maritime. En relevant les défis proposés, vous aurez l'occasion de comprendre l'importance stratégique des grandes routes maritimes à travers le monde,
        dans un contexte à fortes pressions géopolitiques mais aussi environnementales. Alors laissez vous transporter dans un univers d'aventure et de mystère.
        </p>

        <h2> A l'abordage ! </h2>
        <p> Cliquez sur le bouton "Commencer l'aventure" pour plonger dans l'univers captivant de notre escape game en ligne. 
        Alors moussaillons êtes vous prêts à rentrer dans la légende ?</p>

        <h2> Qui sommes nous ? </h2>
        <p>Nous sommes deux valeureux pirates en quêtes de trésor !!! (ah non... oups... pardon... On s'est un peu emballé là !)
        Nous sommes deux étudiants de l'ENSG, ce projet s'inscrit dans le cadre du TP de validation du cours de développement Web avancé. 
        Cet escape game en ligne est le fruit de notre collaboration et de notre créativité. 
        Nous espérons que vous apprécierez cette aventure autant que nous avons aimé la concevoir pour vous !</p>
        <div id="foot"><p>Sophie-Amandine SALVADOR et Grégory YONTCHEV </p></div>

        `;
      },
      /**
       * Affiche la page des meilleurs scores.
       * 
       * @return {void}
       */
      f_messagefame() {
        fetch('/score')
            .then(res => res.json())
            .then(data => {
                this.topScores = data; 
                this.messagefame = true; 
            });
        },
      /**
       * Ferme le message d'information.
       * 
       * @return {void}
       */
      fermerMessageInfo() {
        this.messageInfo = '';
      },
      /**
       * Ferme la page des meilleurs scores.
       * 
       * @return {void}
       */
      fermerMessagefame() {
        this.messagefame= false;
      }
    }
}).mount('#app');