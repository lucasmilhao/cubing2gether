import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../service/api"
import type { MensagemResponse } from "../../../interface/MensagemResponse";

const API_URL = `https://musical-succotash-g4gr9p6xv573vgpp-8080.app.github.dev`;


const fetchdata = async (idConversa : string | undefined) : Promise<MensagemResponse[]> => {
    const response = await api.get(`${API_URL}/mensagens/${idConversa}`);
    console.log(response.data);
    

    return response.data;
}

export function useMensagemData(idConversa : string | undefined) {
    return useQuery({
        queryFn: () => fetchdata(idConversa),
        queryKey: ["mensagem-data"],
        refetchInterval: 2000
    });
}
