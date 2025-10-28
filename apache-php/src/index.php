<?php

declare(strict_types=1);

require_once 'flight/Flight.php';

Flight::route('/', function() {
    Flight::render('accueil');
});

Flight::route('/jeu', function() {
    Flight::render('jeu');
});

Flight::route('/hall_of_fame', function() {
    Flight::render('hall_of_fame');
});

Flight::route('/info', function() {
    Flight::render('info');
});

Flight::route('/test-db', function () {
    $host = 'db';
    $port = 5432;
    $dbname = 'mydb';
    $user = 'postgres';
    $pass = 'postgres';

    // Connexion BDD
    $link = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$pass");

    $sql = "SELECT * FROM objets";
    $query = pg_query($link, $sql);
    $results = pg_fetch_all($query);
    Flight::json($results);
});

Flight::route('GET /objets', function () {
    $host = 'db';
    $port = 5432;
    $dbname = 'mydb';
    $user = 'postgres';
    $pass = 'postgres'; 

    $link = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$pass");

    if (isset($_GET['id']) && !empty($_GET['id'])) {
        $N = $_GET['id'];
        $sql = "SELECT id, nom, img, type_objet, indice, objet_bloquant, objet_libere, code, ST_AsGeoJSON(geom) AS geom, zoom_min FROM objets WHERE id = '" . $N . "'";
        $query = pg_query($link, $sql);
        $results = pg_fetch_all($query);
    }

    else if (isset($_GET['zoom']) && !empty($_GET['zoom'])) {
        $zoom = $_GET['zoom'];
        $sql = "SELECT id, nom, img, type_objet, indice, objet_bloquant, objet_libere, code, ST_AsGeoJSON(geom) AS geom, zoom_min FROM objets WHERE zoom_min <= '" . $zoom . "'";
        $query = pg_query($link, $sql);
        $results = pg_fetch_all($query);
    }

    else {
        $sql = "SELECT id, nom, img, type_objet, indice, objet_bloquant, objet_libere, code, ST_AsGeoJSON(geom) AS geom, zoom_min FROM objets WHERE depart = TRUE";
        $query = pg_query($link, $sql);
        $results = pg_fetch_all($query);
    }

    Flight::json($results);
});

Flight::route('POST /score', function () {
    $host = 'db';
    $port = 5432;
    $dbname = 'mydb';
    $user = 'postgres';
    $pass = 'postgres';
    $link = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$pass");

    $pseudo = $_POST['pseudo'];
    $score = $_POST['score'];
    $sql = "INSERT INTO scores (pseudo, score) VALUES ('$pseudo', $score)";
    pg_query($link, $sql);
    Flight::json(['status' => 'success']);
});

Flight::route('GET /score', function () {
    $host = 'db';
    $port = 5432;
    $dbname = 'mydb';
    $user = 'postgres';
    $pass = 'postgres';
    $link = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$pass");

    $sql = "SELECT pseudo, score FROM scores ORDER BY score DESC LIMIT 10";
    $query = pg_query($link, $sql);
    $results = pg_fetch_all($query);
    Flight::json($results);
    Flight::render('hall_of_fame');
});
Flight::start();

?>