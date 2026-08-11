import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../service/api"
import { useNavigate } from "react-router-dom";

const fetchdata = async () => {
    const response = await api.post("/auth/logout");

    return response.data;
}

export function useUsuarioLogout() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["usuario-data"] });
            navigate("/auth/login");
        },
        onError: () => {
            console.log("FERROU RAPAZES");
        }
    });
}