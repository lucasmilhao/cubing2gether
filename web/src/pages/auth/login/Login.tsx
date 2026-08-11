import React, { useState } from "react";
import "./login.css";
import { useUsuarioLogin } from "../../../hooks/usuario/useUsuarioLogin";
import type { UsuarioLoginRequest } from "../../../interface/UsuarioLoginRequest";
import { useGuestCreate } from "../../../hooks/usuario/useGuestCreate";
import { GoogleLogin } from "@react-oauth/google";
import { useUsuarioLoginGoogle } from "../../../hooks/usuario/useUsuarioLoginGoogle";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("password");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const { mutate, isPending } = useUsuarioLogin();
  const {mutate : loginGoogle} = useUsuarioLoginGoogle();  
  const { mutate: convidado} = useGuestCreate();


  const togglePassword = () => {
    setMostrarSenha(!mostrarSenha);
    setTipo(mostrarSenha ? "password" : "text");
  };

  const login = (response : string | undefined) => {
    loginGoogle(response);
  }

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data: UsuarioLoginRequest = {
      email,
      senha
    }

    mutate(data);
  }

  return (
    <div className="login-container">
      <div className="esquerda">
        <form  onSubmit={submit}>
          <h1 className="login-title">cubing2gether</h1>

          <div className="input-field">
            <p>Email:</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>

          <div className="input-field">
            <p>Senha:</p>
            <input
              type={tipo}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
            />
            <button type="button" onClick={togglePassword} className="toggle-btn">
              {mostrarSenha ? "🙈" : "🐵"}
            </button>
          </div>

          <GoogleLogin context="signin" useOneTap onSuccess={e => {login(e.credential); console.log(e.credential)}} onError={() => {}}/>
          <button type="submit" className="login-btn">
            {isPending ? "Entrando..." : "Entrar"}
          </button>

          <button onClick={() => convidado()} className="guest-btn">
            {"Entrar como convidado"}
          </button>
          
          

          <div className="signup-link">
            Não tem conta? <a href="/auth/register">Crie uma aqui</a>
          </div>
        </form>
      </div>
      <div className="direita">
      </div>
    </div>
  );
}