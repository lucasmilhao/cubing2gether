import {useQuery} from "@tanstack/react-query";
import type { UsuarioProps } from "../../interface/UsuarioProps";
import { api } from "../../service/api";

const fetchdata = async (username : string) : Promise<UsuarioProps> => {
    const response = await api.get(`/usuarios/username/${username}`);

    return response.data;
}

export function useUsuarioUsername(username : string) {

    return useQuery({
        queryFn: () => fetchdata(username),
        queryKey: ["usuario-username-data", username],
        retry: 2
    });
}