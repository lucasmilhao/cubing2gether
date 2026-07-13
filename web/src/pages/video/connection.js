import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const rooms = new Map();

function getRoom(roomId) {
    if (!rooms.has(roomId)) {
        rooms.set(roomId, {
            scramble: null,
            users: new Map(),
            finished: new Set()
        });
    }
    return rooms.get(roomId);
}

io.on("connection", (socket) => {
    console.log("Usuário conectado");

    socket.onAny((event, ...args) => {
        console.log(event, args);
        
    }) 

    socket.on("join-room", ({ roomId, userId }) => {
        const room = getRoom(roomId);
        const numClients = room.users.size;

        console.log("Entrou na sala:", roomId);

        socket.data.roomId = roomId;
        socket.data.userId = userId;
        room.users.set(userId, socket.id);

        socket.join(roomId);

        if (numClients === 0) {
            socket.emit("created");
        } else {
            socket.emit("joined");
            socket.to(roomId).emit("user-connected");
        }

        if (room.scramble) {
            socket.emit("scramble", { scramble: room.scramble });
        }
    });

    socket.on("offer", ({ offer, roomId }) => {
        socket.to(roomId).emit("offer", { offer });
    });

    socket.on("answer", ({ answer, roomId }) => {
        socket.to(roomId).emit("answer", { answer });
    });

    socket.on("ice-candidate", ({ candidate, roomId }) => {
        socket.to(roomId).emit("ice-candidate", { candidate });
    });

    socket.on("scramble-created", ({ scramble, roomId }) => {
        const room = getRoom(roomId);
        if (room.scramble) {
            socket.emit("scramble", { scramble: room.scramble });
            return;
        }
        room.scramble = scramble;
        io.to(roomId).emit("scramble", { scramble });
    });

    socket.on("request-scramble", ({ roomId }) => {
        const room = getRoom(roomId);
        if (room.scramble) {
            socket.emit("scramble", { scramble: room.scramble });
        }
    });

    socket.on("solve-done", ({ roomId, userId }) => {
        console.log("SOLVE CONCLUIDA");
        
        const room = getRoom(roomId);
        room.finished.add(userId);

        socket.to(roomId).emit("opponent-finished", { userId });

        const totalJogadores = room.users.size;
        
        if (totalJogadores >= 2 && room.finished.size >= totalJogadores) {
            console.log("Rodada terminada");
            
            room.finished.clear();
            room.scramble = null;
            io.to(roomId).emit("round-complete");
        }
    });

    socket.on("disconnecting", () => {
        const { roomId, userId } = socket.data;

        socket.rooms.forEach((room) => socket.to(room).emit("user-disconnected"));

        if (roomId && rooms.has(roomId)) {
            const room = rooms.get(roomId);
            room.users.delete(userId);
            room.finished.delete(userId);
            if (room.users.size === 0) rooms.delete(roomId);
        }
    });
});

server.listen(3002, () => {
    console.log("Servidor rodando na porta 3002");
});