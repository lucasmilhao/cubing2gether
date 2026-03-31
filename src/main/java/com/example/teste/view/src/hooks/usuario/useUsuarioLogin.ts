import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UsuarioLoginRequest } from "../../interface/UsuarioLoginRequest";
import { useNavigate } from "react-router-dom";

const API_URL = `http://localhost:8080`;

const fetchdata = async (request : UsuarioLoginRequest) => {
    const response = await axios.post(`${API_URL}/auth/login`, request);

    const token = response.data.token;

    localStorage.setItem("authToken", token)

    return response.data;
}

export function useUsuarioLogin() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: fetchdata,
        retry: 2,
        onSuccess: () => {
            console.log("VAMO BRASISSSSISLSLSIDL");
            
            queryClient.invalidateQueries({queryKey : ["usuario-data"]});
            navigate("/practice");
        },
        onError: () => {
            console.log("FERROU RAPAZES");
            
        }
    });
}