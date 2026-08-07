import { useState } from "react";
import { useFollowAmigosData } from "../../hooks/follow/useAmigosData";
import { useUsuarioLogado } from "../../hooks/usuario/useUsuarioLogado";
import { UsuarioCard } from "../usuario/UsuarioCard";
import type { UsuarioProps } from "../../interface/UsuarioProps";
import "./grupo-modal.css";
import type { ConversaRequestProps } from "../../interface/ConversaRequestProps";
import { useConversaCreate } from "../../hooks/chat/conversa/useConversaCreate";
import { useNavigate } from "react-router-dom";

interface GrupoModalProps {
    onClose: () => void;
}

export function GrupoModal({ onClose }: GrupoModalProps) {
    const { data: amigos } = useFollowAmigosData();
    const { data: usuarioLogado } = useUsuarioLogado();
    const { mutate: conversa } = useConversaCreate();
    const navigate = useNavigate();
    const [nomeGrupo, setNomeGrupo] = useState("");
    const [selecionados, setSelecionados] = useState<Map<string, UsuarioProps>>(new Map());

    const handleToggleSelect = (usuario: UsuarioProps) => {
        setSelecionados((prev) => {
            const next = new Map(prev);
            if (next.has(usuario.id)) {
                next.delete(usuario.id);
            } else {
                next.set(usuario.id, usuario);
            }
            return next;
        });
    };

    const handleConfirm = () => {
        submitConversa(nomeGrupo, Array.from(selecionados.values()))
    }

    const submitConversa = (nome: string, usuarios: UsuarioProps[]) => {
        let idsUsuarios = usuarios.map(e => e.id);
        if (usuarioLogado) {
            idsUsuarios.push(usuarioLogado?.id);
        }

        const props: ConversaRequestProps = {
            nome,
            idsUsuarios
        }

        conversa(props, {
            onSuccess: (data) => {
                navigate(`/chat/${data.idConversa}`)
                console.log(data.nome);
            }
        });
    }


    const amigosDisponiveis = amigos?.filter((e) => e.id !== usuarioLogado?.id) ?? [];

    return (
        <div className="grupo-modal-overlay" onClick={onClose}>
            <div className="grupo-modal-content" onClick={(event) => event.stopPropagation()}>
                <header className="grupo-modal-header">
                    <h2>Selecionar participantes</h2>
                    <button className="grupo-modal-close" onClick={onClose} aria-label="Fechar">
                        ×
                    </button>
                </header>

                <div className="grupo-modal-body">
                    {amigosDisponiveis.length > 0 ? (
                        amigosDisponiveis.map((e) => (
                            <UsuarioCard
                                usuario={e}
                                key={e.id}
                                selectable
                                selected={selecionados.has(e.id)}
                                onToggleSelect={handleToggleSelect}
                            />
                        ))
                    ) : (
                        <p className="grupo-modal-empty">Usuário sem amigos</p>
                    )}
                    {selecionados.size > 0 && (
                        <div className="grupo-modal-nome-wrapper">
                            <input
                                type="text"
                                className="grupo-modal-nome-input"
                                placeholder="Nome do grupo"
                                value={nomeGrupo}
                                onChange={(e) => setNomeGrupo(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                <footer className="grupo-modal-footer">
                    <span className="grupo-modal-count">
                        {selecionados.size} selecionado{selecionados.size !== 1 ? "s" : ""}
                    </span>
                    <button
                        className="grupo-modal-confirm-btn"
                        onClick={handleConfirm}
                        disabled={selecionados.size === 0}
                    >
                        Criar grupo
                    </button>
                </footer>
            </div>
        </div>
    );
}