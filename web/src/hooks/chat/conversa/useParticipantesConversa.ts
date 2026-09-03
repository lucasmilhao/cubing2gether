import { useQuery } from "@tanstack/react-query";
import { api } from "../../../service/api"
import type { ConversaResponseProps } from "../../../interface/ConversaResponse";
import type { UsuarioProps } from "../../../interface/UsuarioProps";

export interface ParticipantesProps {
    id: string;
    conversa : ConversaResponseProps;
    usuario : UsuarioProps;
    isAdmin : boolean;
    entrou : string;
}

const fetchdata = async (idConversa : string | undefined) : Promise<ParticipantesProps[]> => {
    const response = await api.get(`/participantes/${idConversa}`);
    console.log(response.data);
    

    return response.data;
}

export function useParticipantesConversa(idConversa : string | undefined) {
    return useQuery({
        queryFn: () => fetchdata(idConversa),
        queryKey: ["participantes-data"],
        refetchInterval: 2000
    });
}
