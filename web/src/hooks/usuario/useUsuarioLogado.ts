import {useQuery} from "@tanstack/react-query";
import type { UsuarioProps } from "../../interface/UsuarioProps";
import { api, API_URL } from "../../service/api";

const fetchdata = async () : Promise<UsuarioProps> => {
    const response = await api.get(`${API_URL}/usuarios/me`);

    return response.data;
}

export function useUsuarioLogado() {

    return useQuery({
        queryFn: fetchdata,
        queryKey: ["usuario-logado-data"],
        retry: 2
    });
}