import {useQuery} from "@tanstack/react-query";
import type { UsuarioProps } from "../../interface/UsuarioProps";
import { api } from "../../service/api";

const API_URL = `https://musical-succotash-g4gr9p6xv573vgpp-8080.app.github.dev`;

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