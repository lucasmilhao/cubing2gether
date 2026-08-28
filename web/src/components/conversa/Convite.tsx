import { useParams, useNavigate } from "react-router-dom";
import { useConviteAccept } from "../../hooks/chat/conversa/useConviteAccept";
import { useEffect, useState } from "react";

import "./convite.css";
import { useConversaDataToken } from "../../hooks/chat/conversa/useConversaDataToken";
import { useUsuarioLogado } from "../../hooks/usuario/useUsuarioLogado";

export function Convite() {
    const { token } = useParams();
    const navigate = useNavigate();
    const {data : convite} = useConversaDataToken(token);
    const grupo = convite?.conversa;
    const {data : usuarioLogado} = useUsuarioLogado();

    console.log("Expira em: ", new Date(convite?.expiraEm ?? "").toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
    }));

    const { mutate: aceitarConvite, isPending } = useConviteAccept();
    const [erro, setErro] = useState(false);

    
    useEffect(() => {
        if(grupo?.participantes?.find(e => e.id === usuarioLogado?.id)) setErro(true);
    }, [grupo])

    const aceitar = () => {
        
        if (!token) {
            setErro(true);
            return;
        }

        aceitarConvite(token, {
            onError: () => {
                setErro(true);
            }
        });

        navigate(`/chat/${grupo?.idConversa}`);
    };

    if (erro) {
        return (
            <div className="convite-page">
                <div className="convite-card convite-card--erro">

                    <div className="convite-icon convite-icon--erro">
                        !
                    </div>

                    <h1>Convite inválido</h1>

                    <p>
                        Este convite pode ter expirado, sido removido
                        ou não existe mais.
                    </p>

                    <button
                        className="convite-button convite-button--secondary"
                        onClick={() => navigate("/")}
                    >
                        Voltar
                    </button>

                </div>
            </div>
        );
    }

    if (!grupo) {
        return (
            <div className="convite-page">
                <div className="convite-card">

                    <div className="convite-loading">
                        <div className="convite-spinner" />
                    </div>

                    <h1>Carregando convite...</h1>

                    <p>
                        Estamos verificando seu convite.
                    </p>

                </div>
            </div>
        );
    }

    const participantes = grupo.participantes?.slice(0, 4) ?? [];

    return (
        <div className="convite-page">

            <div className="convite-card">
            <div className="convite-card__accent"></div>

                {/* Avatar do grupo */}
                <div
                    className={`grupo-foto grupo-${Math.min(
                        participantes.length,
                        4
                    )}`}
                >
                    {participantes.map((participante, index) => (
                        <img
                            key={index}
                            src={
                                participante.picture ||
                                "/default-profile.png"
                            }
                            alt=""
                        />
                    ))}
                </div>

                <div className="convite-content">

                    <span className="convite-label">
                        CONVITE PARA GRUPO
                    </span>

                    <h1>
                        {grupo.nome}
                    </h1>

                    <p className="convite-description">
                        Você foi convidado para participar desta conversa.
                    </p>

                    <div className="convite-members">

                        <div className="convite-members__avatars">
                            {participantes.slice(0, 3).map(
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
                        </div>

                        <span>
                            {grupo.participantes?.length ?? 0}{" "}
                            {(grupo.participantes?.length ?? 0) === 1
                                ? "membro"
                                : "membros"}
                        </span>

                    </div>

                    <div className="convite-actions">

                        <button
                            type="button"
                            className="convite-button convite-button--accept"
                            onClick={aceitar}
                            disabled={isPending}
                        >
                            {isPending
                                ? "Entrando..."
                                : "Aceitar convite"}
                        </button>

                        <button
                            type="button"
                            className="convite-button convite-button--secondary"
                            onClick={() => navigate("/")}
                        >
                            Recusar
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}