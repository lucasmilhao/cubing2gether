import {useQuery} from "@tanstack/react-query";
import type { UsuarioProps } from "../../interface/UsuarioProps";
import { api } from "../../service/api";

const API_URL = `http://localhost:8080`;

const fetchdata = async (idUsuario : string | undefined) : Promise<UsuarioProps> => {
    const response = await api.get(`${API_URL}/usuarios/${idUsuario}`);

    return response.data;
}

export function useUsuarioDataId(idUsuario : string | undefined) {

    return useQuery({
        queryFn: () => fetchdata(idUsuario),
        queryKey: ["usuario-id-data"],
        retry: 2
    });
}