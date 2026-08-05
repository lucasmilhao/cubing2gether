import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ScrambleProps } from "../../interface/ScrambleProps";
import { api } from "../../service/api";

export interface ScrambleEditRequest {
    idScramble : string,
    scramble : string,
    solution : string
}
const fetchdata = async (request : ScrambleEditRequest) : Promise<ScrambleProps> => {
    const response = await api.put(`/scrambles/${request.idScramble}`, request);

    return response.data;
}

export function useScrambleEdit() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: (result : ScrambleProps) => {
            queryClient.invalidateQueries({queryKey : ["scramble-data", result.id]});
        }
    });
}