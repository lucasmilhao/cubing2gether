import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../service/api"
import type { ConversaResponseProps } from "../../../interface/ConversaResponse";


const fetchdata = async (token : string) : Promise<ConversaResponseProps> => {
    const response = await api.post(`/conversa/convite/${token}`);

    return response.data;
}

export function useConviteAccept() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["convite-data"]});
        }
    })
}