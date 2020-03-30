INSERT INTO project (sponsor_id, name) VALUES (1, 'Madagascar Lemur Conservation');

INSERT INTO asset_type (name)
VALUES ('Ring Tailed Lemur'), ('Brown Mouse Lemur'), ('Silky Sifaka');

INSERT INTO property
    (asset_type_id, name, data_type, required, is_private)
VALUES
    (1, 'fur thickness', 'number', false, false);

INSERT INTO property
    (asset_type_id, name, data_type, required, is_private)
VALUES
    (2, 'year born', 'number', false, false);

INSERT INTO property
    (asset_type_id, name, data_type, required, is_private)
VALUES
    (3, 'fur color', 'text', false, false);

INSERT INTO asset (project_id, asset_type_id, location)
SELECT 1, 1, ST_MakePoint(random_between(46.844, 47.019), random_between(-22.127, -22.324))
FROM generate_series(1, 15);

INSERT INTO asset (project_id, asset_type_id, location)
SELECT 1, 2, ST_MakePoint(random_between(46.844, 47.019), random_between(-22.127, -22.324))
FROM generate_series(1, 15);

INSERT INTO asset (project_id, asset_type_id, location)
SELECT 1, 3, ST_MakePoint(random_between(46.844, 47.019), random_between(-22.127, -22.324))
FROM generate_series(1, 15);
