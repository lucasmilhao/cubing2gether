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
    const {mutate : upload, isError, error} = useUploadPost();
    const edit = useUsuarioEdit();

    let url : string;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const baseData = {
            id: usuarioLogado?.id,
            nome: nome,
            email: usuarioLogado?.email,
            fotoPerfil: usuarioLogado?.picture
        };

        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            upload(formData, {
                onSuccess: (fileName) => {
                    edit.mutate({
                        ...baseData,
                        nome: nome,
                        picture: fileName
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
        URL.revokeObjectURL(url)
    };

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files.length > 0) setFile(e.target.files[0]);
    }

    let avatarSrc = usuarioLogado?.picture
        ? usuarioLogado.picture
        : "https://imgs.search.brave.com/Lbxkvs17cXgIoCX846ro-mnHvSEe8dGMNQNDdxnGyp8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvMTcy/NjIxMzk5My92ZWN0/b3IvZGVmYXVsdC1h/dmF0YXItcHJvZmls/ZS1wbGFjZWhvbGRl/ci1hYnN0cmFjdC12/ZWN0b3Itc2lsaG91/ZXR0ZS1lbGVtZW50/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz1uWWxrMGowNzZD/Qlo1eEdDQ2FWWHRJ/U1lHSzJTelhSd3VR/QlhQa2ZtTVg0PQ"

    if(file) {
        url = URL.createObjectURL(file);
        avatarSrc = url;

        console.log(avatarSrc);
    }

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
                        {isError && <p>{error.message}</p>}
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