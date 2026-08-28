import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../service/api"

export interface ConviteProps {
    token : string;
    expiraEm : string;
    link : string
}

const fetchdata = async (idConversa : string) : Promise<ConviteProps> => {
    const response = await api.post(`/conversa/${idConversa}/convite`);

    return response.data;
}

export function useConviteCreate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["convite-data"]});
        }
    })
}