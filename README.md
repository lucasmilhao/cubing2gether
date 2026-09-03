<div align="center">

# 🧊 cubing2gether

**A rede social para a comunidade de speedcubing**

Conecte-se, compita e evolua com outros cubers ao vivo.

</div>

---

## 📖 Sobre o projeto

**cubing2gether** é uma rede social feita para speedcubers: um espaço para postar, seguir outros usuários, conversar em tempo real e — o grande diferencial — **competir ao vivo por vídeo** contra outra pessoa, resolvendo o mesmo scramble simultaneamente.

O projeto nasceu como TCC do curso Técnico em Informática (Fundatec) e combina uma interface inspirada no X/Twitter (dark mode) com ferramentas específicas para cubers, como geração oficial de scrambles (WCA), timer de resolução e gráficos de evolução de tempos.

## ✨ Funcionalidades

- **🔐 Autenticação** — cadastro/login local (JWT) e login com Google e redefinição de senha por e-mail
- **📰 Feed social** — postagens, curtidas, denúncias e upload de imagens/arquivos (Cloudinary)
- **👥 Seguidores** — seguir/deixar de seguir usuários, listas de seguidores e seguindo
- **💬 Chat** — conversas privadas e em grupo, com participantes e histórico de mensagens
- **🔔 Notificações** — avisos de curtidas, novos seguidores, mensagens etc.
- **⏱️ Timer de cubo (Practice)** — cronômetro de resolução com histórico de *solves*, penalidades (+2/DNF) e gráfico de evolução (D3)
- **🎲 Scrambles oficiais** — geração de embaralhamentos via **TNoodle (WCA)** para 3x3, 4x4, Megaminx e outros eventos, com visualização 3D (`cubing`/`twisty-player`)
- **🎥 Partidas ao vivo (Video)** — sala 1x1 com vídeo/áudio via **WebRTC**, sincronizada por **Socket.IO**: os dois usuários recebem o mesmo scramble e competem em tempo real
- **🌗 Tema claro/escuro** — troca de tema persistida via contexto React

## 🏗️ Arquitetura

O repositório é um monorepo dividido em duas aplicações principais:

```
cubing2gether/
├── backend/    # API REST em Java + Spring Boot
└── web/        # Frontend em React + TypeScript
```

Há ainda um pequeno servidor Node.js (`web/src/pages/video/connection.js`) responsável por sinalização WebRTC e sincronização de partidas via Socket.IO.

## 🛠️ Tecnologias

### Backend (`/backend`)
- **Java 21** + **Spring Boot**
- Spring Data JPA, Spring Security, Spring Validation, Spring Mail
- **MySQL** (via `mysql-connector-j`)
- **JWT** (`java-jwt` / `jjwt`) para autenticação
- **Cloudinary** para upload de arquivos/imagens
- **Google API Client** para login social
- **TNoodle-WCA** para geração oficial de scrambles
- Lombok

### Frontend (`/web`)
- **React 19** + **TypeScript** + **Vite**
- **React Router** para navegação
- **TanStack Query** (React Query) para consumo de dados
- **Axios** para requisições HTTP
- **Tailwind CSS** + `shadcn` para UI
- **Socket.IO Client** e **WebRTC** para as partidas ao vivo
- **D3.js** para gráficos de evolução de *solves*
- **cubing** / `twisty-player` para renderização 3D dos cubos
- **@react-oauth/google** para login com Google

### Servidor de sinalização (WebRTC)
- **Node.js** + **Express** + **Socket.IO**

## 🚀 Como rodar o projeto

### Pré-requisitos
- **Java 21** e **Maven**
- **Node.js** (18+) e npm
- **MySQL**
- Contas/credenciais de: Cloudinary, Google OAuth e um servidor SMTP (ex: Gmail) para envio de e-mails

### 1. Backend

```bash
cd backend
```

Configure suas próprias variáveis em `src/main/resources/application.properties` (não use as credenciais do repositório — elas são apenas exemplo/desenvolvimento):

```properties
spring.application.name=teste
spring.datasource.url=jdbc:mysql://localhost:3306/cubing2gether?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=SEU_USUARIO
spring.datasource.password=SUA_SENHA
spring.jpa.hibernate.ddl-auto=update
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

api.security.token.secret=SEU_SEGREDO_JWT

cloudinary.cloud-name=SEU_CLOUD_NAME
cloudinary.api-key=SUA_API_KEY
cloudinary.api-secret=SEU_API_SECRET

spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=SEU_EMAIL
spring.mail.password=SUA_SENHA_DE_APP
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

Rode a aplicação:

```bash
./mvnw spring-boot:run
```

> O `Dockerfile` do backend também instala o `TNoodle-WCA-1.2.3.jar` (incluso no repositório) como dependência local do Maven antes do build.

### 2. Servidor de sinalização (vídeo em tempo real)

```bash
cd web
node src/pages/video/connection.js
```

O servidor sobe por padrão na porta `3002`.

### 3. Frontend

```bash
cd web
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (padrão do Vite).

## 📂 Estrutura de pastas (resumo)

```
backend/src/main/java/com/example/teste/
├── config/          # Configurações (Cloudinary, Security)
├── controller/      # Endpoints REST
├── dto/             # Objetos de request/response
├── exception/       # Exceções customizadas
├── infra/security/  # JWT, filtros de segurança
├── model/           # Entidades JPA
├── repository/      # Repositórios Spring Data
├── service/         # Regras de negócio
└── type/            # Enums

web/src/
├── components/      # Componentes reutilizáveis (chat, post, header, mapa etc.)
├── hooks/           # Hooks de dados (React Query) por domínio
├── pages/           # Páginas/rotas da aplicação
├── interface/       # Tipos TypeScript
└── service/api.ts   # Configuração do Axios
```

## 🗺️ Principais rotas do frontend

| Rota | Descrição |
|---|---|
| `/` | Feed principal |
| `/auth/login` / `/auth/register` | Autenticação |
| `/user/:idUsuario` | Perfil do usuário |
| `/amigos` `/followers/:id` `/following/:id` | Seguidores/seguindo |
| `/practice` | Timer e treino com scrambles |
| `/chat/:idConversa` | Conversas |
| `/video/:roomId` | Partida ao vivo (vídeo + scramble sincronizado) |
| `/redefinir-senha` | Redefinição de senha |

## 👤 Autor

Desenvolvido por **Lucas Villarinho Milhão**
- GitHub: [@lucasmilhao](https://github.com/lucasmilhao)
- LinkedIn: [Lucas Villarinho Milhão](https://www.linkedin.com/in/lucas-villarinho-milh%C3%A3o-a63a1135a/)


To run, make sure you installed npm and tnoodle
npm install on view
set up tnoodle with this command:
mvn install:install-file \
  -Dfile=TNoodle-WCA-1.2.3.jar \
  -DgroupId=org.worldcubeassociation \
  -DartifactId=tnoodle \
  -Dversion=1.2.3 \
  -Dpackaging=jar


MUST have some database, in this project using MySQL;
