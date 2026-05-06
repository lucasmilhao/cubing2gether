import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../service/api"
import type { MensagemResponse } from "../../../interface/MensagemResponse";
import type { ConversaResponseProps } from "../../../interface/ConversaResponse";

const API_URL = `http://localhost:8080`;

const fetchdata = async (idConversa : string | undefined) : Promise<ConversaResponseProps> => {
    const response = await api.get(`${API_URL}/conversa/${idConversa}`);
    console.log(response.data);
    

    return response.data;
}

export function useConversaData(idConversa : string | undefined) {
    return useQuery({
        queryFn: () => fetchdata(idConversa),
        queryKey: ["Conversa-data"],
        refetchInterval: 2000
    });
}
