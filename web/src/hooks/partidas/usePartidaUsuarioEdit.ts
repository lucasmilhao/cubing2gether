import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../service/api";
import type { PartidaUsuarioProps } from "../../interface/PartidaUsuarioProps";

export interface EditProps {
    idUsuario : string | undefined, 
    idPartida : string | undefined
}

const fetchdata = async (props : EditProps) : Promise<PartidaUsuarioProps> => {
    const response = await api.put(`/usuario-partida/${props.idUsuario}/${props.idPartida}`);

    return response.data;
}

export function usePartidaUsuarioEdit() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["partida-usuario-data"]})
        }
    });
}