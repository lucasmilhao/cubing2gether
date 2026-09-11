import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../service/api";

const fetchdata = async () : Promise<void> => {
    const response = await api.put(`/notificacao`);

    return response.data;
}

export function useLerTodas() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["notificacao-data"]})
        }
    });
}