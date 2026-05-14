import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "./socket";

export default function Video() {
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(false);
    const peerConnection = useRef<RTCPeerConnection | null>(null);
    const { roomId } = useParams();

    useEffect(() => {
        if (!roomId) return;

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

        const handleJoinRoom = async () => {
            console.log("Entrou na sala");
            try {
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
        };

        const attachRemoteStream = (event: RTCTrackEvent) => {
            console.log("Recebeu stream remota");
            const stream = event.streams[0] ?? new MediaStream([event.track]);
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = stream;
            }
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
        });
        socket.on("joined", handleJoinRoom);
        socket.on("offer", handleOffer);
        socket.on("answer", handleAnswer);
        socket.on("ice-candidate", handleIce);
        socket.on("user-disconnected", handleUserDisconnected);

        const init = async () => {
            await setupLocalMedia();
            socket.emit("join-room", roomId);
        };
        init();

        return () => {
            socket.off("created");
            socket.off("joined", handleJoinRoom);
            socket.off("offer", handleOffer);
            socket.off("answer", handleAnswer);
            socket.off("ice-candidate", handleIce);
            socket.off("user-disconnected", handleUserDisconnected);

            if (peerConnection.current) {
                peerConnection.current.close();
                peerConnection.current = null;
            }

            if (localVideoRef.current?.srcObject) {
                const stream = localVideoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [roomId]);

    return (
        <div>
            <video ref={localVideoRef} autoPlay playsInline muted width={300} />
            <p>sla</p>
            <video ref={remoteVideoRef} autoPlay playsInline muted={isMuted} width={300} />
            <button onClick={() => setIsMuted((prev) => !prev)}>Mutar</button>
        </div>
    );
}
