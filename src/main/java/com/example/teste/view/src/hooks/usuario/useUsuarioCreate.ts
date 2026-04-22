import axios from "axios";
import type { UsuarioRequest } from "../../interface/UsuarioRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const API_URL = `http://localhost:8080`;

const fetchdata = async (request : UsuarioRequest) => {
    const response = await axios.post(`${API_URL}/auth/register`, request);

    return response.data;
}

export function useUsuarioCreate() {
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