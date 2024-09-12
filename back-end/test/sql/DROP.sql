SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'alugue_quadras_test'
  AND pid <> pg_backend_pid();

DROP DATABASE IF EXISTS alugue_quadras_test;

CREATE DATABASE alugue_quadras_test;