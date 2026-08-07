import { useMemo, type KeyboardEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { UsuarioProps } from "../../interface/UsuarioProps";
import "./usuario-card.css";
import { useUsuarioLogado } from "../../hooks/usuario/useUsuarioLogado";
import { useFollowCreate, type FollowRequest } from "../../hooks/follow/useFollowCreate";
import { useFollowStatus } from "../../hooks/follow/useFollowStatus";

interface UsuarioCardProps {
  usuario: UsuarioProps;
  actions?: ReactNode;
  onNavigate?: () => void;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: (usuario: UsuarioProps) => void;
}

export function UsuarioCard({
  usuario,
  actions,
  onNavigate,
  selectable = false,
  selected = false,
  onToggleSelect,
}: UsuarioCardProps) {
  const { data: usuarioLogado } = useUsuarioLogado();
  const navigate = useNavigate();
  const { mutate: seguir } = useFollowCreate();
  const { data: followStatus } = useFollowStatus(usuario.id);

  const followInfo = useMemo(() => {
    if (!followStatus) return "Seguir";
    if (followStatus.sigo && followStatus.meSegue) return "Amigos";
    if (followStatus.sigo) return "Seguindo";
    if (followStatus.meSegue) return "Seguir de volta";
    return "Seguir";
  }, [followStatus]);

  const handleNavigate = () => {
    if (selectable) {
      onToggleSelect?.(usuario);
      return;
    }
    onNavigate?.();
    navigate(`/user/${usuario.id}`);
  };

  const handleSeguir = () => {
    const props: FollowRequest = {
      idSeguidor: usuarioLogado?.id,
      idSeguindo: usuario.id,
    };
    seguir(props);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNavigate();
    }
  };

  const avatarSrc =
    usuario.picture ??
    `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
        <rect width="96" height="96" rx="48" fill="#e5e7eb"/>
        <circle cx="48" cy="38" r="20" fill="#9ca3af"/>
        <path d="M24 82c6-16 18-24 24-24s18 8 24 24" fill="#9ca3af"/>
      </svg>
    `)}`;

  return (
    <article
      className={`usuario-card-shell${selectable ? " usuario-card-selectable" : ""}${
        selected ? " usuario-card-selected" : ""
      }`}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="usuario-card-main">
        {selectable && (
          <input
            type="checkbox"
            className="usuario-card-checkbox"
            checked={selected}
            onChange={() => onToggleSelect?.(usuario)}
            onClick={(event) => event.stopPropagation()}
            aria-label={`Selecionar ${usuario.nome}`}
          />
        )}

        <img
          className="usuario-card-avatar"
          src={avatarSrc}
          alt={`Foto de ${usuario.nome}`}
        />

        <div className="usuario-card-content">
          <h1 className="usuario-card-name">{usuario.nome || "Usuário sem nome"}</h1>
          <p className="usuario-card-email">{usuario.email || "Sem e-mail cadastrado"}</p>

          <div className="usuario-card-meta">
            <span className="usuario-card-badge">{usuario.tipo || "Usuário"}</span>
          </div>
        </div>
      </div>

      {!selectable && actions ? (
        <div className="usuario-card-actions" onClick={(event) => event.stopPropagation()}>
          {followInfo === "Amigos" ? actions : null}
          <button onClick={handleSeguir} className="edit-profile-btn">
            {followInfo}
          </button>
        </div>
      ) : null}
    </article>
  );
}