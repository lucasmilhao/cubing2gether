import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../../service/api";

export interface RedefinicaoRequest {
    token : string,
    novaSenha : string
}

const fetchdata = async (request : RedefinicaoRequest | undefined) => {
    const response = await api.post(`/auth/redefinir-senha`, request, {
        withCredentials: true
    });

    return response.data;
}

export function useRedefinirSenha() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["usuario-data"]})
            navigate("/auth/login");
        }
    });
}