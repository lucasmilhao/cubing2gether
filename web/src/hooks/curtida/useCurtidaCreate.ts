import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../service/api";
export interface CurtidaRequest {
    idUsuario : string | undefined,
    idPostagem : string | undefined
}

const fetchdata = async (request : CurtidaRequest) => {
    const response = await api.post(`/curtida`, request);

    return response.data;
}

export function useCurtidaCreate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["postagem-data"]});
        }
    });
}