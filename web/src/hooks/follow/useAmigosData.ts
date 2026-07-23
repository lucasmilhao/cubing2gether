import {useQuery} from "@tanstack/react-query";
import { api, API_URL } from "../../service/api";
import type { UsuarioProps } from "../../interface/UsuarioProps";

const fetchdata = async () : Promise<UsuarioProps[]> => {
    const response = await api.get(`${API_URL}/follow/amigos`);

    return response.data;
}

export function useFollowAmigosData() {

    return useQuery({
        queryFn: () => fetchdata(),
        queryKey: ["amigos-data"],
        retry: 2
    });
}