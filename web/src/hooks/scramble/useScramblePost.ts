import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ScrambleProps } from "../../interface/ScrambleProps";
import { api } from "../../service/api";
export interface ScrambleRequest {
    scramble : string,
    solution : string
}
const fetchdata = async (request : ScrambleRequest) : Promise<ScrambleProps> => {
    const response = await api.post(`/scrambles`, request);

    return response.data;
}

export function useScramblePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["scramble-data"]});
        }
    });
}