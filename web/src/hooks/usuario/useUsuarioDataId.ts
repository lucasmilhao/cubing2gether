import {useQuery} from "@tanstack/react-query";
import type { UsuarioProps } from "../../interface/UsuarioProps";
import { api } from "../../service/api";


const fetchdata = async (idUsuario : string | undefined) : Promise<UsuarioProps> => {
    const response = await api.get(`/usuarios/${idUsuario}`);

    return response.data;
}

export function useUsuarioDataId(idUsuario : string | undefined) {

    return useQuery({
        queryFn: () => fetchdata(idUsuario),
        queryKey: ["usuario-id-data", idUsuario],
        retry: 2
    });
}