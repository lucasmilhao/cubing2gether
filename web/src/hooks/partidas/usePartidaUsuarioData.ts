import { useQuery } from "@tanstack/react-query";
import { api } from "../../service/api";
import type { PartidaUsuarioProps } from "../../interface/PartidaUsuarioProps";


const fetchdata = async (idPartida : string | undefined) : Promise<PartidaUsuarioProps[]> => {
    const response = await api.get(`/usuario-partida/${idPartida}`);
    console.log(response.data);
    

    return response.data;
}

export function usePartidaUsuarioData(idPartida : string | undefined) {
    return useQuery({
        queryFn: () => fetchdata(idPartida),
        queryKey: ["partida-usuario-data"]
    });
}
