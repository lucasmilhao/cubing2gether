import "./PostCardSkeleton.css";

interface PostCardSkeletonProps {
  imagem?: boolean;
  scramble?: boolean;
}

export function PostCardSkeleton({
  imagem = false,
  scramble = false,
}: PostCardSkeletonProps) {
  return (
    <article className="post-card post-card-skeleton">
      {/* Avatar */}
      <div className="post-card-avatar">
        <div className="skeleton skeleton-avatar" />
      </div>

      {/* Conteúdo */}
      <div className="post-card-main">
        {/* Cabeçalho */}
        <header className="post-card-header">
          <div className="skeleton-user-props">
            <div className="skeleton skeleton-name" />
            <div className="skeleton skeleton-handle" />
            <div className="skeleton skeleton-time" />
          </div>

          <div className="skeleton skeleton-options" />
        </header>

        {/* Descrição */}
        <div className="skeleton-description">
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line skeleton-line-medium" />
          <div className="skeleton skeleton-line skeleton-line-short" />
        </div>

        {/* Imagem opcional */}
        {imagem && (
          <div className="skeleton-image-container">
            <div className="skeleton skeleton-image" />
          </div>
        )}

        {/* Scramble opcional */}
        {scramble && (
          <div className="skeleton-scramble">
            <div className="skeleton-scramble-preview">
              <div className="skeleton skeleton-cube" />
            </div>

            <div className="skeleton-scramble-info">
              <div className="skeleton skeleton-label" />
              <div className="skeleton skeleton-scramble-text" />

              <div className="skeleton skeleton-label" />
              <div className="skeleton skeleton-scramble-text" />
            </div>
          </div>
        )}

        {/* Ações */}
        <footer className="post-card-actions skeleton-actions">
          <div className="skeleton skeleton-action" />
          <div className="skeleton skeleton-action" />
          <div className="skeleton skeleton-action" />
        </footer>
      </div>
    </article>
  );
}