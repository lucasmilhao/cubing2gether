import { useQuery } from "@tanstack/react-query";
import { api, API_URL } from "../service/api";
import type { ScrambleProps } from "../interface/ScrambleProps";

const fetchData = async (puzzle : string) : Promise<ScrambleProps> => {
    const response = await api.get(`${API_URL}/scrambles/${puzzle}`);

    return response.data;
} 

export function useScramble(puzzle : string){
    return useQuery({
        queryFn: () => fetchData(puzzle),
        queryKey: ['scramble-data', puzzle],

        enabled: false,
        retry: 2
    });
}