import { useEffect } from "react";
import "./NotificacaoModal.css"
import type NotificacaoProps from "../../interface/NotificacaoProps";
import { formatarTempoRelativo } from "../postagem/PostCard";

import {
    BellIcon,
    Heart,
    MessageCircle,
    UserPlus,
    Share2,
    Users,
    Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotificacaoLida } from "../../hooks/notificacao/useNotificacaoLida";

interface NotificacaoModalProps {
    notificacoes: NotificacaoProps[];
    onClose: () => void;
}

export function NotificacaoModal({
    notificacoes,
    onClose,
}: NotificacaoModalProps) {

    const { mutate: setNotificacaoLida } = useNotificacaoLida();
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    function getTipoNotificacao(notificacao: NotificacaoProps) {
        const tipo = notificacao.tipo;
        switch (tipo) {
            case "CURTIDA":
                return {
                    icone: <Heart size={18} />,
                    texto: "curtiu sua postagem",
                    classe: "notificacao-like",
                };

            case "COMENTARIO":
                return {
                    icone: <MessageCircle size={18} />,
                    texto: "comentou na sua postagem",
                    classe: "notificacao-comment",
                    caminho: `/user/${notificacao.usuario.id}?comentarios=true#post-${notificacao.referenciaId}`
                };

            case "SEGUIDOR":
            case "SEGUIU":
                return {
                    icone: <UserPlus size={18} />,
                    texto: "começou a seguir você",
                    classe: "notificacao-follow",
                    caminho: `/user/${notificacao.referenciaId}`
                };

            case "COMPARTILHAMENTO":
            case "COMPARTILHOU":
                return {
                    icone: <Share2 size={18} />,
                    texto: "compartilhou sua postagem",
                    classe: "notificacao-share",
                };

            case "GRUPO":
                return {
                    icone: <Users size={18} />,
                    texto: "adicionou você a um grupo",
                    classe: "notificacao-group",
                };

            default:
                return {
                    icone: <BellIcon size={18} />,
                    texto: "enviou uma mensagem",
                    classe: "notificacao-default",
                    caminho: `/chat/${notificacao.referenciaId}`
                };
        }
    }

    return (
        <div
            className="comment-modal-overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="comment-modal notificacao-modal">

                <header className="comment-modal__header">
                    <div className="notificacao-header-title">
                        <BellIcon size={22} />
                        <h2>Notificações</h2>
                    </div>

                    <button
                        type="button"
                        className="comment-modal__close"
                        onClick={onClose}
                        aria-label="Fechar notificações"
                    >
                        ×
                    </button>
                </header>

                <div className="comment-modal__content notificacoes-content">

                    {notificacoes.length === 0 ? (

                        <div className="comment-modal__empty">
                            <div className="comment-modal__empty-icon">
                                <BellIcon size={35} />
                            </div>

                            <h3>Nenhuma notificação ainda</h3>

                            <p>
                                Quando alguém interagir com você,
                                as notificações aparecerão aqui.
                            </p>
                        </div>

                    ) : (

                        notificacoes.toReversed().map((notificacao) => {

                            const tipo = getTipoNotificacao(notificacao);
                            console.log(tipo.caminho);


                            return (
                                <article
                                    onClick={() => {
                                        setNotificacaoLida(notificacao.id);

                                        if (tipo.caminho) {
                                            navigate(tipo.caminho);
                                            onClose();
                                        }
                                    }}
                                    className={`notificacao-item ${!notificacao.isLida
                                        ? "notificacao-nao-lida"
                                        : ""
                                        }`}
                                    key={notificacao.id}
                                >

                                    {/* Avatar */}
                                    <div className="notificacao-avatar">
                                        {notificacao.remetente?.picture ? (
                                            <img
                                                src={
                                                    notificacao.remetente.picture
                                                }
                                                alt={
                                                    notificacao.remetente.nome
                                                }
                                            />
                                        ) : (
                                            <span>
                                                {notificacao.remetente?.nome
                                                    ?.charAt(0)
                                                    .toUpperCase() ?? "U"}
                                            </span>
                                        )}
                                    </div>

                                    {/* Conteúdo */}
                                    <div className="notificacao-body">

                                        <div className="notificacao-top">

                                            <div className="notificacao-texto">

                                                <strong>
                                                    {notificacao.remetente?.nome ??
                                                        "Usuário"}
                                                </strong>

                                                <span className="notificacao-acao">
                                                    {tipo.texto}
                                                </span>

                                            </div>

                                            {!notificacao.isLida && (
                                                <span
                                                    className="notificacao-nao-lida-dot"
                                                    title="Não lida"
                                                />
                                            )}

                                        </div>

                                        {/* Mensagem */}
                                        {notificacao.mensagem && (
                                            <p className="notificacao-mensagem">
                                                {notificacao.mensagem}
                                            </p>
                                        )}

                                        {/* Informações adicionais */}
                                        <div className="notificacao-info">

                                            <span
                                                className={`notificacao-tipo ${tipo.classe}`}
                                            >
                                                {tipo.icone}
                                                {String(notificacao.tipo)}
                                            </span>

                                            <span className="notificacao-data">
                                                {formatarTempoRelativo(
                                                    notificacao.createdAt
                                                )}
                                            </span>

                                            {notificacao.isLida && (
                                                <span
                                                    className="notificacao-lida"
                                                    title="Notificação lida"
                                                >
                                                    <Check size={15} />
                                                    Lida
                                                </span>
                                            )}

                                        </div>

                                        {/* Referência */}
                                        {notificacao.referenciaId && (
                                            <div className="notificacao-referencia">
                                            </div>
                                        )}

                                    </div>

                                </article>
                            );
                        })
                    )}

                </div>
            </div>
        </div>
    );
}