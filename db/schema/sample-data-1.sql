INSERT INTO sponsor (id, name) VALUES (1, 'Seneca Park Zoo Society');
INSERT INTO sponsor (id, name) VALUES (2, 'Bronx Zoo');
INSERT INTO project (id, sponsor_id, name) VALUES (1, 1, 'Madagascar Reforesting Project');
INSERT INTO project (id, sponsor_id, name) VALUES (2, 1, 'Lemur Protection');
INSERT INTO project (id, sponsor_id, name) VALUES (3, 2, 'Bison Protection');
INSERT INTO asset_type (id, name) VALUES (1, 'Tree');
INSERT INTO asset_type (id, name) VALUES (2, 'Lemur');
INSERT INTO asset_type (id, name) VALUES (3, 'Bison');

INSERT INTO asset (project_id, asset_type_id, location)
	SELECT 1, 1, ST_MakePoint(46 + ((random() - 0.5) * 4), -19 + ((random() - 0.5) * 4))
	FROM generate_series(1, 10);

INSERT INTO asset (project_id, asset_type_id, location)
	SELECT 2, 2, ST_MakePoint(46 + ((random() - 0.5) * 4), -19.8 + ((random() - 0.5) * 4))
	FROM generate_series(1, 10);

INSERT INTO asset (project_id, asset_type_id, location)
	SELECT 3, 3, ST_MakePoint(-110.814 + ((random() - 0.5) * 4), 38.109 + ((random() - 0.5) * 4))
	FROM generate_series(1, 10);
