import {useQuery} from "@tanstack/react-query";
import { api } from "../../service/api";

interface FollowStatus {
    sigo : boolean,
    meSegue : boolean
}

const fetchdata = async (idUsuario : string | undefined) : Promise<FollowStatus> => {
    const response = await api.get(`/follow/status/${idUsuario}`);

    return response.data;
}

export function useFollowStatus(idUsuario : string | undefined) {

    return useQuery({
        queryFn: () => fetchdata(idUsuario),
        queryKey: ["status-data", idUsuario],
        retry: 2
    });
}