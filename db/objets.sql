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
 'Près de Singapour, les eaux se resserrent. Chaque jour, des milliers de navires risquent ici la collision ou la marée noire. 
 Ce passage est vital, mais fragile.  
 <h4>→ Direction Bab-El-Mandeb, là où le pétrole et les routes du monde se croisent !</h4>',
 NULL, NULL, NULL,
 ST_SetSRID(ST_MakePoint(101.80, 2.52), 4326), 10),

-- DÉTROIT DE BAB-EL-MANDEB

('Clé de la cale', '../assets/img/cle_cale.png', FALSE, FALSE, 'récupérable',
 'Une clé ? Elle doit sans doute ouvrir quelque chose...',
 NULL, NULL, NULL,
 ST_SetSRID(ST_MakePoint(43.42, 12.65), 4326), 10),

('Coffre à carburant', '../assets/img/coffre_bab.png', FALSE, FALSE, 'bloqué_par_objet',
 'Ce coffre est scellé. Il me faudrait une clé...',
 'Clé de la cale', 6, NULL,
 ST_SetSRID(ST_MakePoint(43.25, 13.27), 4326), 10),

('Amulette du navigateur', '../assets/img/amulette.png', FALSE, FALSE, 'récupérable',
 'Trouvé dans le coffre à carburant. Il me servira sans doute plus tard...',
 NULL, NULL, NULL,
 ST_SetSRID(ST_MakePoint(43.25, 13.27), 4326), NULL),

('Panneau du détroit de Bab-El-Mandeb', '../assets/img/panneau.png', FALSE, FALSE, 'indication',
 'Entre le Yémen et Djibouti, ce détroit est vital pour l’or noir. Les guerres et les tempêtes menacent les routes de la mer Rouge.  
 <h4>→ Suis le courant vers le nord, vers le canal de Suez.</h4>',
 NULL, NULL, NULL,
 ST_SetSRID(ST_MakePoint(42.73, 13.0), 4326), 10),

-- CANAL DE SUEZ

('Panneau du Canal de Suez', '../assets/img/panneau.png', FALSE, FALSE, 'indication',
 'Quand un navire se bloque ici, c’est le monde entier qui s’immobilise. Des centaines de milliards 
 reposent sur un passage large de quelques centaines de mètres. En octobre 1973, pendant la guerre du 
 Kippour opposant Israël à l’Égypte et à la Syrie, le Canal de Suez a été fermé et miné par les combats pendant plus de 2 ans.  
 <h4>→ Assez parlé mousaillon ! Cap à l’Ouest, vers Gibraltar, la porte entre deux mers.</h4>',
 NULL, NULL, NULL,
 ST_SetSRID(ST_MakePoint(32.57, 30.17), 4326), 10),

('Plan du cargo Ever Given', '../assets/img/plan.png', FALSE, FALSE, 'code',
 NULL,
 NULL, NULL, 'Un vieux plan une suite de chiffres semblent être inscrite : En mémoire de la guerre, 1973',
 ST_SetSRID(ST_MakePoint(32.550, 29.967), 4326), 10),

-- DÉTROIT DE GIBRALTAR

('Porte du port', '../assets/img/port.png', FALSE, FALSE, 'bloqué_par_code',
 'La porte semble bloquée par un code... On peut y lire l’inscription suivante : ce fut une crise énergétique mondiale,
 un véritable blocage commercial et une guerre sans précédent ! Mais quand est ce que c’était déjà ?',
 NULL, 11, 1973,
 ST_SetSRID(ST_MakePoint(-5.61, 36.00), 4326), 10),

('Coffret du navigateur', '../assets/img/coffret_navigateur.png', FALSE, FALSE, 'bloqué_par_objet',
 'Mon amulette me permet d’obtenir de précieuses informations',
 'Amulette du navigateur', 12, NULL,
 ST_SetSRID(ST_MakePoint(-5.60, 36.01), 4326), NULL),

('Panneau du détroit de Gibraltar', '../assets/img/panneau.png', FALSE, FALSE, 'indication',
 'Le pont entre deux mondes : l’Afrique et l’Europe. Ici, les dauphins croisent les pétroliers chaque jour.
 <h4>→ Le vent t’appelle… pars vers l’Ouest, vers le canal de Panama.</h4>',
 NULL, NULL, NULL,
 ST_SetSRID(ST_MakePoint(-5.60, 36.01), 4326), NULL),

-- CANAL DE PANAMA

('Portes de l’écluse', '../assets/img/porte.png', FALSE, FALSE, 'bloqué_par_objet',
 'Les lourdes portes de l’écluse sont bloquées. Un espace circulaire semble s’y trouver à quoi cela peut-il bien correspondre...',
 'Boussole ancienne', 14, NULL,
 ST_SetSRID(ST_MakePoint(-79.70, 9.05), 4326), 10),

('Carnet du capitaine', '../assets/img/carnet.png', FALSE, FALSE, 'code',
 NULL,
 NULL, NULL, 'Un carnet humide où figure une note : “Code du coffre de Malacca : 4 3 2 1.”',
 ST_SetSRID(ST_MakePoint(-79.49, 9.00), 4326), NULL);

