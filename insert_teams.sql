INSERT INTO teams (name, created_at, updated_at) VALUES
('A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('B', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('C', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

 DELETE FROM teams
   WHERE id IN (
       SELECT id
       FROM (
           SELECT id,
                  ROW_NUMBER() OVER (PARTITION BY name ORDER BY created_at) as row_num
           FROM teams
       ) t
       WHERE t.row_num > 1
   );

-- INSERT INTO teams (name, created_at, updated_at)
-- SELECT 'A', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
-- WHERE NOT EXISTS (SELECT 1 FROM teams WHERE name = 'A');

-- INSERT INTO teams (name, created_at, updated_at)
-- SELECT 'B', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
-- WHERE NOT EXISTS (SELECT 1 FROM teams WHERE name = 'B');

-- INSERT INTO teams (name, created_at, updated_at)
-- SELECT 'C', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
-- WHERE NOT EXISTS (SELECT 1 FROM teams WHERE name = 'C');