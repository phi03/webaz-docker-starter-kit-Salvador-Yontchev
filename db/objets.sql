CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE public.objets
(
	id SERIAL PRIMARY KEY,
    nom character varying,
    img character varying,
	depart boolean DEFAULT FALSE,
	type_objet character varying,
	indice character varying DEFAULT NULL,
	objet_bloquant character varying DEFAULT NULL, 
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

INSERT INTO public.objets (nom, img, depart, type_objet, indice, objet_bloquant, code, geom, zoom_min)
VALUES 
('Clef en or', '../assets/img/clef.png', TRUE, 'récupérable', NULL, NULL, NULL, ST_SetSRID(ST_MakePoint(2.3522,48.8566),4326), 10),
('Coffre mystérieux', '../assets/img/coffre.png', FALSE, 'bloqué_par_objet', 'Il faut la clef pour ouvrir', 'Clef en or', NULL, ST_SetSRID(ST_MakePoint(2.3600,48.8570),4326), 12),
('Parchemin codé', '../assets/img/parchemin.png', TRUE, 'code', NULL, NULL, '1234', ST_SetSRID(ST_MakePoint(2.3550,48.8580),4326), 10),
('Trésor final', '../assets/img/tresor.png', FALSE, 'bloqué_par_code', 'Entrez le code du parchemin', NULL, 1234, ST_SetSRID(ST_MakePoint(2.3580,48.8590),4326), 13);









	