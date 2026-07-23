import {useMutation, useQuery} from "@tanstack/react-query";
import type { UsuarioProps } from "../../interface/UsuarioProps";
import { api, API_URL } from "../../service/api";

const fetchdata = async (emailUsuario : string) : Promise<UsuarioProps> => {
    const response = await api.get(`${API_URL}/usuarios/email/${emailUsuario}`);

    return response.data;
}

export function useUsuarioemailData() {

    return useMutation({
        mutationFn: fetchdata,
        retry: 2
    });
}