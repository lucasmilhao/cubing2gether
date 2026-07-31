import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "./socket";
import { usePartidaUsuarioData } from "../../hooks/partidas/usePartidaUsuarioData";
import { useUsuarioLogado } from "../../hooks/usuario/useUsuarioLogado";
import { useScramble } from "../../hooks/useScramble";
import { puzzles, segundos } from "../Practice";
import { useSolveMutate } from "../../hooks/solves/useSolveMutate";
import type { SolveRequest } from "../../interface/SolveRequest";
import { useSolveDataPartida } from "../../hooks/solves/useSolveDataPartida";
import "./video.css";
import { usePartidaUsuarioEdit } from "../../hooks/partidas/usePartidaUsuarioEdit";

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
    const {data : solvesPartida} = useSolveDataPartida(roomId);
    const [scramble, setScramble] = useState("");
    const scrambleSentRef = useRef(false);
    const partidaUsuario = usePartidaUsuarioEdit();

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

    console.log(scramble);
    

    const submit = () => {
        const request: SolveRequest = {
            tempo: tempoCorrido.current,
            scramble,
            penalty,
            userId: usuarioLogado?.id,
            partidaId : roomId
        }

        solve.mutate(request);

        
        partidaUsuario.mutate({
            idUsuario: usuarioLogado?.id,
            idPartida: roomId
        }, {
            onSuccess: (data) => {
                console.log("Média: ", segundos(data.media));
                
            }
        });
    }


    function stop() {
        socket.emit("solve-done", {roomId : roomId, userId : usuarioLogado?.id})
        submit();
        if (timer.current) clearInterval(timer.current);
        setIsRunning(false);
        setIsPronto(false);
        setAguardandoOponente(true);
    }

    const handleStart = () => {
        console.log(aguardandoOponente);
        
        if(aguardandoOponente) return;
        console.log("Começando start");
        

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

    }, [isPronto, isRunning, aguardandoOponente])

    useEffect(() => {
        if (!roomId || !usuarioLogado?.id) return;

        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        });
        peerConnection.current = pc;

        const setupLocalMedia = async () => {
            console.log("Setando os bagui aqui");
            
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
                setScramble(nextScramble.scramble);
                socket.emit("scramble-created", { scramble: nextScramble.scramble, roomId });
            }
        };

        const handleScrambleRoom = ({ scramble: incomingScramble }: { scramble: string }) => {
            if (incomingScramble) {
                scrambleSentRef.current = true;
                setScramble(incomingScramble);
            }
        };

        const handleRoundComplete = () => {
            console.log("O round foi completado!");
            
            scrambleSentRef.current = false;
            setAguardandoOponente(false);
            console.log(aguardandoOponente);
            
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

    const opponentName = connected && dadosPartida?.length
        ? dadosPartida.find((p) => p.usuario.nome !== usuarioLogado?.nome)?.usuario.nome ?? "Oponente"
        : "Oponente";

    const TwistyPlayer = 'twisty-player' as any;

    return (
        <div className="video-page">
            <div className="video-header">
                <div className="scramble-pill">{scramble || "Aguardando scramble..."}</div>
                <div className="video-actions">
                </div>
            </div>

            <div className="video-stage">
                <div className="video-grid">
                    <div className="video-panel">
                        <video ref={localVideoRef} autoPlay playsInline muted />
                        <div className="video-label">{usuarioLogado?.nome || "Você"}</div>
                    </div>
                    <div className="video-panel">
                        <video ref={remoteVideoRef} autoPlay playsInline muted={isMuted} />
                        <div className="video-label">{opponentName}

                        <button className="video-action-button" onClick={() => setIsMuted((prev) => !prev)}>
                            {isMuted ? "Desmutar" : "Mutar"}
                        </button>
                        </div>
                    </div>
                </div>

                <div className="video-overlay">
                    <h1 className={`timer ${isPronto ? "timer-running" : "timer-idle"}`}>
                        {seconds}
                    </h1>
                    
                    <TwistyPlayer
                        puzzle="3x3x3"
                        control-panel='none'
                        viewer-link='none'
                        experimental-setup-alg={scramble}
                        background='none'
                        visualization="2D"
                        className="cube"
                    ></TwistyPlayer>
                </div>
            </div>

            <div className="video-footer">
                <div className="recent-solves">
                    <h3>Solves recentes</h3>
                    <ul>
                        {(solvesPartida?.data ?? []).map((e) => (
                            <li key={e.id}>
                                <span>{e.user.nome} {segundos(e.tempo)}s</span>
                                <span>{e.scramble}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
    