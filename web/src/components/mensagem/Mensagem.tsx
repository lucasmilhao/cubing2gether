import type { MensagemResponse } from "../../interface/MensagemResponse"
import "./mensagens.css";
import { useNavigate } from "react-router-dom";
import Linkify from "react-linkify";
import { formatarTempoRelativo } from "../postagem/PostCard";

interface MensagemProps extends MensagemResponse {
    isOwnMessage?: boolean;
}

export const Mensagem = (props : MensagemProps) => {
    const user = props.sender;
    const navigate = useNavigate();


    return (
        <div className={`mensagem-container ${props.isOwnMessage ? 'own-message' : ''}`}>
            <div className="user-msg">
                <img onClick={() => navigate(`/user/${user.id}`)} src={user?.picture} alt="" />
                <div className="user-info">
                    <h3>{user?.nome}</h3>
                    <p className="info">{formatarTempoRelativo(props.mandado)}</p>
                </div>
            </div>
            <Linkify>
                <p className="mensagem-texto">{props.texto}</p>
            </Linkify>
        </div>
    )
}