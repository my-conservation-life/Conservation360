INSERT INTO sponsor (name) VALUES ('Seneca Park Zoo');
INSERT INTO sponsor (name) VALUES ('Bronx Zoo');

INSERT INTO project (sponsor_id, name) VALUES (1, 'Madagascar Reforesting Project');
INSERT INTO project (sponsor_id, name) VALUES (1, 'Lemur Protection');
INSERT INTO project (sponsor_id, name) VALUES (2, 'Bison Protection');

INSERT INTO asset_type (name) VALUES ('Tree');
INSERT INTO asset_type (name) VALUES ('Lemur');
INSERT INTO asset_type (name) VALUES ('Bison');

-- 
-- Properties
-- Tree
INSERT INTO property
    (asset_type_id, name, data_type, required, is_private)
VALUES
    (1, 'height', 'number', false, false);

INSERT INTO property
    (asset_type_id, name, data_type, required, is_private)
VALUES
    (1, 'planted_date', 'datetime', false, false);

-- Bison
INSERT INTO property
    (asset_type_id, name, data_type, required, is_private)
VALUES
    (3, 'herd_size', 'number', true, true);