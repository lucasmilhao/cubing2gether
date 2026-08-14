import { FormEvent, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useRedefinirSenha } from "../../hooks/usuario/useRedefinirSenha";
import "./RedefinirSenha.css";

export function RedefinirSenha() {

    const [searchParams] = useSearchParams();
    const { mutate: redefinirSenha, isPending: loading } = useRedefinirSenha();
    const navigate = useNavigate();

    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    const token = searchParams.get("token");

    const senhasPreenchidas = novaSenha.length > 0 && confirmarSenha.length > 0;
    const senhasCoincidem = novaSenha === confirmarSenha;
    const senhaFraca = novaSenha.length > 0 && novaSenha.length < 8;

    function handleSubmit(event: FormEvent) {

        event.preventDefault();

        setErro("");
        setSucesso("");

        if (!token) {
            setErro("Token de redefinição não encontrado.");
            return;
        }

        if (novaSenha !== confirmarSenha) {
            setErro("As senhas não coincidem.");
            return;
        }

        if (novaSenha.length < 8) {
            setErro("A senha deve possuir pelo menos 8 caracteres.");
            return;
        }

        redefinirSenha(
            {
                token,
                novaSenha
            },
            {
                onSuccess: () => {
                    setSucesso("Senha redefinida com sucesso! Redirecionando para o login...");
                    setTimeout(() => navigate("/login"), 2000);
                },
                onError: (error: any) => {
                    setErro(
                        error?.response?.data?.message ??
                        "Não foi possível redefinir sua senha. Tente novamente."
                    );
                }
            }
        );
    }

    return (
        <div className="redefinir-senha-page">
            <div className="redefinir-senha-card">

                <div className="redefinir-senha-card__accent" />

                <h1 className="redefinir-senha-card__title">Redefinir senha</h1>
                <p className="redefinir-senha-card__subtitle">
                    Escolha uma nova senha para acessar sua conta.
                </p>

                {!token && (
                    <p className="redefinir-senha-alert redefinir-senha-alert--erro">
                        Link de redefinição inválido ou incompleto.
                    </p>
                )}

                {token && !sucesso && (
                    <form className="redefinir-senha-form" onSubmit={handleSubmit}>

                        <div className="redefinir-senha-field">
                            <label htmlFor="novaSenha">Nova senha</label>

                            <div className="redefinir-senha-input-wrapper">
                                <input
                                    id="novaSenha"
                                    type={mostrarSenha ? "text" : "password"}
                                    value={novaSenha}
                                    onChange={(e) => setNovaSenha(e.target.value)}
                                    placeholder="Digite sua nova senha"
                                    autoComplete="new-password"
                                    className={senhaFraca ? "input--alerta" : ""}
                                />
                                <button
                                    type="button"
                                    className="redefinir-senha-toggle"
                                    onClick={() => setMostrarSenha((prev) => !prev)}
                                    tabIndex={-1}
                                >
                                    {mostrarSenha ? "Ocultar" : "Mostrar"}
                                </button>
                            </div>

                            {senhaFraca && (
                                <span className="redefinir-senha-hint redefinir-senha-hint--alerta">
                                    Mínimo de 8 caracteres.
                                </span>
                            )}
                        </div>

                        <div className="redefinir-senha-field">
                            <label htmlFor="confirmarSenha">Confirmar senha</label>

                            <div className="redefinir-senha-input-wrapper">
                                <input
                                    id="confirmarSenha"
                                    type={mostrarSenha ? "text" : "password"}
                                    value={confirmarSenha}
                                    onChange={(e) => setConfirmarSenha(e.target.value)}
                                    placeholder="Digite novamente sua senha"
                                    autoComplete="new-password"
                                    className={
                                        senhasPreenchidas && !senhasCoincidem ? "input--alerta" : ""
                                    }
                                />
                            </div>

                            {senhasPreenchidas && !senhasCoincidem && (
                                <span className="redefinir-senha-hint redefinir-senha-hint--alerta">
                                    As senhas não coincidem.
                                </span>
                            )}
                        </div>

                        {erro && (
                            <p className="redefinir-senha-alert redefinir-senha-alert--erro">
                                {erro}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="redefinir-senha-submit"
                            disabled={loading}
                        >
                            {loading ? "Redefinindo..." : "Redefinir senha"}
                        </button>

                    </form>
                )}

                {sucesso && (
                    <p className="redefinir-senha-alert redefinir-senha-alert--sucesso">
                        {sucesso}
                    </p>
                )}

            </div>
        </div>
    );
}