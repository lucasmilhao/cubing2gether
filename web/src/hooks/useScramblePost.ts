import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ScrambleProps } from "../interface/ScrambleProps";

const API_URL = `http://localhost:8080`;
export interface ScrambleRequest {
    scramble : string,
    solution : string
}
const fetchdata = async (request : ScrambleRequest) : Promise<ScrambleProps> => {
    const response = await axios.post(`${API_URL}/scrambles`, request);

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