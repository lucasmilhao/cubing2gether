import { useQuery } from "@tanstack/react-query";
import { api } from "../../../service/api"
import type { ConversaResponseProps } from "../../../interface/ConversaResponse";

const API_URL = `http://localhost:8080`;

const fetchdata = async (idUsuario : string | undefined) : Promise<ConversaResponseProps[]> => {
    const response = await api.get(`${API_URL}/participantes/usuario/${idUsuario}`);
    console.log(response.data);
    

    return response.data;
}

export function useConversaDataUsuario(idUsuario : string | undefined) {
    return useQuery({
        queryFn: () => fetchdata(idUsuario),
        queryKey: ["Conversa-data"],
        refetchInterval: 2000
    });
}
