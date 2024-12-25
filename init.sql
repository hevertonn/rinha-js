CREATE TABLE IF NOT EXISTS pessoas (
  id char(36),
  apelido varchar(32) UNIQUE PRIMARY KEY,
  nome varchar(100),
  nascimento date,
  stack varchar(1024),
  apelido_nome_stack varchar(1024) GENERATED ALWAYS AS (LOWER(apelido || ' ' || nome || ' ' || COALESCE(stack, ''))) STORED
);

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX query_search_idx ON pessoas USING GIST(apelido_nome_stack gist_trgm_ops);
