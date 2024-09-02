-- Database generated with pgModeler (PostgreSQL Database Modeler).
-- pgModeler version: 1.2.0-alpha
-- PostgreSQL version: 15.0
-- Project Site: pgmodeler.io
-- Model Author: ---

-- Database creation must be performed outside a multi lined SQL file. 
-- These commands were put in this file only as a convenience.
-- 
-- object: alugue_quadras | type: DATABASE --
-- DROP DATABASE IF EXISTS alugue_quadras;
CREATE DATABASE alugue_quadras;
-- ddl-end --


-- object: geral | type: SCHEMA --
-- DROP SCHEMA IF EXISTS geral CASCADE;
CREATE SCHEMA geral;
-- ddl-end --
ALTER SCHEMA geral OWNER TO postgres;
-- ddl-end --

-- object: admin | type: SCHEMA --
-- DROP SCHEMA IF EXISTS admin CASCADE;
CREATE SCHEMA admin;
-- ddl-end --
ALTER SCHEMA admin OWNER TO postgres;
-- ddl-end --

-- object: gestao_quadra | type: SCHEMA --
-- DROP SCHEMA IF EXISTS gestao_quadra CASCADE;
CREATE SCHEMA gestao_quadra;
-- ddl-end --
ALTER SCHEMA gestao_quadra OWNER TO postgres;
-- ddl-end --

-- object: gestao_estabelecimento | type: SCHEMA --
-- DROP SCHEMA IF EXISTS gestao_estabelecimento CASCADE;
CREATE SCHEMA gestao_estabelecimento;
-- ddl-end --
ALTER SCHEMA gestao_estabelecimento OWNER TO postgres;
-- ddl-end --

-- object: perfil | type: SCHEMA --
-- DROP SCHEMA IF EXISTS perfil CASCADE;
CREATE SCHEMA perfil;
-- ddl-end --
ALTER SCHEMA perfil OWNER TO postgres;
-- ddl-end --

-- object: auth | type: SCHEMA --
-- DROP SCHEMA IF EXISTS auth CASCADE;
CREATE SCHEMA auth;
-- ddl-end --
ALTER SCHEMA auth OWNER TO postgres;
-- ddl-end --

SET search_path TO pg_catalog,public,geral,admin,gestao_quadra,gestao_estabelecimento,perfil,auth;
-- ddl-end --

-- object: perfil.pessoa | type: TABLE --
-- DROP TABLE IF EXISTS perfil.pessoa CASCADE;
CREATE TABLE perfil.pessoa (
	idkey bigserial NOT NULL,
	idkey_usuario int8 NOT NULL,
	idkey_documento int8 NOT NULL,
	idkey_endereco int8,
	nome text,
	peso numeric(15,2),
	altura numeric(15,2),
	data_nascimento date,
	data_alteracao timestamp with time zone,
	CONSTRAINT pessoa_pk PRIMARY KEY (idkey)
);
-- ddl-end --
ALTER TABLE perfil.pessoa OWNER TO postgres;
-- ddl-end --

-- object: auth.acesso | type: TABLE --
-- DROP TABLE IF EXISTS auth.acesso CASCADE;
CREATE TABLE auth.acesso (
	idkey_tipo_usuario int8 NOT NULL,
	idkey_permissao int8 NOT NULL,
	idkey_modulo int8 NOT NULL

);
-- ddl-end --
ALTER TABLE auth.acesso OWNER TO postgres;
-- ddl-end --

-- object: auth.permissao | type: TABLE --
-- DROP TABLE IF EXISTS auth.permissao CASCADE;
CREATE TABLE auth.permissao (
	idkey bigserial NOT NULL,
	descricao text,
	CONSTRAINT permissao_pk PRIMARY KEY (idkey)
);
-- ddl-end --
ALTER TABLE auth.permissao OWNER TO postgres;
-- ddl-end --

-- object: auth.modulo | type: TABLE --
-- DROP TABLE IF EXISTS auth.modulo CASCADE;
CREATE TABLE auth.modulo (
	idkey bigserial NOT NULL,
	descricao text,
	CONSTRAINT modulo_pk PRIMARY KEY (idkey)
);
-- ddl-end --
ALTER TABLE auth.modulo OWNER TO postgres;
-- ddl-end --

-- object: geral.documento | type: TABLE --
-- DROP TABLE IF EXISTS geral.documento CASCADE;
CREATE TABLE geral.documento (
	idkey bigserial NOT NULL,
	idkey_tipo_documento int8 NOT NULL,
	path_arquivo text,
	CONSTRAINT documento_pk PRIMARY KEY (idkey)
);
-- ddl-end --
ALTER TABLE geral.documento OWNER TO postgres;
-- ddl-end --

-- object: geral.tipo_documento | type: TABLE --
-- DROP TABLE IF EXISTS geral.tipo_documento CASCADE;
CREATE TABLE geral.tipo_documento (
	idkey bigserial NOT NULL,
	descricao text,
	CONSTRAINT tipodocumento_pk PRIMARY KEY (idkey)
);
-- ddl-end --
ALTER TABLE geral.tipo_documento OWNER TO postgres;
-- ddl-end --

-- object: geral.contato | type: TABLE --
-- DROP TABLE IF EXISTS geral.contato CASCADE;
CREATE TABLE geral.contato (
	idkey bigserial NOT NULL,
	telefone text,
	CONSTRAINT contato_pk PRIMARY KEY (idkey)
);
-- ddl-end --
ALTER TABLE geral.contato OWNER TO postgres;
-- ddl-end --

-- object: perfil.pessoa_contato | type: TABLE --
-- DROP TABLE IF EXISTS perfil.pessoa_contato CASCADE;
CREATE TABLE perfil.pessoa_contato (
	idkey_pessoa int8 NOT NULL,
	idkey_contato int8 NOT NULL

);
-- ddl-end --
ALTER TABLE perfil.pessoa_contato OWNER TO postgres;
-- ddl-end --

-- object: geral.endereco | type: TABLE --
-- DROP TABLE IF EXISTS geral.endereco CASCADE;
CREATE TABLE geral.endereco (
	idkey bigserial NOT NULL,
	idkey_cidade int8 NOT NULL,
	bairro text,
	logradouro text,
	numero text,
	complemento text,
	localizacao_x text,
	localizacao_y text,
	CONSTRAINT endereco_pk PRIMARY KEY (idkey)
);
-- ddl-end --
ALTER TABLE geral.endereco OWNER TO postgres;
-- ddl-end --

-- object: geral.cidade | type: TABLE --
-- DROP TABLE IF EXISTS geral.cidade CASCADE;
CREATE TABLE geral.cidade (
	idkey bigserial NOT NULL,
	idkey_estado int8 NOT NULL,
	descricao text,
	codigoibge text,
	CONSTRAINT cidade_pk PRIMARY KEY (idkey)
);
-- ddl-end --
ALTER TABLE geral.cidade OWNER TO postgres;
-- ddl-end --

-- object: geral.estado | type: TABLE --
-- DROP TABLE IF EXISTS geral.estado CASCADE;
CREATE TABLE geral.estado (
	idkey bigserial NOT NULL,
	nome text,
	codigoibge text,
	CONSTRAINT estado_pk PRIMARY KEY (idkey)
);
-- ddl-end --
ALTER TABLE geral.estado OWNER TO postgres;
-- ddl-end --

-- object: gestao_estabelecimento.estabelecimento | type: TABLE --
-- DROP TABLE IF EXISTS gestao_estabelecimento.estabelecimento CASCADE;
CREATE TABLE gestao_estabelecimento.estabelecimento (
	idkey bigserial NOT NULL,
	idkey_endereco int8 NOT NULL,
	descricao text,
	faixa_preco numeric(15,2),
	CONSTRAINT estabelecimento_pk PRIMARY KEY (idkey)
);
-- ddl-end --
ALTER TABLE gestao_estabelecimento.estabelecimento OWNER TO postgres;
-- ddl-end --

-- object: gestao_estabelecimento.rel_estabelecimento_contato | type: TABLE --
-- DROP TABLE IF EXISTS gestao_estabelecimento.rel_estabelecimento_contato CASCADE;
CREATE TABLE gestao_estabelecimento.rel_estabelecimento_contato (
	idkey_estabelecimento int8 NOT NULL,
	idkey_contato int8 NOT NULL

);
-- ddl-end --
ALTER TABLE gestao_estabelecimento.rel_estabelecimento_contato OWNER TO postgres;
-- ddl-end --

-- object: gestao_quadra.quadra | type: TABLE --
-- DROP TABLE IF EXISTS gestao_quadra.quadra CASCADE;
CREATE TABLE gestao_quadra.quadra (
	idkey bigserial NOT NULL,
	idkey_estabelecimento int8 NOT NULL,
	descricao text,
	idkey_piso int8,
	cobertura bool,
	preco_hora numeric(15,2),
	CONSTRAINT quadra_pk PRIMARY KEY (idkey)
);
-- ddl-end --
ALTER TABLE gestao_quadra.quadra OWNER TO postgres;
-- ddl-end --

-- object: gestao_quadra.reserva | type: TABLE --
-- DROP TABLE IF EXISTS gestao_quadra.reserva CASCADE;
CREATE TABLE gestao_quadra.reserva (
	idkey bigserial NOT NULL,
	idkey_quadra int8,
	idkey_evento int8,
	data_reserva date NOT NULL,
	horario_inicio timestamp NOT NULL,
	horario_fim timestamp NOT NULL,
	CONSTRAINT reserva_pk PRIMARY KEY (idkey)
);
-- ddl-end --
ALTER TABLE gestao_quadra.reserva OWNER TO postgres;
-- ddl-end --

-- object: gestao_quadra.rel_reserva_usuario | type: TABLE --
-- DROP TABLE IF EXISTS gestao_quadra.rel_reserva_usuario CASCADE;
CREATE TABLE gestao_quadra.rel_reserva_usuario (
	idkey_usuario int8 NOT NULL,
	idkey_reserva int8 NOT NULL

);
-- ddl-end --
ALTER TABLE gestao_quadra.rel_reserva_usuario OWNER TO postgres;
-- ddl-end --

-- object: gestao_quadra.rel_estabelecimento_usuario | type: TABLE --
-- DROP TABLE IF EXISTS gestao_quadra.rel_estabelecimento_usuario CASCADE;
CREATE TABLE gestao_quadra.rel_estabelecimento_usuario (
	idkey_estabelecimento int8 NOT NULL,
	idkey_usuario int8 NOT NULL

);
-- ddl-end --
ALTER TABLE gestao_quadra.rel_estabelecimento_usuario OWNER TO postgres;
-- ddl-end --

-- object: gestao_estabelecimento.rel_estabelecimento_servico | type: TABLE --
-- DROP TABLE IF EXISTS gestao_estabelecimento.rel_estabelecimento_servico CASCADE;
CREATE TABLE gestao_estabelecimento.rel_estabelecimento_servico (
	idkey bigserial NOT NULL,
	idkey_estabelecimento int8,
	idkey_servico int8,
	CONSTRAINT estabelecimento_servicos_pk PRIMARY KEY (idkey)
);
-- ddl-end --
ALTER TABLE gestao_estabelecimento.rel_estabelecimento_servico OWNER TO postgres;
-- ddl-end --

-- object: gestao_estabelecimento.servico | type: TABLE --
-- DROP TABLE IF EXISTS gestao_estabelecimento.servico CASCADE;
CREATE TABLE gestao_estabelecimento.servico (
	idkey bigserial NOT NULL,
	descricao text,
	CONSTRAINT servicos_pk PRIMARY KEY (idkey)
);
-- ddl-end --
ALTER TABLE gestao_estabelecimento.servico OWNER TO postgres;
-- ddl-end --

-- object: gestao_estabelecimento.avaliacao | type: TABLE --
-- DROP TABLE IF EXISTS gestao_estabelecimento.avaliacao CASCADE;
CREATE TABLE gestao_estabelecimento.avaliacao (
	idkey bigserial NOT NULL,
	idkey_usuario int8 NOT NULL,
	idkey_estabelecimento int8 NOT NULL,
	estrelas int8 NOT NULL,
	descricao text,
	CONSTRAINT avaliacao_pk PRIMARY KEY (idkey),
	CONSTRAINT usuario_unique UNIQUE (idkey_usuario)
);
-- ddl-end --
ALTER TABLE gestao_estabelecimento.avaliacao OWNER TO postgres;
-- ddl-end --

-- object: gestao_estabelecimento.promocao | type: TABLE --
-- DROP TABLE IF EXISTS gestao_estabelecimento.promocao CASCADE;
CREATE TABLE gestao_estabelecimento.promocao (
	idkey bigserial NOT NULL,
	idkey_estabelecimento int8 NOT NULL,
	descricao text,
	imagem_path text,
	ativo bool,
	data_cadastro timestamp,
	data_alteracao timestamp,
	CONSTRAINT promocao_pk PRIMARY KEY (idkey)
);
-- ddl-end --
ALTER TABLE gestao_estabelecimento.promocao OWNER TO postgres;
-- ddl-end --

-- object: gestao_estabelecimento.tipo_esporte | type: TABLE --
-- DROP TABLE IF EXISTS gestao_estabelecimento.tipo_esporte CASCADE;
CREATE TABLE gestao_estabelecimento.tipo_esporte (
	idkey bigserial NOT NULL,
	descricao text,
	CONSTRAINT tipo_esporte_pk PRIMARY KEY (idkey)
);
-- ddl-end --
ALTER TABLE gestao_estabelecimento.tipo_esporte OWNER TO postgres;
-- ddl-end --

-- object: gestao_estabelecimento.rel_estabelecimento_tipo_esporte | type: TABLE --
-- DROP TABLE IF EXISTS gestao_estabelecimento.rel_estabelecimento_tipo_esporte CASCADE;
CREATE TABLE gestao_estabelecimento.rel_estabelecimento_tipo_esporte (
	idkey_estabelecimento int8 NOT NULL,
	idkey_tipo_esporte int8 NOT NULL

);
-- ddl-end --
ALTER TABLE gestao_estabelecimento.rel_estabelecimento_tipo_esporte OWNER TO postgres;
-- ddl-end --

-- object: gestao_estabelecimento.rel_estabelecimento_horario_funcionamento | type: TABLE --
-- DROP TABLE IF EXISTS gestao_estabelecimento.rel_estabelecimento_horario_funcionamento CASCADE;
CREATE TABLE gestao_estabelecimento.rel_estabelecimento_horario_funcionamento (
	idkey bigserial NOT NULL,
	idkey_estabelecimento int8 NOT NULL,
	idkey_dia_semana int8 NOT NULL,
	horario_inicio timestamp NOT NULL,
	horario_encerramento timestamp NOT NULL,
	ativo bool

);
-- ddl-end --
ALTER TABLE gestao_estabelecimento.rel_estabelecimento_horario_funcionamento OWNER TO postgres;
-- ddl-end --

-- object: geral.dia_semana | type: TABLE --
-- DROP TABLE IF EXISTS geral.dia_semana CASCADE;
CREATE TABLE geral.dia_semana (
	idkey bigserial NOT NULL,
	descricao text,
	CONSTRAINT dia_semana_pk PRIMARY KEY (idkey)
);
-- ddl-end --
ALTER TABLE geral.dia_semana OWNER TO postgres;
-- ddl-end --

-- object: gestao_quadra.piso | type: TABLE --
-- DROP TABLE IF EXISTS gestao_quadra.piso CASCADE;
CREATE TABLE gestao_quadra.piso (
	idkey bigserial NOT NULL,
	descricao smallint,
	CONSTRAINT piso_pk PRIMARY KEY (idkey)
);
-- ddl-end --
ALTER TABLE gestao_quadra.piso OWNER TO postgres;
-- ddl-end --

-- object: admin.tipo_usuario | type: TABLE --
-- DROP TABLE IF EXISTS admin.tipo_usuario CASCADE;
CREATE TABLE admin.tipo_usuario (
	idkey bigserial NOT NULL,
	descricao text,
	CONSTRAINT tipo_usuario_pk PRIMARY KEY (idkey)
);
-- ddl-end --
ALTER TABLE admin.tipo_usuario OWNER TO postgres;
-- ddl-end --

-- object: admin.usuario | type: TABLE --
-- DROP TABLE IF EXISTS admin.usuario CASCADE;
CREATE TABLE admin.usuario (
	idkey bigserial NOT NULL,
	idkey_tipo_usuario int8,
	email text NOT NULL,
	senha text NOT NULL,
	data_cadastro timestamp NOT NULL DEFAULT now(),
	CONSTRAINT usuario_pk PRIMARY KEY (idkey),
	CONSTRAINT email_unique UNIQUE (email)
);
-- ddl-end --
ALTER TABLE admin.usuario OWNER TO postgres;
-- ddl-end --

INSERT INTO "admin".tipo_usuario
(idkey, descricao)
VALUES(1, 'Usuário');
-- object: fk_pessoa_usuario | type: CONSTRAINT --
-- ALTER TABLE perfil.pessoa DROP CONSTRAINT IF EXISTS fk_pessoa_usuario CASCADE;
ALTER TABLE perfil.pessoa ADD CONSTRAINT fk_pessoa_usuario FOREIGN KEY (idkey_usuario)
REFERENCES admin.usuario (idkey) MATCH FULL
ON DELETE CASCADE ON UPDATE RESTRICT;
-- ddl-end --

-- object: fk_pessoa_endereco | type: CONSTRAINT --
-- ALTER TABLE perfil.pessoa DROP CONSTRAINT IF EXISTS fk_pessoa_endereco CASCADE;
ALTER TABLE perfil.pessoa ADD CONSTRAINT fk_pessoa_endereco FOREIGN KEY (idkey_endereco)
REFERENCES geral.endereco (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_pessoa_documento | type: CONSTRAINT --
-- ALTER TABLE perfil.pessoa DROP CONSTRAINT IF EXISTS fk_pessoa_documento CASCADE;
ALTER TABLE perfil.pessoa ADD CONSTRAINT fk_pessoa_documento FOREIGN KEY (idkey_documento)
REFERENCES geral.documento (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_acesso_tipo_usuario | type: CONSTRAINT --
-- ALTER TABLE auth.acesso DROP CONSTRAINT IF EXISTS fk_acesso_tipo_usuario CASCADE;
ALTER TABLE auth.acesso ADD CONSTRAINT fk_acesso_tipo_usuario FOREIGN KEY (idkey_tipo_usuario)
REFERENCES admin.tipo_usuario (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_acesso_modulo | type: CONSTRAINT --
-- ALTER TABLE auth.acesso DROP CONSTRAINT IF EXISTS fk_acesso_modulo CASCADE;
ALTER TABLE auth.acesso ADD CONSTRAINT fk_acesso_modulo FOREIGN KEY (idkey_modulo)
REFERENCES auth.modulo (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_acesso_permissoes | type: CONSTRAINT --
-- ALTER TABLE auth.acesso DROP CONSTRAINT IF EXISTS fk_acesso_permissoes CASCADE;
ALTER TABLE auth.acesso ADD CONSTRAINT fk_acesso_permissoes FOREIGN KEY (idkey_permissao)
REFERENCES auth.permissao (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_documento_tipo_documento | type: CONSTRAINT --
-- ALTER TABLE geral.documento DROP CONSTRAINT IF EXISTS fk_documento_tipo_documento CASCADE;
ALTER TABLE geral.documento ADD CONSTRAINT fk_documento_tipo_documento FOREIGN KEY (idkey_tipo_documento)
REFERENCES geral.tipo_documento (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_pessoa_contato_pessoa | type: CONSTRAINT --
-- ALTER TABLE perfil.pessoa_contato DROP CONSTRAINT IF EXISTS fk_pessoa_contato_pessoa CASCADE;
ALTER TABLE perfil.pessoa_contato ADD CONSTRAINT fk_pessoa_contato_pessoa FOREIGN KEY (idkey_pessoa)
REFERENCES perfil.pessoa (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_pessoa_contato_contato | type: CONSTRAINT --
-- ALTER TABLE perfil.pessoa_contato DROP CONSTRAINT IF EXISTS fk_pessoa_contato_contato CASCADE;
ALTER TABLE perfil.pessoa_contato ADD CONSTRAINT fk_pessoa_contato_contato FOREIGN KEY (idkey_contato)
REFERENCES geral.contato (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_endereco_cidade | type: CONSTRAINT --
-- ALTER TABLE geral.endereco DROP CONSTRAINT IF EXISTS fk_endereco_cidade CASCADE;
ALTER TABLE geral.endereco ADD CONSTRAINT fk_endereco_cidade FOREIGN KEY (idkey_cidade)
REFERENCES geral.cidade (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_cidade_estado | type: CONSTRAINT --
-- ALTER TABLE geral.cidade DROP CONSTRAINT IF EXISTS fk_cidade_estado CASCADE;
ALTER TABLE geral.cidade ADD CONSTRAINT fk_cidade_estado FOREIGN KEY (idkey_estado)
REFERENCES geral.estado (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_estabelecimento_endereco | type: CONSTRAINT --
-- ALTER TABLE gestao_estabelecimento.estabelecimento DROP CONSTRAINT IF EXISTS fk_estabelecimento_endereco CASCADE;
ALTER TABLE gestao_estabelecimento.estabelecimento ADD CONSTRAINT fk_estabelecimento_endereco FOREIGN KEY (idkey_endereco)
REFERENCES geral.endereco (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_estabelecimento_contato_estabelecimento | type: CONSTRAINT --
-- ALTER TABLE gestao_estabelecimento.rel_estabelecimento_contato DROP CONSTRAINT IF EXISTS fk_estabelecimento_contato_estabelecimento CASCADE;
ALTER TABLE gestao_estabelecimento.rel_estabelecimento_contato ADD CONSTRAINT fk_estabelecimento_contato_estabelecimento FOREIGN KEY (idkey_estabelecimento)
REFERENCES gestao_estabelecimento.estabelecimento (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_estabelecimento_contato_contato | type: CONSTRAINT --
-- ALTER TABLE gestao_estabelecimento.rel_estabelecimento_contato DROP CONSTRAINT IF EXISTS fk_estabelecimento_contato_contato CASCADE;
ALTER TABLE gestao_estabelecimento.rel_estabelecimento_contato ADD CONSTRAINT fk_estabelecimento_contato_contato FOREIGN KEY (idkey_contato)
REFERENCES geral.contato (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_quadra_estabelecimento | type: CONSTRAINT --
-- ALTER TABLE gestao_quadra.quadra DROP CONSTRAINT IF EXISTS fk_quadra_estabelecimento CASCADE;
ALTER TABLE gestao_quadra.quadra ADD CONSTRAINT fk_quadra_estabelecimento FOREIGN KEY (idkey_estabelecimento)
REFERENCES gestao_estabelecimento.estabelecimento (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_quadra_piso | type: CONSTRAINT --
-- ALTER TABLE gestao_quadra.quadra DROP CONSTRAINT IF EXISTS fk_quadra_piso CASCADE;
ALTER TABLE gestao_quadra.quadra ADD CONSTRAINT fk_quadra_piso FOREIGN KEY (idkey_piso)
REFERENCES gestao_quadra.piso (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_reserva_quadra | type: CONSTRAINT --
-- ALTER TABLE gestao_quadra.reserva DROP CONSTRAINT IF EXISTS fk_reserva_quadra CASCADE;
ALTER TABLE gestao_quadra.reserva ADD CONSTRAINT fk_reserva_quadra FOREIGN KEY (idkey_quadra)
REFERENCES gestao_quadra.quadra (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_reserva_usuario_reserva | type: CONSTRAINT --
-- ALTER TABLE gestao_quadra.rel_reserva_usuario DROP CONSTRAINT IF EXISTS fk_reserva_usuario_reserva CASCADE;
ALTER TABLE gestao_quadra.rel_reserva_usuario ADD CONSTRAINT fk_reserva_usuario_reserva FOREIGN KEY (idkey_reserva)
REFERENCES gestao_quadra.reserva (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_reserva_usuario_usuario | type: CONSTRAINT --
-- ALTER TABLE gestao_quadra.rel_reserva_usuario DROP CONSTRAINT IF EXISTS fk_reserva_usuario_usuario CASCADE;
ALTER TABLE gestao_quadra.rel_reserva_usuario ADD CONSTRAINT fk_reserva_usuario_usuario FOREIGN KEY (idkey_usuario)
REFERENCES admin.usuario (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_estabelecimento_usuario_estabelecimento | type: CONSTRAINT --
-- ALTER TABLE gestao_quadra.rel_estabelecimento_usuario DROP CONSTRAINT IF EXISTS fk_estabelecimento_usuario_estabelecimento CASCADE;
ALTER TABLE gestao_quadra.rel_estabelecimento_usuario ADD CONSTRAINT fk_estabelecimento_usuario_estabelecimento FOREIGN KEY (idkey_estabelecimento)
REFERENCES gestao_estabelecimento.estabelecimento (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_estabelecimento_usuario_usuario | type: CONSTRAINT --
-- ALTER TABLE gestao_quadra.rel_estabelecimento_usuario DROP CONSTRAINT IF EXISTS fk_estabelecimento_usuario_usuario CASCADE;
ALTER TABLE gestao_quadra.rel_estabelecimento_usuario ADD CONSTRAINT fk_estabelecimento_usuario_usuario FOREIGN KEY (idkey_usuario)
REFERENCES admin.usuario (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_estabelecimento_servico_estabelecimento | type: CONSTRAINT --
-- ALTER TABLE gestao_estabelecimento.rel_estabelecimento_servico DROP CONSTRAINT IF EXISTS fk_estabelecimento_servico_estabelecimento CASCADE;
ALTER TABLE gestao_estabelecimento.rel_estabelecimento_servico ADD CONSTRAINT fk_estabelecimento_servico_estabelecimento FOREIGN KEY (idkey_estabelecimento)
REFERENCES gestao_estabelecimento.estabelecimento (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_estabelecimento_servico_servico | type: CONSTRAINT --
-- ALTER TABLE gestao_estabelecimento.rel_estabelecimento_servico DROP CONSTRAINT IF EXISTS fk_estabelecimento_servico_servico CASCADE;
ALTER TABLE gestao_estabelecimento.rel_estabelecimento_servico ADD CONSTRAINT fk_estabelecimento_servico_servico FOREIGN KEY (idkey_servico)
REFERENCES gestao_estabelecimento.servico (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_avaliacao_usuario | type: CONSTRAINT --
-- ALTER TABLE gestao_estabelecimento.avaliacao DROP CONSTRAINT IF EXISTS fk_avaliacao_usuario CASCADE;
ALTER TABLE gestao_estabelecimento.avaliacao ADD CONSTRAINT fk_avaliacao_usuario FOREIGN KEY (idkey_usuario)
REFERENCES admin.usuario (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_avaliacao_estabelecimento | type: CONSTRAINT --
-- ALTER TABLE gestao_estabelecimento.avaliacao DROP CONSTRAINT IF EXISTS fk_avaliacao_estabelecimento CASCADE;
ALTER TABLE gestao_estabelecimento.avaliacao ADD CONSTRAINT fk_avaliacao_estabelecimento FOREIGN KEY (idkey_estabelecimento)
REFERENCES gestao_estabelecimento.estabelecimento (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_promocao_estabelecimento | type: CONSTRAINT --
-- ALTER TABLE gestao_estabelecimento.promocao DROP CONSTRAINT IF EXISTS fk_promocao_estabelecimento CASCADE;
ALTER TABLE gestao_estabelecimento.promocao ADD CONSTRAINT fk_promocao_estabelecimento FOREIGN KEY (idkey_estabelecimento)
REFERENCES gestao_estabelecimento.estabelecimento (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_estabelecimento_tipo_esporte_tipo_esporte | type: CONSTRAINT --
-- ALTER TABLE gestao_estabelecimento.rel_estabelecimento_tipo_esporte DROP CONSTRAINT IF EXISTS fk_estabelecimento_tipo_esporte_tipo_esporte CASCADE;
ALTER TABLE gestao_estabelecimento.rel_estabelecimento_tipo_esporte ADD CONSTRAINT fk_estabelecimento_tipo_esporte_tipo_esporte FOREIGN KEY (idkey_tipo_esporte)
REFERENCES gestao_estabelecimento.tipo_esporte (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_estabelecimento_tipo_esporte_estabelecimento | type: CONSTRAINT --
-- ALTER TABLE gestao_estabelecimento.rel_estabelecimento_tipo_esporte DROP CONSTRAINT IF EXISTS fk_estabelecimento_tipo_esporte_estabelecimento CASCADE;
ALTER TABLE gestao_estabelecimento.rel_estabelecimento_tipo_esporte ADD CONSTRAINT fk_estabelecimento_tipo_esporte_estabelecimento FOREIGN KEY (idkey_estabelecimento)
REFERENCES gestao_estabelecimento.estabelecimento (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_estabelecimento_horario_funcionamento_estabelecimento | type: CONSTRAINT --
-- ALTER TABLE gestao_estabelecimento.rel_estabelecimento_horario_funcionamento DROP CONSTRAINT IF EXISTS fk_estabelecimento_horario_funcionamento_estabelecimento CASCADE;
ALTER TABLE gestao_estabelecimento.rel_estabelecimento_horario_funcionamento ADD CONSTRAINT fk_estabelecimento_horario_funcionamento_estabelecimento FOREIGN KEY (idkey_estabelecimento)
REFERENCES gestao_estabelecimento.estabelecimento (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_estabelecimento_horario_funcionamento_dia_semana | type: CONSTRAINT --
-- ALTER TABLE gestao_estabelecimento.rel_estabelecimento_horario_funcionamento DROP CONSTRAINT IF EXISTS fk_estabelecimento_horario_funcionamento_dia_semana CASCADE;
ALTER TABLE gestao_estabelecimento.rel_estabelecimento_horario_funcionamento ADD CONSTRAINT fk_estabelecimento_horario_funcionamento_dia_semana FOREIGN KEY (idkey_dia_semana)
REFERENCES geral.dia_semana (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: fk_usuario_tipousuario | type: CONSTRAINT --
-- ALTER TABLE admin.usuario DROP CONSTRAINT IF EXISTS fk_usuario_tipousuario CASCADE;
ALTER TABLE admin.usuario ADD CONSTRAINT fk_usuario_tipousuario FOREIGN KEY (idkey_tipo_usuario)
REFERENCES admin.tipo_usuario (idkey) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --


