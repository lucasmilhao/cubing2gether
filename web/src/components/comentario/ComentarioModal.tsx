import { useEffect, useState } from "react";
import type { ComentarioProps } from "../../hooks/postagem/usePostagemData";
import "./ComentarioModal.css";
import { formatarTempoRelativo } from "../postagem/PostCard";
import { useComentarioPost, type ComentarioRequest } from "../../hooks/postagem/useComentarioPost";
import { BalloonIcon } from "lucide-react";

interface CommentModalProps {
    comentarios: ComentarioProps[];
    idPostagem: string;
    idUsuario: string | undefined;
    onClose: () => void;
}

export function CommentModal({
    comentarios,
    idPostagem,
    idUsuario,
    onClose,
}: CommentModalProps) {
    const [comentario, setComentario] = useState("");
    const { mutate: criarComentario } = useComentarioPost();

    const handleSubmit = () => {
        const props: ComentarioRequest = {
            conteudo: comentario,
            idPostagem,
            idUsuario
        }
        criarComentario(props);
    }

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

    const publicarComentario = () => {
        const texto = comentario.trim();

        if (!texto) return;

        // Aqui você chama sua mutation para criar comentário

        setComentario("");
    };

    return (
        <div
            className="comment-modal-overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="comment-modal">

                <header className="comment-modal__header">
                    <h2>Comentários</h2>

                    <button
                        type="button"
                        className="comment-modal__close"
                        onClick={onClose}
                        aria-label="Fechar comentários"
                    >
                        ×
                    </button>
                </header>

                <div className="comment-modal__content">
                    {comentarios.length === 0 ? (
                        <div className="comment-modal__empty">
                            <div className="comment-modal__empty-icon">
                                <BalloonIcon/>
                            </div>

                            <h3>Nenhum comentário ainda</h3>

                            <p>
                                Seja o primeiro a comentar nesta publicação.
                            </p>
                        </div>
                    ) : (
                        comentarios.map((comentario) => (
                            <div className="comment-wrapper" key={comentario.id}>

                                <div className="esquerda">

                                    <article className="comment-item">
                                        <div className="comment-item__avatar">
                                            {comentario.usuario.picture ? (
                                                <img
                                                    src={comentario.usuario.picture}
                                                    alt={comentario.usuario.nome}
                                                />
                                            ) : (
                                                <span>
                                                    {comentario.usuario.nome
                                                        ?.charAt(0)
                                                        .toUpperCase() ?? "U"}
                                                </span>
                                            )}
                                        </div>

                                        <div className="comment-item__body">
                                            <div className="comment-item__user">
                                                {comentario.usuario.nome}
                                            </div>

                                            <p>{comentario.conteudo}</p>
                                        </div>
                                    </article>

                                    <div className="created">
                                        <p>
                                            {formatarTempoRelativo(comentario.createdAt)}
                                        </p>
                                    </div>

                                </div>

                                <hr className="comment-divider" />

                            </div>
                        ))
                    )}
                </div>

                <form
                    className="comment-modal__form"
                    onSubmit={(event) => {
                        event.preventDefault();
                        publicarComentario();
                    }}
                >
                    <input
                        type="text"
                        value={comentario}
                        onChange={(event) => setComentario(event.target.value)}
                        placeholder="Adicione um comentário..."
                        maxLength={500}
                    />

                    <button
                        type="submit"
                        disabled={!comentario.trim()}
                        onClick={handleSubmit}
                    >
                        Publicar
                    </button>
                </form>
            </div>
        </div>
    );
}