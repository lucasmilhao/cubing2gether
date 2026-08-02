import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UsuarioLoginRequest } from "../../interface/UsuarioLoginRequest";
import { useNavigate } from "react-router-dom";
import { api } from "../../service/api";

const fetchdata = async (request: UsuarioLoginRequest) => {
    const response = await api.post(`/auth/login`, request);

    const token = response.data.token;

    localStorage.setItem("authToken", token)

    return response.data;
}

export function useUsuarioLogin() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            console.log("VAMO BRASISSSSISLSLSIDL");

            queryClient.invalidateQueries({ queryKey: ["usuario-data"] });
            navigate("/");
        },
        onError: () => {
            console.log("FERROU RAPAZES");
        }
    });
}