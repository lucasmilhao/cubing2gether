import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../service/api";
import type { ComentarioProps } from "./usePostagemData";

export interface ComentarioRequest {
    idPostagem : string,
    idUsuario: string | undefined,
    conteudo : string
}

const fetchData = async (data : ComentarioRequest) : Promise<ComentarioProps> => {
    const response = await api.post(`/comentario`, data);

    return response.data;
} 


export function useComentarioPost(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchData, 
        retry: 2,
        onSuccess: (data : ComentarioProps) => {
            queryClient.invalidateQueries({queryKey : ["postagem-data"]})
        }
    })
}