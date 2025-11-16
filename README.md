# [Nom du projet]

Ce jeu est un escape game maritime pédagogique sur le thème de la piraterie, développé dans le cadre du cours de développement web en l'ING2

## Description

Ce jeu d'escape game est conçu pour stimuler votre esprit, encourager la résolution de problèmes et offrir une expérience immersive sur le thème du transport maritime. En relevant les défis proposés, vous aurez l'occasion de comprendre l'importance stratégique des grandes routes maritimes à travers le monde, dans un contexte à fortes pressions géopolitiques mais aussi environnementales. Alors laissez vous transporter dans un univers d'aventure et de mystère.

## Technologies utilisées

- **Front-end :** HTML, CSS, JavaScript, Vue.js  
- **Back-end :** PHP avec FlightPHP  
- **Cartographie :** Leaflet  
- **Environnement :** Docker Desktop

## Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et fonctionnel

## Installation et lancement

1. Cloner ce dépôt Git
   ```sh
   git clone https://github.com/phi03/webaz-docker-starter-kit-Salvador-Yontchev.git
  ```

2. Se positionner dans le dossier du projet
   ```sh
   cd webaz-docker-starter-kit-Salvador-Yontchev
   ```

4. Lancer Docker Desktop

3. Lancer les services Docker
   ```sh
    docker compose up -d
    ```

4. Extraire le contenu de workspaces.zip contenant les workspaces GeoServer

5. Copier les workspaces dans le conteneur GeoServer
   ```sh
   cp "chemin/vers/le/dossier/workspaces" webaz-docker-starter-kit-salvador-yontchev-geoserver-1:/opt/geoserver/data_dir/workspaces/
   ```

6. Relancer le conteneur Docker

7. Accéder à l'application web via http://localhost:1234

## Architecture de l’environnement

Le projet se divise en plusieurs dossiers principaux :

- `./apache-php/` : contient le Dockerfile pour le service Apache+PHP et le code source de l’application web
  - `./apache-php/src/` : code source de l’application web (HTML, CSS, JS, PHP)
    - `./apache-php/src/assets/` : ressources statiques (images, styles, scripts)
    - `./apache-php/src/views/` : vues HTML de l’application
    - `./apache-php/src/index.php` : routes du serveur PHP avec FlightPHP permettant de gérer les requêtes vers la base de données
- `./db/` : contient le script SQL d’initialisation de la base de données PostGIS

## Auteurs

- Sophie-Amandine SALVADOR
- Grégory YONTCHEV
