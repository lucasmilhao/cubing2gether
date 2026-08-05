import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosPromise } from "axios"
import { api } from "../../service/api";
import type { PostagemProps } from "./usePostagemData";

export interface PostagemEditRequest {
    idPostagem?: string;
    descricao : string,
    idUsuario : string,
    idScramble? : string | undefined | null
}

const fetchData = async (data : PostagemEditRequest) : AxiosPromise<PostagemProps> => {
    const response = api.put(`/postagem/${data.idPostagem}`, data);

    return response;
} 


export function usePostagemEdit(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: fetchData, 
        retry: 2,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["postagem-data"]})
        }
    })
}