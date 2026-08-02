import { useQuery } from "@tanstack/react-query";
import type { AxiosPromise } from "axios";
import { api } from "../../service/api";
import type { UsuarioProps } from "../../interface/UsuarioProps";
import type { PartidaProps } from "../../interface/PartidaProps";


interface SolveProps {
    id : number,
    tempo :  number,
    scramble: string,
    penalty : string,
    user: UsuarioProps,
    partida : PartidaProps
}

const fetchData = async (partidaId : string | undefined) : AxiosPromise<SolveProps[]> => {
    const response = api.get(`/solves/partida/${partidaId}`);

    return response;
}

export function useSolveDataPartida(partidaId : string | undefined) {
    return useQuery ({
        queryFn: () => fetchData(partidaId),
        queryKey: ["solves-data", partidaId],
        retry: 2,
        enabled: !!partidaId
    })
}