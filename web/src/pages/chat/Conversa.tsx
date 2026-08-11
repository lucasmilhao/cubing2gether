import { useParams } from "react-router-dom";
import { useMensagemData } from "../../hooks/chat/mensagem/useMensagemData";
import { useUsuarioLogado } from "../../hooks/usuario/useUsuarioLogado"
import { useMensagemPost } from "../../hooks/chat/mensagem/useMensagemPost";
import type { MensagemRequest } from "../../interface/MensagemRequest";
import { useState, useRef, useEffect } from "react";
import { Mensagem } from "../../components/mensagem/Mensagem";
import "./conversa.css";
import { useConversaData } from "../../hooks/chat/conversa/useConversaData";

export function Conversa() {
    const { idConversa } = useParams();
    const { data: mensagens } = useMensagemData(idConversa);
    const { data: conversa } = useConversaData(idConversa);
    const enviaMensagem = useMensagemPost();
    const { data: usuarioLogado } = useUsuarioLogado();
    const [texto, setTexto] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [mensagens]);

    const enviar = (texto: string) => {
        if (!texto.trim()) return;

        const props: MensagemRequest = {
            texto,
            idSender: usuarioLogado?.id,
            idConversa
        }

        enviaMensagem.mutate(props);
        setTexto("");
    }


    return (
        <div className="conversa-container">
            <header className="conversa-header">
                <div className="nome-conversa">
                    <h1>{conversa?.nome}</h1>
                    <div style={{display: "flex", gap: 10}} className="participantes">
                        {conversa?.participantes?.slice(0, 3).map(e => <p style={{color: "#bdb6b6b9"}}>{e.nome}</p>)}
                        {(conversa?.participantes?.length && conversa.participantes.length > 3) && <p style={{color: "#bdb6b6b9"}}>e mais {conversa.participantes.length - 3}</p>}
                    </div>
                </div>
                <div className="options">

                </div>
            </header>

            <div className="mensagens-container">
                {mensagens?.map((e, index) => (
                    <Mensagem
                        key={e.id || index}
                        {...e}
                        isOwnMessage={e.sender?.id === usuarioLogado?.id}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="input-area">
                <input
                    placeholder="Digite sua mensagem..."
                    type="text"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key == "Enter") enviar(texto);
                    }}
                />
                <button
                    className="send-button"
                    onClick={() => enviar(texto)}
                    disabled={!texto.trim()}
                >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                </button>
            </div>
        </div>
    )
}