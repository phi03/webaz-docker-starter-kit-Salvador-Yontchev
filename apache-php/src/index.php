<?php

declare(strict_types=1);

require_once 'flight/Flight.php';

$host = 'db';
$port = 5432;
$dbname = 'mydb';
$user = 'postgres';
$pass = 'postgres';

// Connexion BDD
$link = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$pass");

Flight::set('db', $link);

// Page d'accueil
Flight::route('/', function() {
    Flight::render('accueil');
});

// Page du jeu
Flight::route('/jeu', function() {
    Flight::render('jeu');
});

// Route de test pour vérifier la connexion à la base de données
Flight::route('/test-db', function () {
    $link = Flight::get('db');

    $sql = "SELECT * FROM objets";
    $query = pg_query($link, $sql);
    $results = pg_fetch_all($query);
    Flight::json($results);
});

// Route pour récupérer tous les objets de départ ou un objet en particulier depuis la base de données
Flight::route('GET /objets', function () {
    $link = Flight::get('db');

    if (isset($_GET['id']) && !empty($_GET['id'])) {
        $id = $_GET['id'];
        $sql = "SELECT id, nom, img, fin, type_objet, indice, objet_bloquant, objet_libere, code, ST_AsGeoJSON(geom) AS geom, zoom_min FROM objets WHERE id = $1";
        $query = pg_query_params($link, $sql, [$id]);
        $results = pg_fetch_all($query, PGSQL_ASSOC);
    }
    else {
        $sql = "SELECT id, nom, img, fin,type_objet, indice, objet_bloquant, objet_libere, code, ST_AsGeoJSON(geom) AS geom, zoom_min FROM objets WHERE depart = TRUE";
        $query = pg_query($link, $sql);
        $results = pg_fetch_all($query, PGSQL_ASSOC);
    }

    Flight::json($results);
});


// Route pour enregistrer un score dans la base de données
Flight::route('POST /scores', function () {
    $link = Flight::get('db');

    $pseudo = $_POST['pseudo'];
    $temps = $_POST['temps'];
    $sql = "INSERT INTO scores (pseudo, temps) VALUES ($1, $2)";
    pg_query_params($link, $sql, [$pseudo, $temps]);
    Flight::json(['status' => 'success']);
});

Flight::route('GET /score', function () {
    $link = Flight::get('db');

    $sql = "SELECT pseudo, temps FROM scores ORDER BY temps DESC LIMIT 10 ";
    $query = pg_query($link, $sql);
    $results = pg_fetch_all($query);
    Flight::json($results);
});

Flight::start();

?>