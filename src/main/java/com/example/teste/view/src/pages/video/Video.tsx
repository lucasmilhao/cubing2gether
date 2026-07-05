import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "./socket";
import { usePartidaUsuarioData } from "../../hooks/partidas/usePartidaUsuarioData";
import { useUsuarioLogado } from "../../hooks/usuario/useUsuarioLogado";
import { useScramble } from "../../hooks/useScramble";
import { puzzles } from "../Practice";
import { useSolveMutate } from "../../hooks/solves/useSolveMutate";
import type { SolveRequest } from "../../interface/SolveRequest";

export default function Video() {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(false);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const { roomId } = useParams();
    const { data: usuarioLogado } = useUsuarioLogado();
    const { data: dadosPartida } = usePartidaUsuarioData(roomId);
    const [connected, setConnected] = useState(false);
    const { refetch } = useScramble(puzzles[1]);
    const solve = useSolveMutate();
    const [scramble, setScramble] = useState("");
    const scrambleSentRef = useRef(false);

    //variaveis para timer
    let penalty: any = null;
    let [isPronto, setIsPronto] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const startTime = useRef(0);
    const timer = useRef<number | null>(null);
    const tempoCorrido = useRef(0);
    const [seconds, setSeconds] = useState("00.00");
    const [aguardandoOponente, setAguardandoOponente] = useState(false);

    function Update() {
        const currentTime = Date.now();
        tempoCorrido.current = currentTime - startTime.current;

        const seconds = Math.floor((tempoCorrido.current / 1000) % 60);
        const milis = Math.floor(tempoCorrido.current % 1000 / 10);
        setSeconds(`${seconds}.${milis}`);
    }

    function start() {
        if (!isRunning) {
            startTime.current = Date.now();
            timer.current = setInterval(Update, 16);
            setIsRunning(true);
        }
        else {
            stop();
        }
    }


    const submit = () => {
        const request: SolveRequest = {
            tempo: tempoCorrido.current,
            scramble,
            penalty,
            userId: usuarioLogado?.id
        }

        solve.mutate(request);
    }


    function stop() {
        submit();
        if (timer.current) clearInterval(timer.current);
        setIsRunning(false);
        setIsPronto(false);
        setAguardandoOponente(true);
        socket.emit("solve-done", {roomId, userId : usuarioLogado?.id})
    }

    const handleStart = () => {
        if(aguardandoOponente) return;

        if (isRunning) {
            stop();
        } else {
            setIsPronto(true);
        }
    }

    const handleEnd = () => {
        if (isPronto) {
            start();
        }
    }
    useEffect(() => {

        const keyHandlerUp = (e: KeyboardEvent) => {
            if (e.code !== "Space") return;

            e.preventDefault();

            handleEnd();
        };

        const keyHandlerDown = (e: KeyboardEvent) => {
            if (e.code !== "Space") return;
            e.preventDefault();

            handleStart();

        };

        window.addEventListener("keydown", keyHandlerDown);
        window.addEventListener("keyup", keyHandlerUp);
        return () => {
            window.removeEventListener("keydown", keyHandlerDown);
            window.removeEventListener("keyup", keyHandlerUp);
        };

    }, [isPronto, isRunning])

    useEffect(() => {
        if (!roomId || !usuarioLogado?.id) return;

        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        });
        peerConnection.current = pc;

        const setupLocalMedia = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }

            stream.getTracks().forEach((track) => pc.addTrack(track, stream));
        };

        const broadcastScramble = async () => {
            if (scrambleSentRef.current || !roomId) return;

            const response = await refetch();
            const nextScramble = response.data ?? "";

            if (nextScramble) {
                scrambleSentRef.current = true;
                setScramble(nextScramble);
                socket.emit("scramble-created", { scramble: nextScramble, roomId });
            }
        };

        const handleScrambleRoom = ({ scramble: incomingScramble }: { scramble: string }) => {
            if (incomingScramble) {
                scrambleSentRef.current = true;
                setScramble(incomingScramble);
            }
        };

        const handleRoundComplete = () => {
            scrambleSentRef.current = false;
            setAguardandoOponente(false);
            setScramble("");
            void broadcastScramble();
        }

        const handleJoinRoom = async () => {
            console.log("Entrou na sala");
            try {
                socket.emit("request-scramble", { roomId });
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket.emit("offer", { offer: pc.localDescription, roomId });
            } catch (error) {
                console.error("Erro ao criar offer:", error);
            }
        };

        const handleOffer = async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
            console.log("Recebeu offer");
            try {
                await pc.setRemoteDescription(offer);
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit("answer", { answer: pc.localDescription, roomId });
            } catch (error) {
                console.error("Erro ao processar offer:", error);
            }
        };

        const handleAnswer = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
            console.log("Recebeu answer");
            setConnected(true);
            try {
                await pc.setRemoteDescription(answer);
            } catch (error) {
                console.error("Erro ao processar answer:", error);
            }
        };

        const handleIce = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
            if (!candidate) return;
            console.log("Recebeu ICE");
            try {
                await pc.addIceCandidate(candidate);
            } catch (error) {
                console.error("Erro ao adicionar ICE candidate:", error);
            }
        };

        const handleUserDisconnected = () => {
            console.log("Usuário saiu");
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = null;
            }
            setConnected(false);
        };

        const attachRemoteStream = (event: RTCTrackEvent) => {
            console.log("Recebeu stream remota");
            const stream = event.streams[0] ?? new MediaStream([event.track]);
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = stream;
            }
            setConnected(true);
        };

        pc.ontrack = attachRemoteStream;
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("ice-candidate", {
                    candidate: event.candidate,
                    roomId
                });
            }
        };

        socket.on("created", () => {
            console.log("Criou sala");
            void broadcastScramble();
        });
        socket.on("joined", handleJoinRoom);
        socket.on("offer", handleOffer);
        socket.on("answer", handleAnswer);
        socket.on("ice-candidate", handleIce);
        socket.on("scramble", handleScrambleRoom);
        socket.on("user-disconnected", handleUserDisconnected);
        socket.on("round-complete", handleRoundComplete)
        
        const init = async () => {
            await setupLocalMedia();
            socket.emit("join-room", {roomId, userId : usuarioLogado.id});
        };
        init();
        
        return () => {
            socket.off("created");
            socket.off("joined", handleJoinRoom);
            socket.off("offer", handleOffer);
            socket.off("scramble", handleScrambleRoom);
            socket.off("answer", handleAnswer);
            socket.off("ice-candidate", handleIce);
            socket.off("user-disconnected", handleUserDisconnected);
            socket.off("round-complete", handleRoundComplete)

            if (peerConnection.current) {
                peerConnection.current.close();
                peerConnection.current = null;
            }

            if (localVideoRef.current?.srcObject) {
                const stream = localVideoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [roomId, usuarioLogado?.id]);

    console.log();


    return (
        <div>
            <video ref={localVideoRef} autoPlay playsInline muted width={300} />
            <p>{usuarioLogado?.nome}</p>
            <video ref={remoteVideoRef} autoPlay playsInline muted={isMuted} width={300} />
            {connected && <p>{dadosPartida?.at(1)?.usuario.nome === usuarioLogado?.nome ? dadosPartida?.at(0)?.usuario.nome : dadosPartida?.at(1)?.usuario.nome}</p>}
            <button onClick={() => setIsMuted((prev) => !prev)}>Mutar</button>

            <p>Scramble: {scramble}</p>
            <div className="container">
                <div>
                    <h1 className='timer' style={isRunning ? { color: 'green' } : { color: 'red' }} >{seconds}</h1>
                </div>
            </div>
        </div>
    );
}
