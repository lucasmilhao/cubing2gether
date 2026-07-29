import { useQuery } from "@tanstack/react-query";
import type { AxiosPromise } from "axios";
import { api } from "../../service/api";
import type { UsuarioProps } from "../../interface/UsuarioProps";
import type { ScrambleProps } from "../../interface/ScrambleProps";

export interface PostagemProps {
    id : string,
    descricao : string,
    scramble : ScrambleProps,
    usuario : UsuarioProps,
    createdAt : string
}

const fetchData = async () : AxiosPromise<PostagemProps[]> => {
    const response = api.get(`/postagem`);

    return response;
}

export function usePostagemData() {
    return useQuery ({
        queryFn: fetchData,
        queryKey: ["postagem-data"],
        retry: 2
    })
    
}