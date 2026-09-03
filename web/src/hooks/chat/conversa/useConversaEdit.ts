import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ConversaResponseProps } from "../../../interface/ConversaResponse";
import { api } from "../../../service/api";

const fetchdata = async (data : ConversaResponseProps) : Promise<ConversaResponseProps> => {
    const response = await api.put(`/conversa/${data.idConversa}`, data);

    return response.data;
}

export function useConversaEdit() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["conversa-data"]})
        }
    });
}