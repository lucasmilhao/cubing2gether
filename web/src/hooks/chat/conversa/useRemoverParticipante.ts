import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../service/api"

export interface ParticipantesRequest {
    idUsuario : string | undefined;
    idConversa : string | undefined;
}

const fetchdata = async (data : ParticipantesRequest) : Promise<ParticipantesRequest> => {
    const response = await api.delete(`/participantes`, {data});

    return response.data;
}

export function useRemoverParticipante() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["participantes-data"]});
        }
    })
}