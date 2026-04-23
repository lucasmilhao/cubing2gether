import { useUsuarioData } from "../hooks/usuario/useUsuarioData"
import defaultFoto from "../../../../../../../resources/images/default.webp";
import "./amigos.css";

export function Amigos (){
    const {data : usuarios} = useUsuarioData();

    return (
        <div >
            {usuarios?.map((e) => (
                <div key={e.id} className="user-card-amigo">
                    <img src={e.fotoPerfil ? e.fotoPerfil : defaultFoto} alt="" />
                    <div>
                    <h1 >{e.nome}</h1>
                    <p>{e.email}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}