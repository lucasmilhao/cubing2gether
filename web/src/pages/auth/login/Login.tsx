import React, { useState } from "react";
import "./login.css";

import { useUsuarioLogin } from "../../../hooks/usuario/useUsuarioLogin";
import type { UsuarioLoginRequest } from "../../../interface/UsuarioLoginRequest";
import { useGuestCreate } from "../../../hooks/usuario/useGuestCreate";
import { GoogleLogin } from "@react-oauth/google";
import { useUsuarioLoginGoogle } from "../../../hooks/usuario/useUsuarioLoginGoogle";

import WorldMap from "../../../components/ui/world-map";

export function Login() {
  const [erro, setErro] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("password");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const { mutate, isPending} = useUsuarioLogin();
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

    mutate(data, {
      onError: (err: any) => {
        setErro(err.response.data.mensagem);
      }
    });
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

            {erro?.length > 0 && <p>{erro}</p>}
            
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
            // América do Norte
            {
              start: { lat: 40.7128, lng: -74.0060 }, // New York
              end: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
            },
            {
              start: { lat: 40.7128, lng: -74.0060 }, // New York
              end: { lat: 51.5074, lng: -0.1278 }, // London
            },

            // América do Sul
            {
              start: { lat: -23.5505, lng: -46.6333 }, // São Paulo
              end: { lat: -34.6037, lng: -58.3816 }, // Buenos Aires
            },
            {
              start: { lat: -23.5505, lng: -46.6333 }, // São Paulo
              end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
            },

            // Europa
            {
              start: { lat: 51.5074, lng: -0.1278 }, // London
              end: { lat: 48.8566, lng: 2.3522 }, // Paris
            },
            {
              start: { lat: 48.8566, lng: 2.3522 }, // Paris
              end: { lat: 52.5200, lng: 13.4050 }, // Berlin
            },

            // Europa → Ásia
            {
              start: { lat: 51.5074, lng: -0.1278 }, // London
              end: { lat: 35.6762, lng: 139.6503 }, // Tokyo
            },
            {
              start: { lat: 48.8566, lng: 2.3522 }, // Paris
              end: { lat: 25.2048, lng: 55.2708 }, // Dubai
            },

            // Ásia
            {
              start: { lat: 28.6139, lng: 77.2090 }, // New Delhi
              end: { lat: 35.6762, lng: 139.6503 }, // Tokyo
            },
            {
              start: { lat: 35.6762, lng: 139.6503 }, // Tokyo
              end: { lat: 37.5665, lng: 126.9780 }, // Seoul
            },

            // Ásia → Oceania
            {
              start: { lat: 35.6762, lng: 139.6503 }, // Tokyo
              end: { lat: -33.8688, lng: 151.2093 }, // Sydney
            },

            // África
            {
              start: { lat: 25.2048, lng: 55.2708 }, // Dubai
              end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
            },
            {
              start: { lat: -1.2921, lng: 36.8219 }, // Nairobi
              end: { lat: -33.9249, lng: 18.4241 }, // Cape Town
            },

            // Conexões adicionais
            {
              start: { lat: -23.5505, lng: -46.6333 }, // São Paulo
              end: { lat: 19.4326, lng: -99.1332 }, // Mexico City
            },
            {
              start: { lat: 19.4326, lng: -99.1332 }, // Mexico City
              end: { lat: 34.0522, lng: -118.2437 }, // Los Angeles
            },
          ]}
        />
        <p className="worldmap-titulo">conectando cubistas ao redor do mundo</p>
      </div>
    </div>
  );
}
