import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, API_URL } from "../../service/api";
import type { PartidaUsuarioProps } from "../../interface/PartidaUsuarioProps";

const fetchdata = async (idPartida : string | undefined) : Promise<PartidaUsuarioProps[]> => {
    const response = await api.get(`${API_URL}/usuario-partida/${idPartida}`);
    console.log(response.data);
    

    return response.data;
}

export function usePartidaUsuarioData(idPartida : string | undefined) {
    return useQuery({
        queryFn: () => fetchdata(idPartida),
        queryKey: ["partida-usuario-data"]
    });
}
