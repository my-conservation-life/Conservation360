INSERT INTO sponsor (name) VALUES ('Seneca Park Zoo Society');

CREATE OR REPLACE FUNCTION random_between(low DOUBLE PRECISION, high DOUBLE PRECISION) 
   RETURNS DOUBLE PRECISION AS
$$
BEGIN
   RETURN random() * (high - low) + low;
END;
$$ language 'plpgsql' STRICT;