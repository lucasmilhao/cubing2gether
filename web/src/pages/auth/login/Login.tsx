import React, { useEffect, useState } from "react";
import "./login.css";
import { useUsuarioLogin } from "../../../hooks/usuario/useUsuarioLogin";
import type { UsuarioLoginRequest } from "../../../interface/UsuarioLoginRequest";
import { useNavigate } from "react-router-dom";
import { useGuestCreate } from "../../../hooks/usuario/useGuestCreate";
import { GoogleLogin, GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useUsuarioemailData as useUsuarioEmailData } from "../../../hooks/usuario/useUsuarioDataEmail";
import type { UsuarioProps } from "../../../interface/UsuarioProps";
import { useUsuarioLoginGoogle } from "../../../hooks/usuario/useUsuarioLoginGoogle";

const LOGO_URL =
  "https://imgs.search.brave.com/E-_iV4OVdepshvCmTFiCaVOgd6wd99Zcws7s7rnkH7Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/Z2FsbGVyaWVzLnNt/Y2xvdWQubmV0L3Qv/Z2FsbGVyaWVzL2dm/LTRtMnAtVThaYy0z/ODV2X3d5Y3p5bmlh/LWN1ZGEtei1rb3N0/a2EtcnViaWthLW1s/b2R5LXBvem5hbmlh/ay1qZXN0LXJla29y/ZHppc3RhLXN3aWF0/YS02NjR4NDQyLmpw/Zw";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("password");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const { mutate, isPending } = useUsuarioLogin();
  const {mutate : loginGoogle, isError, error} = useUsuarioLoginGoogle();  
  const { mutate: convidado, isPending: isCarregando } = useGuestCreate();
  const {mutate : usuario} = useUsuarioEmailData();


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

          <GoogleLogin context="signin" useOneTap onSuccess={e => login(e.credential)} onError={() => {}}/>
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