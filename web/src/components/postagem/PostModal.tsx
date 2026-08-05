import { useState } from "react";
import { usePostagemCreate, type PostagemRequest } from "../../hooks/postagem/usePostagemCreate";
import { useUsuarioLogado } from "../../hooks/usuario/useUsuarioLogado";
import type { ScrambleProps } from "../../interface/ScrambleProps";
import "./PostModal.css";
import { useScramblePost, type ScrambleRequest } from "../../hooks/scramble/useScramblePost";
import type { PostagemProps } from "../../hooks/postagem/usePostagemData";
import { usePostagemEdit, type PostagemEditRequest } from "../../hooks/postagem/usePostagemEdit";
import { useScrambleEdit } from "../../hooks/scramble/useScrambleEdit";

export interface PostModalProps {
  onClose(): void;
  postagem?: PostagemProps
}

export function PostModal({ onClose, postagem }: PostModalProps) {
  const isEditando = !!postagem;

  const { data: usuario } = useUsuarioLogado();
  const { mutate: postar, isPending } = usePostagemCreate();
  const { mutate: editarPost } = usePostagemEdit();
  const { mutate: editarScramble } = useScrambleEdit();
  const { mutate: scramble } = useScramblePost();

  const [descricao, setDescricao] = useState(isEditando ? postagem.descricao : "");
  const [showScramble, setShowScramble] = useState(isEditando ? postagem?.scramble?.scramble?.length > 0 : false);
  const [setupScramble, setSetupScramble] = useState(isEditando ? postagem?.scramble?.scramble : "");
  const [solution, setSolution] = useState(isEditando ? postagem?.scramble?.solution : "");

  const TwistyPlayer = "twisty-player" as any;

  const hasContent = descricao.trim().length > 0 || (showScramble && solution.trim().length > 0);

  const removeScramble = () => {
    setShowScramble(false);
    setSetupScramble("");
    setSolution("");
  };

  console.log(usuario?.picture);

  const criarPostagem = () => {
    if (!hasContent || !usuario) return;

    const props: ScrambleRequest = {
      scramble: setupScramble,
      solution
    }

    if (solution.length > 0) {

      scramble(props, {
        onSuccess: (scramble: ScrambleProps) => {
          const postProps: PostagemRequest = {
            descricao,
            idScramble: scramble.id,
            idUsuario: usuario?.id
          }

          console.log(scramble.id);

          postar(postProps);
        }
      })
    }
    else {
      const postProps: PostagemRequest = {
        descricao,
        idUsuario: usuario?.id
      }

      postar(postProps);

    }
  }

  const editarPostagem = () => {
    if (!hasContent || !usuario) return;

    if (showScramble && solution?.length > 0) {
      if (postagem?.scramble.scramble) {
        editarScramble({
          idScramble: postagem.scramble.id,
          scramble: setupScramble,
          solution
        })
      }
      else {
        const props: ScrambleRequest = {
          scramble: setupScramble,
          solution
        }
        scramble(props, {
          onSuccess: (scramble: ScrambleProps) => {
            const postProps: PostagemEditRequest = {
              idPostagem: postagem?.id,
              descricao,
              idScramble: scramble?.id,
              idUsuario: usuario?.id
            }

            console.log(scramble.id);

            editarPost(postProps);
          }
        })
      }
    }
    else {
      const postProps : PostagemEditRequest = {
              idPostagem: postagem?.id,
              descricao,
              idUsuario: usuario?.id
      }

      editarPost(postProps);
    }

  }

  const submit = () => {
    if (!hasContent || !usuario) return;

    isEditando ? editarPostagem() : criarPostagem();

  };

  return (
    <div className="post-modal-overlay">
      <div className="post-modal">
        <div className="post-modal-header">
          <button className="icon-btn" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>

        <div className="post-modal-body">
          <div className="post-modal-avatar">
            {usuario?.picture ? (
              <img src={usuario.picture} alt={usuario?.nome ?? "Usuário"} />
            ) : (
              <div className="avatar-placeholder">{usuario?.nome?.[0] ?? "U"}</div>
            )}
          </div>

          <div className="post-modal-main">
            <textarea
              className="post-textarea"
              placeholder="O que você resolveu hoje?"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
            />

            {showScramble && (
              <div className="scramble-attachment">
                <button
                  className="scramble-remove-btn"
                  onClick={removeScramble}
                  aria-label="Remover scramble"
                  title="Remover"
                >
                  ✕
                </button>

                <div className="scramble-attachment-content">
                  <div className="scramble-preview">
                    <TwistyPlayer
                      puzzle="3x3x3"
                      viewer-link="none"
                      experimental-setup-alg={setupScramble}
                      alg={solution}
                      background="none"
                    />
                  </div>

                  <div className="scramble-inputs">
                    <label className="scramble-label">
                      Scramble
                      <input
                        type="text"
                        className="scramble-input"
                        placeholder="R U R' U' ..."
                        value={setupScramble}
                        onChange={(e) => setSetupScramble(e.target.value)}
                      />
                    </label>

                    <label className="scramble-label">
                      Solução
                      <input
                        type="text"
                        className="scramble-input"
                        placeholder="Sua solução"
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="post-modal-footer">
          <div className="post-modal-tools">
            <button
              type="button"
              className={`tool-btn ${showScramble ? "tool-btn-active" : ""}`}
              onClick={() => setShowScramble((prev) => !prev)}
              title="Adicionar scramble"
              aria-pressed={showScramble}
            >
              <CubeIcon />
            </button>

            <button type="button" className="tool-btn" title="Adicionar imagem" disabled>
              <ImageIcon />
            </button>

            <button type="button" className="tool-btn" title="Adicionar enquete" disabled>
              <PollIcon />
            </button>
          </div>

          <button
            className="post-submit-btn"
            onClick={submit}
            disabled={!hasContent || isPending}
          >
            {isPending ? "Postando..." : "Postar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2 3 7v10l9 5 9-5V7l-9-5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M3 7l9 5 9-5M12 12v10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="m21 15-5-5-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function PollIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7 15v-3M12 15V9M17 15v-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}