import { useParticipantesConversa } from "../../hooks/chat/conversa/useParticipantesConversa";
import { useMensagemData } from "../../hooks/chat/mensagem/useMensagemData";
import { useUsuarioDataId } from "../../hooks/usuario/useUsuarioDataId";
import { useUsuarioLogado } from "../../hooks/usuario/useUsuarioLogado";
import type { ConversaResponseProps } from "../../interface/ConversaResponse";

export function ConversaCard({idConversa, nome, dataCriado} : ConversaResponseProps) {
    const {data : mensagens} = useMensagemData(idConversa);
    const {data : usuarioLogado} = useUsuarioLogado();
    const {data : participantes} = useParticipantesConversa(idConversa);
    const {data : user} = useUsuarioDataId(participantes?.at(0)?.usuario.id === usuarioLogado?.id ? participantes?.at(1)?.usuario.id : participantes?.at(0)?.usuario.id)
    const ultimaMensagem = mensagens?.at(-1);
    
    return (
        <div>
            <img src={user?.picture} alt="" />
            <h1>{nome}</h1>
            <h3>{ultimaMensagem?.texto}</h3>
            <p>{ultimaMensagem?.mandado}</p>            
        </div>
    )
}