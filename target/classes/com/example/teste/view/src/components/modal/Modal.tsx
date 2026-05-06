import { useState } from "react"
import "./modal.css"
import type { UsuarioProps } from "../../interface/UsuarioProps"
import { useUploadPost } from "../../hooks/uploads/useUploadPost"
import { useUsuarioEdit } from "../../hooks/usuario/useUsuarioEdit"

interface ModalProps {
    closeModal() : void,
    usuarioLogado? : UsuarioProps
}

export function Modal ({closeModal, usuarioLogado} : ModalProps) {
    const [file, setFile] = useState<File | null>(null)
    const [nome, setNome] = useState(usuarioLogado?.nome ?? "")
    const upload = useUploadPost();
    const edit = useUsuarioEdit();

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const baseData = {
            id: usuarioLogado?.id,
            nome: nome,
            email: usuarioLogado?.email,
            fotoPerfil: usuarioLogado?.fotoPerfil
        };

        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            upload.mutate(formData, {
                onSuccess: (fileName) => {
                    edit.mutate({
                        ...baseData,
                        nome: nome,
                        fotoPerfil: fileName
                    }, {
                        onSuccess: closeModal
                    });
                }
            });
        } else {
            edit.mutate(baseData, {
                onSuccess: closeModal
            });
        }
    };

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files.length > 0) setFile(e.target.files[0]);
    }

    const avatarSrc = usuarioLogado?.fotoPerfil
        ? `http://localhost:8080/uploads/${usuarioLogado.fotoPerfil}`
        : "https://via.placeholder.com/140?text=Avatar"

    return (
        <div className="modal-container" role="dialog" aria-modal="true">
            <div className="modal-card">
                <header className="modal-header">
                    <div>
                        <h2>Editar perfil</h2>
                        <p>Atualize seu nome e foto de perfil.</p>
                    </div>
                    <button type="button" className="close-button" onClick={closeModal} aria-label="Fechar modal">
                        ×
                    </button>
                </header>
                <form className="modal-form" onSubmit={submit}>
                    <div className="modal-avatar">
                        <img src={avatarSrc} alt="Foto de perfil" />
                        <label className="file-label">
                            <span>Trocar imagem</span>
                            <input type="file" accept="image/*" onChange={handleChange} />
                        </label>
                    </div>
                    <div className="modal-field">
                        <label htmlFor="nome">Nome</label>
                        <input type="text" id="nome" value={nome} onChange={e => setNome(e.target.value)} placeholder="Digite seu nome" />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="ghost-button" onClick={closeModal}>
                            Cancelar
                        </button>
                        <button type="submit" className="primary-button">
                            Salvar alterações
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}