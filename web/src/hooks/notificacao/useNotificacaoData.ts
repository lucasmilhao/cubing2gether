import {useQuery} from "@tanstack/react-query";
import { api } from "../../service/api";
import type NotificacaoProps from "../../interface/NotificacaoProps";


const fetchdata = async () : Promise<NotificacaoProps[]> => {
    const response = await api.get(`/notificacao`);

    return response.data;
}

export function useNotificacaoData() {

    return useQuery({
        queryFn: () => fetchdata(),
        queryKey: ["notificacao-data"],
        retry: 2
    });
}