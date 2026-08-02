import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MensagemRequest } from "../../../interface/MensagemRequest";
import { api } from "../../../service/api"

const fetchdata = async (data : MensagemRequest) => {
    const response = await api.post(`/mensagens`, data);

    return response.data;
}

export function useMensagemPost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["mensagem-data"]});
        }
    })
}