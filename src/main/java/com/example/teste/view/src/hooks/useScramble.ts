import { useQuery } from "@tanstack/react-query";
import { api } from "../service/api";

const API = 'http://localhost:8080'

const fetchData = async (puzzle : string) : Promise<string> => {
    const response = await api.get(`${API}/scrambles/${puzzle}`);

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