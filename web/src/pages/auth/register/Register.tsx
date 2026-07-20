import { useState } from "react";
import "../login/login.css";
import { useUsuarioCreate } from "../../../hooks/usuario/useUsuarioCreate";
import type { UsuarioRequest } from "../../../interface/UsuarioRequest";
import { GoogleLogin } from "@react-oauth/google";
import { useUsuarioLoginGoogle } from "../../../hooks/usuario/useUsuarioLoginGoogle";

const LOGO_URL =
  "https://imgs.search.brave.com/E-_iV4OVdepshvCmTFiCaVOgd6wd99Zcws7s7rnkH7Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/Z2FsbGVyaWVzLnNt/Y2xvdWQubmV0L3Qv/Z2FsbGVyaWVzL2dm/LTRtMnAtVThaYy0z/ODV2X3d5Y3p5bmlh/LWN1ZGEtei1rb3N0/a2EtcnViaWthLW1s/b2R5LXBvem5hbmlh/ay1qZXN0LXJla29y/ZHppc3RhLXN3aWF0/YS02NjR4NDQyLmpw/Zw";

export function Register() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("password");
  const [errors, setErrors] = useState({});
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const {mutate : loginGoogle} = useUsuarioLoginGoogle();
  const data = useUsuarioCreate();



  const togglePassword = () => {
    setMostrarSenha(!mostrarSenha);
    setTipo(mostrarSenha ? "password" : "text");
  };
  
  const login = (response : string | undefined) => {
    loginGoogle(response);
  }
  
  const submit = () => {
    const user : UsuarioRequest =  {
        nome,
        email,
        senha
    }

    data.mutate(user, {
      onError: (err : any) => {
        if(err.response && err.response.data) {
          console.log(JSON.stringify(err.response.data));
          setErrors(err.response.data);
        }
      }
    });
  }

  return (
    <div className="login-container">
      <div className="esquerda">
        <form onSubmit={(e) => e.preventDefault()}>
          <h1 className="login-title">cubing2gether</h1>

          <div className="input-field">
            <p>Email:</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          {errors.email && <p className="errors">{errors.email}</p>}
          </div>
          
          <div className="input-field">
            <p>Nick:</p>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="seunickname123"
            />
            {errors.nome && <p className="errors">{errors.nome}</p>}
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
          {errors.senha && <p className="errors">{errors.senha}</p>}
          </div>

          <GoogleLogin context="signup" text="continue_with" useOneTap onSuccess={e => login(e.credential)} onError={() => {}}/>
          <button type="submit" onClick={submit} className="login-btn">
            Crie sua Conta
          </button>

          <div className="signup-link">
            Já possui uma conta? <a href="/auth/login">Entre</a>
          </div>
        </form>
      </div>
      <div className="direita">
      </div>
    </div>
  );
}