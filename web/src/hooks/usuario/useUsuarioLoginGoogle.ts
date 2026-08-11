import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../../service/api";

const fetchdata = async (request : string | undefined) => {
    const response = await api.post(`/auth/login/google`, request);

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
            navigate("/");
        },
        onError: () => {
            console.log("FERROU RAPAZES");
            
        }
    });
}