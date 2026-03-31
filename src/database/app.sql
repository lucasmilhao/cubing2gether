CREATE DATABASE IF NOT EXISTS teste;
USE teste;

create table usuario (
    id_usuario varchar(36) PRIMARY KEY not null,
    nome varchar(50) not null,
    email varchar(50) not null,
    senha varchar(50) not null,
    foto_perfil varchar(250)
);

create table solve (
    id_solve bigint PRIMARY KEY not null AUTO_INCREMENT,
    tempo_ms bigint not null,
    scramble varchar(250) not null,
    penalty varchar(50) check (penalty = '+2' or penalty = 'dnf' or penalty = NULL),
    id_usuario varchar(36),

    Foreign Key (id_usuario) REFERENCES usuario(id_usuario)
);

use teste;
SELECT * from usuario;