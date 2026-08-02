import {useMutation} from "@tanstack/react-query";
import type { UsuarioProps } from "../../interface/UsuarioProps";
import { api } from "../../service/api";


const fetchdata = async (emailUsuario : string) : Promise<UsuarioProps> => {
    const response = await api.get(`/usuarios/email/${emailUsuario}`);

    return response.data;
}

export function useUsuarioEmailData() {

    return useMutation({
        mutationFn: fetchdata,
        retry: 2
    });
}