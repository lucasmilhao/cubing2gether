import "./PostCard.css";
import type { PostagemProps } from "../../hooks/postagem/usePostagemData";
import { useNavigate } from "react-router-dom";

export function PostCard({ postagem }: { postagem: PostagemProps }) {

  const TwistyPlayer = "twisty-player" as any;
  const navigate = useNavigate();

  const toggleCurtir = () => {
  };

  const tempoRelativo = formatarTempoRelativo(postagem.createdAt);

  return (
    <article className="post-card">
      <div className="post-card-avatar">
        {postagem.usuario.picture ? (
          <img onClick={() => navigate(`/user/${postagem.usuario.id}`)} src={postagem.usuario.picture} alt={postagem.usuario.nome} />
        ) : (
          <div className="avatar-placeholder">{postagem.usuario.nome?.[0] ?? "U"}</div>
        )}
      </div>

      <div className="post-card-main">
        <header className="post-card-header">
          <span className="post-card-nome">{postagem.usuario.nome}</span>
          {postagem.usuario.nome && (
            <span className="post-card-handle">@{postagem.usuario.email}</span>
          )}
          <span className="post-card-dot">·</span>
          <span className="post-card-tempo">{tempoRelativo}</span>
        </header>

        {postagem.descricao && (
          <p className="post-card-descricao">{postagem.descricao}</p>
        )}

        {postagem.scramble && (
          <div className="post-card-scramble">
            <div className="post-card-scramble-preview">
              <TwistyPlayer
                puzzle="3x3x3"
                viewer-link="none"
                experimental-setup-alg={postagem.scramble.scramble}
                alg={postagem.scramble.solution}
                background="none"
              />
            </div>

            <div className="post-card-scramble-info">
              <div className="scramble-info-row">
                <span className="scramble-info-label">Scramble</span>
                <span className="scramble-info-value">{postagem.scramble.scramble}</span>
              </div>
              <div className="scramble-info-row">
                <span className="scramble-info-label">Solução</span>
                <span className="scramble-info-value">{postagem.scramble.solution}</span>
              </div>
            </div>
          </div>
        )}

        <footer className="post-card-actions">
          <button className="action-btn" title="Comentar">
            <CommentIcon />
            {/* {postagem.comentarios ? <span>{postagem.comentarios}</span> : null} */}
          </button>

          <button
            className={`action-btn like-btn ${false /*curtido : boolean*/ ? "like-btn-active" : ""}`}
            onClick={toggleCurtir}
            title="Curtir"
          >
            <HeartIcon filled={false} />
            {/* {totalCurtidas > 0 ? <span>{totalCurtidas}</span> : null} */}
          </button>

          <button className="action-btn" title="Compartilhar">
            <ShareIcon />
          </button>
        </footer>
      </div>
    </article>
  );
}

export function formatarTempoRelativo(dataISO: string) {
  const data = new Date(dataISO);
  const diffMs = Date.now() - data.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `${diffMin}min`;
  const diffHoras = Math.floor(diffMin / 60);
  if (diffHoras < 24) return `${diffHoras}h`;
  const diffDias = Math.floor(diffHoras / 24);
  if (diffDias < 7) return `${diffDias}d`;
  return data.toLocaleDateString("pt-BR");
}

function CommentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-3.5-.75L3 21l1.75-5A8.4 8.4 0 0 1 4 12.5 8.5 8.5 0 0 1 12.5 4 8.5 8.5 0 0 1 21 11.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"}>
      <path
        d="M12 20.5s-7.5-4.6-10-9.3C.6 8.1 2 4.5 5.6 4a5 5 0 0 1 6.4 2.5A5 5 0 0 1 18.4 4c3.6.5 5 4.1 3.6 7.2-2.5 4.7-10 9.3-10 9.3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}