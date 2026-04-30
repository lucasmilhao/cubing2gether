import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MensagemRequest } from "../../../interface/MensagemRequest";
import { api } from "../../../service/api"


const API_URL = `https://musical-succotash-g4gr9p6xv573vgpp-8080.app.github.dev`;

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