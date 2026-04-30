import axios from "axios";
import type { UsuarioRequest } from "../../interface/UsuarioRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const API_URL = `https://musical-succotash-g4gr9p6xv573vgpp-8080.app.github.dev`;

const fetchdata = async (request : UsuarioRequest) => {
    const response = await axios.post(`${API_URL}/auth/register`, request, {
        withCredentials: true
    });

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