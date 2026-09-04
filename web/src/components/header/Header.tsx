import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useUsuarioLogado } from "../../hooks/usuario/useUsuarioLogado";
import { SearchModal } from "../search/SearchModal";
import { useEffect, useRef, useState } from "react";
import logo from "../../assets/logo.png";
import "./header.css";
import { useUsuarioLogout } from "../../hooks/usuario/useUsuarioLogout";
import { BellIcon } from "lucide-react";
import { NotificacaoModal } from "../notificacao/NotificacaoModal";
import { useNotificacaoData } from "../../hooks/notificacao/useNotificacaoData";

export function Header() {

    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const { mutate: logout } = useUsuarioLogout();
    const { data: usuarioLogado } = useUsuarioLogado();
    const { data: notificacoes } = useNotificacaoData();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotificacaoOpen, setIsNotificacaoOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const naoLidas = notificacoes?.filter(e => e.isLida === false).length;

    const checarConvidado = (): boolean => {
        return usuarioLogado?.isGuest === undefined ? false : usuarioLogado?.isGuest;
    }

    function handleSearchModal() {
        setIsSearchOpen(prev => !prev);
    }

    useEffect(() => {
        const handleClickFora = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickFora);

        return () => {
            document.removeEventListener("mousedown", handleClickFora);
        };
    }, []);

    return (

        <header className="user-header">
            <img src={logo} alt="" />
            <div className="user-header-nav">
                <h2 onClick={() => navigate("/")}>Home</h2>
                {usuarioLogado && (
                    <>
                        <h2 onClick={() => navigate("/practice")}>Practice</h2>
                        {!checarConvidado() && <h2 onClick={() => navigate("/amigos")}>Amigos</h2>}
                    </>
                )}
            </div>
            <div className="user-header-actions">
                <div className="user-profile-header">
                    <div style={{ display: 'flex', gap: 5 }}>
                        {usuarioLogado &&
                            <>
                                <button onClick={() => setIsNotificacaoOpen(prev => !prev)} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
                                    <BellIcon size={20} style={{ color: theme === 'light' ? "black" : "white" }} />
                                </button>
                                <p>{naoLidas}</p>
                            </>
                        }
                    </div>
                    <button onClick={toggleTheme} title={theme === 'light' ? 'Modo escuro' : 'Modo claro'} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
                        <ToggleSwitch />
                    </button>
                    {usuarioLogado && <button className="search-button" onClick={handleSearchModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="6"></circle>
                            <path d="m20 20-4.2-4.2"></path>
                        </svg>
                        <span>Pesquisar</span>
                    </button>}
                    <div ref={menuRef}>
                        {usuarioLogado ? <img src={usuarioLogado?.picture} onClick={() => setIsMenuOpen(prev => !prev)} alt="" /> : <div style={{ display: "flex", alignItems: 'center', gap: 10 }}> <p style={{ margin: 0, cursor: 'pointer', color: "var(--accent-color)", textDecoration: 'underline' }} onClick={() => navigate("/auth/login")}>Entrar</p> <button className="login-btn-header" onClick={() => navigate("/auth/register")}>Cadastrar-se</button>
                        </div>}
                        {isMenuOpen && (
                            <div className="user-options-menu">
                                <button className="profile-actions" onClick={() => { navigate(`/user/${usuarioLogado?.id}`); setIsMenuOpen(false) }}>
                                    Profile
                                </button>
                                <hr />
                                <button onClick={() => { navigate("/ajuda"); setIsMenuOpen(false) }} className="profile-actions">
                                    Ajuda
                                </button>
                                <button onClick={() => { navigate("/sobre"); setIsMenuOpen(false) }} className="profile-actions">
                                    Sobre
                                </button>
                                <button onClick={() => logout()} className="profile-actions">
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {isSearchOpen && <SearchModal closeModal={handleSearchModal} />}
            {isNotificacaoOpen && <NotificacaoModal notificacoes={notificacoes ?? []} onClose={() => setIsNotificacaoOpen(prev => !prev)} />}
        </header>
    )
}

function ToggleSwitch() {
    return (

        <svg width="18" height="18" fill="var(--text-primary)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
                d="M448 256c0-106-86-192-192-192l0 384c106 0 192-86 192-192zM0 256a256 256 0 1 1 512 0 256 256 0 1 1 -512 0z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
        </svg>
    )
}