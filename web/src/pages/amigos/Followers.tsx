import "./amigos.css";
import { useNavigate, useParams } from "react-router-dom";
import { useUsuarioLogado } from "../../hooks/usuario/useUsuarioLogado";
import { useConversaCreate } from "../../hooks/chat/conversa/useConversaCreate";
import type { ConversaRequestProps } from "../../interface/ConversaRequestProps";
import { usePartidaCreate } from "../../hooks/partidas/usePartidaCreate";
import { useMensagemPost } from "../../hooks/chat/mensagem/useMensagemPost";
import type { MensagemRequest } from "../../interface/MensagemRequest";
import { useFollowSeguidoresData } from "../../hooks/follow/useFollowSeguidoresData";
import { UsuarioCard } from "../../components/usuario/UsuarioCard";

export function Followers() {
    const {idUsuario} = useParams();
    const { data: usuarioLogado } = useUsuarioLogado();
    const {data : usuarios} = useFollowSeguidoresData(idUsuario);
        
    const navigate = useNavigate();
    const conversa = useConversaCreate();
    const partida = usePartidaCreate();
    const enviaMensagem = useMensagemPost();
    let idsUsuarios: string[] | undefined = [];

    const submitConversa = (nome: string, idsUsuarios: string[])=> {
        const props: ConversaRequestProps = {
            nome,
            idsUsuarios
        }

        console.log(props);
        

        conversa.mutate(props, {
            onSuccess: (data) => {
                navigate(`/chat/${data.idConversa}`)
                console.log(data.nome);
            }
        });
    }

    const submitPartida = (nome : string, idsUsuarios : string[]) => {
        
        partida.mutate(idsUsuarios, {
            onSuccess: (data) => {
                
                const propsConversa: ConversaRequestProps = {
                    nome,
                    idsUsuarios
                }

                conversa.mutate(propsConversa, {
                    onSuccess: (dataConversa) => {
                        const props : MensagemRequest = {
                            texto:`Junte-se à mim em: http://localhost:5173/video/${data.idPartida}`,
                            idSender: usuarioLogado?.id,
                            idConversa: dataConversa.idConversa
                        }
        
                        enviaMensagem.mutate(props, {
                            onSuccess: () => console.log("Mensagem enviada")
                            
                        })
                        navigate(`/video/${data.idPartida}`)
                    }
                });
                
            }
        });
    }


    return (
        <div className="amigo-container">
            {usuarios && usuarios.length > 0 ? usuarios?.map((e) => {
                const seguindo = e.seguidor;
                return (
                    <UsuarioCard
                        key={seguindo.id}
                        usuario={seguindo}
                        actions={seguindo.id !== usuarioLogado?.id ? (
                            <>
                                <button className="chat-button" onClick={() => {
                                    idsUsuarios.push(seguindo.id);
                                    if (usuarioLogado?.id) {
                                        idsUsuarios.push(usuarioLogado.id);
                                    }
                                    submitPartida(`${seguindo.nome} e ${usuarioLogado?.nome}`, idsUsuarios);
                                }} title="Iniciar partida">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M96 64c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L96 64zM464 336l73.5 58.8c4.2 3.4 9.4 5.2 14.8 5.2 13.1 0 23.7-10.6 23.7-23.7l0-240.6c0-13.1-10.6-23.7-23.7-23.7-5.4 0-10.6 1.8-14.8 5.2L464 176 464 336z" /></svg>
                                </button>
                                <button className="chat-button" onClick={() => {
                                    idsUsuarios.push(seguindo.id);
                                    if (usuarioLogado?.id) {
                                        idsUsuarios.push(usuarioLogado.id);
                                    }
                                    submitConversa(`${seguindo.nome} e ${usuarioLogado?.nome}`, idsUsuarios)
                                }} title="Iniciar conversa">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M64 416L64 192C64 139 107 96 160 96L480 96C533 96 576 139 576 192L576 416C576 469 533 512 480 512L360 512C354.8 512 349.8 513.7 345.6 516.8L230.4 603.2C226.2 606.3 221.2 608 216 608C202.7 608 192 597.3 192 584L192 512L160 512C107 512 64 469 64 416z" /></svg>
                                </button>
                            </>
                        ) : null}
                    />
                );
            }) : <p>Usuario ainda não é seguido por ninguém.</p>}
        </div>
    )
}