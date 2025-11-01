CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE public.objets
(
	id SERIAL PRIMARY KEY,
    nom character varying,
    img character varying,
	depart boolean DEFAULT FALSE,
	fin boolean DEFAULT FALSE,
	type_objet character varying,
	indice character varying DEFAULT NULL,
	objet_bloquant character varying DEFAULT NULL, 
	objet_libere integer DEFAULT NULL,
	code character varying DEFAULT NULL,
	geom geometry(Point,4326),
	zoom_min integer DEFAULT 0
);

ALTER TABLE IF EXISTS public.objets
    OWNER to postgres;

CREATE INDEX IF NOT EXISTS idx_geom_objet
    ON public.objets USING gist
    (geom)
    WITH (fillfactor=90, buffering=auto)
    TABLESPACE pg_default;

INSERT INTO public.objets (nom, img, depart, fin, type_objet, indice, objet_bloquant, objet_libere, code, geom, zoom_min)
VALUES 

-- DÉTROIT DE MALACCA

('Boussole ancienne', '../assets/img/boussole_malacca.png', TRUE, FALSE, 'récupérable',
 'Une boussole. Servira peut-être plus tard...',
 NULL, NULL, NULL,
 ST_SetSRID(ST_MakePoint(103.94, 1.045), 4326), 10),

('Coffre du Capitaine', '../assets/img/coffre_malacca.png', TRUE, TRUE, 'bloqué_par_code',
 'Je me souviens avoir laissé le code dans mon carnet... Mais où peut-il être ? ',
 NULL, NULL, 4321,
 ST_SetSRID(ST_MakePoint(101.45, 1.68), 4326), 10),

('Panneau du détroit de Malacca', '../assets/img/panneau.png', TRUE, FALSE, 'indication',
 'Je quitte Dumai vers Malacca, où plus de 80 000 navires s’entassent chaque année. 
 Les mangroves détruites et les traces de marées noires me rappellent les dangers de ces eaux. 
 Les anciens marins racontent que ceux qui s’y perdent mettent des semaines à retrouver la bonne route. 
 Pour continuer mon aventure, je devrai bientôt viser l’ouest, vers la mer Rouge. 
 <h4>→ Direction Bab-El-Mandeb, là où le pétrole et les routes du monde se croisent !</h4>',
 NULL, NULL, NULL,
 ST_SetSRID(ST_MakePoint(101.80, 2.52), 4326), 10),

-- DÉTROIT DE BAB-EL-MANDEB

('Clé de la cale', '../assets/img/cle_cale.png', FALSE, FALSE, 'récupérable',
 'Une clé ? Elle doit sans doute ouvrir quelque chose...',
 NULL, NULL, NULL,
 ST_SetSRID(ST_MakePoint(43.42, 12.65), 4326), 11),

('Coffre à carburant', '../assets/img/coffre_bab.png', FALSE, FALSE, 'bloqué_par_objet',
 'Ce coffre est scellé. Il me faudrait une clé...',
 'Clé de la cale', 6, NULL,
 ST_SetSRID(ST_MakePoint(43.25, 13.27), 4326), 11),

('Amulette du navigateur', '../assets/img/amulette.png', FALSE, FALSE, 'récupérable',
 'Trouvé dans le coffre à carburant. Il me servira sans doute plus tard...',
 NULL, NULL, NULL,
 ST_SetSRID(ST_MakePoint(43.25, 13.27), 4326), NULL),

('Panneau du détroit de Bab-El-Mandeb', '../assets/img/panneau.png', FALSE, FALSE, 'indication',
 'Ma route me mena ensuite au détroit de Bab el-Mandeb, large de 20 km et gardien de 10 % du pétrole mondial.
 Les tensions yéménites flottaient dans l’air et les récifs coralliens semblaient veiller jalousement sur ces eaux stratégiques. 
 Mais je savais que pour atteindre la gloire passée de l’EverGiven, 
 il me faudrait continuer vers le nord, où un canal légendaire m’ouvrirait la voie vers la Méditerranée…
 <h4>→ Suis le courant vers le nord, vers le canal de Suez.</h4>',
 NULL, NULL, NULL,
 ST_SetSRID(ST_MakePoint(42.73, 13.0), 4326), 11),

-- CANAL DE SUEZ

('Panneau du Canal de Suez', '../assets/img/panneau.png', FALSE, FALSE, 'indication',
 'Le canal de Suez, long de 193 km et parcouru par plus de 19 000 navires chaque année, est dangereux 
 à cause des pollutions chimiques et des accidents maritimes. Même un capitaine expérimenté comme moi 
 doit garder l’œil ouvert, surtout quand je pense aux conflits passés, comme la guerre du Kippour de 
 1973 qui bloqua ce passage stratégique. L’horizon me rappelle qu’après ce canal.
 <h4>→ Assez parlé mousaillon ! Cap à l’Ouest, vers Gibraltar, la porte entre deux mers.</h4>',
 NULL, NULL, NULL,
 ST_SetSRID(ST_MakePoint(32.57, 30.17), 4326), 12),

('Plan du cargo Ever Given', '../assets/img/plan.png', FALSE, FALSE, 'code',
 NULL,
 NULL, NULL, 'Un vieux plan une suite de chiffres semblent être inscrite : En mémoire de la guerre, 1973',
 ST_SetSRID(ST_MakePoint(32.550, 29.967), 4326), 12),

-- DÉTROIT DE GIBRALTAR

('Porte du port', '../assets/img/port.png', FALSE, FALSE, 'bloqué_par_code',
 'La porte semble bloquée par un code... On peut y lire l’inscription suivante : ce fut une crise énergétique mondiale,
 un véritable blocage commercial et une guerre sans précédent ! Mais quand est ce que c’était déjà ?',
 NULL, 11, 1973,
 ST_SetSRID(ST_MakePoint(-5.61, 36.00), 4326), 13),

('Coffret du navigateur', '../assets/img/coffret_navigateur.png', FALSE, FALSE, 'bloqué_par_objet',
 'Mon amulette me permet d’obtenir de précieuses informations',
 'Amulette du navigateur', 12, NULL,
 ST_SetSRID(ST_MakePoint(-5.60, 36.01), 4326), NULL),

('Panneau du détroit de Gibraltar', '../assets/img/panneau.png', FALSE, FALSE, 'indication',
 'Le vent me porta vers le détroit de Gibraltar, large de 14 km, passage séculaire entre l’Europe et l’Afrique.
 L’Histoire semblait flotter dans chaque vague, mais les espèces invasives et la pollution maritime
 rappelaient que le danger rôdait partout. Les anciens marins murmuraient que ceux qui franchissent ce 
 passage sentent déjà l’appel des océans lointains. 
 <h4>→ Mon regard se tourna alors vers l’ouest, où une autre voie stratégique, reliant deux océans, me conduirait vers de nouvelles aventures…</h4>',
 NULL, NULL, NULL,
 ST_SetSRID(ST_MakePoint(-5.60, 36.01), 4326), NULL),

-- CANAL DE PANAMA

('Panneau du détroit de Gibraltar', '../assets/img/panneau.png', FALSE, FALSE, 'indication',
 'Je franchis ensuite le canal de Panama, long de 80 km et fréquenté par 14 000 navires chaque année, 
 reliant l’Atlantique au Pacifique. Les écosystèmes fragiles des rivières et marais m’inspiraient le respect,
 Je m’y arrêtai quelques jours, le temps d’y consigner mes aventures dans mon journal, profiter d’une taverne proche des portes de l’écluse pour ne rien oublier.
 <h4>→ C’est ici que je crois avoir égaré mon carnet...</h4>',
 NULL, NULL, NULL,
 ST_SetSRID(ST_MakePoint(-79.62, 9.03), 4326), NULL),

('Portes de l’écluse', '../assets/img/porte.png', FALSE, FALSE, 'bloqué_par_objet',
 'Les lourdes portes de l’écluse sont bloquées. Un espace circulaire semble s’y trouver à quoi cela peut-il bien correspondre...',
 'Boussole ancienne', 14, NULL,
 ST_SetSRID(ST_MakePoint(-79.70, 9.05), 4326), 11),

('Carnet du capitaine', '../assets/img/carnet.png', FALSE, FALSE, 'code',
 NULL,
 NULL, NULL, 'Un carnet humide où figure une note : “Code du coffre de Malacca : 4 3 2 1.”',
 ST_SetSRID(ST_MakePoint(-79.49, 9.00), 4326), NULL);

