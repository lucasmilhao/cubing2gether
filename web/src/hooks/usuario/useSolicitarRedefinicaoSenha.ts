import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../service/api";
import type { UsuarioProps } from "../../interface/UsuarioProps";


const fetchdata = async (request : UsuarioProps | undefined) => {
    const response = await api.post(`/auth/recuperar-senha`, request, {
        withCredentials: true
    });

    return response.data;
}

export function useSolicitarRedefinicaoSenha() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["usuario-data"]})
        }
    });
}