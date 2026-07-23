import axios from "axios";
import type { UsuarioRequest } from "../../interface/UsuarioRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../service/api";

const fetchdata = async () => {
    const response = await axios.post(`${API_URL}/auth/guest`);
    

    const token = response.data.token;

    localStorage.setItem("authToken", token)

    return response.data;
}

export function useGuestCreate() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["guest-data"]})
            navigate("/practice");
        }
    });
}