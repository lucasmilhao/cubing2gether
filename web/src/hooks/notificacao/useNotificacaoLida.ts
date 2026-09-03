import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../service/api";

const fetchdata = async (notificacaoId : string) : Promise<void> => {
    const response = await api.put(`/notificacao/${notificacaoId}`);

    return response.data;
}

export function useNotificacaoLida() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["notificacao-data"]})
        }
    });
}