import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const API_URL = `http://localhost:8080`;

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