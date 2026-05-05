import { useState } from "react"
import type { UsuarioProps } from "../../interface/UsuarioProps"
import { useUploadPost } from "../../hooks/uploads/useUploadPost"

interface ModalProps {
    closeModal() : void,
    usuarioLogado? : UsuarioProps
}

export function Modal ({closeModal, usuarioLogado} : ModalProps) {
    const [file, setFile] = useState<File | null>(null)
    const upload = useUploadPost();

    const submit = () => {
        if(!file) return;

        const formData = new FormData();
        formData.append("file", file);

        upload.mutate(formData);
    }

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files.length > 0) setFile(e.target.files[0]);
    }

    return (
        <div>
            <form action="">
            <button onClick={closeModal}></button>
            <h1>Foto de usuario do usuario {usuarioLogado?.nome}:</h1>
            <input type="file" onChange={handleChange} />
            <button onClick={submit}>Agora ou nunk</button>
            </form>
        </div>
    )
}