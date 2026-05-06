import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MensagemRequest } from "../../../interface/MensagemRequest";
import { api } from "../../../service/api"


const API_URL = `http://localhost:8080`;

const fetchdata = async (data : MensagemRequest) => {
    const response = await api.post(`${API_URL}/mensagens`, data);

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