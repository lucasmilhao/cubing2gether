import {useQuery} from "@tanstack/react-query";
import { api } from "../../service/api";
import type { UsuarioProps } from "../../interface/UsuarioProps";

const API_URL = `http://localhost:8080`;


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