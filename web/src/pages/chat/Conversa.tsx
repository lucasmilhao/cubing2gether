import { useNavigate, useParams } from "react-router-dom";
import { useMensagemData } from "../../hooks/chat/mensagem/useMensagemData";
import { useUsuarioLogado } from "../../hooks/usuario/useUsuarioLogado"
import { useMensagemPost } from "../../hooks/chat/mensagem/useMensagemPost";
import type { MensagemRequest } from "../../interface/MensagemRequest";
import { useState, useRef, useEffect } from "react";
import { Mensagem } from "../../components/mensagem/Mensagem";
import "./conversa.css";
import { useConversaData } from "../../hooks/chat/conversa/useConversaData";
import { ArrowLeft } from "lucide-react";
import { OptionsIcon } from "../../components/postagem/PostCard";
import { useRemoverParticipante, type ParticipantesRequest } from "../../hooks/chat/conversa/useRemoverParticipante";
import Swal from "sweetalert2";

export function Conversa() {
    const { idConversa } = useParams();
    const { data: mensagens } = useMensagemData(idConversa);
    const { data: conversa } = useConversaData(idConversa);
    const { mutate: removerParticipante } = useRemoverParticipante();
    const enviaMensagem = useMensagemPost();
    const { data: usuarioLogado } = useUsuarioLogado();
    const [texto, setTexto] = useState("");
    const menuRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isOptionOpen, setOptionOpen] = useState(false);
    const navigate = useNavigate();

    const user = conversa?.participantes?.at(0)?.id === usuarioLogado?.id ? conversa?.participantes?.at(1) : conversa?.participantes?.at(0)
    const nomeConversa = (conversa?.participantes?.length ?? 0) > 2 ? conversa?.nome : user?.nome;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {

        const handleClickFora = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setOptionOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickFora);
        scrollToBottom();

        return () => {
            document.removeEventListener("mousedown", handleClickFora);
        };
    }, [mensagens]);

    const enviar = (texto: string) => {
        if (!texto.trim()) return;

        const props: MensagemRequest = {
            texto,
            idSender: usuarioLogado?.id,
            idConversa
        }

        enviaMensagem.mutate(props);
        setTexto("");
    }

    const remover = () => {
        const props: ParticipantesRequest = {
            idConversa: conversa?.idConversa,
            idUsuario: usuarioLogado?.id
        }

        Swal.fire({
            draggable: true,
            title: `Sair desta conversa?`,
            text: "Sair desta conversa",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim",
            cancelButtonText: "Cancelar",
            confirmButtonColor: 'var(--accent-color)',
            cancelButtonColor: '#777777',
            iconColor: 'var(--accent-color)',

            customClass: {
                popup: 'swal-popup',
                title: 'swal-title',
                confirmButton: 'swal-confirm-button'
            }
        }).then((result) => {
            if (result.isConfirmed)
                removerParticipante(props, {
                    onSuccess: () => {
                        navigate("/");
                    }
                });
        })
    }

    return (
        <div className="conversa-container">
            <header className="conversa-header">
                <div className="chat-info">
                    <button className="back-button-chat" onClick={() => window.history.back()}>
                        <ArrowLeft />
                    </button>
                    <img style={{ width: 45, height: 45, borderRadius: "50%", objectFit: 'cover' }} src={user?.picture} alt="" />
                    <div className="nome-conversa">
                        <h1>{nomeConversa}</h1>
                        <div style={{ display: "flex", gap: 10 }} className="participantes">
                            {conversa?.participantes?.slice(0, 3).map(e => <p style={{ color: "#bdb6b6b9" }}>{e.nome}</p>)}
                            {(conversa?.participantes?.length && conversa.participantes.length > 3) && <p style={{ color: "#bdb6b6b9" }}>e mais {conversa.participantes.length - 3}</p>}
                        </div>
                    </div>
                </div>
                <div className="post-options options" ref={menuRef}>
                    <button onClick={() => setOptionOpen(prev => !prev)} className="action-btn options-btn">
                        <OptionsIcon />
                    </button>
                    {isOptionOpen && (
                        <div className="post-options-menu">
                            <button onClick={remover} style={{ color: "#ff5b5bc2" }}>
                                Sair do grupo
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <div className="mensagens-container">
                {mensagens?.map((e, index) => (
                    <Mensagem
                        key={e.id || index}
                        {...e}
                        isOwnMessage={e.sender?.id === usuarioLogado?.id}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="input-area">
                <input
                    placeholder="Digite sua mensagem..."
                    type="text"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key == "Enter") enviar(texto);
                    }}
                />
                <button
                    className="send-button"
                    onClick={() => enviar(texto)}
                    disabled={!texto.trim()}
                >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                </button>
            </div>
        </div>
    )
}