import type { UsuarioProps } from "./UsuarioProps";

export interface MensagemResponse {
    id : string,
    texto : string,
    sender : UsuarioProps,
    conversa : string,
    mandado : string
}