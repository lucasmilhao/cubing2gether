import { X } from "lucide-react";
import { UsuarioCard } from "../usuario/UsuarioCard";
import { useState } from "react";
import { OptionsIcon } from "../postagem/PostCard";
import type { ConversaResponseProps } from "../../interface/ConversaResponse";
import { useRemoverParticipante, type ParticipantesRequest } from "../../hooks/chat/conversa/useRemoverParticipante";
import { useParticipantesConversa } from "../../hooks/chat/conversa/useParticipantesConversa";
import { useUsuarioLogado } from "../../hooks/usuario/useUsuarioLogado";

interface ParticipantesSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    conversa?: ConversaResponseProps
}

export function ParticipantesSidebar({
    isOpen,
    onClose,
    conversa
}: ParticipantesSidebarProps) {
    if (!isOpen) return null;

    const { mutate: removerParticipante } = useRemoverParticipante();
    const { data: dataParticipantes } = useParticipantesConversa(conversa?.idConversa);
    const { data: usuarioLogado } = useUsuarioLogado();

    const isAdmin = dataParticipantes?.find(e => e.usuario.id === usuarioLogado?.id)?.isAdmin;
    const qtd = conversa?.participantes?.length ?? 0;
    const isGrupo = qtd > 2;
    const [optionOpenId, setOptionOpenId] = useState<string | null>(null);
    const remover = (idUsuario: string) => {
        const props: ParticipantesRequest = {
            idConversa: conversa?.idConversa,
            idUsuario: idUsuario
        }

        removerParticipante(props);
    }

    return (
        <>
            <div className="sidebar-overlay" onClick={onClose} />
            <aside className="participantes-sidebar">
                <div className="sidebar-header">
                    <h3>Detalhes</h3>
                    <button className="close-sidebar-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="sidebar-perfil">
                    {isGrupo ? (
                        <div
                            className={`grupo-foto grupo-${Math.min(qtd, 4)}`}
                        >
                            {conversa?.participantes?.slice(0, 4).map((p, index) => (
                                <img
                                    key={index}
                                    src={p.picture || "/default-profile.png"}
                                    alt=""
                                />
                            ))}
                        </div>
                    ) : (
                        <img
                            className="perfil-foto-unica"
                            src={
                                conversa?.participantes?.at(0)?.picture ||
                                "/default-profile.png"
                            }
                            alt=""
                        />
                    )}
                    <h2 className="sidebar-nome-conversa">{conversa?.nome}</h2>
                    <span className="sidebar-qtd">
                        {isGrupo
                            ? `${qtd} participantes`
                            : "Conversa direta"}
                    </span>
                </div>

                <div className="sidebar-lista-participantes">
                    <span className="lista-titulo">Participantes</span>
                    {conversa?.participantes?.map((participante) =>
                        usuarioLogado?.id !== participante.id ? (

                            <UsuarioCard
                                key={participante.id}
                                usuario={participante}
                                actions={
                                    <div className="post-options options">
                                        <button
                                            onClick={() =>
                                                setOptionOpenId(
                                                    optionOpenId === participante.id
                                                        ? null
                                                        : participante.id
                                                )
                                            }
                                            className="action-btn options-btn"
                                        >
                                            <OptionsIcon />
                                        </button>

                                        {optionOpenId === participante.id && (
                                            <div className="post-options-menu">
                                                {isAdmin && (
                                                    <button
                                                        onClick={() => remover(participante.id)}
                                                        style={{ color: "#ff5b5bc2" }}
                                                    >
                                                        {qtd > 2
                                                            ? "Remover da conversa"
                                                            : "Remover conversa"}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                }
                            />
                        )
                        
                        :

                        <UsuarioCard
                            key={participante.id}
                            usuario={participante}
                        />)}
                </div>
            </aside>
        </>
    );
}