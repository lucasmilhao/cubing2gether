import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../service/api";
export interface DenunciaRequest {
    idUsuario : string | undefined,
    idPostagem : string | undefined
}

const fetchdata = async (request : DenunciaRequest) => {
    const response = await api.post(`/denuncia`, request);

    return response.data;
}

export function useDenunciaCreate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            console.log("Deu certo porra");
            
            queryClient.invalidateQueries({queryKey : ["denuncia-data"]});
        }
    });
}