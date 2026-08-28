import { useQuery } from "@tanstack/react-query";
import { api } from "../../../service/api"
import type { ConviteProps } from "./useConviteCreate";

const fetchdata = async (token : string | undefined) : Promise<ConviteProps> => {
    const response = await api.get(`/conversa/token/${token}`);
    console.log(response.data);
    

    return response.data;
}

export function useConversaDataToken(token : string | undefined) {
    return useQuery({
        queryFn: () => fetchdata(token),
        queryKey: ["Conversa-data"],
    });
}
