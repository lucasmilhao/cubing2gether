import type { UsuarioProps } from "./UsuarioProps";

export interface ConversaResponseProps {
    idConversa? : string,
    nome? : string,
    participantes? : UsuarioProps[]
    isPublico? : boolean;
    dataCriado?: string,
}