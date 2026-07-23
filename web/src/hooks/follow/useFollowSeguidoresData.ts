import {useQuery} from "@tanstack/react-query";
import { api, API_URL } from "../../service/api";
import type { FollowProps } from "./useFollowSeguindoData";

const fetchdata = async (idUsuario : string | undefined) : Promise<FollowProps[]> => {
    const response = await api.get(`${API_URL}/follow/seguidores/${idUsuario}`);

    return response.data;
}

export function useFollowSeguidoresData(idUsuario : string | undefined) {

    return useQuery({
        queryFn: () => fetchdata(idUsuario),
        queryKey: ["seguidores-data", idUsuario],
        retry: 2
    });
}