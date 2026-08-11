import React, { useState } from "react";
import "./login.css";

import { useUsuarioLogin } from "../../../hooks/usuario/useUsuarioLogin";
import type { UsuarioLoginRequest } from "../../../interface/UsuarioLoginRequest";
import { useGuestCreate } from "../../../hooks/usuario/useGuestCreate";
import { GoogleLogin } from "@react-oauth/google";
import { useUsuarioLoginGoogle } from "../../../hooks/usuario/useUsuarioLoginGoogle";

import WorldMap from "../../../components/ui/world-map";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("password");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const { mutate, isPending } = useUsuarioLogin();
  const { mutate: loginGoogle } = useUsuarioLoginGoogle();
  const { mutate: convidado } = useGuestCreate();

  const togglePassword = () => {
    setMostrarSenha(!mostrarSenha);
    setTipo(mostrarSenha ? "password" : "text");
  };

  const login = (response: string | undefined) => {
    if (response) {
      loginGoogle(response);
    }
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data: UsuarioLoginRequest = {
      email,
      senha,
    };

    mutate(data);
  };

  return (
    <div className="login-container">
      <div className="esquerda">
        <form onSubmit={submit}>
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

            <button
              type="button"
              onClick={togglePassword}
              className="toggle-btn"
            >
              {mostrarSenha ? "🙈" : "🐵"}
            </button>
          </div>

          <GoogleLogin
            context="signin"
            useOneTap
            onSuccess={(e) => {
              login(e.credential);
            }}
            onError={() => { }}
          />

          <button type="submit" className="login-btn">
            {isPending ? "Entrando..." : "Entrar"}
          </button>

          <button
            type="button"
            onClick={() => convidado()}
            className="guest-btn"
          >
            Entrar como convidado
          </button>

          <div className="signup-link">
            Não tem conta?{" "}
            <a href="/auth/register">
              Crie uma aqui
            </a>
          </div>
        </form>
      </div>

      <div className="direita">
        <WorldMap
          lineColor="var(--accent-color)"
          dots={[
            {
              start: {
                lat: 64.2008,
                lng: -149.4937,
              }, // Alaska (Fairbanks)
              end: {
                lat: 34.0522,
                lng: -118.2437,
              }, // Los Angeles
            },
            {
              start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
              end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
            },
            {
              start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
              end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
            },
            {
              start: { lat: 51.5074, lng: -0.1278 }, // London
              end: { lat: 28.6139, lng: 77.209 }, // New Delhi
            },
            {
              start: { lat: 28.6139, lng: 77.209 }, // New Delhi
              end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
            },
            {
              start: { lat: 28.6139, lng: 77.209 }, // New Delhi
              end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
            },
          ]}
        />
        <p className="worldmap-titulo">conectando cubistas ao redor do mundo</p>
      </div>
    </div>
  );
}