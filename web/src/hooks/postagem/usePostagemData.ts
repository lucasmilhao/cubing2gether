import { useQuery } from "@tanstack/react-query";
import { api } from "../../service/api";
import type { UsuarioProps } from "../../interface/UsuarioProps";
import type { ScrambleProps } from "../../interface/ScrambleProps";

export interface ComentarioProps {
    id : string,
    usuario : UsuarioProps,
    postagem : PostagemProps,
    conteudo : string,
    createdAt : string,
}

export interface PostagemProps {
    id : string,
    descricao : string,
    scramble : ScrambleProps,
    usuario : UsuarioProps,
    createdAt : string,
    curtidas : number,
    comentarios : ComentarioProps[]
}

const fetchData = async () : Promise<PostagemProps[]> => {
    const response = await api.get<PostagemProps[]>(`/postagem`);

    return response.data;
}

export function usePostagemData() {
    return useQuery ({
        queryFn: fetchData,
        queryKey: ["postagem-data"],
        retry: 2
    })
    
}