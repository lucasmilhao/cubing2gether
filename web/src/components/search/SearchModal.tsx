import { useMemo, useState } from "react";
import { useUsuarioNomeData } from "../../hooks/usuario/useUsuarioDataNome";
import { UsuarioCard } from "../usuario/UsuarioCard";
import "./search-modal.css";
import { useNavigate } from "react-router-dom";

interface SearchProps {
closeModal() : void
}

export function SearchModal({closeModal} : SearchProps) {
const [nome, setNome] = useState("");
const { data: usuarios, isLoading, isError } = useUsuarioNomeData(nome);
const navigate = useNavigate();

const hasQuery = nome.trim().length > 0;
const results = useMemo(() => usuarios ?? [], [usuarios]);

return (
<div className="search-modal-shell">
    <div className="search-modal-card">
    <header className="search-modal-header">
        <div>
        <p className="search-modal-eyebrow">Descubra pessoas</p>
        <h2 className="search-modal-title">Buscar usuários</h2>
        </div>
        <div className="search-modal-header-actions">
        <span className="search-modal-pill">{hasQuery ? `${results.length} resultado(s)` : "Digite para buscar"}</span>
        <button className="search-modal-close" onClick={closeModal} aria-label="Fechar busca">
            ×
        </button>
        </div>
    </header>

    <label className="search-modal-input-wrapper" htmlFor="search-users">
        <span className="search-modal-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="6"></circle>
                <path d="m20 20-4.2-4.2"></path>
            </svg>
        </span>
        <form action="submit" 
        onSubmit={(e) => {
            e.preventDefault();

            const usuario = results.at(0);

            if(!usuario) return;

            navigate(`/user/${results[0].id}`)
            closeModal()
        }} >
        <input
        id="search-users"
        onChange={(e) => setNome(e.target.value)}
        type="text"
        name="search"
        placeholder="Procure por nome"
        value={nome}
        />
        </form>
    </label>

    <section className="search-modal-results" aria-live="polite">
        {!hasQuery ? (
        <div className="search-modal-empty-state">
            <h3>Encontre novos cubers</h3>
            <p>Comece digitando no campo acima para ver perfis compatíveis.</p>
        </div>
        ) : isLoading ? (
        <div className="search-modal-empty-state">
            <h3>Buscando...</h3>
            <p>Estamos procurando usuários que combinem com sua pesquisa.</p>
        </div>
        ) : isError ? (
        <div className="search-modal-empty-state">
            <h3>Não foi possível buscar</h3>
            <p>Ocorreu um erro ao carregar os resultados. Tente novamente em instantes.</p>
        </div>
        ) : results.length === 0 ? (
        <div className="search-modal-empty-state">
            <h3>Nenhum usuário encontrado</h3>
            <p>Tente outra palavra-chave para ampliar a busca.</p>
        </div>
        ) : (
        <div className="search-modal-results-list">
            {results.map((usuario) => (
            <UsuarioCard onNavigate={closeModal} key={usuario.id} usuario={usuario} />
            ))}
        </div>
        )}
    </section>
    </div>
</div>
);
}