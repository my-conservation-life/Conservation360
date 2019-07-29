INSERT INTO project (sponsor_id, name) VALUES (1, 'Madagascar Reforesting');

INSERT INTO asset_type (name) VALUES ('Tree');

INSERT INTO asset (project_id, asset_type_id, location)
SELECT 2, 4, ST_MakePoint(random_between(-16.8, -17.5), random_between(46, 47))
FROM generate_series(1, 20);
