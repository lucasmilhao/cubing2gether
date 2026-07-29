import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const API_URL = `http://localhost:8080`;

const fetchdata = async (request : string | undefined) => {
    const response = await axios.post(`${API_URL}/auth/login/google`, request);

    const token = response.data.token;

    localStorage.setItem("authToken", token)

    return response.data;
}

export function useUsuarioLoginGoogle() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: fetchdata,
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