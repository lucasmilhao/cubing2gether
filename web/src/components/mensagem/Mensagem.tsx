import type { MensagemResponse } from "../../interface/MensagemResponse";
import "./mensagens.css";
import { useNavigate } from "react-router-dom";
import Linkify from "react-linkify";

interface MensagemProps extends MensagemResponse {
    isOwnMessage?: boolean;
}

export const Mensagem = (props: MensagemProps) => {
    const user = props.sender;
    const navigate = useNavigate();

    return (
        <div
            className={`mensagem-container ${
                props.isOwnMessage ? "own-message" : ""
            }`}
        >
            <div className="user-msg">
                <img
                    onClick={() => navigate(`/user/${user.id}`)}
                    src={user?.picture}
                    alt={user?.nome}
                />

                <div className="user-info">
                    <h3>{user?.nome}</h3>
                </div>
            </div>

            <Linkify>
                <p className="mensagem-texto">
                    {props.texto}
                </p>
            </Linkify>

            <div className="mensagem-footer">
                <span className="mensagem-hora">
                    {new Date(props.mandado).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>

                {props.isOwnMessage && (
                    <span
                        className={`mensagem-status ${
                            props.isVisto ? "visto" : "enviado"
                        }`}
                        aria-label={
                            props.isVisto
                                ? "Mensagem vista"
                                : "Mensagem não lida"
                        }
                    >
                        <CheckIcon visto={props.isVisto} />
                    </span>
                )}
            </div>
        </div>
    );
};

function CheckIcon({ visto }: { visto: boolean }) {
    return (
        <svg
            className="check-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                d="M4 12.5L9 17L20 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {visto && (
                <path
                    d="M9 12.5L14 17L22 9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            )}
        </svg>
    );
}