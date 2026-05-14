import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

io.on("connection", (socket) => {

    console.log("Usuário conectado");

    socket.on("join-room", (roomId) => {

        const room = io.sockets.adapter.rooms.get(roomId);

        const numClients = room ? room.size : 0;

        console.log("Entrou na sala:", roomId);

        socket.join(roomId);

        if (numClients === 0) {

            socket.emit("created");

        } else {

            socket.emit("joined");

            socket.to(roomId).emit("user-connected");
        }

    });

    socket.on("offer", ({ offer, roomId }) => {

        console.log("Enviando offer");

        socket.to(roomId).emit("offer", { offer });
    });

    socket.on("answer", ({ answer, roomId }) => {

        console.log("Enviando answer");

        socket.to(roomId).emit("answer", { answer });
    });

    socket.on("ice-candidate", ({ candidate, roomId }) => {

        socket.to(roomId).emit("ice-candidate", {
            candidate
        });
    });
    socket.on("disconnecting", () => {

        socket.rooms.forEach(room => {

            socket.to(room).emit("user-disconnected");

        });
    });





});

server.listen(3002, () => {
    console.log("Servidor rodando na porta 3002");
});