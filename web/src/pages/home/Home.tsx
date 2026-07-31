import { useNavigate } from "react-router-dom";
import { ConversaCard } from "../../components/conversa/ConversaCard";
import { PostCard } from "../../components/postagem/PostCard";
import { useConversaDataUsuario } from "../../hooks/chat/conversa/useConversaDataUsuario";
import { usePostagemData } from "../../hooks/postagem/usePostagemData";
import { useUsuarioLogado } from "../../hooks/usuario/useUsuarioLogado";
import "./home.css";
import { useState } from "react";
import { PostModal } from "../../components/postagem/PostModal";

export default function Home() {
  const { data: postagens } = usePostagemData();
  const { data: usuarioLogado } = useUsuarioLogado();
  const { data: conversas, isPending} = useConversaDataUsuario(usuarioLogado?.id);
  const navigate = useNavigate();
  const avatarFallback = usuarioLogado?.nome?.charAt(0)?.toUpperCase() || "U";
  const [isOpen, setIsOpen] = useState(false);
  console.log(conversas);
  
  const handleModal = () => {
    setIsOpen(prev => !prev);
  }

  return (
    <div className="home-shell">
      <aside className="home-sidebar">
        <div className="home-profile-card">
          <div className="home-profile-avatar">
            {usuarioLogado?.picture ? (
              <img onClick={() => navigate(`/user/${usuarioLogado.id}`)} src={usuarioLogado.picture} alt={`Foto de ${usuarioLogado.nome || "usuário"}`} />
            ) : (
              <span>{avatarFallback}</span>
            )}
          </div>

          <div>
            <h2>{usuarioLogado?.nome || "Usuário"}</h2>
            <p>{usuarioLogado?.email || "Seu perfil"}</p>
          </div>
        </div>

        <section className="home-section">
          <div className="home-section-header">
            <h3>Conversas</h3>
            <span>{conversas?.length ?? 0}</span>
          </div>

          <div className="home-conversas-list">
            {isPending ? (
              <p className="home-empty-state">Carregando...</p>
            ) :
            conversas?.length ? (
              conversas.map((conversa) => <ConversaCard key={conversa.idConversa} {...conversa} />)
            ) : (
              <p className="home-empty-state">Nenhuma conversa por enquanto.</p>
            )}
          </div>
        </section>
      </aside>

      <main className="home-feed">
        <div style={{height:30}}>
          <button onClick={handleModal}>Postar</button>
        </div>

        {isOpen && <PostModal onClose={handleModal}/>}

        <div className="home-posts-list">
          {postagens?.data?.length ? (
            postagens.data.map((postagem) => <PostCard key={postagem.id} postagem={postagem} />)
          ) : (
            <div className="home-empty-state">Ainda não há publicações para mostrar.</div>
          )}
        </div>
      </main>
    </div>
  );
}