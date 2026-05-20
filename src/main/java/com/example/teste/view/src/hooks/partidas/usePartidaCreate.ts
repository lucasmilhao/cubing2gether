import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosPromise } from "axios";
import { api } from "../../service/api";

const API_URL = `http://localhost:8080`;


const fetchdata = async (data : string[]) => {
    const response = await api.post(`${API_URL}/partida`, {
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