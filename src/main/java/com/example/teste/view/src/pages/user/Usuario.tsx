import { useNavigate, useParams } from "react-router-dom";
import { useUsuarioDataId } from "../../hooks/usuario/useUsuarioDataId"
import './Usuario.css';
//import logo from "../../../../../../../../resources/images/logo.png";
import defaltImage from "../../../../../../../../resources/images/default.webp";
import { useSolveDataUser } from "../../hooks/solves/useSolveDataUser";
import { segundos } from "../Practice";
import { useUsuarioLogado } from "../../hooks/usuario/useUsuarioLogado";

export function Usuario () {
    const {idUsuario} = useParams();
    const { data: usuario, isLoading, isError, error } = useUsuarioDataId(idUsuario);
    const usuarioLogado = useUsuarioLogado();
    const navigate = useNavigate();
    const {data : solveUser} = useSolveDataUser(usuario?.id);

    const solves = solveUser?.data.reverse();
    const image = usuario?.fotoPerfil ? usuario.fotoPerfil : defaltImage;

    if (isLoading) return <div className="usuario-page">Carregando usuário...</div>;
    if (isError) return <div className="usuario-page error">id: {idUsuario} Erro ao buscar usuário: {String((error as any)?.message || error)}</div>;

    const isUsuarioLogado = usuarioLogado.data?.id === idUsuario;

    const show = solves ? solves.length > 0 : false;
    
    return (
        <div className="user-container">
            <div className="user-header">
                <img src="" alt="" />
                <h2 onClick={() => navigate("/practice")}>Practice</h2>
                <h2>Sobre</h2>
                <h2 onClick={() => navigate("/amigos")}>Amigos</h2>
            </div>
            <div className="usuario-page">
                <div className="actions">

            <div className="usuario-card">
                    <img className="usuario-avatar" src={image} alt="Foto Usuario" />
                    
                    <div>
                        <h1 className="usuario-name">{usuario?.nome || 'Sem nome'}</h1>
                    </div>
            </div>
            {isUsuarioLogado && <button className="edit-profile-btn">Editar perfil</button>}
                </div>

            <div className="usuario-sections">
                <section className="usuario-section">
                    <h2>Média:</h2>
                    {solveUser?.data && solveUser.data.length > 0 ? (
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
            {show && <h2>Histórico gráfico:</h2>}
            
            <div className="graphic-solve" style={{width: "100%"}}>
            {solves?.map(e => {
                
                const hue = (e.id * 360) / solves.length;

                return (
                <div
                key={e.id}
                style={{
                    backgroundColor: `hsl(${hue}, 70%, 50%)`,
                    height: `${e.tempo / 100}px`,
                    flex: 1,
                    color: `rgb(${segundos(e.tempo)} ${e.id} 32)`
                }}
                >
                <p>{segundos(e.tempo)}s</p>
                </div>
            )})}
            </div>
            </div>
        </div>
    )

}
