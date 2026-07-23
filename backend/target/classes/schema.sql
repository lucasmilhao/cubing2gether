
create table usuario (
    id_usuario varchar(36) PRIMARY KEY not null,
    nome varchar(50) not null,
    email varchar(50) not null,
    senha varchar(250) not null,
    tipo varchar(20) not null,
    is_guest boolean default false,
    foto_perfil varchar(250)
);

create table solve (
    id_solve bigint PRIMARY KEY not null AUTO_INCREMENT,
    tempo_ms bigint not null,
    scramble varchar(450) not null,
    penalty varchar(50) check (penalty = '+2' or penalty = 'dnf' or penalty = NULL),
    id_usuario varchar(36),

    Foreign Key (id_usuario) REFERENCES usuario(id_usuario)
);

create table conversa (
    id_conversa varchar(36) primary key not null,
    nome varchar(32) not null,
    data_criado timestamp default current_timestamp
);

create table participantes_conversa (
    id varchar(36) primary key not null,
    id_conversa varchar(36),
    id_usuario varchar(36),
    entrou timestamp DEFAULT CURRENT_TIMESTAMP,

    foreign key id_conversa references conversa(id_conversa),
    foreign key id_usuario references usuario(id_usuario)
);

create table mensagem (
    id varchar(36) primary key not null,
    texto varchar(250),
    id_sender varchar(36),
    id_conversa varchar(36),
    mandado timestamp default current_time,

    foreign key (id_sender) REFERENCES usuario(id_usuario),
);

create table arquivo (
    id_arquivo varchar(36) primary key not null,
    nome varchar(150) not null,
    caminho varchar(250) not null
);