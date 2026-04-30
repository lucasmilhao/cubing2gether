import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../service/api"
import type { ConversaRequestProps } from "../../../interface/ConversaRequestProps";
import type { ConversaResponseProps } from "../../../interface/ConversaResponse";
import type { AxiosPromise } from "axios";

const API_URL = `https://musical-succotash-g4gr9p6xv573vgpp-8080.app.github.dev`;


const fetchdata = async (data : ConversaRequestProps) : Promise<ConversaResponseProps> => {
    const response = await api.post(`${API_URL}/conversa/participantes`, data);

    return response.data;
}

export function useConversaCreate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["conversa-data"]});
        }
    })
}