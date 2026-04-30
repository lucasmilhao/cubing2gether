import { useQuery } from "@tanstack/react-query";
import { api } from "../service/api";


const API_URL = `https://musical-succotash-g4gr9p6xv573vgpp-8080.app.github.dev`;

const fetchData = async (puzzle : string) : Promise<string> => {
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