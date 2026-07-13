import {useQuery} from "@tanstack/react-query";
import { api } from "../../service/api";

const API_URL = `http://localhost:8080`;

interface FollowStatus {
    sigo : boolean,
    meSegue : boolean
}

const fetchdata = async (idUsuario : string | undefined) : Promise<FollowStatus> => {
    const response = await api.get(`${API_URL}/follow/status/${idUsuario}`);

    return response.data;
}

export function useFollowStatus(idUsuario : string | undefined) {

    return useQuery({
        queryFn: () => fetchdata(idUsuario),
        queryKey: ["status-data", idUsuario],
        retry: 2
    });
}