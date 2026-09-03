import { useNavigate } from "react-router-dom";
import { useMensagemData } from "../../hooks/chat/mensagem/useMensagemData";
import { useUsuarioLogado } from "../../hooks/usuario/useUsuarioLogado";
import type { ConversaResponseProps } from "../../interface/ConversaResponse";
import { formatarTempoRelativo } from "../postagem/PostCard";
import "./conversa-card.css";

export function ConversaCard({ idConversa, nome, participantes }: ConversaResponseProps) {
  const { data: mensagens } = useMensagemData(idConversa);
  const { data: usuarioLogado } = useUsuarioLogado();
  const user = participantes?.at(0)?.id === usuarioLogado?.id ? participantes?.at(1) : participantes?.at(0)

  const navigate = useNavigate();

  const ultimaMensagem = mensagens?.at(-1);
  const avatarFallback = user?.nome?.charAt(0)?.toUpperCase() || "C";
  const previewText = ultimaMensagem?.texto || "Nenhuma mensagem ainda";
  const nomeConversa = participantes.length > 2 ? nome : user?.nome;

  return (
    <article onClick={() => navigate(`/chat/${idConversa}`)} className="conversa-card">
      <div className="conversa-card-avatar">
        {user?.picture ? (
          <img src={user.picture} alt={`Foto de ${user.nome || "contato"}`} />
        ) : (
          <span>{avatarFallback}</span>
        )}
      </div>

      <div className="conversa-card-content">
        <div className="conversa-card-header">
          <h3 className="conversa-card-name">{nomeConversa || "Conversa"}</h3>
          {ultimaMensagem ? (
            <span className="conversa-card-time">{formatarTempoRelativo(ultimaMensagem.mandado)}</span>
          ) : null}
        </div>

        <p className="conversa-card-preview">{previewText}</p>
      </div>
    </article>
  );
}