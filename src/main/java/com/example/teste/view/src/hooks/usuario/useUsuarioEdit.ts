import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../../service/api";
import type { UsuarioEditRequest } from "../../interface/UsuarioEditRequest";

const API_URL = `http://localhost:8080`;

const fetchdata = async (request : UsuarioEditRequest) => {
    const response = await api.put(`${API_URL}/usuarios/${request.id}`, request);

    return response.data;
}

export function useUsuarioEdit() {
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