import type { PartidaProps } from "./PartidaProps";
import type { UsuarioProps } from "./UsuarioProps";

export interface PartidaUsuarioProps {
    id : string,
    partida : PartidaProps,
    usuario : UsuarioProps,
    media : number
}