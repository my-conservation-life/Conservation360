INSERT INTO project (sponsor_id, name) VALUES (1, 'African Elephant Conservation');

INSERT INTO asset_type (name)
VALUES ('Elephant');

INSERT INTO property
    (asset_type_id, name, data_type, required, is_private)
VALUES
    (5, 'weight', 'number', false, false);

INSERT INTO asset (project_id, asset_type_id, location)
SELECT 3, 5, ST_MakePoint(random_between(-16.80, -16.15), random_between(37.90, 38.78))
FROM generate_series(1, 30);