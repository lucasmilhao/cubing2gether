import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type AxiosPromise } from "axios"
import { api } from "../../service/api";
import type { PostagemProps } from "./usePostagemData";

export interface PostagemRequest {
    descricao : string,
    idUsuario : string,
    idScramble : string
}

const API_URL = `http://localhost:8080`;
const fetchData = async (data : PostagemRequest) : AxiosPromise<PostagemProps[]> => {
    const response = api.post(`${API_URL}/postagem`, data);

    return response;
} 


export function usePostagemCreate(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: fetchData, 
        retry: 2,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["postagem-data"]})
        }
    })
}