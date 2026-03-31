import { useQuery } from "@tanstack/react-query";
import axios from "axios"

const API = 'http://localhost:8080'

const fetchData = async (puzzle : string) : Promise<string> => {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(`${API}/scrambles/${puzzle}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

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