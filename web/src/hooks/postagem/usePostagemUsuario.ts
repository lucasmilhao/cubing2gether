import { useQuery } from "@tanstack/react-query";
import { api } from "../../service/api";
import type { PostagemProps } from "./usePostagemData";

const fetchdata = async (idUsuario : string | undefined) : Promise<PostagemProps[]> => {
    const response = await api.get(`/postagem/${idUsuario}`);

    return response.data;
}

export function usePostagemUsuario(idUsuario : string | undefined) {

    return useQuery({
        queryFn: () => fetchdata(idUsuario),
        queryKey: ["postagem-data", idUsuario],
        retry: 2
    });
}