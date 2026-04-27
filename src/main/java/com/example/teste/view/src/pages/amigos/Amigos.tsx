import { useUsuarioData } from "../../hooks/usuario/useUsuarioData"
import defaultFoto from "../../../../../../../../resources/images/default.webp";
import "./amigos.css";
import { useNavigate } from "react-router-dom";
import { useUsuarioLogado } from "../../hooks/usuario/useUsuarioLogado";
import { useConversaCreate } from "../../hooks/chat/conversa/useConversaCreate";
import type { ConversaRequestProps } from "../../interface/ConversaRequestProps";
import { useEffect } from "react";

export function Amigos() {
    const { data: usuarios } = useUsuarioData();
    const navigate = useNavigate();
    const { data: usuarioLogado } = useUsuarioLogado();
    const conversa = useConversaCreate();
    let idsUsuarios: string[] | undefined = [];

    const submit = (nome: string, idsUsuarios: string[]) => {
        const props: ConversaRequestProps = {
            nome,
            idsUsuarios
        }

        conversa.mutate(props, {
            onSuccess: (data) => {
                navigate(`/chat/${data.idConversa}`)
                console.log(data.nome);
            }
        });
    }


    return (
        <div className="amigo-container">
            {usuarios?.map((e) => {
                if (e.id !== usuarioLogado?.id) {

                    return (
                        <div key={e.id} className="user-card-amigo">
                            <div className="informacoes">
                                <img onClick={() => navigate(`/user/${e.id}`)} src={e.fotoPerfil ? e.fotoPerfil : defaultFoto} alt="" />
                                <div>
                                    <h1 >{e.nome}</h1>
                                    <p>{e.email}</p>
                                </div>
                            </div>
                            <button className="chat-button" onClick={() => { idsUsuarios.push(e.id); idsUsuarios.push(usuarioLogado?.id); submit(`${e.nome} e ${usuarioLogado?.nome}`, idsUsuarios) }} title="Iniciar conversa">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M267.7 576.9C267.7 576.9 267.7 576.9 267.7 576.9L229.9 603.6C222.6 608.8 213 609.4 205 605.3C197 601.2 192 593 192 584L192 512L160 512C107 512 64 469 64 416L64 192C64 139 107 96 160 96L480 96C533 96 576 139 576 192L576 416C576 469 533 512 480 512L359.6 512L267.7 576.9zM332 472.8C340.1 467.1 349.8 464 359.7 464L480 464C506.5 464 528 442.5 528 416L528 192C528 165.5 506.5 144 480 144L160 144C133.5 144 112 165.5 112 192L112 416C112 442.5 133.5 464 160 464L216 464C226.4 464 235.3 470.6 238.6 479.9C239.5 482.4 240 485.1 240 488L240 537.7C272.7 514.6 303.3 493 331.9 472.8z" /></svg>
                            </button>
                        </div>
                    )
                }
            })}
        </div>
    )
}