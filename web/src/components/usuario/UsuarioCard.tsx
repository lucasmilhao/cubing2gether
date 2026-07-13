import { type KeyboardEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { UsuarioProps } from "../../interface/UsuarioProps";
import "./usuario-card.css";

interface UsuarioCardProps {
  usuario: UsuarioProps;
  actions?: ReactNode;
  onNavigate?: () => void;
}

export function UsuarioCard({ usuario, actions, onNavigate }: UsuarioCardProps) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    onNavigate?.();
    navigate(`/user/${usuario.id}`);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNavigate();
    }
  };

  const avatarSrc = usuario.fotoPerfil
    ? `http://localhost:8080/uploads/${usuario.fotoPerfil}`
    : `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
        <rect width="96" height="96" rx="48" fill="#e5e7eb"/>
        <circle cx="48" cy="38" r="20" fill="#9ca3af"/>
        <path d="M24 82c6-16 18-24 24-24s18 8 24 24" fill="#9ca3af"/>
      </svg>
    `)}`;

  return (
    <article
      className="usuario-card-shell"
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="usuario-card-main">
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

      {actions ? (
        <div className="usuario-card-actions" onClick={(event) => event.stopPropagation()}>
          {actions}
        </div>
      ) : null}
    </article>
  );
}
