import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export interface FollowRequest {
    idSeguidor : string | undefined,
    idSeguindo : string | undefined
}

const fetchdata = async (request : FollowRequest) => {
    const response = await axios.post(`/follow`, request);

    return response.data;
}

export function useFollowCreate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["seguidores-data"]});
            queryClient.invalidateQueries({queryKey : ["status-data"]});
        }
    });
}