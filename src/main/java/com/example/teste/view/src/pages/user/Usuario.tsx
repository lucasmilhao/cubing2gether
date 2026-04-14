import { useParams } from "react-router-dom";
import { useUsuarioDataId } from "../../hooks/usuario/useUsuarioDataId"
import type { UsuarioProps } from "../../interface/UsuarioProps";
import './Usuario.css';
import { useSolveDataUser } from "../../hooks/solves/useSolveDataUser";
import { segundos } from "../Practice";
import { useUsuarioLogado } from "../../hooks/usuario/useUsuarioLogado";

export function Usuario () {
    const {idUsuario} = useParams();
    const { data: usuario, isLoading, isError, error } = useUsuarioDataId(idUsuario);
    const usuarioLogado = useUsuarioLogado();
    const {data : solveUser} = useSolveDataUser(usuario?.id);

    if (isLoading) return <div className="usuario-page">Carregando usuário...</div>;
    if (isError) return <div className="usuario-page error">Erro ao buscar usuário: {String((error as any)?.message || error)}</div>;

    const isUsuarioLogado = usuarioLogado.data?.id === idUsuario;

    return (
        <div className="user-container">
            <div className="usuario-page">
            <div className="usuario-card">
                <img className="usuario-avatar" src={usuario?.fotoPerfil} alt={`${usuario?.nome || 'Usuário'} avatar`} />
                <div>
                    <h1 className="usuario-name">{usuario?.nome || 'Sem nome'}</h1>
                </div>
                {isUsuarioLogado && <button className="edit-profile-btn">Editar perfil</button>}
            </div>

            <div className="usuario-sections">
                <section className="usuario-section">
                    <h2>Média:</h2>
                    {solveUser?.data ? (
                        <div className="photos-grid">
                            <h1>{segundos(solveUser.data.reduce((a, b) => a + b.tempo, 0) / solveUser.data.length)}s</h1>
                        </div>
                    ) : (
                        <p>Sem resoluções ainda. Faça upload de suas melhores jogadas!</p>
                    )}
                </section>

                <section className="usuario-section">
                    <h2>Reposts</h2>
                    <p>Nenhum repost ainda.</p>
                </section>

                <section className="usuario-section">
                    <h2>Mencões</h2>
                    <p>Você não foi mencionado ainda.</p>
                </section>
            </div>
            </div>
        </div>
    )

}
