import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useUsuarioLogado } from "../../hooks/usuario/useUsuarioLogado";
import { SearchModal } from "../search/SearchModal";
import { useState } from "react";
import "./header.css";

export function Header() {

    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const {data : usuarioLogado} = useUsuarioLogado();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const checarConvidado = (): boolean => {
        return usuarioLogado?.isGuest === undefined ? false : usuarioLogado?.isGuest;
    }

    
    function handleSearchModal() {
        setIsSearchOpen(prev => !prev);
    }

    return (
        
        <header className="user-header">
            <img src={"logo"} alt="" />
            <div className="user-header-nav">
                <h2 onClick={() => navigate("/")}>Home</h2>
                <h2 onClick={() => navigate("/practice")}>Practice</h2>
                <h2 onClick={() => navigate("/sobre")}>Sobre</h2>
                {!checarConvidado() && <h2 onClick={() => navigate("/amigos")}>Amigos</h2>}
            </div>
            <div className="user-header-actions">
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
                <button className="search-button" onClick={handleSearchModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="6"></circle>
                        <path d="m20 20-4.2-4.2"></path>
                    </svg>
                    <span>Pesquisar</span>
                </button>
            </div>
            {isSearchOpen && <SearchModal closeModal={handleSearchModal} />}
        </header>
    )
}