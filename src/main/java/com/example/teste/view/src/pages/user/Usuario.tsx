import { useNavigate, useParams } from "react-router-dom";
import { useUsuarioDataId } from "../../hooks/usuario/useUsuarioDataId"
import './Usuario.css';
import logo from "../../../../../../../../resources/images/logo.png";
import defaltImage from "../../../../../../../../resources/images/default.webp";
import { useSolveDataUser } from "../../hooks/solves/useSolveDataUser";
import { segundos } from "../Practice";
import { useUsuarioLogado } from "../../hooks/usuario/useUsuarioLogado";
import { useTheme } from "../../context/ThemeContext";
import { useState } from "react";
import { Modal } from "../../components/modal/Modal";

export function Usuario () {
    const {idUsuario} = useParams();
    const { data: usuario, isLoading, isError, error } = useUsuarioDataId(idUsuario);
    const usuarioLogado = useUsuarioLogado();
    const navigate = useNavigate();
    const {data : solveUser} = useSolveDataUser(usuario?.id);
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const handleModal = () => {
        setIsOpen(prev => !prev);
    }

    const solves = solveUser?.data.reverse();
    const image = usuario?.fotoPerfil ? usuario.fotoPerfil : defaltImage;

    if (isLoading) return <div className="usuario-page">Carregando usuário...</div>;
    if (isError) return <div className="usuario-page error">id: {idUsuario} Erro ao buscar usuário: {String((error as any)?.message || error)}</div>;

    const isUsuarioLogado = usuarioLogado.data?.id === idUsuario;

    const show = solves ? solves.length > 0 : false;
    
    return (
        <div className="user-container">
            {isOpen && <Modal closeModal={handleModal} usuarioLogado={usuarioLogado.data}/>}
            <header className="user-header">
                <img src={logo} alt="" />
                <h2 onClick={() => navigate("/practice")}>Practice</h2>
                <h2 onClick={() => navigate("/sobre")}>Sobre</h2>
                <h2 onClick={() => navigate("/amigos")}>Amigos</h2>
                <button className="theme-toggle" onClick={toggleTheme} title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}>
                    {theme === 'light' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                        </svg>
                    )}
                </button>
            </header>
            <div className="usuario-page">
                <div className="actions">

            <div className="usuario-card">
                    <img className="usuario-avatar" src={`http://localhost:8080/uploads/${usuario?.fotoPerfil}` } alt="Foto Usuario" />
                    
                    <div>
                        <h1 className="usuario-name">{usuario?.nome || 'Sem nome'}</h1>
                    </div>
            </div>
            {isUsuarioLogado && <button onClick={handleModal} className="edit-profile-btn">Editar perfil</button>}
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
                <p style={{color: "white"}}>{segundos(e.tempo)}s</p>
                </div>
            )})}
            </div>
            </div>
        </div>
    )

}
