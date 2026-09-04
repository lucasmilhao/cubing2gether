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
import { useParticipantesConversa } from "../../hooks/chat/conversa/useParticipantesConversa";
import { useConversaEdit } from "../../hooks/chat/conversa/useConversaEdit";
import type { ConversaResponseProps } from "../../interface/ConversaResponse";
import { useConviteCreate } from "../../hooks/chat/conversa/useConviteCreate";
import { ParticipantesSidebar } from "../../components/sidebar/SidebarParticipantes";

export function Conversa() {
    const { idConversa } = useParams();
    const { data: mensagens } = useMensagemData(idConversa);
    const { data: conversa } = useConversaData(idConversa);
    const { mutate: removerParticipante } = useRemoverParticipante();
    const { data: dataParticipantes } = useParticipantesConversa(idConversa);
    const { mutate: criarConvite } = useConviteCreate();
    const enviaMensagem = useMensagemPost();
    const { data: usuarioLogado } = useUsuarioLogado();
    const { mutate: editarConversa } = useConversaEdit();
    const [texto, setTexto] = useState("");
    const menuRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isOptionOpen, setOptionOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const qtdParticipantes = conversa?.participantes?.length ?? 0;
    const user = conversa?.participantes?.at(0)?.id === usuarioLogado?.id ? conversa?.participantes?.at(1) : conversa?.participantes?.at(0)
    const nomeConversa = qtdParticipantes > 2 ? conversa?.nome : user?.nome;

    const isAdmin = dataParticipantes?.find(e => e.usuario.id === usuarioLogado?.id)?.isAdmin;

    console.log(isAdmin);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    const editar = () => {
        const props: ConversaResponseProps = {
            idConversa,
            nome: conversa?.nome,
            isPublico: !conversa?.isPublico
        }

        editarConversa(props);
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
                    {qtdParticipantes > 2 ?
                        <div className="convite-members__avatars">
                            {conversa?.participantes?.slice(0, 3).map(
                                (participante, index) => (
                                    <img
                                        key={index}
                                        src={
                                            participante.picture ||
                                            "/default-profile.png"
                                        }
                                        alt=""
                                    />
                                )
                            )}
                        </div> : <img style={{ width: 45, height: 45, borderRadius: "50%", objectFit: 'cover' }} src={user?.picture} alt="" />}
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
                            <button onClick={() => setIsSidebarOpen(prev => !prev)}>
                                Detalhes
                            </button>
                            {isAdmin && (
                                <>
                                    <button onClick={editar}>
                                        {conversa?.isPublico ? "Tornar privado" : "Tornar público"}
                                    </button>
                                </>
                            )
                            }
                            {conversa?.isPublico && <button onClick={() => criarConvite(idConversa ?? "", {
                                onSuccess: (response: any) => {
                                    navigator.clipboard.writeText(response.link)
                                        .then(() => window.alert("Copiado com sucesso"))

                                }
                            })}>Compartilhar grupo</button>}
                            <button onClick={remover} style={{ color: "#ff5b5bc2" }}>
                                {qtdParticipantes > 2 ? "Sair do grupo" : "Remover conversa"}
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

            <ParticipantesSidebar key={conversa?.idConversa}  isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(prev => !prev)} conversa={conversa}/>

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