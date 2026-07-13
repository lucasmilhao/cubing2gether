import type { MensagemResponse } from "../../interface/MensagemResponse"
import "./mensagens.css";
import { useNavigate } from "react-router-dom";
import Linkify from "react-linkify";

interface MensagemProps extends MensagemResponse {
    isOwnMessage?: boolean;
}

export const Mensagem = (props : MensagemProps) => {
    const user = props.sender;
    const navigate = useNavigate();


    return (
        <div className={`mensagem-container ${props.isOwnMessage ? 'own-message' : ''}`}>
            <div className="user-msg">
                <img onClick={() => navigate(`/user/${user.id}`)} src={`http://localhost:8080/uploads/${user?.fotoPerfil}`} alt="" />
                <div className="user-info">
                    <h3>{user?.nome}</h3>
                    <p className="info">{props.mandado}</p>
                </div>
            </div>
            <Linkify>
                <p className="mensagem-texto">{props.texto}</p>
            </Linkify>
        </div>
    )
}