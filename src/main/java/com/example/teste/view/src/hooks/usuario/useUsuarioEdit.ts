import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../service/api";
import type { UsuarioEditRequest } from "../../interface/UsuarioEditRequest";
import type { UsuarioProps } from "../../interface/UsuarioProps";

const API_URL = `http://localhost:8080`;

const fetchdata = async (request : UsuarioEditRequest) : Promise<UsuarioProps> => {
    const response = await api.put(`${API_URL}/usuarios/${request.id}`, request);

    return response.data;
}

export function useUsuarioEdit() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["usuario-data"]})
        }
    });
}