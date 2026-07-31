import { ConversaCard } from "../../components/conversa/ConversaCard";
import { PostCard } from "../../components/postagem/PostCard";
import { useConversaDataUsuario } from "../../hooks/chat/conversa/useConversaDataUsuario";
import { usePostagemData } from "../../hooks/postagem/usePostagemData";
import { useUsuarioLogado } from "../../hooks/usuario/useUsuarioLogado";

export default function Home() {
    const { data: postagens } = usePostagemData();
    const { data: usuarioLogado } = useUsuarioLogado();
const { data: conversas } = useConversaDataUsuario(usuarioLogado?.id);

    return (
        <div>
            <div className="sidebar">
                <div>
                    <img src={usuarioLogado?.picture} alt="" />
                    <h2>{usuarioLogado?.nome}</h2>
                    <p>{usuarioLogado?.email}</p>
                </div>
                <h1>Conversas:</h1>
                {conversas && conversas.map(e => <ConversaCard {...e}/>)}
            </div>
            <div className="main-feed">
                <h1>Feed:</h1>
                {postagens?.data && postagens.data.map(e => {
                    console.log(e.descricao);
                    return <PostCard postagem={e} />
                })}
            </div>
        </div>
    )
}