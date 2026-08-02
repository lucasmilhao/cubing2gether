import {useQuery} from "@tanstack/react-query";
import type { UsuarioProps } from "../../interface/UsuarioProps";
import { api } from "../../service/api";

const fetchdata = async (nomeUsuario : string) : Promise<UsuarioProps[]> => {
    const response = await api.get(`/usuarios/nome/${nomeUsuario}`);

    return response.data;
}

export function useUsuarioNomeData(nomeUsuario : string) {

    return useQuery({
        queryFn: () => fetchdata(nomeUsuario),
        queryKey: ["usuario-nome-data", nomeUsuario],
        retry: 2
    });
}