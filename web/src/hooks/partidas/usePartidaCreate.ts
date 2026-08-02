import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../service/api";

const fetchdata = async (data : string[]) => {
    const response = await api.post(`/partida`, {
        idsUsuarios: data
    });

    return response.data;
}

export function usePartidaCreate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["partida-data"]});
        }
    })
}