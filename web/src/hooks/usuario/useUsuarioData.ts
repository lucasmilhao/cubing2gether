import {useQuery} from "@tanstack/react-query";
import type { UsuarioProps } from "../../interface/UsuarioProps";
import { api, API_URL } from "../../service/api";

const fetchdata = async () : Promise<UsuarioProps[]> => {
    const response = await api.get(`${API_URL}/usuarios`);

    return response.data;
}

export function useUsuarioData() {

    return useQuery({
        queryFn: () => fetchdata(),
        queryKey: ["usuario-data"],
        retry: 2
    });
}