import type { UsuarioProps } from "./UsuarioProps";

export default interface NotificacaoProps {
    id: string;
    usuario: UsuarioProps;
    remetente: UsuarioProps;
    tipo: string;
    mensagem: string;
    isLida: boolean;
    createdAt: string;
    referenciaId: string;
}

